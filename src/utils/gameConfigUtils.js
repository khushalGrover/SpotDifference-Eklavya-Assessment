const LOCAL_STORAGE_KEY = "game-config";

const defaultConfig = {
  levels: [
    {
      name: "City",
      thumbNail: "/images/city1.png",
      isCompleted: false,
      isLocked: false,
      imagePath: "/images/city1.png",
      imagePath2: "/images/city2.png",
      differences: [
        { x: 200, y: 140, width: 50, height: 50 },
        { x: 290, y: 150, width: 35, height: 35 },
        { x: 325, y: 25, width: 35, height: 35 },
        { x: 220, y: 285, width: 45, height: 45 },
        { x: 165, y: 40, width: 45, height: 70 },
        { x: 350, y: 310, width: 75, height: 75 },
      ],
    },
  ],

};

export function getGameConfig() {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : defaultConfig;
}

export function saveGameConfig(config) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
}
