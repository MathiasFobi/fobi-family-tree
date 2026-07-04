"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { getAllPeople, type Person } from "@/lib/family";

function fullName(p: Person): string {
  return [p.name, p.middleName, p.surname].filter(Boolean).join(" ");
}

interface NodeProps {
  person: Person;
  depth: number;
}

function TreeNode({ person, depth }: NodeProps) {
  const [expanded, setExpanded] = useState(false);
  const people = useMemo(() => getAllPeople(), []);
  const children = useMemo(
    () => people.filter((p) => p.parentId === person.id),
    [people, person.id]
  );
  const isR = person.status === "remembered";
  const hasChildren = children.length > 0;

  return (
    <li className={`tree-node depth-${depth}${isR ? " remembered" : ""}`}>
      <div className="node-row">
        {hasChildren ? (
          <button
            type="button"
            className="toggle"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? `Collapse ${fullName(person)}` : `Expand ${fullName(person)}`}
          >
            <span className={`chev ${expanded ? "open" : ""}`}>›</span>
          </button>
        ) : (
          <span className="toggle leaf" aria-hidden="true">·</span>
        )}
        <Link
          href={`/tree/${person.id}`}
          className={`node-card glass-inner${isR ? " remembered" : ""}`}
        >
          <span className="node-name">{fullName(person) || person.name}</span>
          <span className="node-meta">
            {isR && <span className="rip-badge">RIP</span>}
            <span className="node-gen">Gen {person.generation}</span>
            {hasChildren && <span className="node-count">↳ {children.length}</span>}
          </span>
        </Link>
      </div>
      {hasChildren && expanded && (
        <ul className="children">
          {children.map((c) => (
            <TreeNode key={c.id} person={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function FamilyTree() {
  const people = useMemo(() => getAllPeople(), []);
  const roots = useMemo(
    () =>
      people
        .filter((p) => p.generation === 1)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [people]
  );
  // Bumped on every "expand all" / "collapse all" so we can
  // imperatively set all branch open states via the key/remount trick.
  const [globalOpen, setGlobalOpen] = useState<boolean | null>(null);
  // A counter is used as the key prefix on each branch so we can remount them
  // (which resets all their internal `useState` to the default open=true).
  const [remountKey, setRemountKey] = useState(0);

  const expandAll = useCallback(() => {
    setGlobalOpen(true);
    setRemountKey((k) => k + 1);
  }, []);

  const collapseAll = useCallback(() => {
    setGlobalOpen(false);
    setRemountKey((k) => k + 1);
  }, []);

  return (
    <div className="tree-wrap glass">
      <div className="tree-toolbar">
        <div className="toolbar-text">
          <strong>{roots.length}</strong> branches — click any name to expand its descendants or open the full profile.
        </div>
        <div className="toolbar-actions">
          <button type="button" className="ctrl-btn" onClick={expandAll}>
            Expand all
          </button>
          <span className="ctrl-sep">·</span>
          <button type="button" className="ctrl-btn" onClick={collapseAll}>
            Collapse all
          </button>
        </div>
      </div>
      <ul className="tree-root">
        {roots.map((r) => (
          <TreeBranch
            key={`${remountKey}-${r.id}`}
            person={r}
            force={globalOpen}
          />
        ))}
      </ul>
    </div>
  );
}

function TreeBranch({
  person,
  force,
}: {
  person: Person;
  force: boolean | null;
}) {
  const [open, setOpen] = useState(true);
  const people = useMemo(() => getAllPeople(), []);
  const children = useMemo(
    () =>
      people
        .filter((p) => p.parentId === person.id)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [people, person.id]
  );
  const isR = person.status === "remembered";

  // If force is non-null, take its value; otherwise use the local state.
  const effectiveOpen = force === null ? open : force;

  return (
    <li className={`branch${isR ? " remembered" : ""}`}>
      <button
        type="button"
        className="branch-header glass-inner"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={effectiveOpen}
      >
        <span className={`chev ${effectiveOpen ? "open" : ""}`}>›</span>
        <Link
          href={`/tree/${person.id}`}
          className="branch-name"
          onClick={(e) => e.stopPropagation()}
        >
          {fullName(person) || person.name}
          {isR && <span className="rip-badge">RIP</span>}
        </Link>
        <span className="branch-stats">
          <span className="stat-pill">Gen 1</span>
          <span className="stat-pill leaf">↳ {children.length}</span>
        </span>
      </button>
      {effectiveOpen && children.length > 0 && (
        <ul className="tree-children">
          {children.map((c) => (
            <TreeNode key={c.id} person={c} depth={2} />
          ))}
        </ul>
      )}
      {effectiveOpen && children.length === 0 && (
        <div className="empty-branch">No descendants listed yet.</div>
      )}
    </li>
  );
}
