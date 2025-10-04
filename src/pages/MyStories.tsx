import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  FileText, 
  Eye, 
  Heart, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/DemoAuthContext';
import { storyService, type Story, type StoryDraft, type StoryStats } from '@/services/newStoryService';

export default function MyStories() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [stories, setStories] = useState<Story[]>([]);
  const [drafts, setDrafts] = useState<StoryDraft[]>([]);
  const [stats, setStats] = useState<StoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('published');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // const [storiesData, draftsData, statsData] = await Promise.all([
        
      // ]);
      
      // setStories(storiesData);
      // setDrafts(draftsData);
      // setStats(statsData);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load your stories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStory = () => {
    navigate('/');
  };

  const handleEditDraft = (draft: StoryDraft) => {
    navigate(`/story-creation/${draft.biome}?draft=${draft.id}`);
  };

  const handleDeleteDraft = async (draftId: string) => {
    if (!user) return;
    
    try {
      
      setDrafts(prev => prev.filter(draft => draft.id !== draftId));
    } catch (err) {
      console.error('Error deleting draft:', err);
      setError('Failed to delete draft. Please try again.');
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!user) return;
    
    try {
      setStories(prev => prev.filter(story => story.id !== storyId));
    } catch (err) {
      console.error('Error deleting story:', err);
      setError('Failed to delete story. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
              >
                <BookOpen className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">My Stories</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your published stories and drafts
                </p>
              </div>
            </div>
            <Button onClick={handleCreateStory} className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create New Story
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.total_stories}</div>
                <div className="text-sm text-muted-foreground">Total Stories</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.published_stories}</div>
                <div className="text-sm text-muted-foreground">Published</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.draft_stories}</div>
                <div className="text-sm text-muted-foreground">Drafts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.total_likes}</div>
                <div className="text-sm text-muted-foreground">Total Likes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total_views}</div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stories and Drafts Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="published">
              <FileText className="w-4 h-4 mr-2" />
              Published Stories ({stories.length})
            </TabsTrigger>
            <TabsTrigger value="drafts">
              <Edit className="w-4 h-4 mr-2" />
              Drafts ({drafts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="published" className="space-y-4">
            {stories.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stories.map((story) => (
                  <Card key={story.id} className="group hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">{story.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {/* {story.biomes?.name || story.biome_id} */}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {story.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {story.likes_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {story.views_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(story.published_at || story.created_at)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/story/${story.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteStory(story.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Published Stories Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create and publish your first story to see it here!
                    </p>
                    <Button onClick={handleCreateStory} className="bg-gradient-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Story
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            {drafts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {drafts.map((draft) => (
                  <Card key={draft.id} className="group hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">{draft.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {draft.biome}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          Draft
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="w-4 h-4" />
                          Last updated: {formatDate(draft.updated_at)}
                        </div>
                        <div className="line-clamp-2">
                          {draft.beginning.substring(0, 100)}...
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEditDraft(draft)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Continue
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteDraft(draft.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Edit className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Drafts Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start writing a story and save it as a draft to continue later!
                    </p>
                    <Button onClick={handleCreateStory} className="bg-gradient-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Start Writing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}