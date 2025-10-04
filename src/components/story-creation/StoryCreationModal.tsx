import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  PenTool, 
  Sparkles, 
  Eye, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  X,
  Image as ImageIcon,
  BookOpen
} from 'lucide-react';
import { PhotoUploadStep } from './PhotoUploadStep';
import { StoryPromptStep } from './StoryPromptStep';
import { AIGenerationStep } from './AIGenerationStep';
import { StoryPreviewStep } from './StoryPreviewStep';

export interface StoryCreationData {
  photos: File[];
  storyBeginning: string;
  selectedBiome: string;
  storyTitle: string;
  characters: string[];
  generatedStory?: {
    title: string;
    pages: Array<{
      text: string;
      imagePrompt: string;
      imageUrl?: string;
    }>;
  };
}

interface StoryCreationModalProps {
  biomeId: string;
  biomeName: string;
  open: boolean;
  onClose: () => void;
  onStoryCreated: (story: any) => void;
}

const STEPS = [
  { id: 'upload', title: 'Upload Photos', icon: Upload, description: 'Add photos of characters' },
  { id: 'prompt', title: 'Story Beginning', icon: PenTool, description: 'Write your story start' },
  { id: 'generate', title: 'AI Generation', icon: Sparkles, description: 'Generate your story' },
  { id: 'preview', title: 'Preview & Edit', icon: Eye, description: 'Review your story' },
];

export const StoryCreationModal = ({ 
  biomeId, 
  biomeName, 
  open, 
  onClose, 
  onStoryCreated 
}: StoryCreationModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [storyData, setStoryData] = useState<StoryCreationData>({
    photos: [],
    storyBeginning: '',
    selectedBiome: biomeId,
    storyTitle: '',
    characters: [],
  });

  const currentStepData = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setStoryData({
      photos: [],
      storyBeginning: '',
      selectedBiome: biomeId,
      storyTitle: '',
      characters: [],
    });
    onClose();
  };

  const updateStoryData = (updates: Partial<StoryCreationData>) => {
    setStoryData(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Upload photos
        return storyData.photos.length > 0;
      case 1: // Story beginning
        return storyData.storyBeginning.trim().length > 0;
      case 2: // AI Generation
        return !!storyData.generatedStory;
      case 3: // Preview
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PhotoUploadStep
            photos={storyData.photos}
            onPhotosChange={(photos) => updateStoryData({ photos })}
            onCharactersExtracted={(characters) => updateStoryData({ characters })}
          />
        );
      case 1:
        return (
          <StoryPromptStep
            biomeName={biomeName}
            storyBeginning={storyData.storyBeginning}
            storyTitle={storyData.storyTitle}
            onStoryBeginningChange={(storyBeginning) => updateStoryData({ storyBeginning })}
            onStoryTitleChange={(storyTitle) => updateStoryData({ storyTitle })}
          />
        );
      case 2:
        return (
          <AIGenerationStep
            storyData={storyData}
            onStoryGenerated={(generatedStory) => updateStoryData({ generatedStory })}
          />
        );
      case 3:
        return (
          <StoryPreviewStep
            storyData={storyData}
            onStorySaved={(story) => {
              onStoryCreated(story);
              handleClose();
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Create Story in {biomeName}
              </DialogTitle>
              <DialogDescription>
                Step {currentStep + 1} of {STEPS.length}: {currentStepData.description}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{currentStepData.title}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center space-y-2">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-colors
                  ${isActive ? 'bg-primary text-primary-foreground' : 
                    isCompleted ? 'bg-green-500 text-white' : 
                    'bg-muted text-muted-foreground'}
                `}>
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="text-center">
                  <p className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
              {currentStep < STEPS.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};