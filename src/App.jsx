import { useState } from "react";
import "./App.css";
import SpotTheDifferenceGame from "./components/SpotTheDifferenceGame";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <SpotTheDifferenceGame />
    </>
  );
}

export default App;
