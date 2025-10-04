import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { BiomeMap } from "@/components/BiomeMap";
import { BiomeDetailPanel } from "@/components/BiomeDetailPanel";
import { StudentSidebar } from "@/components/StudentSidebar";
import { Biome } from "@/components/BiomeTile";

const Index = () => {
  const [selectedClass, setSelectedClass] = useState("class-a");
  const [selectedBiome, setSelectedBiome] = useState<Biome | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleBiomeClick = (biome: Biome) => {
    if (biome.unlocked) {
      setSelectedBiome(biome);
      setIsPanelOpen(true);
    }
  };

  const handleNavigate = (section: string) => {
    console.log("Navigate to:", section);
    // Handle navigation logic here
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar 
        selectedClass={selectedClass} 
        onClassChange={setSelectedClass}
        onNavigate={handleNavigate}
      />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 overflow-y-auto">
          <BiomeMap onBiomeClick={handleBiomeClick} />
        </main>
        
        <StudentSidebar />
      </div>

      <BiomeDetailPanel
        biome={selectedBiome}
        open={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
};

export default Index;
