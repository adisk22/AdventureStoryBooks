import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Biome } from "./BiomeTile";

interface BiomeDetailPanelProps {
  biome: Biome | null;
  open: boolean;
  onClose: () => void;
}

export const BiomeDetailPanel = ({ biome, open, onClose }: BiomeDetailPanelProps) => {
  const navigate = useNavigate();

  console.log('🔍 BiomeDetailPanel render:', { biome, open });

  if (!biome) {
    console.log('❌ No biome provided');
    return null;
  }

  const handleCreateStory = () => {
    console.log('📝 Create story clicked for biome:', biome.name);
    navigate(`/story-create/${biome.id}`);
    onClose(); // Close the panel when navigating
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {biome.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          <div className="text-center space-y-4">
            <div className={`w-16 h-16 rounded-full mx-auto ${biome.gradient}`} />
            <h2 className="text-xl font-semibold">{biome.name}</h2>
            <p className="text-muted-foreground">
              Create amazing stories in the {biome.name}! Click below to start writing your adventure.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
              <Button onClick={handleCreateStory} className="bg-gradient-primary">
                Create Story
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};