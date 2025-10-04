import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  User, 
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { geminiService } from '@/services/gemini';

interface PhotoUploadStepProps {
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
  onCharactersExtracted: (characters: string[]) => void;
}

export const PhotoUploadStep = ({ 
  photos, 
  onPhotosChange, 
  onCharactersExtracted 
}: PhotoUploadStepProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      alert('Please only upload image files (JPG, PNG, GIF)');
      return;
    }

    // Limit to 5 photos
    const newPhotos = [...photos, ...imageFiles].slice(0, 5);
    onPhotosChange(newPhotos);
    
    // Extract characters using Gemini AI
    if (newPhotos.length > 0) {
      setIsProcessing(true);
      try {
        const characters = await geminiService.analyzePhotos(newPhotos);
        onCharactersExtracted(characters);
      } catch (error) {
        console.error('Error analyzing photos:', error);
        // Fallback to mock characters
        const mockCharacters = newPhotos.map((_, index) => 
          `Character ${index + 1}`
        );
        onCharactersExtracted(mockCharacters);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
    
    if (newPhotos.length === 0) {
      onCharactersExtracted([]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Upload Character Photos
          </CardTitle>
          <CardDescription>
            Upload photos of yourself and friends to become characters in your story
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              ${photos.length >= 5 ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-primary/50'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {dragActive ? 'Drop photos here' : 'Drag & drop photos here'}
            </h3>
            <p className="text-muted-foreground mb-4">
              or click to browse files
            </p>
            <Button variant="outline" onClick={(e) => e.stopPropagation()}>
              Choose Photos
            </Button>
            
            {photos.length >= 5 && (
              <p className="text-sm text-muted-foreground mt-2">
                Maximum 5 photos allowed
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Guidelines */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Tips for best results:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Use clear, well-lit photos</li>
            <li>• Include photos of faces for character recognition</li>
            <li>• JPG, PNG, or GIF formats supported</li>
            <li>• Maximum file size: 10MB per photo</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Uploaded Photos */}
      {photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Uploaded Photos ({photos.length}/5)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Character ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-medium">Character {index + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      {(photo.size / 1024 / 1024).toFixed(1)}MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Character Detection Status */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span className="text-sm">Detecting characters in photos...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {photos.length > 0 && !isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">
                Ready to create your story with {photos.length} character{photos.length > 1 ? 's' : ''}!
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};