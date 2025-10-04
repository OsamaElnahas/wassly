export default function Loader({ size = "100vh" }) {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: size, opacity: 0.7 }}
    >
      <div
        className="spinner-border"
        style={{ width: "60px", height: "60px", color: "var(--mainColor)" }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
