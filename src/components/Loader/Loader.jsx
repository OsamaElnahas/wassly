
export default function Loader() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className={`spinner-border` } style={{width:"80px", height:"80px" ,color:"--mainColor"}} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
