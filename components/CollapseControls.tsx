"use client";

import { useEffect } from "react";

/**
 * Renders "Expand all" / "Collapse all" buttons that operate on every
 * <details> element inside its container (matched by [data-collapse-root]).
 */
export function CollapseControls({ rootId = "collapse-root" }: { rootId?: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    const all = root.querySelectorAll<HTMLDetailsElement>("details.collapsible");
    return () => {
      // no-op cleanup; nothing to unsubscribe
    };
  }, [rootId]);

  function setAll(open: boolean) {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.querySelectorAll<HTMLDetailsElement>("details.collapsible").forEach((d) => {
      d.open = open;
    });
  }

  return (
    <div className="collapse-controls">
      <button type="button" onClick={() => setAll(true)} className="ctrl-btn">
        Expand all
      </button>
      <span className="ctrl-sep">·</span>
      <button type="button" onClick={() => setAll(false)} className="ctrl-btn">
        Collapse all
      </button>
    </div>
  );
}
