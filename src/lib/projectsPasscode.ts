export const PROJECTS_PASSCODE_STORAGE_KEY = "v1.projects.unlocked";

type UnlockState = {
  unlocked: true;
  unlockedAt: number;
};

const DEFAULT_PASSCODE = "1234";

export function getProjectsPasscode(): string {
  const fromEnv = (import.meta as any)?.env?.VITE_PROJECTS_PASSCODE as string | undefined;
  const passcode = (fromEnv ?? DEFAULT_PASSCODE).trim();
  return passcode.length ? passcode : DEFAULT_PASSCODE;
}

export function getProjectsPasscodeLength(): number {
  const passcode = getProjectsPasscode();
  return Math.max(4, Math.min(12, passcode.length));
}

export function readProjectsUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(PROJECTS_PASSCODE_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as Partial<UnlockState>;
    return parsed.unlocked === true;
  } catch {
    return false;
  }
}

export function setProjectsUnlocked(): void {
  if (typeof window === "undefined") return;
  const state: UnlockState = { unlocked: true, unlockedAt: Date.now() };
  try {
    window.localStorage.setItem(PROJECTS_PASSCODE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore (private mode / storage blocked)
  }
}

export function clearProjectsUnlocked(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PROJECTS_PASSCODE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function verifyProjectsPasscode(input: string): boolean {
  const expected = getProjectsPasscode();
  return input === expected;
}

