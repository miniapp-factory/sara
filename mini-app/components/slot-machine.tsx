"use client";

import { useState, useEffect, useRef } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"];
const fruitImages: Record<string, string> = {
  Apple: "/apple.png",
  Banana: "/banana.png",
  Cherry: "/cherry.png",
  Lemon: "/lemon.png",
};

function getRandomFruit(): string {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>([
    [getRandomFruit(), getRandomFruit(), getRandomFruit()],
    [getRandomFruit(), getRandomFruit(), getRandomFruit()],
    [getRandomFruit(), getRandomFruit(), getRandomFruit()],
  ]);
  const [spinning, setSpinning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize grid with random fruits on mount
    setGrid([
      [getRandomFruit(), getRandomFruit(), getRandomFruit()],
      [getRandomFruit(), getRandomFruit(), getRandomFruit()],
      [getRandomFruit(), getRandomFruit(), getRandomFruit()],
    ]);
  }, []);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]); // deep copy
        // shift each column down
        for (let col = 0; col < 3; col++) {
          const newFruit = getRandomFruit();
          newGrid[2][col] = newGrid[1][col];
          newGrid[1][col] = newGrid[0][col];
          newGrid[0][col] = newFruit;
        }
        return newGrid;
      });
      if (Date.now() - start >= 2000) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setSpinning(false);
      }
    }, 200);
  };

  // Check win condition directly in render
  const hasWon =
    !spinning &&
    (grid.some(
      (row) => row[0] === row[1] && row[1] === row[2]
    ) ||
      [0, 1, 2].some((col) =>
        grid[0][col] === grid[1][col] && grid[1][col] === grid[2][col]
      ));

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img
            key={idx}
            src={fruitImages[fruit]}
            alt={fruit}
            className="w-16 h-16 object-contain"
          />
        ))}
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className="px-4 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50"
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {hasWon && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-bold text-green-600">You Win!</span>
          <Share text={`I just won the Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
