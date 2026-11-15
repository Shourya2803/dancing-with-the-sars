-- ============================================================
-- Dancing with the SARs: Supabase PostgreSQL + PostGIS Schema
-- ============================================================

-- Enable PostGIS extension for spatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Table: analyses
CREATE TABLE IF NOT EXISTS analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL,
    analysis_type TEXT NOT NULL DEFAULT 'surface_change',
    region TEXT NOT NULL DEFAULT 'Uttarakhand',
    district TEXT NULL,
    aoi_geometry GEOMETRY(Geometry, 4326) NULL,
    requested_start_date TIMESTAMPTZ NOT NULL,
    requested_end_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    error_message TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ NULL,
    completed_at TIMESTAMPTZ NULL
);

-- Index on status and created_at
CREATE INDEX IF NOT EXISTS idx_analyses_status ON analyses(status);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_aoi ON analyses USING GIST(aoi_geometry);

-- 2. Table: observations
CREATE TABLE IF NOT EXISTS observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
    product_identifier TEXT NOT NULL,
    product_type TEXT NOT NULL, -- 'GCOV' or 'GUNW'
    acquisition_timestamp TIMESTAMPTZ NOT NULL,
    track INTEGER NULL,
    frame INTEGER NULL,
    flight_direction TEXT NULL,
    footprint_geometry GEOMETRY(Geometry, 4326) NULL,
    is_suitable BOOLEAN NOT NULL DEFAULT TRUE,
    suitability_notes TEXT NULL,
    metadata JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_observations_analysis_id ON observations(analysis_id);
CREATE INDEX IF NOT EXISTS idx_observations_footprint ON observations USING GIST(footprint_geometry);

-- 3. Table: analysis_results
CREATE TABLE IF NOT EXISTS analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL UNIQUE REFERENCES analyses(id) ON DELETE CASCADE,
    observations_used TEXT[] NOT NULL,
    result_type TEXT NOT NULL,
    change_metric TEXT NOT NULL,
    changed_area_km2 NUMERIC NULL,
    change_percentage NUMERIC NULL,
    change_magnitude TEXT NULL,
    statistics JSONB NULL,
    geotiff_r2_key TEXT NULL,
    geotiff_url TEXT NULL,
    geojson_r2_key TEXT NULL,
    geojson_url TEXT NULL,
    gemini_explanation TEXT NULL,
    processing_metadata JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analysis_results_analysis_id ON analysis_results(analysis_id);
