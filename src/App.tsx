
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Bookmarks from "./pages/Bookmarks";
import Stack from "./pages/Stack";
import NotFound from "./pages/NotFound";
import WorkInProgress from "./pages/WorkInProgress";
import Desserts from "./pages/Desserts";
import Writing from "./pages/Writing";
import BlogPost from "./pages/BlogPost";
import WritingByTag from "./pages/WritingByTag";
import ReadingList from "./pages/ReadingList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/stack" element={<Stack />} />
          <Route path="/work-in-progress" element={<WorkInProgress />} />
          <Route path="/desserts" element={<Desserts />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/writing/tag/:tag" element={<WritingByTag />} />
          <Route path="/writing/:slug" element={<BlogPost />} />
          <Route path="/reading-list" element={<ReadingList />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
