export default function Loader({ size = "100vh" }) {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: size }}>
      <div
        className="spinner-border"
        style={{ width: "80px", height: "80px", color: "var(--mainColor)" }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
