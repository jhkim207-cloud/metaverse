package com.biz.management.inventory.service;

import com.biz.management.inventory.dto.WarehouseViewDto;
import com.biz.management.inventory.dto.WarehouseViewDto.ItemDto;
import com.biz.management.inventory.dto.WarehouseViewDto.ZoneDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 창고 3D 뷰 서비스
 *
 * 현재는 샘플 데이터 생성. 실제 inventory, container_inventory 테이블 연동 시
 * Mapper를 통해 조회하도록 전환.
 */
@Service
public class InventoryViewService {

    public WarehouseViewDto getWarehouseView() {
        // TODO: 실제 DB에서 inventory + container_inventory 조회
        return generateSampleData();
    }

    private WarehouseViewDto generateSampleData() {
        WarehouseViewDto dto = new WarehouseViewDto();
        List<ZoneDto> zones = new ArrayList<>();

        // 원판유리 창고
        ZoneDto rawGlass = new ZoneDto();
        rawGlass.setId("RAW_GLASS");
        rawGlass.setName("원판유리 창고");
        rawGlass.setPosition(new double[]{-3, 0, 0});
        rawGlass.setSize(new double[]{3, 1.5, 2});
        rawGlass.setOccupancyRate(0.72);
        List<ItemDto> rawItems = new ArrayList<>();
        rawItems.add(createItem("FL-5T", "5T 투명유리", "RAW_GLASS", 120, 200, 30, "매", "#5ac8fa"));
        rawItems.add(createItem("FL-6T", "6T 투명유리", "RAW_GLASS", 85, 150, 20, "매", "#0a84ff"));
        rawItems.add(createItem("FL-8T", "8T 투명유리", "RAW_GLASS", 40, 100, 15, "매", "#1e3a5f"));
        rawItems.add(createItem("FL-10T", "10T 투명유리", "RAW_GLASS", 25, 80, 10, "매", "#30d158"));
        rawGlass.setItems(rawItems);
        zones.add(rawGlass);

        // 부자재 창고
        ZoneDto subMaterial = new ZoneDto();
        subMaterial.setId("SUB_MATERIAL");
        subMaterial.setName("부자재 창고");
        subMaterial.setPosition(new double[]{0, 0, 0});
        subMaterial.setSize(new double[]{2.5, 1.2, 2});
        subMaterial.setOccupancyRate(0.55);
        List<ItemDto> subItems = new ArrayList<>();
        subItems.add(createItem("SP-12", "12A 간봉", "SPACER", 500, 1000, 100, "m", "#ff9f0a"));
        subItems.add(createItem("SL-01", "1차 실란트", "SEALANT", 200, 400, 50, "kg", "#bf5af2"));
        subItems.add(createItem("SL-02", "2차 실란트", "SEALANT", 150, 300, 40, "kg", "#ff453a"));
        subItems.add(createItem("GAS-AR", "아르곤 가스", "GAS", 30, 50, 10, "통", "#86868b"));
        subMaterial.setItems(subItems);
        zones.add(subMaterial);

        // 완제품 창고
        ZoneDto finished = new ZoneDto();
        finished.setId("FINISHED");
        finished.setName("완제품 보관");
        finished.setPosition(new double[]{3.5, 0, 0});
        finished.setSize(new double[]{2.5, 1.0, 2});
        finished.setOccupancyRate(0.38);
        List<ItemDto> finItems = new ArrayList<>();
        finItems.add(createItem("FG-ML", "복층유리", "FINISHED", 45, 120, 10, "매", "#ffd60a"));
        finItems.add(createItem("FG-TM", "강화유리", "FINISHED", 30, 80, 5, "매", "#30d158"));
        finished.setItems(finItems);
        zones.add(finished);

        // 용기 보관
        ZoneDto container = new ZoneDto();
        container.setId("CONTAINER");
        container.setName("용기 보관");
        container.setPosition(new double[]{-1, 0, 3});
        container.setSize(new double[]{2, 0.8, 1.5});
        container.setOccupancyRate(0.65);
        List<ItemDto> contItems = new ArrayList<>();
        contItems.add(createItem("CT-A", "A형 용기", "CONTAINER", 25, 40, 10, "개", "#5ac8fa"));
        contItems.add(createItem("CT-B", "B형 용기", "CONTAINER", 18, 30, 8, "개", "#0a84ff"));
        container.setItems(contItems);
        zones.add(container);

        dto.setZones(zones);
        dto.setTotalItems(zones.stream().mapToInt(z -> z.getItems().size()).sum());

        // 안전재고 미달 항목 수
        int alerts = 0;
        for (ZoneDto zone : zones) {
            for (ItemDto item : zone.getItems()) {
                if (item.getCurrentQty() <= item.getMinQty()) alerts++;
            }
        }
        dto.setAlertCount(alerts);

        return dto;
    }

    private ItemDto createItem(String cd, String nm, String type, int cur, int max, int min, String unit, String color) {
        ItemDto item = new ItemDto();
        item.setMaterialCd(cd);
        item.setMaterialNm(nm);
        item.setMaterialType(type);
        item.setCurrentQty(cur);
        item.setMaxQty(max);
        item.setMinQty(min);
        item.setUnit(unit);
        item.setColor(color);
        return item;
    }
}
