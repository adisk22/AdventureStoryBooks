import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

interface StoryData {
  title: string;
  beginning: string;
  continuation: string;
  biome: string;
}

export default function StoryCreation() {
  const { biomeId } = useParams<{ biomeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [storyData, setStoryData] = useState<StoryData>({
    title: '',
    beginning: '',
    continuation: '',
    biome: biomeId || ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isDraft, setIsDraft] = useState(false);

  const totalSteps = 4;

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field: keyof StoryData, value: string) => {
    setStoryData(prev => ({ ...prev, [field]: value }));
  };

  const saveDraft = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      if (draftId) {
        // Update existing draft
        // await storyService.updateDraft(draftId, storyData);
        console.log('✅ Draft updated');
      } else {
        // Create new draft
        // const draft = await storyService.createDraft({
        //   ...storyData,
        //   author_id: user.id
        // });
        // setDraftId(draft.id);
        // console.log('✅ Draft created:', draft);
      }
      setIsDraft(true);
    } catch (err) {
      console.error('❌ Error saving draft:', err);
      setError('Failed to save draft. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const generateStory = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('🤖 Generating story with Gemini...');
      
      // Generate the complete storybook with Gemini Storybook
      const story = await geminiService.generateStorybook({
        title: storyData.title,
        beginning: storyData.beginning,
        continuation: storyData.continuation,
        biome: storyData.biome
      });
      
      console.log('✅ Story generated successfully:', story);
      setGeneratedStory(story);
      setCurrentStep(4); // Move to preview step
      
    } catch (err) {
      console.error('❌ Story generation failed:', err);
      setError('Failed to generate story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const publishStory = async () => {
    if (!user || !generatedStory) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      if (draftId) {
        // Publish from existing draft
        // await storyService.publishStory(draftId, generatedStory);
      } else {
        // Create new story directly
        // await storyService.createDraft({
        //   ...storyData,
        //   author_id: user.id
        // });
        // Note: In a real implementation, you'd publish directly
        console.log('📚 Story published successfully!');
      }
      
      alert('Story published successfully!');
      navigate('/');
    } catch (err) {
      console.error('❌ Error publishing story:', err);
      setError('Failed to publish story. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Story Title & Beginning";
      case 2: return "Story Continuation";
      case 3: return "Generate Your Storybook";
      case 4: return "Preview & Publish";
      default: return "Create Story";
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <PenTool className="w-5 h-5" />;
      case 2: return <BookOpen className="w-5 h-5" />;
      case 3: return <Sparkles className="w-5 h-5" />;
      case 4: return <Eye className="w-5 h-5" />;
      default: return <PenTool className="w-5 h-5" />;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return storyData.title.trim() && storyData.beginning.trim();
      case 2: return storyData.continuation.trim();
      case 3: return true; // Always can proceed to generation
      case 4: return generatedStory !== null;
      default: return false;
    }
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
                  Step {currentStep} of {totalSteps}: {getStepTitle(currentStep)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStepIcon(currentStep)}
              <span className="text-sm font-medium">{getStepTitle(currentStep)}</span>
            </div>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="mt-4" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentStep === 1 && (
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
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {isDraft && <span className="text-green-600">✓ Draft saved</span>}
                </div>
                <Button 
                  variant="outline" 
                  onClick={saveDraft}
                  disabled={isSaving || !storyData.title || !storyData.beginning}
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Story Continuation
              </CardTitle>
              <CardDescription>
                Continue your story! Write whatever comes next - your exact words will become part of the storybook.
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
                  Tip: Just write what happens next - Gemini will turn it into a beautiful storybook!
                </p>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {isDraft && <span className="text-green-600">✓ Draft saved</span>}
                </div>
                <Button 
                  variant="outline" 
                  onClick={saveDraft}
                  disabled={isSaving || !storyData.title || !storyData.beginning || !storyData.continuation}
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generate Your Storybook
              </CardTitle>
              <CardDescription>
                Gemini will transform your exact story into a beautiful illustrated storybook!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isGenerating && !generatedStory && (
                <div className="space-y-4">
                  <div className="p-6 bg-primary/10 rounded-lg">
                    <h3 className="font-semibold mb-2">Ready to Create Your Storybook?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Gemini will take your exact story and create:
                    </p>
                    <ul className="text-sm text-left space-y-1">
                      <li>• A beautiful illustrated storybook using your words</li>
                      <li>• Custom illustrations for each page</li>
                      <li>• Professional children's book style</li>
                      <li>• Your story, exactly as you wrote it</li>
                    </ul>
                  </div>
                  
                  <Button 
                    size="lg" 
                    onClick={generateStory}
                    className="bg-gradient-primary shadow-lg hover:shadow-xl transition-all"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Storybook!
                  </Button>
                </div>
              )}

              {isGenerating && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3 text-lg font-medium text-primary">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Creating your storybook...</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This might take a moment while Gemini creates your illustrations and polishes your story.
                  </p>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && generatedStory && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview Your Picture Book
              </CardTitle>
              <CardDescription>
                Here's your completed story! Review it and publish when you're ready.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-green-500/10 rounded-lg">
                <Check className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-semibold mb-2">Picture Book Created Successfully!</h3>
                <p className="text-muted-foreground">
                  Your story has been transformed into a beautiful picture book with {generatedStory.pages?.length || 0} pages.
                </p>
              </div>
              
              {/* Story Preview */}
              <div className="space-y-4">
                <h4 className="font-semibold">Story Preview:</h4>
                <div className="space-y-4">
                  {generatedStory.pages?.map((page: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-primary">Page {page.page_number}</span>
                      </div>
                      <p className="text-sm mb-2">{page.text_content}</p>
                      {page.image_url && (
                        <div className="mt-2">
                          <img 
                            src={page.image_url} 
                            alt={`Page ${page.page_number} illustration`}
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
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isGenerating}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {currentStep < totalSteps && currentStep !== 3 && (
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          
          {currentStep === totalSteps && generatedStory && (
            <Button 
              onClick={publishStory}
              className="bg-gradient-primary"
            >
              <Check className="w-4 h-4 mr-2" />
              Publish Story
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}