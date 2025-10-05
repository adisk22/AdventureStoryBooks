import { useEffect, useState } from 'react';
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
import { storyService } from '@/services/newStoryService';

export default function StoryFinish() {
  const { storyId } = useParams<{ storyId }>();
  const storyIdNum = storyId ? Number(storyId) : null;
  var biomeId = '';
  const [generatedStory, setGeneratedStory] = useState<any>(null);
  const navigate = useNavigate();

	useEffect(() => {
		setGeneratedStory([]);

		const fetchBiome = async () => {
			if (storyIdNum) {
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
	}, [storyIdNum]);


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
                onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Create Story</h1>
                <p className="text-sm text-muted-foreground">
                  Step 3: Completed Story!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />;
            </div>
          </div>
          <Progress value={(3 / 3) * 100} className="mt-4" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
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
              </div>
              
              {/* Story Preview */}
              <div className="space-y-4">
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
    </div>
  );
}