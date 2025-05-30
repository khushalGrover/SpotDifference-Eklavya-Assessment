import React, { useState } from "react";
import { getGameConfig, saveGameConfig } from "../utils/gameConfigUtils";

export default function AdminScreen() {
  const [config, setConfig] = useState(getGameConfig());
  const [imagePath, setImagePath] = useState(config.imagePath || "");
  const [imagePath2, setImagePath2] = useState(config.imagePath2 || "");
  const [differences, setDifferences] = useState(config.differences || []);

  const handleDifferenceChange = (index, field, value) => {
    const updated = [...differences];
    updated[index][field] = parseInt(value);
    setDifferences(updated);
  };

  const addDifference = () => {
    setDifferences([...differences, { x: 0, y: 0 }]);
  };

  const removeDifference = (index) => {
    setDifferences(differences.filter((_, i) => i !== index));
  };

  const saveConfig = () => {
    const newConfig = { imagePath, imagePath2, differences };
    saveGameConfig(newConfig);
    alert("Config saved to localStorage!", newConfig);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>🛠 Spot the Difference - Admin Panel</h1>

      <div>
        <label>🖼 Image Path of image1:</label>
        <input
          type="text"
          value={imagePath}
          onChange={(e) => setImagePath(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
      </div>
      <div>
        <label>🖼 Image Path of image2:</label>
        <input
          type="text"
          value={imagePath2}
          onChange={(e) => setImagePath2(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
      </div>

      <h3>🎯 Difference Points</h3>
      {differences.map((point, index) => (
        <div key={index} style={{ display: "flex", gap: 10, marginBottom: 5 }}>
          <input
            type="number"
            value={point.x}
            onChange={(e) => handleDifferenceChange(index, "x", e.target.value)}
            placeholder="X"
          />
          <input
            type="number"
            value={point.y}
            onChange={(e) => handleDifferenceChange(index, "y", e.target.value)}
            placeholder="Y"
          />
          <button onClick={() => removeDifference(index)}>❌</button>
        </div>
      ))}
      <button onClick={addDifference}>➕ Add Point</button>

      <br />
      <br />
      <button onClick={saveConfig} style={{ background: "#4caf50", color: "#fff", padding: "10px 20px" }}>
        💾 Save Config
      </button>
    </div>
  );
}
