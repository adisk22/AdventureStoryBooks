import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  path: string;
  fullPath: string;
  publicUrl: string;
}

export const storageService = {
  // Upload a biome image
  async uploadBiomeImage(file: File, biomeId: string): Promise<UploadResult> {
    try {
      console.log('📤 Uploading biome image for:', biomeId);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${biomeId}-${Date.now()}.${fileExt}`;
      const filePath = `biome-images/${fileName}`;

      // Upload the file
      const { data, error } = await supabase.storage
        .from('biome-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('biome-images')
        .getPublicUrl(filePath);

      console.log('✅ Image uploaded successfully:', publicUrl);

      return {
        path: filePath,
        fullPath: data.path,
        publicUrl: publicUrl
      };

    } catch (error) {
      console.error('❌ Upload error:', error);
      throw error;
    }
  },

  // Update biome image URL in database
  async updateBiomeImageUrl(biomeId: string, imageUrl: string) {
    try {
      console.log('🔄 Updating biome image URL:', biomeId);
      
      const { data, error } = await supabase
        .from('biomes')
        .update({ image_url: imageUrl })
        .eq('id', biomeId)
        .select()
        .single();

      if (error) throw error;
      console.log('✅ Biome image URL updated:', data);
      return data;

    } catch (error) {
      console.error('❌ Update biome image URL error:', error);
      throw error;
    }
  },

  // Delete a biome image
  async deleteBiomeImage(filePath: string) {
    try {
      console.log('🗑️ Deleting biome image:', filePath);
      
      const { error } = await supabase.storage
        .from('biome-images')
        .remove([filePath]);

      if (error) throw error;
      console.log('✅ Image deleted successfully');

    } catch (error) {
      console.error('❌ Delete image error:', error);
      throw error;
    }
  },

  // Get all images in the biome-images bucket
  async listBiomeImages() {
    try {
      const { data, error } = await supabase.storage
        .from('biome-images')
        .list('biome-images', {
          limit: 100,
          offset: 0,
        });

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('❌ List images error:', error);
      return [];
    }
  }
};