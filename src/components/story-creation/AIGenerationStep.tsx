import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Sparkles, 
  Brain, 
  Image as ImageIcon, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Wand2,
  BookOpen
} from 'lucide-react';
import type { StoryCreationData } from './StoryCreationModal';
import { geminiService } from '@/services/gemini';

interface AIGenerationStepProps {
  storyData: StoryCreationData;
  onStoryGenerated: (story: any) => void;
}

const GENERATION_STEPS = [
  { id: 'analyzing', title: 'Analyzing Photos', description: 'Extracting character details from your photos' },
  { id: 'writing', title: 'Writing Story', description: 'Crafting your personalized story with AI' },
  { id: 'illustrating', title: 'Creating Illustrations', description: 'Generating cartoon-style illustrations' },
  { id: 'finalizing', title: 'Finalizing', description: 'Putting everything together' },
];

export const AIGenerationStep = ({ storyData, onStoryGenerated }: AIGenerationStepProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generatedStory, setGeneratedStory] = useState<any>(null);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsGenerating(false);
            generateStory();
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const generateStory = async () => {
    try {
      console.log('🤖 Starting story generation with Gemini...');
      
      // Use Gemini service to generate story
      const generatedStory = await geminiService.generateStory({
        photos: storyData.photos,
        storyBeginning: storyData.storyBeginning,
        biomeName: storyData.selectedBiome,
        characters: storyData.characters,
        literaryGoals: ['adjectives', 'verbs'] // Default goals for demo
      });

      console.log('📚 Story generated, now generating images...');
      
      // Generate images for each page
      const storyWithImages = {
        ...generatedStory,
        pages: await geminiService.generateStoryImages(generatedStory.pages)
      };

      console.log('🎨 All images generated successfully!');
      
      setGeneratedStory(storyWithImages);
      onStoryGenerated(storyWithImages);
    } catch (error) {
      console.error('❌ Story generation failed:', error);
      setError('Failed to generate story. Please try again.');
      setIsGenerating(false);
    }
  };

  const startGeneration = () => {
    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setCurrentStep(0);
  };

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (stepIndex === currentStep) {
      return <Loader2 className="w-5 h-5 animate-spin text-primary" />;
    } else {
      return <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />;
    }
  };

  if (generatedStory) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold">Story Generated Successfully!</h3>
                <p className="text-muted-foreground">Your personalized story is ready for review</p>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Story Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Title:</strong> {generatedStory.title}</p>
                  <p><strong>Pages:</strong> {generatedStory.pages.length}</p>
                  <p><strong>Characters:</strong> {storyData.characters.length}</p>
                  <p><strong>Setting:</strong> {storyData.selectedBiome}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Preview</h4>
                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <p className="line-clamp-3">{generatedStory.pages[0].text}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Generation Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Story Generation
          </CardTitle>
          <CardDescription>
            Our AI will create a personalized story using your photos and story beginning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Your Input</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>{storyData.photos.length} character photos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Story beginning: {storyData.storyBeginning.length} characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4" />
                    <span>Setting: {storyData.selectedBiome}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">What AI Will Create</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>4-6 story pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Cartoon illustrations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Character integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Educational elements</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Process */}
      {isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 animate-pulse" />
              Generating Your Story
            </CardTitle>
            <CardDescription>
              This usually takes 30-60 seconds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progress} className="h-2" />
              
              <div className="space-y-3">
                {GENERATION_STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3">
                    {getStepIcon(index)}
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Start Generation */}
      {!isGenerating && !generatedStory && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Ready to Generate Your Story</h3>
                <p className="text-muted-foreground">
                  Click the button below to start creating your personalized story
                </p>
              </div>
              <Button onClick={startGeneration} size="lg" className="bg-gradient-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate My Story
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};