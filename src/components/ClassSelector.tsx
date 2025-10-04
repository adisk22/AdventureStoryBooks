import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";

interface ClassSelectorProps {
  selectedClass: string;
  onClassChange: (classId: string) => void;
}

const classes = [
  { id: "class-a", name: "Creative Writers 101", color: "from-forest to-forest/80" },
  { id: "class-b", name: "Story Explorers", color: "from-ocean to-ocean/80" },
  { id: "class-c", name: "Adventure Authors", color: "from-desert to-desert/80" },
];

export const ClassSelector = ({ selectedClass, onClassChange }: ClassSelectorProps) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-10 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Story Biomes
            </h1>
          </div>
        </div>
        
        <Tabs value={selectedClass} onValueChange={onClassChange} className="w-full">
          <TabsList className="w-full justify-start bg-secondary/50 h-auto p-1">
            {classes.map((cls) => (
              <TabsTrigger
                key={cls.id}
                value={cls.id}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:text-primary-foreground transition-all"
                style={{
                  backgroundImage: selectedClass === cls.id ? `linear-gradient(to right, hsl(var(--${cls.color.split('-')[1]})), hsl(var(--${cls.color.split('-')[1]}) / 0.8))` : undefined
                }}
              >
                {cls.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
