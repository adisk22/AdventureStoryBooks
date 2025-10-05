import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProfanityPopup } from '@/components/ProfanityPopup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  PenTool, 
  Sparkles, 
  Eye,
  Check,
  Loader2,
  AlertCircle,
  Save
} from 'lucide-react';
import { geminiService } from '@/services/gemini';
import { storyService } from '@/services/newStoryService';
import { useAuth } from '@/contexts/DemoAuthContext';
import { storyPagesToStory } from '@/models/models';

interface StoryData {
  title: string;
  beginning: string;
  continuation: string;
  biome: string;
}

export default function StoryContinuation() {
  const { storyId, pageNum } = useParams<{ storyId, pageNum }>();
  const storyIdNum = storyId ? Number(storyId) : null;
  const pageNumNum = pageNum ? Number(pageNum) : null;
  var biomeId = '';
  const [generatedStory, setGeneratedStory] = useState<storyPagesToStory[]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setStoryData(prev => ({ ...prev, ['continuation']: "" }));
    setGeneratedStory([]);

    const fetchBiome = async () => {
      if (storyIdNum && pageNumNum) {
        // Load existing story data
        biomeId = await storyService.getStoryBiome(storyIdNum);
      }
    };

    const fetchPastStories = async () => {
      console.log("Fetching past stories for story ID:", storyIdNum);
      var returnedStory = await storyService.getStoryPages(storyIdNum);
      setGeneratedStory(returnedStory ?? []);

      console.log("generatedStory" + returnedStory);
    }
    
    fetchBiome();
    fetchPastStories();
  }, [storyIdNum, pageNumNum]);
  
  const [storyData, setStoryData] = useState<StoryData>({
    title: '',
    beginning: '',
    continuation: '',
    biome: biomeId || ''
  });

  const handleNext = async () => {

		const postPage = async () => {
			try {
        setIsLoading(true);
        
        // Compiling all the story so far into one string
        const fullStoryText = (generatedStory ?? []).reduce((acc, page) => acc + " " + (page.text ?? ""), "");
        
        const storyTitle = await storyService.getStoryTitle(storyIdNum);

        const containsProfanity = await geminiService.checkProfanity(storyData.continuation);
        if (containsProfanity.profanity) {
          setIsPanelOpen(true);
          setIsLoading(false);
          return;
        }

        const generatedPage = await geminiService.generatePartOfStory({
          title: storyTitle,
          beginning: fullStoryText,
          continuation: storyData.continuation,
          biome: biomeId
        });

        const generatedImage = await geminiService.generatePageImage({
          title: storyTitle,
          beginning: fullStoryText,
          continuation: storyData.continuation,
          biome: biomeId
        });

        generatedPage.page_number = pageNumNum + 1;
        generatedPage.image_url = generatedImage;

				await storyService.saveStoryPage(generatedPage, storyIdNum);

        setIsLoading(false);
        navigate(`/story-continuation/${storyIdNum}/${pageNumNum + 1}`);
			} catch (err) {
				console.error("Error generating or saving story page:", err);
			}

		}

    postPage();
  };

  const handleInputChange = (field: keyof StoryData, value: string) => {
    setStoryData(prev => ({ ...prev, [field]: value }));
  };

  const finishStory = () => {
    navigate(`/story-finish/${storyId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Generating...</p>
        </div>
      </div>
    );
  }

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
                  Step 2: Continue your story
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <Progress value={(2 / 3) * 100} className="mt-4" />
        </div>
      </div>

      <div style = {{ marginTop: "2rem", marginBottom: "2rem" }} >
        <Card className="max-w-4xl mx-auto">
          <CardContent className="space-y-6">
            {/* Story Preview */}
            <div className="space-y-4" style={{ maxWidth: "80vw", alignContent: "center", justifyContent: "center", margin: "2rem 2rem", paddingTop: "2rem", paddingBottom: "2rem" }}>
              <h4 className="font-semibold">Story Preview:</h4>
              <div className="space-y-4">
                {(generatedStory ?? []).map((page) => (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-primary">Page {page.pageNum}</span>
                    </div>
                    <p className="text-sm mb-2">{page.text}</p>
                    {page.imageUrl && (
                      <div className="mt-2">
                        <img 
                          src={page.imageUrl} 
                          alt={`Page ${page.pageNum} illustration`}
                          className="w-full max-w-md mx-auto rounded border"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Story Continuation
          </CardTitle>
          <CardDescription>
            Decide what happens next! What should your characters do? Where will they go next?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="continuation">Story Continuation</Label>
            <Textarea
              id="continuation"
              placeholder="Write whatever comes next in your story..."
              value={storyData.continuation}
              onChange={(e) => handleInputChange('continuation', e.target.value)}
              rows={8}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Gemini will turn your ideas into a one part of a beautiful storybook!
            </p>
          </div>
        </CardContent>
      </Card>

      <ProfanityPopup
        open={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false);
        }}
      />

        {/* Navigation */}
        <div style={{ margin: "2rem 2rem" }}>
          <div className="flex justify-end space-x-2 mt-8">
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button onClick={finishStory} className="bg-gradient-primary">
                <Check className="w-4 h-4 mr-2" />
                Finish Story
            </Button>
          </div>
        </div>
      </div>
  );
}