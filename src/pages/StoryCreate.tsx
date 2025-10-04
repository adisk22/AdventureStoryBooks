import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  PenTool, 
} from 'lucide-react';
import { storyService } from '@/services/newStoryService';
import { useAuth } from '@/contexts/DemoAuthContext';
import { geminiService } from '@/services/gemini';

import { UnprocessedStory } from '@/models/models';

interface StoryData {
  title: string;
  beginning: string;
  continuation: string;
  biome: string;
}

export default function StoryCreate() {
  const { biomeId } = useParams<{ biomeId: string }>();
  const navigate = useNavigate();
  
  const [storyData, setStoryData] = useState<StoryData>({
    title: '',
    beginning: '',
    continuation: '',
    biome: biomeId || ''
  });

  const handleNext = () => {
		var storyID;

    const postStory = async () => {
    
      // Saving story in new schema
			var newStory = {
				title: storyData.title,
				beginningPrompt: storyData.beginning,
				biome: storyData.biome
			}

      try {
        storyID = await storyService.saveStory(newStory);
      } catch (err) {

      }
    };

		const postPage = async (storyID: number) => {
			try {
        const generatedPage = await geminiService.generatePartOfStory({
          title: storyData.title,
          beginning: storyData.beginning,
          continuation: "",
          biome: storyData.biome
        });

				storyService.saveStoryPage(generatedPage, storyID);
			} catch (err) {
				console.error("Error generating or saving story page:", err);
			}

		}

    postStory();
		postPage(storyID);

		navigate(`/story-continuation/:${storyID}:/1`);
  };


  const handleInputChange = (field: keyof StoryData, value: string) => {
    setStoryData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Create Story</h1>
                <p className="text-sm text-muted-foreground">
                  Step 1: Story Title & Beginning
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
							<PenTool className="w-5 h-5" />;
              <span className="text-sm font-medium">Story Title & Beginning</span>
            </div>
          </div>
          <Progress value={(1 / 4) * 100} className="mt-4" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            Story Title & Beginning
            </CardTitle>
            <CardDescription>
                Give your story a title and write the beginning. Your exact words will be transformed into a beautiful storybook!
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
            <Label htmlFor="title">Story Title</Label>
            <Input
                id="title"
                placeholder="Enter your story title..."
                value={storyData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
            />
            </div>
            
            <div className="space-y-2">
            <Label htmlFor="beginning">Story Beginning</Label>
            <Textarea
                id="beginning"
                placeholder="Write the beginning of your story here... (first 3-4 pages)"
                value={storyData.beginning}
                onChange={(e) => handleInputChange('beginning', e.target.value)}
                rows={8}
                className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
                Tip: Introduce your characters, set the scene, and start the adventure!
            </p>
            </div>
        </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">          
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
      </div>
    </div>
  );
}