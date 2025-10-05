import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { BiomeMap } from "@/components/BiomeMap";
import { BiomeDetailPanel } from "@/components/BiomeDetailPanel";
import { StudentSidebar } from "@/components/StudentSidebar";
import { Biome } from "@/components/BiomeTile";
import { useAuth } from "@/contexts/DemoAuthContext";
import { storyService } from '@/services/newStoryService';

const Index = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState("class-a");
  const [selectedBiome, setSelectedBiome] = useState<Biome | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [biomes, setBiomes] = useState<Biome[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load biomes - using hardcoded data for demo
  useEffect(() => {
    var demoBiomes = [];

    const loadBiomes = async () => {
      console.log('Loading demo biomes...');
      
      try {
        demoBiomes = await storyService.getBiomes();
      } catch (err) {
        console.error('Error fetching biomes from service:', err);
      }
      
      console.log('Demo biomes loaded:', demoBiomes);
      setBiomes(demoBiomes);
      setIsLoading(false);
    };

    loadBiomes();
  }, []);

  const handleBiomeClick = (biome: Biome) => {
    console.log('Biome clicked:', biome);
    
    if (biome.unlocked) {
      console.log('Biome is unlocked, opening panel');
      setSelectedBiome(biome);
      setIsPanelOpen(true);
    } else {
      console.log('Biome is locked');
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
          <p className="text-muted-foreground">Loading Adventure Story Books...</p>
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
      </div>

      <BiomeDetailPanel
        biome={selectedBiome}
        open={isPanelOpen}
        onClose={() => {
          console.log('Closing biome panel');
          setIsPanelOpen(false);
        }}
      />
    </div>
  );
};

export default Index;
