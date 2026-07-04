import Link from "next/link";
import { getChildren, getRemembered, getFamilyData, type Person } from "@/lib/family";
import { CollapseControls } from "@/components/CollapseControls";

function fullName(p: Person): string {
  const parts = [p.name, p.middleName, p.surname].filter(Boolean);
  return parts.join(" ");
}

function PersonCard({ person }: { person: Person }) {
  const isR = person.status === "remembered";
  const kids = getChildren(person.id);
  const detailHref = `/tree/${person.id}`;

  return (
    <Link href={detailHref} className={`person glass${isR ? " remembered" : ""}`}>
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
      <div className="bg-gradient" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>

      <header className="site-header glass">
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

      <main id="collapse-root">
        {/* HERO */}
        <section className="hero">
          <div className="hero-card glass-strong">
            <div className="eyebrow">A Living Family Tree</div>
            <h1>The Descendants of Vincent &amp; Barbara Fobi</h1>
            <p className="sub">Honoring those who have passed. Keeping the living connected.</p>
            {patriarch && matriarch && (
              <div className="ancestors glass-pill">
                <span>{patriarch.name}</span>
                <span className="amp">&amp;</span>
                <span>{matriarch.name}</span>
              </div>
            )}
          </div>
        </section>

        {/* STATS */}
        <section className="section-wrap">
          <div className="stats">
            <div className="stat glass">
              <div className="num">{data.stats.total}</div>
              <div className="label">Family Members</div>
            </div>
            <div className="stat glass">
              <div className="num">{data.stats.gen1}</div>
              <div className="label">Children</div>
            </div>
            <div className="stat glass">
              <div className="num">{data.stats.gen2}</div>
              <div className="label">Grandchildren</div>
            </div>
            <div className="stat glass">
              <div className="num">{data.stats.gen3}</div>
              <div className="label">Great-Grandchildren</div>
            </div>
            <div className="stat glass remember">
              <div className="num">{data.stats.remembered}</div>
              <div className="label">Remembered</div>
            </div>
          </div>
        </section>

        {/* ANCESTORS (collapsible) */}
        <section className="section-wrap" id="about">
          <details className="collapsible glass" open>
            <summary>
              <span className="summary-text">
                <span className="kicker">About</span>
                <span className="title">Founding Ancestors</span>
              </span>
              <span className="chevron" aria-hidden="true">›</span>
            </summary>
            <div className="details-body">
              <div className="ancestor-card glass-inner">
                <div className="names">
                  <span className="name">{patriarch?.name}</span>
                  <span className="and">&amp;</span>
                  <span className="name">{matriarch?.name}</span>
                </div>
                <h3>The roots of this family tree</h3>
                <p>
                  {data.stats.gen1} children, {data.stats.gen2} grandchildren, and{" "}
                  {data.stats.gen3} great-grandchildren — and counting. This tree
                  grows with every new life added to the family.
                </p>
              </div>
            </div>
          </details>
        </section>

        {/* TREE (collapsible) */}
        <section className="section-wrap" id="tree">
          <div className="section-header">
            <div>
              <div className="kicker">Browse</div>
              <h2>The Family Tree</h2>
              <p className="lede">
                Three generations and {data.stats.total} family members. Tap any
                name to see their place in the tree.
              </p>
            </div>
            <CollapseControls />
          </div>

          <div className="tree">
            {(["1", "2", "3"] as const).map((gen, i) => {
              const titles: Record<"1" | "2" | "3", string> = {
                "1": "Generation 1 — Children of Vincent & Barbara",
                "2": "Generation 2 — Grandchildren",
                "3": "Generation 3 — Great-Grandchildren",
              };
              const counts: Record<"1" | "2" | "3", number> = {
                "1": data.stats.gen1,
                "2": data.stats.gen2,
                "3": data.stats.gen3,
              };
              return (
                <details key={gen} className="collapsible glass" open={i === 0}>
                  <summary>
                    <span className="summary-text">
                      <span className="kicker">Gen {gen}</span>
                      <span className="title">{titles[gen]}</span>
                    </span>
                    <span className="count-pill">{counts[gen]}</span>
                    <span className="chevron" aria-hidden="true">›</span>
                  </summary>
                  <div className="details-body">
                    <div className="gen-grid">
                      {data.generations[gen].map((p) => (
                        <PersonCard key={p.id} person={p} />
                      ))}
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        {/* IN MEMORIAM (collapsible) */}
        <section className="section-wrap" id="memoriam">
          <details className="collapsible glass" open>
            <summary>
              <span className="summary-text">
                <span className="kicker">In Memoriam</span>
                <span className="title">Those we have lost</span>
              </span>
              <span className="count-pill">{data.stats.remembered}</span>
              <span className="chevron" aria-hidden="true">›</span>
            </summary>
            <div className="details-body">
              <p className="lede">
                Their memory lives on in every branch of this tree.{" "}
                {data.stats.remembered}{" "}
                {data.stats.remembered === 1 ? "soul" : "souls"} remembered.
              </p>
              <div className="memorial-grid">
                {remembered.map((p) => (
                  <Link
                    key={p.id}
                    href={`/tree/${p.id}`}
                    className="memorial-card glass-inner"
                  >
                    <div className="gen">Generation {p.generation}</div>
                    <h4>{fullName(p) || p.name}</h4>
                    <p>
                      Gone from our sight, but never from our hearts. A branch
                      of this tree, forever.
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </details>
        </section>
      </main>

      <footer className="site-footer glass">
        <p>
          <strong>The Fobi Family Tree</strong>
        </p>
        <p>A living record of the descendants of Vincent &amp; Barbara Fobi</p>
        <p style={{ marginTop: 16, fontSize: 11, opacity: 0.7 }}>
          © {new Date().getFullYear()} The Fobi Family. Maintained with love.
        </p>
      </footer>
    </>
  );
}
