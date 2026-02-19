
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Bookmarks from "./pages/Bookmarks";
import Stack from "./pages/Stack";
import NotFound from "./pages/NotFound";
import Writing from "./pages/Writing";
import Projects from "./pages/Projects";
import BlogPost from "./pages/BlogPost";
import WritingByTag from "./pages/WritingByTag";
import { craftApi } from "./services/craftApi";
import { craftQueryKeys } from "./hooks/useCraftApi";
import { ProjectsPasscodeProvider, useProjectsPasscode } from "@/contexts/ProjectsPasscodeContext";
import { ProjectsRouteGuard } from "@/components/ProjectsRouteGuard";

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
  const { isProjectsUnlocked } = useProjectsPasscode();
  
  useEffect(() => {
    // Prefetch blog posts on first load (tags are derived from posts)
    queryClient.prefetchQuery({
      queryKey: craftQueryKeys.posts(),
      queryFn: () => craftApi.getBlogPosts(),
    });

    if (isProjectsUnlocked) {
      queryClient.prefetchQuery({
        queryKey: craftQueryKeys.projects(),
        queryFn: () => craftApi.getProjects(),
      });
    }
  }, [queryClient, isProjectsUnlocked]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ProjectsPasscodeProvider>
          <DataPrefetcher />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/stack" element={<Stack />} />
            <Route
              path="/projects"
              element={
                <ProjectsRouteGuard>
                  <Projects />
                </ProjectsRouteGuard>
              }
            />
            <Route
              path="/projects/:slug"
              element={
                <ProjectsRouteGuard>
                  <BlogPost />
                </ProjectsRouteGuard>
              }
            />
            <Route path="/writing" element={<Writing />} />
            <Route path="/writing/tag/:tag" element={<WritingByTag />} />
            <Route path="/writing/:slug" element={<BlogPost />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProjectsPasscodeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
