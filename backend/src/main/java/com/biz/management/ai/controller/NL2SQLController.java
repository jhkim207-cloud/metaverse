package com.biz.management.ai.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/nl2sql")
public class NL2SQLController {
    private static final Logger log = LoggerFactory.getLogger(NL2SQLController.class);
    private final ObjectMapper om = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${app.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${app.gemini.model:gemini-2.5-flash}")
    private String geminiModel;

    @Value("${spring.ai.openai.api-key:}")
    private String openaiApiKey;

    @Value("${spring.ai.openai.chat.model:gpt-4o}")
    private String openaiModel;

    private final ExecutorService streamExecutor = Executors.newCachedThreadPool();

    /**
     * DB 스키마 조회
     */
    @GetMapping("/schema")
    public ResponseEntity<?> getSchema() {
        try {
            String schemaSql = """
                SELECT
                    t.table_schema,
                    t.table_name,
                    c.column_name,
                    c.data_type,
                    c.is_nullable,
                    c.column_default,
                    col_description((t.table_schema || '.' || t.table_name)::regclass::oid, c.ordinal_position) as column_description
                FROM information_schema.tables t
                JOIN information_schema.columns c
                    ON t.table_schema = c.table_schema
                    AND t.table_name = c.table_name
                WHERE t.table_schema = 'hkgn'
                    AND t.table_type = 'BASE TABLE'
                ORDER BY t.table_schema, t.table_name, c.ordinal_position
            """;

            List<Map<String, Object>> schemaData = jdbcTemplate.queryForList(schemaSql);

            String fkSql = """
                SELECT
                    tc.table_schema,
                    tc.table_name,
                    kcu.column_name,
                    ccu.table_schema AS foreign_table_schema,
                    ccu.table_name AS foreign_table_name,
                    ccu.column_name AS foreign_column_name
                FROM information_schema.table_constraints AS tc
                JOIN information_schema.key_column_usage AS kcu
                    ON tc.constraint_name = kcu.constraint_name
                    AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage AS ccu
                    ON ccu.constraint_name = tc.constraint_name
                    AND ccu.table_schema = tc.table_schema
                WHERE tc.constraint_type = 'FOREIGN KEY'
                    AND tc.table_schema = 'hkgn'
            """;

            List<Map<String, Object>> foreignKeys = jdbcTemplate.queryForList(fkSql);

            Map<String, List<Map<String, Object>>> tableGroups = schemaData.stream()
                    .collect(Collectors.groupingBy(row ->
                        row.get("table_schema") + "." + row.get("table_name")
                    ));

            List<Map<String, Object>> tables = new ArrayList<>();
            for (Map.Entry<String, List<Map<String, Object>>> entry : tableGroups.entrySet()) {
                Map<String, Object> table = new LinkedHashMap<>();
                List<Map<String, Object>> rows = entry.getValue();
                if (!rows.isEmpty()) {
                    table.put("schema", rows.get(0).get("table_schema"));
                    table.put("name", rows.get(0).get("table_name"));

                    List<Map<String, Object>> columns = rows.stream().map(row -> {
                        Map<String, Object> col = new LinkedHashMap<>();
                        col.put("name", row.get("column_name"));
                        col.put("type", row.get("data_type"));
                        col.put("nullable", row.get("is_nullable"));
                        col.put("default", row.get("column_default"));
                        col.put("description", row.get("column_description"));
                        return col;
                    }).collect(Collectors.toList());

                    table.put("columns", columns);
                    tables.add(table);
                }
            }

            return ResponseEntity.ok(Map.of(
                "tables", tables,
                "foreignKeys", foreignKeys
            ));
        } catch (Exception e) {
            log.error("Failed to retrieve schema", e);
            return ResponseEntity.ok(Map.of("error", e.getMessage()));
        }
    }

    /**
     * NL → SQL 실행 (동기)
     */
    @PostMapping("/query")
    public ResponseEntity<?> executeNaturalLanguageQuery(@RequestBody Map<String, String> request) {
        String question = request.get("question");

        if (question == null || question.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "질문을 입력해주세요"));
        }

        boolean useGemini = geminiApiKey != null && !geminiApiKey.trim().isEmpty();
        boolean useOpenAI = openaiApiKey != null && !openaiApiKey.trim().isEmpty();

        if (!useGemini && !useOpenAI) {
            return ResponseEntity.ok(Map.of("error", "No LLM API key configured (Gemini or OpenAI required)"));
        }

        try {
            String schemaInfo = buildSchemaContext();

            // Gemini 우선, 실패 시 GPT-4O fallback
            String sql;
            try {
                sql = convertToSQL(question, schemaInfo);
            } catch (Exception e) {
                if (useOpenAI) {
                    log.warn("Gemini failed, falling back to GPT-4O: {}", e.getMessage());
                    sql = convertToSQLWithOpenAI(question, schemaInfo);
                } else {
                    throw e;
                }
            }

            if (sql == null || sql.trim().isEmpty()) {
                return ResponseEntity.ok(Map.of("error", "SQL 생성에 실패했습니다"));
            }

            String sqlLower = sql.trim().toLowerCase();
            if (!sqlLower.startsWith("select")) {
                return ResponseEntity.ok(Map.of(
                    "error", "보안상 SELECT 쿼리만 허용됩니다",
                    "generatedSQL", sql
                ));
            }

            List<Map<String, Object>> results = jdbcTemplate.queryForList(sql);

            return ResponseEntity.ok(Map.of(
                "question", question,
                "sql", sql,
                "results", results,
                "rowCount", results.size()
            ));

        } catch (Exception e) {
            log.error("NL2SQL query failed", e);
            return ResponseEntity.ok(Map.of("error", e.getMessage(), "question", question));
        }
    }

    /**
     * SSE 스트리밍 NL2SQL
     */
    @GetMapping(value = "/query/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter queryStream(@RequestParam String question) {
        SseEmitter emitter = new SseEmitter(120000L);

        if (question == null || question.trim().isEmpty()) {
            sendErrorAndComplete(emitter, "질문을 입력해주세요");
            return emitter;
        }

        boolean useGemini = geminiApiKey != null && !geminiApiKey.trim().isEmpty();
        boolean useOpenAI = openaiApiKey != null && !openaiApiKey.trim().isEmpty();

        if (!useGemini && !useOpenAI) {
            sendErrorAndComplete(emitter, "No LLM API key configured");
            return emitter;
        }

        final boolean finalUseOpenAI = useOpenAI;
        streamExecutor.execute(() -> {
            try {
                // Step 1: Build schema context
                emitter.send(SseEmitter.event().name("status").data("스키마 분석 중..."));
                String schemaInfo = buildSchemaContext();

                // Step 2: Generate SQL (Gemini → GPT-4O fallback)
                emitter.send(SseEmitter.event().name("status").data("SQL 생성 중..."));
                String sql;
                try {
                    sql = convertToSQL(question, schemaInfo);
                } catch (Exception e) {
                    if (finalUseOpenAI) {
                        log.warn("Gemini failed, falling back to GPT-4O: {}", e.getMessage());
                        emitter.send(SseEmitter.event().name("status").data("GPT-4O로 전환 중..."));
                        sql = convertToSQLWithOpenAI(question, schemaInfo);
                    } else {
                        throw e;
                    }
                }

                if (sql == null || sql.trim().isEmpty()) {
                    emitter.send(SseEmitter.event().name("error").data("SQL 생성에 실패했습니다"));
                    emitter.complete();
                    return;
                }

                // Step 3: Validate SQL
                String sqlLower = sql.trim().toLowerCase();
                if (!sqlLower.startsWith("select")) {
                    emitter.send(SseEmitter.event().name("error").data("보안상 SELECT 쿼리만 허용됩니다"));
                    emitter.send(SseEmitter.event().name("sql").data(sql));
                    emitter.complete();
                    return;
                }

                emitter.send(SseEmitter.event().name("sql").data(sql));

                // Step 4: Execute SQL
                emitter.send(SseEmitter.event().name("status").data("쿼리 실행 중..."));
                List<Map<String, Object>> results = jdbcTemplate.queryForList(sql);

                String resultsJson = om.writeValueAsString(Map.of(
                    "question", question,
                    "sql", sql,
                    "results", results,
                    "rowCount", results.size()
                ));
                emitter.send(SseEmitter.event().name("result").data(resultsJson));
                emitter.send(SseEmitter.event().name("done").data("[DONE]"));
                emitter.complete();

            } catch (Exception e) {
                log.error("NL2SQL streaming failed", e);
                try {
                    emitter.send(SseEmitter.event().name("error").data("실패: " + e.getMessage()));
                    emitter.complete();
                } catch (IOException ex) {
                    emitter.completeWithError(ex);
                }
            }
        });

        return emitter;
    }

    private String buildSchemaContext() {
        try {
            String schemaSql = """
                SELECT
                    t.table_schema,
                    t.table_name,
                    string_agg(c.column_name || ' (' || c.data_type || ')', ', ' ORDER BY c.ordinal_position) as columns
                FROM information_schema.tables t
                JOIN information_schema.columns c
                    ON t.table_schema = c.table_schema
                    AND t.table_name = c.table_name
                WHERE t.table_schema = 'hkgn'
                    AND t.table_type = 'BASE TABLE'
                GROUP BY t.table_schema, t.table_name
                ORDER BY t.table_schema, t.table_name
            """;

            List<Map<String, Object>> tables = jdbcTemplate.queryForList(schemaSql);

            StringBuilder context = new StringBuilder("Database Schema (PostgreSQL, schema: hkgn):\n\n");
            for (Map<String, Object> table : tables) {
                context.append(String.format("Table: %s.%s\n",
                    table.get("table_schema"),
                    table.get("table_name")));
                context.append(String.format("Columns: %s\n\n", table.get("columns")));
            }

            String fkSql = """
                SELECT
                    tc.table_schema || '.' || tc.table_name as from_table,
                    kcu.column_name as from_column,
                    ccu.table_schema || '.' || ccu.table_name as to_table,
                    ccu.column_name as to_column
                FROM information_schema.table_constraints AS tc
                JOIN information_schema.key_column_usage AS kcu
                    ON tc.constraint_name = kcu.constraint_name
                    AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage AS ccu
                    ON ccu.constraint_name = tc.constraint_name
                    AND ccu.table_schema = tc.table_schema
                WHERE tc.constraint_type = 'FOREIGN KEY'
                    AND tc.table_schema = 'hkgn'
            """;

            List<Map<String, Object>> fks = jdbcTemplate.queryForList(fkSql);
            if (!fks.isEmpty()) {
                context.append("Foreign Key Relationships:\n");
                for (Map<String, Object> fk : fks) {
                    context.append(String.format("- %s.%s -> %s.%s\n",
                        fk.get("from_table"), fk.get("from_column"),
                        fk.get("to_table"), fk.get("to_column")));
                }
            }

            return context.toString();
        } catch (Exception e) {
            log.error("Failed to build schema context", e);
            return "Error building schema context";
        }
    }

    private static final String NL2SQL_RULES = """

            Important Table Relationships (always use these JOINs for name lookups):
            - site/현장 name: JOIN hkgn.site_master sm ON sm.site_cd = <table>.site_cd → use sm.site_nm
            - customer/거래처 name: JOIN hkgn.business_partner bp ON bp.bp_cd = <table>.customer_cd → use bp.bp_nm
            - delivery details: JOIN hkgn.delivery_detail dd ON dd.delivery_no = dh.delivery_no
            - production plan details: JOIN hkgn.production_plan_detail ppd ON ppd.plan_no = pp.plan_no
            - production_plan has site_cd (code only), always JOIN site_master for site_nm
            - CRITICAL: production_result does NOT have site_cd or site_nm columns!
              For site info from production_result, you MUST do a 3-table JOIN:
              JOIN hkgn.production_plan pp ON pp.plan_no = pr.plan_no
              JOIN hkgn.site_master sm ON sm.site_cd = pp.site_cd
            - production_result links to production_plan via plan_no
            - CRITICAL: delivery_header has customer_cd ONLY (no customer_nm)!
              For customer/거래처 name from delivery, you MUST JOIN:
              JOIN hkgn.business_partner bp ON bp.bp_cd = dh.customer_cd → use bp.bp_nm
            - CRITICAL: delivery_header has NO site_cd or site_nm!
              For site info from delivery, you MUST go through sales_order_header:
              JOIN hkgn.sales_order_header soh ON soh.order_no = dd.order_no
              Then use soh.site_nm or JOIN hkgn.site_master sm ON sm.site_cd = soh.site_cd

            Rules:
            1. Generate ONLY the SQL query, no explanations or markdown formatting
            2. Use proper PostgreSQL syntax
            3. ALWAYS JOIN lookup tables to get names instead of codes (site_master for site_nm, business_partner for bp_nm)
            4. Use table aliases for readability
            5. Return ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP, etc.)
            6. Limit results to 1000 rows unless specifically asked for more
            7. Use proper column names and table names from the schema above
            8. Always use the schema prefix 'hkgn.' for table references
            9. Never return only code columns (_cd) without their corresponding name columns (_nm)
            10. IMPORTANT: Add WHERE ... IS NOT NULL for key output columns that the user is asking about (e.g. if asking "which site", add WHERE sm.site_nm IS NOT NULL; if asking "which customer", add WHERE bp.bp_nm IS NOT NULL)

            SQL Query:
            """;

    private String convertToSQL(String question, String schemaInfo) throws Exception {
        String prompt = String.format("""
            You are a PostgreSQL SQL expert. Convert the following natural language question into a valid PostgreSQL SELECT query.

            %s

            User Question: %s
            """ + NL2SQL_RULES, schemaInfo, question);

        String url = String.format(
            "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
            geminiModel, geminiApiKey
        );

        Map<String, Object> requestBody = new LinkedHashMap<>();
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> content = new LinkedHashMap<>();
        List<Map<String, String>> parts = new ArrayList<>();
        parts.add(Map.of("text", prompt));
        content.put("parts", parts);
        contents.add(content);
        requestBody.put("contents", contents);

        Map<String, Object> generationConfig = new LinkedHashMap<>();
        generationConfig.put("temperature", 0.1);
        generationConfig.put("maxOutputTokens", 2048);
        requestBody.put("generationConfig", generationConfig);

        String jsonBody = om.writeValueAsString(requestBody);

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .timeout(Duration.ofSeconds(30))
                .build();

        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            log.error("Gemini API error: {}", response.body());
            throw new RuntimeException("Gemini API returned status " + response.statusCode());
        }

        JsonNode root = om.readTree(response.body());
        JsonNode candidates = root.path("candidates");
        if (candidates.isArray() && !candidates.isEmpty()) {
            String sqlText = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
            return cleanSQL(sqlText);
        }

        throw new RuntimeException("No valid response from Gemini API");
    }

    private String convertToSQLWithOpenAI(String question, String schemaInfo) throws Exception {
        String prompt = String.format("""
            You are a PostgreSQL SQL expert. Convert the following natural language question into a valid PostgreSQL SELECT query.

            %s

            User Question: %s
            """ + NL2SQL_RULES, schemaInfo, question);

        Map<String, Object> requestBody = new LinkedHashMap<>();
        requestBody.put("model", openaiModel);

        List<Map<String, Object>> messages = new ArrayList<>();
        Map<String, Object> message = new LinkedHashMap<>();
        message.put("role", "user");
        message.put("content", prompt);
        messages.add(message);
        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.1);
        requestBody.put("max_tokens", 2048);

        String jsonBody = om.writeValueAsString(requestBody);

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + openaiApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .timeout(Duration.ofSeconds(60))
                .build();

        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            log.error("OpenAI API error: {}", response.body());
            throw new RuntimeException("OpenAI API returned status " + response.statusCode());
        }

        JsonNode root = om.readTree(response.body());
        JsonNode choices = root.path("choices");
        if (choices.isArray() && !choices.isEmpty()) {
            String sqlText = choices.get(0).path("message").path("content").asText();
            return cleanSQL(sqlText);
        }

        throw new RuntimeException("No valid response from OpenAI API");
    }

    private String cleanSQL(String sqlText) {
        if (sqlText == null) return null;
        sqlText = sqlText.trim();
        sqlText = sqlText.replaceAll("```sql\\s*", "").replaceAll("```\\s*", "").trim();
        return sqlText;
    }

    private void sendErrorAndComplete(SseEmitter emitter, String message) {
        streamExecutor.execute(() -> {
            try {
                emitter.send(SseEmitter.event().name("error").data(message));
                emitter.complete();
            } catch (IOException e) {
                emitter.completeWithError(e);
            }
        });
    }
}
