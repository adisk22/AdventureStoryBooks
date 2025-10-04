import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  PenTool, 
  Lightbulb, 
  BookOpen,
  Sparkles,
  Target,
  Award
} from 'lucide-react';

interface StoryPromptStepProps {
  biomeName: string;
  storyBeginning: string;
  storyTitle: string;
  onStoryBeginningChange: (beginning: string) => void;
  onStoryTitleChange: (title: string) => void;
}

const LITERARY_GOALS = [
  { id: 'adjectives', name: 'Use 5+ Descriptive Adjectives', points: 10, description: 'Make your story vivid with colorful describing words' },
  { id: 'verbs', name: 'Use Strong Action Verbs', points: 10, description: 'Bring your story to life with powerful action words' },
  { id: 'dialogue', name: 'Include Character Dialogue', points: 15, description: 'Let your characters speak and express themselves' },
  { id: 'emotions', name: 'Show Character Emotions', points: 12, description: 'Help readers feel what your characters are feeling' },
  { id: 'setting', name: 'Describe the Setting', points: 8, description: 'Paint a picture of where your story takes place' },
];

const STORY_PROMPTS = [
  "Once upon a time in the {biome}, there was...",
  "In the magical {biome}, something amazing happened...",
  "Deep in the heart of the {biome}, a great adventure began...",
  "The {biome} held a secret that only the bravest could discover...",
];

export const StoryPromptStep = ({ 
  biomeName, 
  storyBeginning, 
  storyTitle,
  onStoryBeginningChange,
  onStoryTitleChange 
}: StoryPromptStepProps) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['adjectives', 'verbs']);
  const [selectedPrompt, setSelectedPrompt] = useState(0);

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handlePromptSelect = (promptIndex: number) => {
    setSelectedPrompt(promptIndex);
    const prompt = STORY_PROMPTS[promptIndex].replace('{biome}', biomeName);
    onStoryBeginningChange(prompt + ' ');
  };

  const totalPoints = selectedGoals.reduce((sum, goalId) => {
    const goal = LITERARY_GOALS.find(g => g.id === goalId);
    return sum + (goal?.points || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Story Title */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Story Title
          </CardTitle>
          <CardDescription>
            Give your story a catchy title that captures the adventure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="story-title">Story Title</Label>
            <Input
              id="story-title"
              placeholder="Enter your story title..."
              value={storyTitle}
              onChange={(e) => onStoryTitleChange(e.target.value)}
              className="text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Literary Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Literary Goals
          </CardTitle>
          <CardDescription>
            Choose goals to earn points and improve your writing skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {LITERARY_GOALS.map((goal) => (
              <div
                key={goal.id}
                className={`
                  p-4 rounded-lg border cursor-pointer transition-colors
                  ${selectedGoals.includes(goal.id) 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
                onClick={() => handleGoalToggle(goal.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{goal.name}</h4>
                      <Badge variant="secondary">
                        <Award className="w-3 h-3 mr-1" />
                        {goal.points} pts
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {goal.description}
                    </p>
                  </div>
                  <div className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center ml-3
                    ${selectedGoals.includes(goal.id) 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : 'border-muted-foreground'
                    }
                  `}>
                    {selectedGoals.includes(goal.id) && (
                      <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selectedGoals.length > 0 && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  Total Points Available: {totalPoints}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Story Prompts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Story Starters
          </CardTitle>
          <CardDescription>
            Choose a prompt to get your story started, or write your own beginning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {STORY_PROMPTS.map((prompt, index) => (
              <div
                key={index}
                className={`
                  p-3 rounded-lg border cursor-pointer transition-colors
                  ${selectedPrompt === index 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
                onClick={() => handlePromptSelect(index)}
              >
                <p className="text-sm">
                  {prompt.replace('{biome}', biomeName)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Story Beginning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            Your Story Beginning
          </CardTitle>
          <CardDescription>
            Write the first 2-3 sentences of your story. This will help the AI understand your vision.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="story-beginning">Story Beginning</Label>
            <Textarea
              id="story-beginning"
              placeholder="Begin your story here... (2-3 sentences recommended)"
              value={storyBeginning}
              onChange={(e) => onStoryBeginningChange(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Characters will be added automatically from your photos</span>
              <span>{storyBeginning.length} characters</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>Writing Tips:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Start with an interesting hook to grab readers' attention</li>
            <li>• Introduce your main character and the setting</li>
            <li>• Set up a problem or adventure that needs to be solved</li>
            <li>• Keep it to 2-3 sentences for the best AI results</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};