"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Clock, Trophy, RotateCcw, CheckCircle } from "lucide-react";
import { HowToPlay } from "../components/HowToPlay";
// import gameConfig from public
// import gameConfig from "../../public/game-config.json";
import { getGameConfig } from "../utils/gameConfigUtils";

export default function GameScreen() {
  const gameConfig = getGameConfig();
  const [foundDifferences, setFoundDifferences] = useState(new Set());
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [clickAnimation, setClickAnimation] = useState(null);
  const timerRef = useRef();
  const imageRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, gameCompleted, startTime]);

  useEffect(() => {
    if (
      foundDifferences.size === gameConfig.levels[0].differences.length &&
      gameStarted
    ) {
      setGameCompleted(true);
      setGameStarted(false);
    }
  }, [foundDifferences.size, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    setFoundDifferences(new Set());
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setFoundDifferences(new Set());
    setElapsedTime(0);
    setClickAnimation(null);
  };

  const handleImageClick = (event, imageIndex) => {
    if (!gameStarted || gameCompleted) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const scaleX = 600 / rect.width;
    const scaleY = 400 / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    const clickedDifference = gameConfig.levels[0].differences.findIndex(
      (diff, index) => {
        if (foundDifferences.has(index)) return false;
        return (
          scaledX >= diff.x &&
          scaledX <= diff.x + diff.width &&
          scaledY >= diff.y &&
          scaledY <= diff.y + diff.height
        );
      }
    );

    setClickAnimation({ x, y });
    setTimeout(() => setClickAnimation(null), 600);

    if (clickedDifference !== -1) {
      setFoundDifferences((prev) => new Set([...prev, clickedDifference]));

      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          1200,
          audioContext.currentTime + 0.1
        );

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.1
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (e) {
        // ignore audio errors
      }
    }
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const renderDifferenceMarkers = (imageIndex) => {
    return gameConfig.levels[0].differences.map((diff, index) => {
      if (!foundDifferences.has(index)) {
        return null;
      } else {
        return (
          <div
            key={index}
            className="absolute border-4 border-green-500 bg-green-500/20 rounded-full animate-pulse"
            style={{
              left: `${(diff.x / 600) * 100}%`,
              top: `${(diff.y / 400) * 100}%`,
              width: `${(diff.width / 600) * 100}%`,
              height: `${(diff.height / 400) * 100}%`,
            }}
          />
        );
      }
    });
  };

  const renderClickAnimation = (imageIndex) => {
    if (!clickAnimation) return null;
    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: clickAnimation.x - 20,
          top: clickAnimation.y - 20,
        }}
      >
        <div className="w-10 h-10 border-4 border-blue-500 rounded-full animate-ping" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800">
              {gameConfig.levels[0].name}
            </CardTitle>
            <p className="text-gray-600">
              Find all {gameConfig.levels[0].differences.length} differences between the
              two images!
            </p>
            <HowToPlay />
          </CardHeader>
        </Card>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <Badge variant="outline" className="text-lg p-3">
            <Trophy className="w-5 h-5 mr-2" />
            Score: {foundDifferences.size}/{gameConfig.levels[0].differences.length}
          </Badge>
          <Badge variant="outline" className="text-lg p-3">
            <Clock className="w-5 h-5 mr-2" />
            Time: {formatTime(elapsedTime)}
          </Badge>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          {!gameStarted && !gameCompleted && (
            <Button onClick={startGame} size="lg" className="text-lg px-8">
              Start Game
            </Button>
          )}
          {(gameStarted || gameCompleted) && (
            <Button onClick={resetGame} variant="outline" size="lg">
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset Game
            </Button>
          )}
        </div>

        {gameCompleted && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="text-center p-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Congratulations! 🎉
              </h2>
              <p className="text-green-700">
                You found all {gameConfig.levels[0].differences.length} differences in{" "}
                {formatTime(elapsedTime)}!
              </p>
            </CardContent>
          </Card>
        )}

        {gameStarted && !gameCompleted && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-center">Image 1</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div ref={imageRef} className="relative cursor-crosshair">
                  <img
                    src={gameConfig.levels[0].imagePath}
                    alt="Spot the difference - Image 1"
                    className="w-full h-auto max-h-96 object-contain"
                    draggable={false}
                    onClick={(e) => handleImageClick(e, 0)}
                  />
                  {renderDifferenceMarkers(0)}
                  {renderClickAnimation(0)}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-center">Image 2</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative cursor-crosshair">
                  <img
                    src={gameConfig.levels[0].imagePath2}
                    alt="Spot the difference - Image 2"
                    className="w-full h-auto max-h-96 object-contain"
                    draggable={false}
                    onClick={(e) => handleImageClick(e, 1)}
                  />
                  {renderDifferenceMarkers(1)}
                  {renderClickAnimation(1)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
