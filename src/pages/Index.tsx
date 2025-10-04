import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { BiomeMap } from "@/components/BiomeMap";
import { BiomeDetailPanel } from "@/components/BiomeDetailPanel";
import { StudentSidebar } from "@/components/StudentSidebar";
import { Biome } from "@/components/BiomeTile";
import { useAuth } from "@/contexts/DemoAuthContext";

const Index = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState("class-a");
  const [selectedBiome, setSelectedBiome] = useState<Biome | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [biomes, setBiomes] = useState<Biome[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load biomes - using hardcoded data for demo
  useEffect(() => {
    console.log('🌍 Loading demo biomes...');
    
    const demoBiomes = [
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
    
    console.log('✅ Demo biomes loaded:', demoBiomes);
    setBiomes(demoBiomes);
    setIsLoading(false);
  }, []);

  const handleBiomeClick = (biome: Biome) => {
    console.log('🖱️ Biome clicked:', biome);
    if (biome.unlocked) {
      console.log('✅ Biome is unlocked, opening panel');
      setSelectedBiome(biome);
      setIsPanelOpen(true);
    } else {
      console.log('❌ Biome is locked');
    }
  };

  const handleNavigate = (section: string) => {
    console.log("Navigate to:", section);
    // Handle navigation logic here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Biome Scribe Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar 
        selectedClass={selectedClass} 
        onClassChange={setSelectedClass}
        onNavigate={handleNavigate}
      />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 overflow-y-auto">
          <BiomeMap onBiomeClick={handleBiomeClick} biomes={biomes} />
        </main>
        
        {user && <StudentSidebar />}
      </div>

      <BiomeDetailPanel
        biome={selectedBiome}
        open={isPanelOpen}
        onClose={() => {
          console.log('🔒 Closing biome panel');
          setIsPanelOpen(false);
        }}
      />
    </div>
  );
};

export default Index;
