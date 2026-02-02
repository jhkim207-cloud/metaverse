package com.biz.management.common.dto;

/**
 * 페이징 요청 DTO
 */
public class PageRequest {

    private int page = 0;
    private int size = 20;
    private String sortBy;
    private String sortDir = "asc";

    public PageRequest() {}

    public PageRequest(int page, int size) {
        this.page = page;
        this.size = size;
    }

    public int getOffset() {
        return page * size;
    }

    // Getters and Setters
    public int getPage() { return page; }
    public void setPage(int page) { this.page = Math.max(0, page); }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = Math.min(Math.max(1, size), 100); }

    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }

    public String getSortDir() { return sortDir; }
    public void setSortDir(String sortDir) {
        this.sortDir = "desc".equalsIgnoreCase(sortDir) ? "desc" : "asc";
    }
}
