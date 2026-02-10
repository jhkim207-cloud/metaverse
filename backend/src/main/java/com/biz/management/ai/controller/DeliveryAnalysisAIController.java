package com.biz.management.ai.controller;

import com.biz.management.ai.config.DeliveryAITableConfig;
import com.biz.management.ai.config.DeliveryAITableConfig.FieldDefinition;
import com.biz.management.ai.config.DeliveryAITableConfig.TableDefinition;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/api/v1/delivery-analysis-ai")
public class DeliveryAnalysisAIController {
    private static final Logger log = LoggerFactory.getLogger(DeliveryAnalysisAIController.class);
    private final ObjectMapper om = new ObjectMapper();

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private DeliveryAITableConfig tableConfig;

    @Value("${app.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${app.gemini.model:gemini-2.5-flash}")
    private String geminiModel;

    private final ExecutorService streamExecutor = Executors.newCachedThreadPool();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    /**
     * 동기 출고 분석
     */
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeDelivery(@RequestBody Map<String, Object> request) {
        String question = (String) request.get("question");

        if (question == null || question.trim().isEmpty()) {
            return ResponseEntity.ok(Map.of("error", "질문을 입력해주세요"));
        }

        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            return ResponseEntity.ok(Map.of("error", "Gemini API key not configured"));
        }

        try {
            Map<String, Object> parsedInfo = parseQuestionWithAI(question);
            String startDate = (String) parsedInfo.getOrDefault("startDate", null);
            String endDate = (String) parsedInfo.getOrDefault("endDate", null);
            String searchKeyword = (String) parsedInfo.getOrDefault("searchKeyword", null);

            String deliveryData = fetchDeliveryDataFromConfig(startDate, endDate, searchKeyword);

            if (deliveryData == null || deliveryData.trim().isEmpty()) {
                return ResponseEntity.ok(Map.of("error", "해당 기간에 출고 데이터가 없습니다."));
            }

            String analysis = analyzeWithGeminiSync(question, deliveryData);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "analysis", analysis,
                "question", question
            ));
        } catch (Exception e) {
            log.error("Delivery analysis failed", e);
            return ResponseEntity.ok(Map.of("error", e.getMessage()));
        }
    }

    /**
     * SSE 스트리밍 출고 분석
     */
    @GetMapping(value = "/analyze/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter analyzeStream(
            @RequestParam String question) {
        SseEmitter emitter = new SseEmitter(180000L);

        if (question == null || question.trim().isEmpty()) {
            sendErrorAndComplete(emitter, "질문을 입력해주세요");
            return emitter;
        }

        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            sendErrorAndComplete(emitter, "Gemini API key not configured");
            return emitter;
        }

        streamExecutor.execute(() -> {
            try {
                // Step 1: Parse question
                emitter.send(SseEmitter.event().name("status").data("질문 분석 중..."));
                Map<String, Object> parsedInfo = parseQuestionWithAI(question);
                String startDate = (String) parsedInfo.getOrDefault("startDate", null);
                String endDate = (String) parsedInfo.getOrDefault("endDate", null);
                String searchKeyword = (String) parsedInfo.getOrDefault("searchKeyword", null);

                // Step 2: Fetch data
                emitter.send(SseEmitter.event().name("status").data("데이터 조회 중..."));
                String deliveryData = fetchDeliveryDataFromConfig(startDate, endDate, searchKeyword);

                if (deliveryData == null || deliveryData.trim().isEmpty()) {
                    emitter.send(SseEmitter.event().name("error").data("해당 기간에 출고 데이터가 없습니다."));
                    emitter.complete();
                    return;
                }

                // Step 3: Stream with Gemini REST API (streamGenerateContent)
                emitter.send(SseEmitter.event().name("status").data("AI 분석 중..."));
                String prompt = buildAnalysisPrompt(question, deliveryData);
                streamWithGeminiREST(prompt, emitter);

                emitter.send(SseEmitter.event().name("done").data("[DONE]"));
                emitter.complete();

            } catch (Exception e) {
                log.error("Delivery analysis streaming failed", e);
                try {
                    emitter.send(SseEmitter.event().name("error").data("분석 실패: " + e.getMessage()));
                    emitter.complete();
                } catch (IOException ex) {
                    emitter.completeWithError(ex);
                }
            }
        });

        return emitter;
    }

    /**
     * 설정된 테이블 목록 조회
     */
    @GetMapping("/tables")
    public ResponseEntity<?> getTables() {
        List<Map<String, Object>> tables = new ArrayList<>();
        for (TableDefinition table : tableConfig.getEnabledTables()) {
            Map<String, Object> tableInfo = new LinkedHashMap<>();
            tableInfo.put("name", table.getName());
            tableInfo.put("displayName", table.getDisplayName());
            tableInfo.put("enabled", table.isEnabled());
            tableInfo.put("dateColumn", table.getDateColumn());
            tableInfo.put("limit", table.getLimit());
            tables.add(tableInfo);
        }
        return ResponseEntity.ok(Map.of("tables", tables));
    }

    /**
     * 설정 파일 리로드
     */
    @PostMapping("/reload-config")
    public ResponseEntity<?> reloadConfig() {
        try {
            tableConfig.loadConfig();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "설정이 리로드되었습니다.",
                "tableCount", tableConfig.getEnabledTables().size()
            ));
        } catch (Exception e) {
            log.error("Failed to reload config", e);
            return ResponseEntity.ok(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseQuestionWithAI(String question) throws Exception {
        Map<String, Object> result = new HashMap<>();
        java.time.LocalDate today = java.time.LocalDate.now();

        String dateParsePrompt = String.format("""
            오늘 날짜: %s (%s)

            사용자 질문: "%s"

            위 질문을 분석하여 다음 정보를 추출하세요:

            1. 날짜 범위:
               - "이번 달", "이달" → 이번 달 1일~오늘
               - "지난달" → 지난 달 1일~마지막 날
               - "이번주" → 이번 주 월요일~오늘
               - "지난주" → 지난 주 월요일~일요일
               - "올해", "금년" → 올해 1월 1일~오늘
               - "작년", "지난해" → 작년 1월 1일~12월 31일
               - "최근 3개월" → 3개월 전~오늘
               - "최근 6개월" → 6개월 전~오늘
               - 특정 자재명이 언급되고 날짜 범위가 없는 경우 → 최근 3개월
               - 날짜 표현이 없으면 → 이번 달 1일~오늘

            2. 자재명 검색 키워드:
               - 질문에 특정 자재명이 언급된 경우, 핵심 키워드만 추출
               - 예: "유리 출고 현황" → searchKeyword: "%%유리%%"
               - 예: "강화유리 관련" → searchKeyword: "%%강화유리%%"
               - 자재명이 없으면 → searchKeyword: null

            다음 JSON 형식으로만 답변하세요:
            {"startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD", "searchKeyword": "%%키워드%%" 또는 null}

            JSON만 출력하고 다른 설명은 하지 마세요.
            """,
            today.toString(),
            today.getDayOfWeek().toString(),
            question
        );

        try {
            String url = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                geminiModel, geminiApiKey
            );

            Map<String, Object> requestBody = new LinkedHashMap<>();
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new LinkedHashMap<>();
            List<Map<String, String>> parts = new ArrayList<>();
            parts.add(Map.of("text", dateParsePrompt));
            content.put("parts", parts);
            contents.add(content);
            requestBody.put("contents", contents);

            Map<String, Object> generationConfig = new LinkedHashMap<>();
            generationConfig.put("temperature", 0.1);
            generationConfig.put("maxOutputTokens", 100);
            requestBody.put("generationConfig", generationConfig);

            String jsonBody = om.writeValueAsString(requestBody);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

            org.springframework.http.ResponseEntity<String> response =
                new org.springframework.web.client.RestTemplate().postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseMap = om.readValue(response.getBody(), Map.class);
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");

                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    Map<String, Object> contentMap = (Map<String, Object>) candidate.get("content");
                    List<Map<String, Object>> partsList = (List<Map<String, Object>>) contentMap.get("parts");

                    if (partsList != null && !partsList.isEmpty()) {
                        String aiResponse = (String) partsList.get(0).get("text");
                        log.info("AI date parsing response: {}", aiResponse);

                        String jsonStr = aiResponse.trim();
                        if (jsonStr.startsWith("```")) {
                            jsonStr = jsonStr.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();
                        }

                        Map<String, Object> parsedResult = om.readValue(jsonStr, Map.class);
                        result.put("startDate", (String) parsedResult.get("startDate"));
                        result.put("endDate", (String) parsedResult.get("endDate"));

                        Object searchKeywordObj = parsedResult.get("searchKeyword");
                        if (searchKeywordObj != null && !"null".equals(String.valueOf(searchKeywordObj))) {
                            String searchKeyword = String.valueOf(searchKeywordObj).replace("%%", "%");
                            result.put("searchKeyword", searchKeyword);
                            log.info("AI parsed searchKeyword: {}", searchKeyword);
                        }

                        log.info("AI parsed - date range: {} to {}, searchKeyword: {}",
                            result.get("startDate"), result.get("endDate"), result.get("searchKeyword"));
                        return result;
                    }
                }
            }
        } catch (Exception e) {
            log.warn("AI date parsing failed, using default: {}", e.getMessage());
        }

        // Fallback: 이번 달
        java.time.LocalDate firstDayOfMonth = today.withDayOfMonth(1);
        result.put("startDate", firstDayOfMonth.toString());
        result.put("endDate", today.toString());
        return result;
    }

    private String fetchDeliveryDataFromConfig(String startDate, String endDate, String searchKeyword) {
        StringBuilder data = new StringBuilder();

        log.info("fetchDeliveryDataFromConfig - startDate: {}, endDate: {}, searchKeyword: {}",
            startDate, endDate, searchKeyword);

        try {
            java.sql.Date startSqlDate = java.sql.Date.valueOf(startDate);
            java.sql.Date endSqlDate = java.sql.Date.valueOf(endDate);
            boolean hasSearchKeyword = searchKeyword != null && !searchKeyword.trim().isEmpty();

            for (TableDefinition table : tableConfig.getEnabledTables()) {
                try {
                    if (!hasSearchKeyword && table.isSearchable()) {
                        continue;
                    }

                    boolean isSearchQuery = table.isSearchable() && hasSearchKeyword;

                    String sql = table.getSql()
                            .replace(":startDate", "?")
                            .replace(":endDate", "?")
                            .replace(":limit", String.valueOf(table.getLimit()));

                    List<Map<String, Object>> results;

                    if (isSearchQuery && sql.contains(":searchKeyword")) {
                        sql = sql.replace(":searchKeyword", "?");
                        results = jdbcTemplate.queryForList(sql, startSqlDate, endSqlDate, searchKeyword);
                    } else {
                        results = jdbcTemplate.queryForList(sql, startSqlDate, endSqlDate);
                    }

                    log.info("{} query returned {} rows", table.getName(), results.size());

                    if (!results.isEmpty()) {
                        data.append("\n=== ").append(table.getDisplayName()).append(" ===\n\n");

                        for (Map<String, Object> row : results) {
                            for (FieldDefinition field : table.getFields()) {
                                String value = getFieldValue(row, field);
                                if (value != null && !value.isEmpty()) {
                                    data.append(String.format("%s: %s\n", field.getLabel(), value));
                                }
                            }
                            data.append("\n");
                        }
                    }
                } catch (Exception e) {
                    log.warn("Failed to query table {}: {}", table.getName(), e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch delivery data from config", e);
            return null;
        }

        String result = data.toString();
        log.info("fetchDeliveryDataFromConfig returning {} characters of data", result.length());
        return result;
    }

    private String getFieldValue(Map<String, Object> row, FieldDefinition field) {
        Object value = row.get(field.getColumn());

        if (value == null || value.toString().trim().isEmpty() || "null".equals(value.toString())) {
            if (field.getFallback() != null) {
                Object fallbackValue = row.get(field.getFallback());
                if (fallbackValue != null && !fallbackValue.toString().trim().isEmpty()) {
                    return fallbackValue.toString();
                }
            }
            return null;
        }

        return value.toString();
    }

    private String buildAnalysisPrompt(String question, String deliveryData) {
        return String.format("""
            당신은 출고(매출) 분석 전문가입니다. 사용자의 질문에 답하기 위해 다음 출고 데이터를 분석해주세요.

            **사용자 질문**
            %s

            **출고 데이터**
            %s

            **분석 지침**
            1. 사용자의 질문에 직접적으로 답변하세요
            2. **자재 검색 결과** 또는 **자재별 출고 요약 (검색)** 섹션이 있으면, 이것이 사용자가 찾는 자재의 실제 출고 데이터입니다. 반드시 이 데이터를 기반으로 분석하세요.
            3. 금액은 읽기 쉽게 포맷팅하세요 (예: 1,234,567원)
            4. 출고 추이, 자재별 분석, 거래처별 분석 등 인사이트를 제공하세요
            5. 데이터가 있으면 총 출고금액, 출고건수, 주요 거래처 등을 정리해주세요
            6. **중요**: 코드를 표시하지 말고, 이름으로 표시하세요 (거래처명, 자재명, 현장명 등)
            7. 자재 검색 결과가 있으면 해당 자재의 출고 현황을 표로 정리해주세요

            **출력 형식**
            - 마크다운 형식으로 작성
            - 간결하고 명확하게 답변
            - 핵심 내용을 bullet point로 정리
            - 구체적인 수치와 예시를 포함
            - 자재 검색 시 표(table) 형식으로 출고 내역 정리

            답변:
            """, question, deliveryData);
    }

    private String analyzeWithGeminiSync(String question, String deliveryData) throws Exception {
        String prompt = buildAnalysisPrompt(question, deliveryData);

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
        generationConfig.put("temperature", 0.7);
        generationConfig.put("maxOutputTokens", 4096);
        requestBody.put("generationConfig", generationConfig);

        String jsonBody = om.writeValueAsString(requestBody);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        org.springframework.http.ResponseEntity<String> response =
            new org.springframework.web.client.RestTemplate().postForEntity(url, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> responseMap = om.readValue(response.getBody(), Map.class);
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");

            if (candidates != null && !candidates.isEmpty()) {
                @SuppressWarnings("unchecked")
                Map<String, Object> candidate = candidates.get(0);
                @SuppressWarnings("unchecked")
                Map<String, Object> contentMap = (Map<String, Object>) candidate.get("content");
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> partsList = (List<Map<String, Object>>) contentMap.get("parts");

                if (partsList != null && !partsList.isEmpty()) {
                    return (String) partsList.get(0).get("text");
                }
            }
        }

        throw new RuntimeException("No valid response from Gemini API");
    }

    /**
     * Gemini REST API 스트리밍 (streamGenerateContent)
     */
    private void streamWithGeminiREST(String prompt, SseEmitter emitter) throws Exception {
        String url = String.format(
            "https://generativelanguage.googleapis.com/v1beta/models/%s:streamGenerateContent?alt=sse&key=%s",
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
        generationConfig.put("temperature", 0.7);
        generationConfig.put("maxOutputTokens", 4096);
        requestBody.put("generationConfig", generationConfig);

        String jsonBody = om.writeValueAsString(requestBody);

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .timeout(Duration.ofSeconds(120))
                .build();

        HttpResponse<java.io.InputStream> response = httpClient.send(
            httpRequest, HttpResponse.BodyHandlers.ofInputStream()
        );

        if (response.statusCode() != 200) {
            String errorBody = new String(response.body().readAllBytes(), StandardCharsets.UTF_8);
            log.error("Gemini streaming API error: {}", errorBody);
            throw new RuntimeException("Gemini API returned status " + response.statusCode());
        }

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(response.body(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.startsWith("data: ")) {
                    String jsonData = line.substring(6).trim();
                    if (jsonData.isEmpty()) continue;

                    try {
                        JsonNode root = om.readTree(jsonData);
                        JsonNode candidates = root.path("candidates");
                        if (candidates.isArray() && !candidates.isEmpty()) {
                            String text = candidates.get(0)
                                .path("content").path("parts").get(0).path("text").asText("");
                            if (!text.isEmpty()) {
                                emitter.send(SseEmitter.event().name("content").data(text));
                            }
                        }
                    } catch (Exception e) {
                        log.debug("Skip non-JSON SSE line: {}", jsonData);
                    }
                }
            }
        }
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
