import { supabase } from '@/integrations/supabase/client';

export interface VariantImageInsert {
  variantId: string;
  imageUrl: string;
  storagePath: string;
  type?: string;
  context?: string;
  altText?: string;
  sortOrder?: number;
}

export const insertVariantImage = async (data: VariantImageInsert) => {
  try {
    const { data: result, error } = await supabase
      .from('variant_images')
      .insert({
        variant_id: data.variantId,
        image_url: data.imageUrl,
        storage_path: data.storagePath,
        type: data.type || 'main',
        context: data.context || 'studio',
        alt_text: data.altText,
        sort_order: data.sortOrder || 0
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('Image variante insérée avec succès:', result);
    return result;
  } catch (error) {
    console.error('Erreur lors de l\'insertion:', error);
    throw error;
  }
};

// Fonction spécifique pour votre image Music Shield
export const insertMusicShieldImage = async () => {
  return await insertVariantImage({
    variantId: 'msh-blc-blu-audio', // Remplacez par l'ID réel de votre variante
    imageUrl: 'https://hgapjysrbldjqromnrov.supabase.co/storage/v1/object/public/variant-images/music-shield-monture-blanche-verres-bleus-audio-spr-msh-blc-blu-audio/main-1.png',
    storagePath: 'music-shield-monture-blanche-verres-bleus-audio-spr-msh-blc-blu-audio/main-1.png',
    type: 'main',
    context: 'studio',
    altText: 'Music Shield - Monture Blanche Verres Bleus - Image principale',
    sortOrder: 0
  });
};

// Fonction pour scanner et insérer automatiquement les images depuis le bucket
export const scanAndInsertVariantImages = async (bucketFolder: string, variantId: string) => {
  try {
    // Lister les fichiers dans le dossier du bucket
    const { data: files, error } = await supabase.storage
      .from('variant-images')
      .list(bucketFolder);

    if (error) {
      throw error;
    }

    if (!files || files.length === 0) {
      console.log('Aucun fichier trouvé dans le dossier:', bucketFolder);
      return [];
    }

    const insertedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Skip les dossiers
      if (file.id === null) continue;

      const storagePath = `${bucketFolder}/${file.name}`;
      const { data: publicUrlData } = supabase.storage
        .from('variant-images')
        .getPublicUrl(storagePath);

      // Déterminer le type d'image basé sur le nom du fichier
      let imageType = 'gallery';
      if (file.name.includes('main')) imageType = 'main';
      else if (file.name.includes('swatch')) imageType = 'swatch';
      else if (file.name.includes('detail')) imageType = 'detail';
      else if (file.name.includes('lifestyle')) imageType = 'lifestyle';

      try {
        const result = await insertVariantImage({
          variantId,
          imageUrl: publicUrlData.publicUrl,
          storagePath,
          type: imageType,
          context: 'studio',
          altText: `${variantId} - ${imageType}`,
          sortOrder: i
        });

        insertedImages.push(result);
        console.log(`Image insérée: ${file.name}`);
      } catch (insertError) {
        console.error(`Erreur pour ${file.name}:`, insertError);
      }
    }

    console.log(`${insertedImages.length} images insérées pour la variante ${variantId}`);
    return insertedImages;

  } catch (error) {
    console.error('Erreur lors du scan:', error);
    throw error;
  }
};