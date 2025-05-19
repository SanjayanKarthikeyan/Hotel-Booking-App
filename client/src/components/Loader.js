import React , { useState, CSSProperties } from "react";
import { ClockLoader } from "react-spinners";

function Loader() {
  let [loading, setLoading] = useState(true);
 
  return (
    <div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <ClockLoader color='#000' loading={loading} cssOverride='' size={80} aria-label="Loading Spinner" data-testid="loader" />
    </div>
    </div>
  );
}

export default Loader;
