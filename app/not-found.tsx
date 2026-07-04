import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">
          <span className="crest">🌳</span>
          <span>The Fobi Family Tree</span>
        </Link>
      </header>
      <main>
        <section style={{ textAlign: "center", padding: "120px 20px" }}>
          <h1>Branch not found</h1>
          <p className="lede" style={{ margin: "0 auto" }}>
            That family member isn&apos;t in this tree yet — but they might be soon.
            Head back to the tree and explore the branches.
          </p>
          <Link href="/" className="btn" style={{ marginTop: 24 }}>
            ← Back to the tree
          </Link>
        </section>
      </main>
    </>
  );
}
