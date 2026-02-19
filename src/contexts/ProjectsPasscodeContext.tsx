import * as React from "react";

import { ProjectsPasscodeDialog } from "@/components/ProjectsPasscodeDialog";
import { clearProjectsUnlocked, readProjectsUnlocked } from "@/lib/projectsPasscode";

type ProjectsPasscodeContextValue = {
  isProjectsUnlocked: boolean;
  requestProjectsUnlock: (onUnlocked?: () => void) => void;
  lockProjects: () => void;
};

const ProjectsPasscodeContext = React.createContext<ProjectsPasscodeContextValue | null>(null);

export function ProjectsPasscodeProvider({ children }: { children: React.ReactNode }) {
  const [isProjectsUnlocked, setIsProjectsUnlocked] = React.useState(() => readProjectsUnlocked());
  const [open, setOpen] = React.useState(false);
  const onUnlockedRef = React.useRef<(() => void) | null>(null);

  const requestProjectsUnlock = React.useCallback((onUnlocked?: () => void) => {
    onUnlockedRef.current = onUnlocked ?? null;
    setOpen(true);
  }, []);

  const lockProjects = React.useCallback(() => {
    clearProjectsUnlocked();
    setIsProjectsUnlocked(false);
  }, []);

  const handleUnlocked = React.useCallback(() => {
    setIsProjectsUnlocked(true);
    setOpen(false);
    const cb = onUnlockedRef.current;
    onUnlockedRef.current = null;
    cb?.();
  }, []);

  return (
    <ProjectsPasscodeContext.Provider value={{ isProjectsUnlocked, requestProjectsUnlock, lockProjects }}>
      {children}
      <ProjectsPasscodeDialog open={open} onOpenChange={setOpen} onUnlocked={handleUnlocked} />
    </ProjectsPasscodeContext.Provider>
  );
}

export function useProjectsPasscode() {
  const ctx = React.useContext(ProjectsPasscodeContext);
  if (!ctx) throw new Error("useProjectsPasscode must be used within ProjectsPasscodeProvider");
  return ctx;
}

