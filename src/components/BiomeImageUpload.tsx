import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Image, Loader2, CheckCircle } from 'lucide-react';
import { storageService } from '@/services/storage';

interface BiomeUploadProps {
  biomeId: string;
  biomeName: string;
  currentImageUrl?: string;
  onImageUpdated: (newUrl: string) => void;
}

export const BiomeImageUpload = ({ biomeId, biomeName, currentImageUrl, onImageUpdated }: BiomeUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file');
      setUploadStatus('error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size must be less than 5MB');
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      console.log('📤 Uploading image for biome:', biomeName);
      
      // Upload the image
      const uploadResult = await storageService.uploadBiomeImage(file, biomeId);
      
      // Update the biome record with the new image URL
      await storageService.updateBiomeImageUrl(biomeId, uploadResult.publicUrl);
      
      // Notify parent component
      onImageUpdated(uploadResult.publicUrl);
      
      setUploadStatus('success');
      console.log('✅ Image uploaded successfully:', uploadResult.publicUrl);
      
    } catch (error: any) {
      console.error('❌ Upload failed:', error);
      setErrorMessage(error.message || 'Upload failed');
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Upload {biomeName} Image
        </CardTitle>
        <CardDescription>
          Upload a new image for the {biomeName} biome
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Image Preview */}
        {currentImageUrl && (
          <div className="space-y-2">
            <Label>Current Image</Label>
            <div className="relative w-full h-32 rounded-lg overflow-hidden border">
              <img 
                src={currentImageUrl} 
                alt={biomeName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="space-y-2">
          <Label htmlFor={`upload-${biomeId}`}>Choose New Image</Label>
          <div className="flex items-center gap-2">
            <Input
              id={`upload-${biomeId}`}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => document.getElementById(`upload-${biomeId}`)?.click()}
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Status Messages */}
        {uploadStatus === 'success' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Image uploaded successfully!
            </AlertDescription>
          </Alert>
        )}

        {uploadStatus === 'error' && (
          <Alert variant="destructive">
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Instructions */}
        <div className="text-sm text-muted-foreground">
          <p>• Supported formats: JPG, PNG, GIF</p>
          <p>• Maximum file size: 5MB</p>
          <p>• Recommended size: 800x600px</p>
        </div>
      </CardContent>
    </Card>
  );
};