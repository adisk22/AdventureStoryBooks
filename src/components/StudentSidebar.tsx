import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, BookMarked, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StudentStory {
  id: string;
  title: string;
  biome: string;
  status: "draft" | "published" | "in-review";
  lastEdited: string;
}

const studentStories: StudentStory[] = [
  {
    id: "1",
    title: "The Midnight Adventure",
    biome: "Enchanted Forest",
    status: "published",
    lastEdited: "2 days ago",
  },
  {
    id: "2",
    title: "Desert Mirage Mystery",
    biome: "Golden Desert",
    status: "published",
    lastEdited: "5 days ago",
  },
  {
    id: "3",
    title: "Underwater Kingdom",
    biome: "Deep Ocean",
    status: "draft",
    lastEdited: "Today",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "bg-success/10 text-success border-success/20";
    case "draft":
      return "bg-warning/10 text-warning border-warning/20";
    case "in-review":
      return "bg-primary/10 text-primary border-primary/20";
    default:
      return "bg-muted";
  }
};

export const StudentSidebar = () => {
  const currentPoints = 275;
  const nextUnlockPoints = 500;
  const progressPercentage = (currentPoints / nextUnlockPoints) * 100;

  return (
    <div className="w-full lg:w-80 border-l bg-card/50 backdrop-blur-sm">
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-6 space-y-6">
          {/* Progress Card */}
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="w-5 h-5 text-warning" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Story Points</span>
                  <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {currentPoints}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  {nextUnlockPoints - currentPoints} points until next biome unlock
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <div className="flex-1 bg-forest-light rounded-lg p-3 text-center">
                  <Star className="w-4 h-4 mx-auto mb-1 text-forest" />
                  <div className="text-xs font-medium text-forest">Level 5</div>
                </div>
                <div className="flex-1 bg-ocean-light rounded-lg p-3 text-center">
                  <BookMarked className="w-4 h-4 mx-auto mb-1 text-ocean" />
                  <div className="text-xs font-medium text-ocean">3 Published</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Stories Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookMarked className="w-5 h-5 text-primary" />
                My Stories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {studentStories.map((story) => (
                <div
                  key={story.id}
                  className="group p-3 rounded-lg border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                >
                  <h4 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {story.title}
                  </h4>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-xs">
                      {story.biome}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(story.status)}`}>
                      {story.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {story.lastEdited}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};
