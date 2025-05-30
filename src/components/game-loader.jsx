import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Loader2 } from "lucide-react";

export function GameLoader({ configPath = "/game-config.json", onConfigLoaded }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGameConfig = async () => {
      try {
        const response = await fetch(configPath);
        if (!response.ok) {
          throw new Error(`Failed to load game configuration: ${response.statusText}`);
        }
        const config = await response.json();

        // Validate the configuration
        if (!config.gameTitle || !config.images || !config.differences) {
          throw new Error("Invalid game configuration format");
        }

        onConfigLoaded(config);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load game configuration");
        setLoading(false);
      }
    };

    loadGameConfig();
  }, [configPath, onConfigLoaded]);

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin mr-3" />
          <span>Loading game...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Game</h3>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return null;
}
