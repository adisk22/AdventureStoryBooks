import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Biome {
  id: string;
  name: string;
  unlocked: boolean;
  gradient: string;
  image: string;
  storyCount: number;
}

interface BiomeTileProps {
  biome: Biome;
  onClick: () => void;
}

export const BiomeTile = ({ biome, onClick }: BiomeTileProps) => {
  console.log('🖼️ Rendering biome tile:', biome.name, 'Image:', biome.image);
  
  return (
    <button
      onClick={onClick}
      disabled={!biome.unlocked}
      className={cn(
        "group relative overflow-hidden rounded-2xl transition-all duration-300",
        "shadow-md hover:shadow-xl hover:scale-105",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        biome.unlocked ? "cursor-pointer" : "cursor-not-allowed"
      )}
    >
      <div className="aspect-square relative">
        <img
          src={biome.image}
          alt={biome.name}
          className={cn(
            "w-full h-full object-cover transition-transform duration-300",
            biome.unlocked ? "group-hover:scale-110" : "grayscale"
          )}
          onLoad={() => console.log('✅ Image loaded:', biome.image)}
          onError={(e) => console.error('❌ Image failed to load:', biome.image, e)}
        />
        
        {/* Gradient overlay */}
        <div
          className={cn(
            "absolute inset-0 opacity-30 mix-blend-overlay transition-opacity",
            biome.gradient
          )}
        />
        
        {/* Lock overlay for locked biomes */}
        {!biome.unlocked && (
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Lock className="w-12 h-12 text-background mx-auto mb-2" />
              <span className="text-background font-semibold">Locked</span>
            </div>
          </div>
        )}
        
        {/* Title and story count */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-4">
          <h3 className="text-background font-bold text-lg mb-1">{biome.name}</h3>
          {biome.unlocked && (
            <p className="text-background/90 text-sm">
              {biome.storyCount} {biome.storyCount === 1 ? 'story' : 'stories'}
            </p>
          )}
        </div>

        {/* Unlock animation pulse */}
        {biome.unlocked && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-success rounded-full animate-pulse-glow" />
        )}
      </div>
    </button>
  );
};
