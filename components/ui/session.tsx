"use client";

// Lightweight citizen session. Spec allows phone + OTP only (no passwords), so a
// "sign-in" is just remembering the OTP-verified phone + name. Persisted to
// localStorage so it survives navigation and reloads (fixes the "logo signs me
// out" problem — the logo just navigates home; the session stays).
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type SessionUser = { phone: string; name: string };

type SessionValue = {
  user: SessionUser | null;
  signIn: (u: SessionUser) => void;
  signOut: () => void;
  ready: boolean;
};

const KEY = "praman.session";
const Ctx = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw) as SessionUser);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const value = useMemo<SessionValue>(
    () => ({
      user,
      ready,
      signIn: (u) => {
        setUser(u);
        try { localStorage.setItem(KEY, JSON.stringify(u)); } catch { /* ignore */ }
      },
      signOut: () => {
        setUser(null);
        try { localStorage.removeItem(KEY); } catch { /* ignore */ }
      },
    }),
    [user, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession(): SessionValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSession must be used within <SessionProvider>");
  return ctx;
}
