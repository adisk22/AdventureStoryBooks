import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Biome } from "./BiomeTile";

interface ProfanityPopupProps {
  open: boolean;
  onClose: () => void;
}

export const ProfanityPopup = ({ open, onClose }: ProfanityPopupProps) => {

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        
        <div className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">Bad language detected</h2>
            <p className="text-muted-foreground">
                Please remove any inappropriate language to continue
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};