'use client';

import { useState, useEffect } from 'react';

// Define the 18 chromobiology colors
const COLORS = [
  { id: 1, name: 'Magenta', hex: '#FF00FF', rgb: [255, 0, 255] },
  { id: 2, name: 'Pourpre', hex: '#9933FF', rgb: [153, 51, 255] },
  { id: 3, name: 'Violet', hex: '#6600FF', rgb: [102, 0, 255] },
  { id: 4, name: 'Bleu Roi', hex: '#0000FF', rgb: [0, 0, 255] },
  { id: 5, name: 'Indigo', hex: '#4D9FFF', rgb: [77, 159, 255] },
  { id: 6, name: 'Bleu', hex: '#99CCFF', rgb: [153, 204, 255] },
  { id: 7, name: 'Cyan', hex: '#00FFFF', rgb: [0, 255, 255] },
  { id: 8, name: 'Bleu Turquoise', hex: '#00D4AA', rgb: [0, 212, 170] },
  { id: 9, name: 'Vert Turquoise', hex: '#00FF7F', rgb: [0, 255, 127] },
  { id: 10, name: 'Vert', hex: '#00FF00', rgb: [0, 255, 0] },
  { id: 11, name: 'Citron', hex: '#ADFF2F', rgb: [173, 255, 47] },
  { id: 12, name: 'Pomme', hex: '#FFFF00', rgb: [255, 255, 0] },
  { id: 13, name: 'Jaune', hex: '#FFFF00', rgb: [255, 255, 0] },
  { id: 14, name: 'Or', hex: '#FFA500', rgb: [255, 165, 0] },
  { id: 15, name: 'Orange', hex: '#FF8000', rgb: [255, 128, 0] },
  { id: 16, name: 'Rouge', hex: '#FF0000', rgb: [255, 0, 0] },
  { id: 17, name: 'Ecarlate', hex: '#FF1493', rgb: [255, 20, 147] },
  { id: 18, name: 'Framboise', hex: '#FF00CC', rgb: [255, 0, 204] },
];

type Circle = {
  colorId: number;
  isSelected: boolean;
};

type GameState = 'playing' | 'results';

interface ChromobioTestProps {
  dictionary: {
    title: string;
    instructions: string;
    selectCircles: string;
    row: string;
    results: string;
    restart: string;
    remaining: string;
  };
}

export default function ChromobioTest({ dictionary }: ChromobioTestProps) {
  const [grid, setGrid] = useState<Circle[][]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [selectedInRow, setSelectedInRow] = useState(0);

  // Initialize the grid with random colors
  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    // Create array with 8 of each color (144 total circles)
    const allCircles: number[] = [];
    COLORS.forEach(color => {
      for (let i = 0; i < 8; i++) {
        allCircles.push(color.id);
      }
    });

    // Shuffle using Fisher-Yates algorithm
    const shuffled = [...allCircles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Distribute into 18 rows of 8, ensuring no repeats per row
    const newGrid: Circle[][] = [];
    let attempts = 0;
    const maxAttempts = 100;

    while (newGrid.length < 18 && attempts < maxAttempts) {
      attempts++;
      newGrid.length = 0; // Reset if we need to retry
      const available = [...shuffled];

      for (let row = 0; row < 18; row++) {
        const rowCircles: Circle[] = [];
        const usedInRow = new Set<number>();

        for (let col = 0; col < 8; col++) {
          // Find a color that hasn't been used in this row
          let foundValid = false;
          let attemptCount = 0;

          while (!foundValid && attemptCount < available.length) {
            const randomIndex = Math.floor(Math.random() * available.length);
            const colorId = available[randomIndex];

            if (!usedInRow.has(colorId)) {
              rowCircles.push({ colorId, isSelected: false });
              usedInRow.add(colorId);
              available.splice(randomIndex, 1);
              foundValid = true;
            }
            attemptCount++;
          }

          if (!foundValid) {
            // Could not find valid color, restart grid generation
            break;
          }
        }

        if (rowCircles.length === 8) {
          newGrid.push(rowCircles);
        } else {
          // Row generation failed, restart
          break;
        }
      }
    }

    if (newGrid.length === 18) {
      setGrid(newGrid);
      setCurrentRow(0);
      setSelectedInRow(0);
      setGameState('playing');
    } else {
      // Fallback: simpler algorithm without strict no-repeat constraint
      const fallbackGrid: Circle[][] = [];
      for (let i = 0; i < 18; i++) {
        const row: Circle[] = [];
        for (let j = 0; j < 8; j++) {
          row.push({ colorId: shuffled[i * 8 + j], isSelected: false });
        }
        fallbackGrid.push(row);
      }
      setGrid(fallbackGrid);
      setCurrentRow(0);
      setSelectedInRow(0);
      setGameState('playing');
    }
  };

  const handleCircleClick = (rowIndex: number, colIndex: number) => {
    if (gameState !== 'playing') return;
    if (rowIndex !== currentRow) return; // Only allow clicks on current row
    if (grid[rowIndex][colIndex].isSelected) return; // Already selected

    // Mark circle as selected
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex].isSelected = true;
    setGrid(newGrid);

    const newSelectedCount = selectedInRow + 1;
    setSelectedInRow(newSelectedCount);

    // If 4 circles selected, move to next row
    if (newSelectedCount === 4) {
      if (currentRow < 17) {
        setCurrentRow(currentRow + 1);
        setSelectedInRow(0);
      } else {
        // Game complete, show results
        setGameState('results');
      }
    }
  };

  const handleRestart = () => {
    initializeGrid();
  };

  const getRemainingColors = () => {
    const counts: { [key: number]: number } = {};
    COLORS.forEach(color => {
      counts[color.id] = 0;
    });

    grid.forEach(row => {
      row.forEach(circle => {
        if (!circle.isSelected) {
          counts[circle.colorId]++;
        }
      });
    });

    return counts;
  };

  if (gameState === 'results') {
    const remainingCounts = getRemainingColors();
    const maxCount = Math.max(...Object.values(remainingCounts));

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-purple-900 pt-32 md:pt-40 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            {dictionary.results}
          </h2>
          <p className="text-white text-center mb-12 text-lg">
            {dictionary.remaining}
          </p>

          {/* Vertical bar graph */}
          <div className="flex justify-center items-end gap-2 md:gap-4 mb-12 h-96">
            {COLORS.map(color => {
              const count = remainingCounts[color.id];
              const heightPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;

              return (
                <div
                  key={color.id}
                  className="flex flex-col items-center gap-2"
                  style={{ width: '5%', minWidth: '30px' }}
                >
                  {/* Bar */}
                  <div className="relative w-full flex flex-col justify-end" style={{ height: '300px' }}>
                    <div
                      className="w-full rounded-t-lg transition-all duration-500 relative"
                      style={{
                        backgroundColor: color.hex,
                        height: `${heightPercent}%`,
                      }}
                    >
                      {/* Count label */}
                      {count > 0 && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white font-bold text-sm">
                          {count}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Color name */}
                  <div className="text-white text-xs text-center transform -rotate-45 origin-top-left mt-4">
                    {color.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Restart button */}
          <div className="text-center">
            <button
              onClick={handleRestart}
              className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              {dictionary.restart}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-purple-900 pt-32 md:pt-40 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          {dictionary.title}
        </h1>
        <p className="text-white text-center mb-8 text-lg">
          {dictionary.instructions}
        </p>

        {/* Current row indicator */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <p className="text-white font-semibold">
              {dictionary.row} {currentRow + 1}/18 - {dictionary.selectCircles} ({selectedInRow}/4)
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="space-y-2 md:space-y-3">
          {grid.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`flex justify-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg transition-all ${
                rowIndex === currentRow
                  ? 'bg-white/30 backdrop-blur-sm scale-105 shadow-xl'
                  : 'bg-white/5'
              }`}
            >
              {row.map((circle, colIndex) => {
                const color = COLORS.find(c => c.id === circle.colorId);
                return (
                  <button
                    key={colIndex}
                    onClick={() => handleCircleClick(rowIndex, colIndex)}
                    disabled={rowIndex !== currentRow || circle.isSelected}
                    title={color?.name}
                    className={`w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full transition-all transform ${
                      rowIndex === currentRow && !circle.isSelected
                        ? 'hover:scale-110 cursor-pointer shadow-lg'
                        : ''
                    } ${circle.isSelected ? 'opacity-50' : ''}`}
                    style={{
                      backgroundColor: circle.isSelected ? '#FFFFFF' : color?.hex,
                      border: circle.isSelected ? '2px solid #CBD5E0' : 'none',
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
