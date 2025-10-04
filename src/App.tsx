import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DemoAuthProvider } from "@/contexts/DemoAuthContext";
import Index from "./pages/Index";

// Creating a story
import StoryCreation from "./pages/StoryCreation";
import StoryContinuation from "./pages/StoryContinuation";
import StoryCreate from "./pages/StoryCreate"

import MyStories from "./pages/MyStories";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DemoAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/story-creation/:biomeId" element={<StoryCreation />} />
            <Route path="/my-stories" element={<MyStories />} />
            <Route path="/story-continuation/:storyId/:pageNum" element={<StoryContinuation/>} />
            <Route path="/story-create/:biomeId" element={<StoryCreate />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DemoAuthProvider>
  </QueryClientProvider>
);

export default App;
