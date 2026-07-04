import Link from "next/link";
import { getChildren, getRemembered, getFamilyData, type Person } from "@/lib/family";

function fullName(p: Person): string {
  const parts = [p.name, p.middleName, p.surname].filter(Boolean);
  return parts.join(" ");
}

function PersonCard({ person }: { person: Person }) {
  const isR = person.status === "remembered";
  const kids = getChildren(person.id);
  const detailHref = `/tree/${person.id}`;

  return (
    <Link href={detailHref} className={`person${isR ? " remembered" : ""}`}>
      <div className="name">
        <span>{fullName(person) || person.name}</span>
        {isR && <span className="rip-badge">RIP</span>}
      </div>
      <div className="meta">
        {kids.length > 0 && (
          <span className="children-count">↳ {kids.length}</span>
        )}
        <span>Gen {person.generation}</span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const data = getFamilyData();
  const remembered = getRemembered();
  const patriarch = data.ancestors.find((a) => a.role === "Patriarch");
  const matriarch = data.ancestors.find((a) => a.role === "Matriarch");

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">
          <span className="crest">🌳</span>
          <span>The Fobi Family Tree</span>
        </Link>
        <nav>
          <Link href="#tree">The Tree</Link>
          <Link href="#memoriam">In Memoriam</Link>
          <Link href="#about">About</Link>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="eyebrow">A Living Family Tree</div>
          <h1>The Descendants of Vincent &amp; Barbara Fobi</h1>
          <p className="sub">Honoring those who have passed. Keeping the living connected.</p>
          {patriarch && matriarch && (
            <div className="ancestors">
              <span>{patriarch.name}</span>
              <span className="amp">&amp;</span>
              <span>{matriarch.name}</span>
            </div>
          )}
        </section>

        {/* STATS */}
        <section style={{ paddingTop: 56, paddingBottom: 0, borderBottom: "none" }}>
          <div className="stats">
            <div className="stat">
              <div className="num">{data.stats.total}</div>
              <div className="label">Family Members</div>
            </div>
            <div className="stat">
              <div className="num">{data.stats.gen1}</div>
              <div className="label">Children</div>
            </div>
            <div className="stat">
              <div className="num">{data.stats.gen2}</div>
              <div className="label">Grandchildren</div>
            </div>
            <div className="stat">
              <div className="num">{data.stats.gen3}</div>
              <div className="label">Great-Grandchildren</div>
            </div>
            <div className="stat remember">
              <div className="num">{data.stats.remembered}</div>
              <div className="label">Remembered</div>
            </div>
          </div>
        </section>

        {/* ANCESTORS */}
        <section id="about">
          <div className="ancestor-card">
            <div className="names">
              <span className="name">{patriarch?.name}</span>
              <span className="and">&amp;</span>
              <span className="name">{matriarch?.name}</span>
            </div>
            <h3>Founding Ancestors</h3>
            <p>
              {data.stats.gen1} children, {data.stats.gen2} grandchildren, and{" "}
              {data.stats.gen3} great-grandchildren — and counting. This tree
              grows with every new life added to the family.
            </p>
          </div>
        </section>

        {/* TREE */}
        <section id="tree">
          <h2>The Family Tree</h2>
          <p className="lede">
            Three generations and {data.stats.total} family members. Tap any
            name to see their place in the tree.
          </p>

          <div className="tree">
            <div className="tree-gen">
              <div className="gen-header">
                <h3>Generation 1 — Children of Vincent &amp; Barbara</h3>
                <span className="count">{data.stats.gen1} family lines</span>
              </div>
              <div className="gen-grid">
                {data.generations["1"].map((p) => (
                  <PersonCard key={p.id} person={p} />
                ))}
              </div>
            </div>

            <div className="tree-gen">
              <div className="gen-header">
                <h3>Generation 2 — Grandchildren</h3>
                <span className="count">{data.stats.gen2} family members</span>
              </div>
              <div className="gen-grid">
                {data.generations["2"].map((p) => (
                  <PersonCard key={p.id} person={p} />
                ))}
              </div>
            </div>

            <div className="tree-gen">
              <div className="gen-header">
                <h3>Generation 3 — Great-Grandchildren</h3>
                <span className="count">{data.stats.gen3} family members</span>
              </div>
              <div className="gen-grid">
                {data.generations["3"].map((p) => (
                  <PersonCard key={p.id} person={p} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* IN MEMORIAM */}
        <section id="memoriam">
          <h2>In Memoriam</h2>
          <p className="lede">
            Those we have lost, but whose memory lives on in every branch of
            this tree. {data.stats.remembered === 0
              ? ""
              : `${data.stats.remembered} ${data.stats.remembered === 1 ? "soul" : "souls"} remembered.`}
          </p>
          <div className="memorial-grid">
            {remembered.map((p) => (
              <Link
                key={p.id}
                href={`/tree/${p.id}`}
                className="memorial-card"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <div className="gen">Generation {p.generation}</div>
                <h4>{fullName(p) || p.name}</h4>
                <p>
                  Gone from our sight, but never from our hearts. A branch of
                  this tree, forever.
                </p>
              </Link>
            ))}
          </div>
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
