import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllPeople,
  getChildren,
  getPersonById,
  type Person,
} from "@/lib/family";

function fullName(p: Person): string {
  return [p.name, p.middleName, p.surname].filter(Boolean).join(" ");
}

export function generateStaticParams() {
  return getAllPeople().map((p) => ({ id: p.id }));
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = getPersonById(id);
  if (!person) notFound();

  const children = getChildren(person.id);
  const parent = person.parentId ? getPersonById(person.parentId) : null;
  const isR = person.status === "remembered";

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">
          <span className="crest">🌳</span>
          <span>The Fobi Family Tree</span>
        </Link>
        <nav>
          <Link href="/#tree">The Tree</Link>
          <Link href="/#memoriam">In Memoriam</Link>
          <Link href="/#about">About</Link>
        </nav>
      </header>

      <main>
        <section style={{ paddingTop: 56, paddingBottom: 32 }}>
          <Link
            href="/#tree"
            style={{
              fontSize: 14,
              color: "var(--ink-muted)",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
            }}
          >
            ← Back to the tree
          </Link>

          <div
            className={`person${isR ? " remembered" : ""}`}
            style={{
              marginTop: 16,
              padding: 24,
              fontSize: 18,
              cursor: "default",
            }}
          >
            <div
              className="name"
              style={{ fontSize: 24, marginBottom: 8 }}
            >
              {fullName(person) || person.name}
              {isR && <span className="rip-badge">RIP</span>}
            </div>
            <div className="meta" style={{ fontSize: 14 }}>
              <span>Generation {person.generation}</span>
              {parent && (
                <>
                  <span>·</span>
                  <span>
                    Child of{" "}
                    <Link href={`/tree/${parent.id}`}>
                      {fullName(parent) || parent.name}
                    </Link>
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        {children.length > 0 && (
          <section style={{ paddingTop: 0 }}>
            <h2>Children</h2>
            <p className="lede">
              {children.length} {children.length === 1 ? "descendant" : "descendants"} continuing this branch.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 12,
              }}
            >
              {children.map((c) => {
                const r = c.status === "remembered";
                return (
                  <Link
                    key={c.id}
                    href={`/tree/${c.id}`}
                    className={`person${r ? " remembered" : ""}`}
                  >
                    <div className="name">
                      {fullName(c) || c.name}
                      {r && <span className="rip-badge">RIP</span>}
                    </div>
                    <div className="meta">
                      <span>Generation {c.generation}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section style={{ paddingTop: 32 }}>
          <h2>About {person.name}</h2>
          <p
            className="lede"
            style={{
              background: "rgba(47, 93, 58, 0.18)",
              border: "1px solid rgba(47, 93, 58, 0.35)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              borderRadius: 12,
              padding: 20,
              color: "var(--ink)",
              fontStyle: "italic",
            }}
          >
            {isR
              ? "In loving memory. A life that shaped this family and lives on in every branch of this tree."
              : "A beloved member of the Fobi family. Their story is still being written."}
          </p>
          <p
            style={{
              fontSize: 13,
              color: "var(--ink-muted)",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
            }}
          >
            Want to add a story, photo, or tribute for this family member? Reach
            out to the family archivist to contribute.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          <strong>The Fobi Family Tree</strong>
        </p>
        <p>A living record of the descendants of Vincent &amp; Barbara Fobi</p>
        <p style={{ marginTop: 16, fontSize: 11, color: "var(--muted)" }}>
          © {new Date().getFullYear()} The Fobi Family. Maintained with love.
        </p>
      </footer>
    </>
  );
}
