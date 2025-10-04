import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  Edit, 
  Save, 
  Download,
  Share,
  BookOpen,
  Image as ImageIcon,
  PenTool,
  CheckCircle
} from 'lucide-react';
import type { StoryCreationData } from './StoryCreationModal';

interface StoryPreviewStepProps {
  storyData: StoryCreationData;
  onStorySaved: (story: any) => void;
}

export const StoryPreviewStep = ({ storyData, onStorySaved }: StoryPreviewStepProps) => {
  const [editingPage, setEditingPage] = useState<number | null>(null);
  const [editedStory, setEditedStory] = useState(storyData.generatedStory);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditPage = (pageIndex: number, newText: string) => {
    if (editedStory) {
      const updatedStory = {
        ...editedStory,
        pages: editedStory.pages.map((page: any, index: number) => 
          index === pageIndex ? { ...page, text: newText } : page
        )
      };
      setEditedStory(updatedStory);
    }
  };

  const handleSaveStory = async () => {
    setIsSaving(true);
    
    // Simulate saving to database
    setTimeout(() => {
      const savedStory = {
        id: `story-${Date.now()}`,
        title: editedStory?.title || 'Untitled Story',
        author: 'Demo Student',
        biome: storyData.selectedBiome,
        pages: editedStory?.pages || [],
        status: 'published',
        created_at: new Date().toISOString(),
        likes: 0,
        views: 0,
      };
      
      onStorySaved(savedStory);
      setIsSaving(false);
    }, 2000);
  };

  const handleDownload = () => {
    // Simulate story download
    console.log('Downloading story as PDF...');
    alert('Story download feature coming soon!');
  };

  const handleShare = () => {
    // Simulate story sharing
    console.log('Sharing story...');
    alert('Story sharing feature coming soon!');
  };

  if (!editedStory) {
    return (
      <Alert>
        <AlertDescription>
          No story generated yet. Please go back to the previous step.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Story Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {editedStory.title}
              </CardTitle>
              <CardDescription>
                Your personalized story in the {storyData.selectedBiome}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              <ImageIcon className="w-3 h-3 mr-1" />
              {storyData.photos.length} Characters
            </Badge>
            <Badge variant="secondary">
              <BookOpen className="w-3 h-3 mr-1" />
              {editedStory.pages.length} Pages
            </Badge>
            <Badge variant="secondary">
              {storyData.selectedBiome}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Story Pages */}
      <div className="space-y-6">
        {editedStory.pages.map((page: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Page {index + 1}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingPage(editingPage === index ? null : index)}
                >
                  {editingPage === index ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Done Editing
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Story Text */}
                <div className="space-y-3">
                  <Label>Story Text</Label>
                  {editingPage === index ? (
                    <Textarea
                      value={page.text}
                      onChange={(e) => handleEditPage(index, e.target.value)}
                      rows={8}
                      className="resize-none"
                    />
                  ) : (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="leading-relaxed">{page.text}</p>
                    </div>
                  )}
                </div>
                
                {/* Story Image */}
                <div className="space-y-3">
                  <Label>Illustration</Label>
                  <div className="aspect-square rounded-lg overflow-hidden border bg-muted/50 flex items-center justify-center">
                    <img
                      src={page.imageUrl || '/placeholder.svg'}
                      alt={`Page ${index + 1} illustration`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Badge className="bg-white text-black">
                        AI Generated
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Prompt: {page.imagePrompt}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleSaveStory}
              disabled={isSaving}
              className="flex-1"
              size="lg"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Publishing Story...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Publish Story
                </>
              )}
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownload} size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={handleShare} size="lg">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your story will be published to the {storyData.selectedBiome} and visible to your classmates!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};