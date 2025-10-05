
import { useEffect, useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { BookOpen, Trophy, GraduationCap, FileText, Map, User } from "lucide-react";
import { useAuth } from "@/contexts/DemoAuthContext";
import { UserProfile } from "./UserProfile";

import { storyService } from '@/services/newStoryService';

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

export const NavBar = ({ selectedClass, onClassChange, onNavigate }: NavBarProps) => {
  const { user } = useAuth();

   const [stories, setStories] = useState([]);

   useEffect(() => {
      
     
      const fetchStories = async () => {
        var returnedStories = await storyService.getAllStories();
        setStories(returnedStories ?? []);
      }

      fetchStories();
      
    }, []);

  return (
    <div className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Adventure Story Books
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
                        {stories.map((story) => (
                          <NavigationMenuLink
                                 className="block p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                                 onClick={() => window.location.href = '/story-finish/' + story.id}
                               >
                            <div className="font-medium">{story.title}</div>
                          </NavigationMenuLink>
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
