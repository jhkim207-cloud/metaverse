import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.Arrays;
import java.util.List;

/**
 * PostgreSQL DDL 실행 유틸리티
 *
 * 사용법:
 * java -cp ".;postgresql-42.7.1.jar" ExecuteDDL.java
 */
public class ExecuteDDL {

    private static final String JDBC_URL = "jdbc:postgresql://168.107.43.244:5432/apps";
    private static final String USERNAME = "postgres";

    // DDL 파일 실행 순서 (FK 의존성 고려)
    private static final List<String> DDL_FILES = Arrays.asList(
        "business_partner.sql",
        "item_master.sql",
        "site_master.sql",
        "site_price.sql",
        "worker.sql",
        "standard_terms.sql",
        "sales_order_header.sql",
        "sales_order_detail.sql",
        "production_plan.sql",
        "production_plan_detail.sql",
        "production_result.sql",
        "cutting_daily_report.sql",
        "packing_order.sql",
        "delivery_header.sql",
        "delivery_detail.sql",
        "purchase_order.sql",
        "purchase_order_detail.sql",
        "goods_receipt.sql",
        "inventory.sql",
        "inventory_transaction.sql",
        "container_inventory.sql",
        "subcontract_order.sql"
    );

    public static void main(String[] args) {
        String password = System.getenv("DB_PASSWORD");
        if (password == null || password.isEmpty()) {
            System.out.print("Enter PostgreSQL password for user 'postgres': ");
            password = System.console() != null ?
                new String(System.console().readPassword()) :
                ""; // Fallback for non-console environments
        }

        Path ddlDir = Paths.get("c:/project/hkgn/db_dic/sql/postgres/hkgn");

        System.out.println("==========================================");
        System.out.println("HK G&N Tech ERP DDL 실행 시작...");
        System.out.println("==========================================");
        System.out.println();

        try (Connection conn = DriverManager.getConnection(JDBC_URL, USERNAME, password)) {
            System.out.println("✓ 데이터베이스 연결 성공: " + JDBC_URL);
            System.out.println();

            // 1. 스키마 생성
            System.out.println("1. 스키마 생성...");
            executeSQL(conn, "CREATE SCHEMA IF NOT EXISTS hkgn");
            executeSQL(conn, "SET search_path TO hkgn, public");
            System.out.println("   ✓ hkgn 스키마 생성 완료");
            System.out.println();

            // 2. DDL 파일 실행
            int successCount = 0;
            int totalTables = DDL_FILES.size();

            System.out.println("2. 테이블 생성 시작...");
            for (String fileName : DDL_FILES) {
                Path filePath = ddlDir.resolve(fileName);
                if (Files.exists(filePath)) {
                    System.out.println("   - " + fileName);
                    String sql = Files.readString(filePath);
                    // psql 메타커맨드 제거
                    sql = sql.replaceAll("\\\\echo.*", "");
                    sql = sql.replaceAll("\\\\i .*", "");
                    executeSQL(conn, sql);
                    successCount++;
                } else {
                    System.out.println("   ⚠ 파일 없음: " + fileName);
                }
            }

            System.out.println();
            System.out.println("==========================================");
            System.out.println("DDL 실행 완료!");
            System.out.println("==========================================");
            System.out.println();
            System.out.println("총 " + successCount + "/" + totalTables + "개 테이블 생성");
            System.out.println();

        } catch (Exception e) {
            System.err.println("❌ 오류 발생: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }

    private static void executeSQL(Connection conn, String sql) throws Exception {
        // 빈 SQL 무시
        sql = sql.trim();
        if (sql.isEmpty() || sql.startsWith("--")) {
            return;
        }

        // 세미콜론으로 구분된 여러 SQL 문 처리
        String[] statements = sql.split(";");

        try (Statement stmt = conn.createStatement()) {
            for (String statement : statements) {
                statement = statement.trim();
                if (!statement.isEmpty() && !statement.startsWith("--")) {
                    stmt.execute(statement);
                }
            }
        }
    }
}
