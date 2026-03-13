package com.biz.management.yard.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;

@Component
public class YardTableInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(YardTableInitializer.class);

    private final DataSource dataSource;

    public YardTableInitializer(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            ResultSet rs = conn.getMetaData().getTables(null, null, "yard_master", null);
            if (!rs.next()) {
                log.info("Creating yard tables...");
                ScriptUtils.executeSqlScript(conn,
                        new ClassPathResource("db/migration/postgres/V14__create_yard_tables.sql"));
                log.info("Yard tables created successfully");
            }

            // V15: 차량/경로 테이블 + CCTV 커버리지 컬럼
            ResultSet rs2 = conn.getMetaData().getTables(null, null, "yard_vehicle", null);
            if (!rs2.next()) {
                log.info("Creating yard vehicle/route tables...");
                ScriptUtils.executeSqlScript(conn,
                        new ClassPathResource("db/migration/postgres/V15__yard_vehicle_route.sql"));
                log.info("Yard vehicle/route tables created successfully");
            }
        }
    }
}
