import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const message = location.state?.message;

  return <Navigate to="/painel/dados-cadastrais" state={{ message }} replace />;
}

export default App;