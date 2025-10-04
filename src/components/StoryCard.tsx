import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen } from "lucide-react";

interface Story {
  id: string;
  title: string;
  author: string;
  biome: string;
  preview: string;
  likes: number;
}

interface StoryCardProps {
  story: Story;
}

export const StoryCard = ({ story }: StoryCardProps) => {
  const authorInitials = story.author
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
              {authorInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{story.author}</span>
        </div>
        <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
          {story.title}
        </h3>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3">{story.preview}</p>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between pt-3 border-t">
        <Badge variant="secondary" className="text-xs">
          <BookOpen className="w-3 h-3 mr-1" />
          {story.biome}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {story.likes} {story.likes === 1 ? 'like' : 'likes'}
        </span>
      </CardFooter>
    </Card>
  );
};
