"use client";

// Real hero search — a live typeahead over the whole service catalog
// (components/services.ts). Filters by Hindi + English title, description and
// slug; Enter or the button navigates to the best match (or the full directory
// when nothing matches). Fully keyboard-navigable. No mock: every result is a
// real route.
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang, pick, bi } from "@/components/ui/lang";
import { Icon } from "@/components/ui/Icon";
import { DEPARTMENTS, serviceHref, type Service } from "@/components/services";

type Entry = { service: Service; dept: string; href: string; hay: string };

// Flatten the catalog once — a single searchable haystack per service.
const ENTRIES: Entry[] = DEPARTMENTS.flatMap((d) =>
  d.services.map((s) => ({
    service: s,
    dept: `${d.name.hi} ${d.name.en}`,
    href: serviceHref(s),
    hay: [s.slug, s.title.hi, s.title.en, s.desc.hi, s.desc.en, d.name.hi, d.name.en]
      .join(" ")
      .toLowerCase(),
  }))
);

function match(q: string): Entry[] {
  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return ENTRIES
    .map((e) => {
      // Every term must appear; rank a title hit above a description hit.
      let score = 0;
      for (const t of terms) {
        if (!e.hay.includes(t)) return { e, score: -1 };
        if (e.service.title.hi.toLowerCase().includes(t) || e.service.title.en.toLowerCase().includes(t)) score += 3;
        else if (e.service.slug.includes(t)) score += 2;
        else score += 1;
      }
      if (e.service.live) score += 1; // nudge working flows up
      return { e, score };
    })
    .filter((r) => r.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)
    .map((r) => r.e);
}

export function ServiceSearch() {
  const { lang } = useLang();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => match(q), [q]);
  const showList = open && q.trim().length > 0;

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function submit() {
    if (results.length) go(results[Math.min(active, results.length - 1)].href);
    else if (q.trim()) go(`/services`); // no match → the full directory
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div style={{ position: "relative", marginTop: 24 }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        role="combobox"
        aria-expanded={showList}
        aria-haspopup="listbox"
        aria-owns="service-search-list"
        style={{ background: "var(--ink-0)", border: "2px solid var(--ink-900)", display: "flex" }}
      >
        <input
          aria-label={pick(lang, bi("सेवा खोजें", "Search a service"))}
          aria-autocomplete="list"
          aria-controls="service-search-list"
          aria-activedescendant={showList && results.length ? `svc-opt-${active}` : undefined}
          placeholder={pick(lang, bi("सेवा, विभाग या दस्तावेज़ खोजें", "Search a service, department or document"))}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            // Delay so a result click registers before the list closes.
            blurTimer.current = setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={onKeyDown}
          style={{ flex: 1, border: 0, outline: 0, padding: "0 18px", height: 56, font: "var(--type-body)", color: "var(--ink-900)", background: "transparent", minWidth: 0 }}
        />
        <button type="submit" style={{ border: 0, background: "var(--blue-500)", color: "var(--ink-0)", padding: "0 24px", font: "700 15px var(--font-sans)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="search" size="sm" />
          <span className="hide-narrow">{pick(lang, bi("खोजें", "Search"))}</span>
        </button>
      </form>

      {showList && (
        <ul
          id="service-search-list"
          role="listbox"
          onMouseDown={() => {
            // Keep focus/list alive through the click on a result.
            if (blurTimer.current) clearTimeout(blurTimer.current);
          }}
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 30,
            margin: 0,
            padding: 0,
            listStyle: "none",
            background: "var(--ink-0)",
            border: "1px solid var(--line, #d9d9d9)",
            boxShadow: "0 12px 32px rgba(0,0,0,.18)",
            maxHeight: 360,
            overflowY: "auto",
          }}
        >
          {results.length === 0 ? (
            <li style={{ padding: "14px 18px", color: "var(--ink-700)", font: "var(--type-body-sm)" }}>
              {pick(lang, bi("कोई सेवा नहीं मिली — सभी सेवाएँ देखें", "No service found — browse all services"))}
              <div style={{ marginTop: 8 }}>
                <a href="/services" style={{ color: "var(--blue-600)", font: "600 14px var(--font-sans)" }}>
                  {pick(lang, bi("सेवा निर्देशिका →", "Service directory →"))}
                </a>
              </div>
            </li>
          ) : (
            results.map((e, i) => (
              <li key={e.service.slug} role="option" id={`svc-opt-${i}`} aria-selected={i === active}>
                <a
                  href={e.href}
                  onMouseEnter={() => setActive(i)}
                  onClick={(ev) => {
                    ev.preventDefault();
                    go(e.href);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 18px",
                    textDecoration: "none",
                    color: "var(--ink-900)",
                    background: i === active ? "var(--blue-50, #eef3ff)" : "transparent",
                  }}
                >
                  <Icon name={e.service.icon} size="sm" style={{ color: "var(--blue-500)", flexShrink: 0 }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", font: "700 15px var(--font-sans)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {pick(lang, e.service.title)}
                    </span>
                    <span style={{ display: "block", font: "var(--type-caption)", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {pick(lang, e.service.desc)}
                    </span>
                  </span>
                  {e.service.live ? (
                    <span style={{ flexShrink: 0, font: "700 11px var(--font-sans)", color: "var(--green-700, #17692e)", background: "var(--green-50, #e7f6ec)", padding: "2px 8px", borderRadius: 999 }}>
                      {pick(lang, bi("कार्यशील", "Live"))}
                    </span>
                  ) : null}
                </a>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
