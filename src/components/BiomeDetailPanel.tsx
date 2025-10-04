import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StoryCard } from "./StoryCard";
import { Biome } from "./BiomeTile";
import { PenLine } from "lucide-react";

interface BiomeDetailPanelProps {
  biome: Biome | null;
  open: boolean;
  onClose: () => void;
}

const mockStories = [
  {
    id: "1",
    title: "The Lost Key of the Ancient Oak",
    author: "Emma Johnson",
    biome: "Forest",
    preview: "Deep in the heart of the enchanted forest, a young explorer discovers a mysterious key embedded in the bark of the oldest tree...",
    likes: 24,
  },
  {
    id: "2",
    title: "Whispers Among the Leaves",
    author: "Alex Chen",
    biome: "Forest",
    preview: "When the wind blows through the forest, some say you can hear the trees talking. I never believed it until last Tuesday...",
    likes: 18,
  },
  {
    id: "3",
    title: "The Firefly Festival",
    author: "Maya Patel",
    biome: "Forest",
    preview: "Once a year, millions of fireflies gather in the clearing. Legend says if you make a wish during the festival, it will come true...",
    likes: 31,
  },
  {
    id: "4",
    title: "Guardian of the Grove",
    author: "Sam Williams",
    biome: "Forest",
    preview: "An ancient creature watches over the forest, protecting it from harm. But when danger comes from within, who will protect the guardian?",
    likes: 15,
  },
];

export const BiomeDetailPanel = ({ biome, open, onClose }: BiomeDetailPanelProps) => {
  if (!biome) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${biome.gradient}`} />
            {biome.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6 py-6">
          <div className="flex justify-center">
            <Button size="lg" className="bg-gradient-primary shadow-lg hover:shadow-xl transition-all">
              <PenLine className="w-5 h-5 mr-2" />
              Write a Story in {biome.name}
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Classmates' Stories</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {mockStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
