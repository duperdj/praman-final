"use client";

// Floating accessibility widget — mounted globally in the root layout. Opens a
// small panel with: Read aloud (screen reader via the browser Speech Synthesis
// API), Larger text, and High contrast. Text-size + contrast choices persist to
// localStorage and re-apply on every load; read-aloud speaks the main content
// in the current language. All self-contained — no external services.
import { useCallback, useEffect, useRef, useState } from "react";
import { useLang, pick, bi } from "@/components/ui/lang";

const LS_LARGE = "praman.a11y.large";
const LS_CONTRAST = "praman.a11y.contrast";

export function AccessibilityMenu() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [large, setLarge] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // Re-apply saved preferences on mount.
  useEffect(() => {
    try {
      const l = localStorage.getItem(LS_LARGE) === "1";
      const c = localStorage.getItem(LS_CONTRAST) === "1";
      setLarge(l);
      setContrast(c);
      document.documentElement.classList.toggle("a11y-large", l);
      document.documentElement.classList.toggle("a11y-contrast", c);
    } catch {
      /* storage blocked — defaults are fine */
    }
  }, []);

  // Keep the speaking flag honest if speech ends on its own.
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const id = window.setInterval(() => {
      if (!window.speechSynthesis.speaking && speaking) setSpeaking(false);
    }, 500);
    return () => window.clearInterval(id);
  }, [speaking]);

  // Stop speech when the tab is hidden or the component unmounts.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Close the panel on Escape / outside click.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    }
    function onClick(e: MouseEvent) {
      const t = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(t) && btnRef.current && !btnRef.current.contains(t)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const toggleLarge = useCallback(() => {
    setLarge((v) => {
      const next = !v;
      document.documentElement.classList.toggle("a11y-large", next);
      try { localStorage.setItem(LS_LARGE, next ? "1" : "0"); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const toggleContrast = useCallback(() => {
    setContrast((v) => {
      const next = !v;
      document.documentElement.classList.toggle("a11y-contrast", next);
      try { localStorage.setItem(LS_CONTRAST, next ? "1" : "0"); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const readAloud = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert(pick(lang, bi("आपके ब्राउज़र में वाचन उपलब्ध नहीं है।", "Read-aloud is not available in your browser.")));
      return;
    }
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const main = document.getElementById("main") ?? document.body;
    const text = (main.innerText || "").replace(/\s+/g, " ").trim().slice(0, 4000);
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "hi" ? "hi-IN" : "en-IN";
    const voices = synth.getVoices();
    const match = voices.find((v) => v.lang === u.lang) || voices.find((v) => v.lang.startsWith(lang === "hi" ? "hi" : "en"));
    if (match) u.voice = match;
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(u);
    setSpeaking(true);
  }, [lang]);

  const t = {
    open: bi("सुगम्यता विकल्प", "Accessibility options"),
    title: bi("सुगम्यता", "Accessibility"),
    read: bi("पढ़कर सुनाएँ", "Read aloud"),
    stop: bi("रोकें", "Stop reading"),
    large: bi("बड़ा टेक्स्ट", "Larger text"),
    contrast: bi("अधिक कंट्रास्ट", "High contrast"),
    on: bi("चालू", "On"),
    off: bi("बंद", "Off"),
  };

  return (
    <div className="a11y-widget">
      {open ? (
        <div ref={panelRef} className="a11y-panel" role="dialog" aria-label={pick(lang, t.title)}>
          <div className="a11y-panel-title">{pick(lang, t.title)}</div>

          <button type="button" className="a11y-item" onClick={readAloud} aria-pressed={speaking}>
            <span className="a11y-ic" aria-hidden="true">{speaking ? "⏹" : "🔊"}</span>
            <span className="a11y-label">{pick(lang, speaking ? t.stop : t.read)}</span>
          </button>

          <button type="button" className="a11y-item" onClick={toggleLarge} aria-pressed={large}>
            <span className="a11y-ic" aria-hidden="true">🅰</span>
            <span className="a11y-label">{pick(lang, t.large)}</span>
            <span className="a11y-state">{pick(lang, large ? t.on : t.off)}</span>
          </button>

          <button type="button" className="a11y-item" onClick={toggleContrast} aria-pressed={contrast}>
            <span className="a11y-ic" aria-hidden="true">◑</span>
            <span className="a11y-label">{pick(lang, t.contrast)}</span>
            <span className="a11y-state">{pick(lang, contrast ? t.on : t.off)}</span>
          </button>
        </div>
      ) : null}

      <button
        ref={btnRef}
        type="button"
        className="a11y-fab"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={pick(lang, t.open)}
        title={pick(lang, t.open)}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">♿</span>
      </button>
    </div>
  );
}
