import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useProjectsPasscode } from "@/contexts/ProjectsPasscodeContext";

export function ProjectsRouteGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isProjectsUnlocked, requestProjectsUnlock } = useProjectsPasscode();
  const requestedRef = React.useRef(false);

  React.useEffect(() => {
    if (isProjectsUnlocked) return;
    if (requestedRef.current) return;
    requestedRef.current = true;
    requestProjectsUnlock();
  }, [isProjectsUnlocked, requestProjectsUnlock]);

  if (isProjectsUnlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-black/30 p-6">
        <h1 className="text-xl font-semibold">Projects locked</h1>
        <p className="mt-2 text-sm text-gray-300">
          Enter the passcode to access Projects.
        </p>
        <p className="mt-2 text-xs text-gray-400 break-all">
          Attempted: {location.pathname}
        </p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <Button type="button" onClick={() => requestProjectsUnlock()}>
            Enter passcode
          </Button>
        </div>
      </div>
    </div>
  );
}

