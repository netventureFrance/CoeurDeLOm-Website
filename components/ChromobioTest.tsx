'use client';

import { useState, useEffect } from 'react';

// Define the chromobiology colors (using colors 01-18 for this game)
// Full palette contains 27 colors - can be expanded for future games
const COLORS = [
  { id: 1, name: 'Pourpre Foncé', hex: '#7C1E7A', rgb: [124, 30, 122] },
  { id: 2, name: 'Magenta', hex: '#FF41FB', rgb: [255, 65, 251] },
  { id: 3, name: 'Pourpre', hex: '#BD35DE', rgb: [189, 53, 222] },
  { id: 4, name: 'Violet', hex: '#9133DE', rgb: [145, 51, 222] },
  { id: 5, name: 'Bleu Roi', hex: '#342EDE', rgb: [52, 46, 222] },
  { id: 6, name: 'Indigo', hex: '#0063F8', rgb: [0, 99, 248] },
  { id: 7, name: 'Bleu', hex: '#0088F8', rgb: [0, 136, 248] },
  { id: 8, name: 'Cyan', hex: '#00E1F9', rgb: [0, 225, 249] },
  { id: 9, name: 'Bleu Turquoise', hex: '#00F7C6', rgb: [0, 247, 198] },
  { id: 10, name: 'Vert Turquoise', hex: '#00F395', rgb: [0, 243, 149] },
  { id: 11, name: 'Vert', hex: '#00B92C', rgb: [0, 185, 44] },
  { id: 12, name: 'Citron', hex: '#ADF000', rgb: [173, 240, 0] },
  { id: 13, name: 'Pomme', hex: '#00F134', rgb: [0, 241, 52] },
  { id: 14, name: 'Jaune', hex: '#FFFC00', rgb: [255, 252, 0] },
  { id: 15, name: 'Or', hex: '#FDCE00', rgb: [253, 206, 0] },
  { id: 16, name: 'Orange', hex: '#FE8A00', rgb: [254, 138, 0] },
  { id: 17, name: 'Rouge', hex: '#FF2500', rgb: [255, 37, 0] },
  { id: 18, name: 'Ecarlate', hex: '#FF307F', rgb: [255, 48, 127] },
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
      <>
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
        <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black pt-32 md:pt-40 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            {dictionary.results}
          </h2>
          <p className="text-white text-center mb-12 text-lg">
            {dictionary.remaining}
          </p>

          {/* Stacked circles visualization */}
          <div className="flex justify-center items-end gap-2 md:gap-4 mb-12 min-h-[400px]">
            {COLORS.map(color => {
              const count = remainingCounts[color.id];

              return (
                <div
                  key={color.id}
                  className="flex flex-col items-center gap-2"
                  style={{ width: '5%', minWidth: '30px' }}
                >
                  {/* Stacked circles */}
                  <div className="relative w-full flex flex-col-reverse items-center justify-start gap-1" style={{ minHeight: '300px' }}>
                    {count > 0 && (
                      <>
                        {/* Count label */}
                        <div className="text-white font-bold text-sm mb-2">
                          {count}
                        </div>
                        {/* Render circles */}
                        {Array.from({ length: count }).map((_, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 md:w-8 md:h-8 rounded-full shadow-md transition-all duration-500"
                            style={{
                              backgroundColor: color.hex,
                              animation: `fadeIn 0.3s ease-in-out ${index * 0.05}s backwards`,
                            }}
                          />
                        ))}
                      </>
                    )}
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
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black pt-32 md:pt-40 pb-12 px-4">
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
              className={`relative flex justify-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg transition-all ${
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
              {/* Overlay for inactive rows */}
              {rowIndex !== currentRow && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 backdrop-blur-[2px] rounded-lg pointer-events-none" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
