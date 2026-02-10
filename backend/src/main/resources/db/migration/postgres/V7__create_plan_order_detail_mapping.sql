-- Junction table: production_plan <-> sales_order_detail (many-to-many)
CREATE TABLE IF NOT EXISTS hkgn.production_plan_order_detail (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    plan_id           BIGINT        NOT NULL,
    detail_id         BIGINT        NOT NULL,
    assigned_quantity INTEGER       NOT NULL DEFAULT 0,
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by        VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by        VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    CONSTRAINT uq_plan_detail UNIQUE (plan_id, detail_id)
);

CREATE INDEX idx_ppod_plan_id ON hkgn.production_plan_order_detail(plan_id);
CREATE INDEX idx_ppod_detail_id ON hkgn.production_plan_order_detail(detail_id);

COMMENT ON TABLE hkgn.production_plan_order_detail IS 'Junction: production_plan <-> sales_order_detail';
COMMENT ON COLUMN hkgn.production_plan_order_detail.plan_id IS 'FK to production_plan.id';
COMMENT ON COLUMN hkgn.production_plan_order_detail.detail_id IS 'FK to sales_order_detail.id';
COMMENT ON COLUMN hkgn.production_plan_order_detail.assigned_quantity IS 'Quantity assigned from this detail to this plan';
