import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { getProjectsPasscodeLength, setProjectsUnlocked, verifyProjectsPasscode } from "@/lib/projectsPasscode";

type ProjectsPasscodeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlocked: () => void;
};

export function ProjectsPasscodeDialog({ open, onOpenChange, onUnlocked }: ProjectsPasscodeDialogProps) {
  const length = getProjectsPasscodeLength();
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setValue("");
      setError(null);
    }
  }, [open]);

  const tryUnlock = React.useCallback(() => {
    if (!value || value.length < length) {
      setError("Enter the full passcode.");
      return;
    }
    if (!verifyProjectsPasscode(value)) {
      setError("Incorrect passcode.");
      return;
    }
    setProjectsUnlocked();
    onUnlocked();
  }, [length, onUnlocked, value]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl border-border">
        <DialogHeader>
          <DialogTitle>Passcode required</DialogTitle>
          <DialogDescription>
            Enter the passcode to access Projects.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 py-2">
          <InputOTP
            value={value}
            onChange={(next) => {
              setValue(next);
              if (error) setError(null);
            }}
            maxLength={length}
            inputMode="numeric"
            autoFocus
            onComplete={() => {
              // `value` is async; tryUnlock will validate length anyway.
              setTimeout(tryUnlock, 0);
            }}
            className="w-full"
            containerClassName="w-full justify-center"
          >
            <InputOTPGroup>
              {Array.from({ length }).map((_, idx) => (
                <InputOTPSlot key={idx} index={idx} className="border-border" />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <div
            aria-live="polite"
            aria-atomic="true"
            className={cn(
              "min-h-5 text-sm",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {error ?? " "}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="font-custom font-bold rounded-xl px-4 py-2 text-sm bg-muted hover:bg-muted/80 text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={tryUnlock}
            className="font-custom font-bold rounded-xl px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Unlock
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

