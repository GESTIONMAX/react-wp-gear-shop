-- Create product_images table for managing product images
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'main',
    context TEXT,
    alt_text TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_type ON public.product_images(type);
CREATE INDEX IF NOT EXISTS idx_product_images_sort_order ON public.product_images(sort_order);
CREATE INDEX IF NOT EXISTS idx_product_images_product_type ON public.product_images(product_id, type);

-- Add comments for documentation
COMMENT ON TABLE public.product_images IS 'Images associated with products';
COMMENT ON COLUMN public.product_images.product_id IS 'Foreign key to products table';
COMMENT ON COLUMN public.product_images.image_url IS 'Public URL of the image in Supabase Storage';
COMMENT ON COLUMN public.product_images.storage_path IS 'Storage path in the product-images bucket';
COMMENT ON COLUMN public.product_images.type IS 'Type of image: main, gallery, thumbnail, hero, detail, lifestyle, packaging';
COMMENT ON COLUMN public.product_images.context IS 'Context where image was taken: studio, lifestyle, detail, packaging, outdoor';
COMMENT ON COLUMN public.product_images.alt_text IS 'Alternative text for accessibility';
COMMENT ON COLUMN public.product_images.sort_order IS 'Display order of images';

-- Enable RLS (Row Level Security)
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_images

-- Policy: Allow public to read product images
CREATE POLICY "Allow public read access to product images" ON public.product_images
    FOR SELECT
    USING (true);

-- Policy: Allow authenticated users to insert product images
CREATE POLICY "Allow authenticated users to insert product images" ON public.product_images
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Allow authenticated users to update product images
CREATE POLICY "Allow authenticated users to update product images" ON public.product_images
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Allow authenticated users to delete product images
CREATE POLICY "Allow authenticated users to delete product images" ON public.product_images
    FOR DELETE
    TO authenticated
    USING (true);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_images_updated_at
    BEFORE UPDATE ON public.product_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();