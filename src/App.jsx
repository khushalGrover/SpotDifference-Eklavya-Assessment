import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/routes/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <AppRouter fallback={<div>Loading...</div>} />
    </BrowserRouter>
  );
}

export default App;
