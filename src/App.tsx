
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Bookmarks from "./pages/Bookmarks";
import Stack from "./pages/Stack";
import NotFound from "./pages/NotFound";
import Writing from "./pages/Writing";
import BlogPost from "./pages/BlogPost";
import WritingByTag from "./pages/WritingByTag";
import ReadingList from "./pages/ReadingList";
import Showcase from "./pages/Showcase";
import { craftApi } from "./services/craftApi";
import { craftQueryKeys } from "./hooks/useCraftApi";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
});

// Component to prefetch data on app load
const DataPrefetcher = () => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Prefetch blog posts on first load (tags are derived from posts)
    queryClient.prefetchQuery({
      queryKey: craftQueryKeys.posts(),
      queryFn: () => craftApi.getBlogPosts(),
    });
  }, [queryClient]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DataPrefetcher />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/stack" element={<Stack />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/writing/tag/:tag" element={<WritingByTag />} />
          <Route path="/writing/:slug" element={<BlogPost />} />
          <Route path="/reading-list" element={<ReadingList />} />
          <Route path="/showcase" element={<Showcase />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
