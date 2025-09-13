-- Create wishlist table for user favorites
CREATE TABLE public.wishlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  product_variant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique wishlist items per user
  UNIQUE(user_id, product_id, product_variant_id)
);

-- Enable RLS
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own wishlist items
CREATE POLICY "Users can manage their own wishlist" 
ON public.wishlist 
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add trigger for automatic updated_at timestamp
CREATE TRIGGER update_wishlist_updated_at
BEFORE UPDATE ON public.wishlist
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_wishlist_user_id ON public.wishlist(user_id);
CREATE INDEX idx_wishlist_product_id ON public.wishlist(product_id);
CREATE INDEX idx_wishlist_created_at ON public.wishlist(created_at DESC);