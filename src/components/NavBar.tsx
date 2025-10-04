import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, GraduationCap, FileText, Map, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/DemoAuthContext";
import { UserProfile } from "./UserProfile";

interface NavBarProps {
  selectedClass: string;
  onClassChange: (classId: string) => void;
  onNavigate: (section: string) => void;
}

interface NavBarProps {
  selectedClass: string;
  onClassChange: (classId: string) => void;
  onNavigate: (section: string) => void;
}

const classes = [
  { 
    id: "class-a", 
    name: "Creative Writers 101", 
    biomes: [
      { id: "forest", name: "Enchanted Forest", storyCount: 12 },
      { id: "desert", name: "Golden Desert", storyCount: 8 },
      { id: "ocean", name: "Deep Ocean", storyCount: 15 },
    ]
  },
  { 
    id: "class-b", 
    name: "Story Explorers",
    biomes: [
      { id: "tundra", name: "Frozen Tundra", storyCount: 6 },
      { id: "mountains", name: "Misty Mountains", storyCount: 10 },
    ]
  },
  { 
    id: "class-c", 
    name: "Adventure Authors",
    biomes: [
      { id: "forest", name: "Enchanted Forest", storyCount: 9 },
      { id: "ocean", name: "Deep Ocean", storyCount: 11 },
    ]
  },
];

export const NavBar = ({ selectedClass, onClassChange, onNavigate }: NavBarProps) => {
  const { user } = useAuth();

  return (
    <div className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Biome Scribe Studio
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Navigation Menu */}
            <NavigationMenu>
              <NavigationMenuList>
                {/* My Stories */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    My Stories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[300px] p-4">
                      <div className="space-y-2">
                               <NavigationMenuLink
                                 className="block p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                                 onClick={() => window.location.href = '/my-stories'}
                               >
                          <div className="font-medium">All My Stories</div>
                          <div className="text-sm text-muted-foreground">View all your published and draft stories</div>
                        </NavigationMenuLink>
                        <NavigationMenuLink 
                          className="block p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => window.location.href = '/my-stories?tab=drafts'}
                        >
                          <div className="font-medium">Drafts</div>
                          <div className="text-sm text-muted-foreground">Continue writing your drafts</div>
                        </NavigationMenuLink>
                        <NavigationMenuLink 
                          className="block p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => window.location.href = '/my-stories?tab=published'}
                        >
                          <div className="font-medium">Published</div>
                          <div className="text-sm text-muted-foreground">See your published works</div>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* My Progress */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    <Trophy className="w-4 h-4 mr-2" />
                    My Progress
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[300px] p-4">
                      <div className="space-y-2">
                        <NavigationMenuLink 
                          className="block p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => onNavigate('achievements')}
                        >
                          <div className="font-medium">Achievements</div>
                          <div className="text-sm text-muted-foreground">View your badges and milestones</div>
                        </NavigationMenuLink>
                        <NavigationMenuLink 
                          className="block p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => onNavigate('points')}
                        >
                          <div className="font-medium">Story Points</div>
                          <div className="text-sm text-muted-foreground">Track your progress and unlocks</div>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* My Classes */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    My Classes
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4">
                      <div className="space-y-3">
                        {classes.map((cls) => (
                          <div key={cls.id} className="space-y-2">
                            <div 
                              className={cn(
                                "font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors",
                                selectedClass === cls.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                              )}
                              onClick={() => onClassChange(cls.id)}
                            >
                              {cls.name}
                            </div>
                            <div className="ml-4 space-y-1">
                              {cls.biomes.map((biome) => (
                                <NavigationMenuLink
                                  key={biome.id}
                                  className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 cursor-pointer transition-colors text-sm"
                                  onClick={() => {
                                    onClassChange(cls.id);
                                    onNavigate(`biome-${biome.id}`);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <Map className="w-3 h-3 text-muted-foreground" />
                                    <span>{biome.name}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {biome.storyCount} stories
                                  </span>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Demo User Profile */}
            <UserProfile user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};
