export default function NotFound() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>
        Page Not Found
      </h1>
      <p>Sorry, we couldn't find that page.</p>
      <a href="/" style={{ marginTop: "1rem", fontWeight: 700 }}>
        Go back home
      </a>
    </main>
  );
}