import { BiomeTile, Biome } from "./BiomeTile";
import forestImage from "@/assets/forest-biome.jpg";
import desertImage from "@/assets/desert-biome.jpg";
import oceanImage from "@/assets/ocean-biome.jpg";
import tundraImage from "@/assets/tundra-biome.jpg";
import mountainsImage from "@/assets/mountains-biome.jpg";

interface BiomeMapProps {
  onBiomeClick: (biome: Biome) => void;
}

const biomes: Biome[] = [
  {
    id: "forest",
    name: "Enchanted Forest",
    unlocked: true,
    gradient: "bg-gradient-forest",
    image: forestImage,
    storyCount: 12,
  },
  {
    id: "desert",
    name: "Golden Desert",
    unlocked: true,
    gradient: "bg-gradient-desert",
    image: desertImage,
    storyCount: 8,
  },
  {
    id: "ocean",
    name: "Deep Ocean",
    unlocked: true,
    gradient: "bg-gradient-ocean",
    image: oceanImage,
    storyCount: 15,
  },
  {
    id: "tundra",
    name: "Frozen Tundra",
    unlocked: false,
    gradient: "bg-gradient-tundra",
    image: tundraImage,
    storyCount: 0,
  },
  {
    id: "mountains",
    name: "Misty Mountains",
    unlocked: false,
    gradient: "bg-gradient-mountains",
    image: mountainsImage,
    storyCount: 0,
  },
];

export const BiomeMap = ({ onBiomeClick }: BiomeMapProps) => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Explore Story Biomes
          </h2>
          <p className="text-muted-foreground">
            Click on an unlocked biome to read stories or write your own adventure!
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {biomes.map((biome, index) => (
            <div
              key={biome.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="animate-scale-in"
            >
              <BiomeTile biome={biome} onClick={() => onBiomeClick(biome)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
