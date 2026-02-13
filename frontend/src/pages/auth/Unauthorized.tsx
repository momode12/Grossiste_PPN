import React from "react";

const Unauthorized: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>🚫 Accès refusé</h1>
      <p>Vous n'avez pas la permission d'accéder à cette page.</p>
    </div>
  );
};

export default Unauthorized;
