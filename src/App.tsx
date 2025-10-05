import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DemoAuthProvider } from "@/contexts/DemoAuthContext";
import Index from "./pages/Index";

// Creating a story
import StoryContinuation from "./pages/StoryContinuation";
import StoryCreate from "./pages/StoryCreate"
import StoryFinish from "./pages/StoryFinish";

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
            <Route path="/story-continuation/:storyId/:pageNum" element={<StoryContinuation/>} />
            <Route path="/story-finish/:storyId" element={<StoryFinish />} />
            <Route path="/story-create/:biomeId" element={<StoryCreate />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DemoAuthProvider>
  </QueryClientProvider>
);

export default App;
