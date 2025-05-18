-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  materials TEXT[] NOT NULL,
  manufacturing_location TEXT NOT NULL,
  additional_details TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analyses Table
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  product_description TEXT NOT NULL,
  carbon_score SMALLINT NOT NULL CHECK (carbon_score BETWEEN 1 AND 10),
  water_score SMALLINT NOT NULL CHECK (water_score BETWEEN 1 AND 10),
  resources_score SMALLINT NOT NULL CHECK (resources_score BETWEEN 1 AND 10),
  overall_score SMALLINT NOT NULL CHECK (overall_score BETWEEN 1 AND 10),
  explanation TEXT NOT NULL,
  suggestions TEXT NOT NULL,
  raw_analysis TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for improved query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_analyses_product_id ON analyses(product_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at);

-- Add text search capabilities
CREATE INDEX IF NOT EXISTS idx_products_name_search ON products USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_description_search ON products USING GIN (to_tsvector('english', description));

-- Trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE products IS 'Products to be analyzed for environmental impact';
COMMENT ON TABLE analyses IS 'Environmental impact analyses for products';
COMMENT ON COLUMN products.materials IS 'Array of materials used in the product';
COMMENT ON COLUMN analyses.carbon_score IS 'Carbon footprint score (1-10)';
COMMENT ON COLUMN analyses.water_score IS 'Water usage score (1-10)';
COMMENT ON COLUMN analyses.resources_score IS 'Resource consumption score (1-10)';
COMMENT ON COLUMN analyses.overall_score IS 'Overall environmental impact score (1-10)';