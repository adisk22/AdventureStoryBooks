import { BiomeTile, Biome } from "./BiomeTile";

interface BiomeMapProps {
  onBiomeClick: (biome: Biome) => void;
  biomes?: Biome[]; // Make biomes optional for backward compatibility
}

export const BiomeMap = ({ onBiomeClick, biomes }: BiomeMapProps) => {
  // Fallback biomes if none provided (for backward compatibility)
  const defaultBiomes: Biome[] = [
    {
      id: "forest",
      name: "Enchanted Forest",
      unlocked: true,
      gradient: "bg-gradient-forest",
      image: "/forest-biome.jpg",
      storyCount: 12,
    },
    {
      id: "desert",
      name: "Golden Desert",
      unlocked: true,
      gradient: "bg-gradient-desert",
      image: "/desert-biome.jpg",
      storyCount: 8,
    },
    {
      id: "ocean",
      name: "Deep Ocean",
      unlocked: true,
      gradient: "bg-gradient-ocean",
      image: "/ocean-biome.jpg",
      storyCount: 15,
    },
    {
      id: "tundra",
      name: "Frozen Tundra",
      unlocked: false,
      gradient: "bg-gradient-tundra",
      image: "/tundra-biome.jpg",
      storyCount: 0,
    },
    {
      id: "mountains",
      name: "Misty Mountains",
      unlocked: false,
      gradient: "bg-gradient-mountains",
      image: "/mountains-biome.jpg",
      storyCount: 0,
    },
  ];

  const displayBiomes = biomes || defaultBiomes;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Explore Environments
          </h2>
          <p className="text-muted-foreground">
            Click on an unlocked biome to start writing stories with that setting!
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {displayBiomes.map((biome, index) => (
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
