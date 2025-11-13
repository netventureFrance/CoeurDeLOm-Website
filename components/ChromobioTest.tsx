'use client';

import { useState, useEffect } from 'react';
import { generateShortInterpretation, generateDetailedInterpretation } from '@/lib/interpretation-generator';

// Define the chromobiology colors (using colors 01-18 for this game)
// Full palette contains 27 colors - can be expanded for future games
const COLORS = [
  { id: 1, name: 'Magenta', hex: '#FF00FF', rgb: [255, 0, 255] },
  { id: 2, name: 'Pourpre', hex: '#BE02FF', rgb: [190, 2, 255] },
  { id: 3, name: 'Violet', hex: '#7D01FF', rgb: [125, 1, 255] },
  { id: 4, name: 'Bleu Roi', hex: '#1600FF', rgb: [22, 0, 255] },
  { id: 5, name: 'Indigo', hex: '#00BEFF', rgb: [0, 190, 255] },
  { id: 6, name: 'Bleu', hex: '#00BEFF', rgb: [0, 190, 255] },
  { id: 7, name: 'Cyan', hex: '#00FFFF', rgb: [0, 255, 255] },
  { id: 8, name: 'Bleu Turquoise', hex: '#00FCBB', rgb: [0, 252, 187] },
  { id: 9, name: 'Vert Turquoise', hex: '#02FF7D', rgb: [2, 255, 125] },
  { id: 10, name: 'Vert', hex: '#01FF00', rgb: [1, 255, 0] },
  { id: 11, name: 'Citron', hex: '#7DFF01', rgb: [125, 255, 1] },
  { id: 12, name: 'Pomme', hex: '#BEFF04', rgb: [190, 255, 4] },
  { id: 13, name: 'Jaune', hex: '#FEFF00', rgb: [255, 255, 0] },
  { id: 14, name: 'Or', hex: '#FFBE00', rgb: [255, 190, 0] },
  { id: 15, name: 'Orange', hex: '#FF7D00', rgb: [255, 125, 0] },
  { id: 16, name: 'Rouge', hex: '#FF0200', rgb: [255, 2, 0] },
  { id: 17, name: 'Ecarlate', hex: '#FF007D', rgb: [255, 0, 125] },
  { id: 18, name: 'Framboise', hex: '#FF00BE', rgb: [255, 0, 190] },
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
    summary: string;
    bookSession: string;
    shortInterpretation: string;
    detailedInterpretation: string;
    detailedNote: string;
    interpretation: {
      excess: string;
      shortage: string;
      balanced: string;
    };
  };
  lang?: string;
}

export default function ChromobioTest({ dictionary, lang = 'fr' }: ChromobioTestProps) {
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

    // Prepare color results for interpretation (include ALL colors, even 0)
    const colorResults = COLORS.map(color => {
      const count = remainingCounts[color.id];
      let status: 'excess' | 'balanced' | 'shortage' = 'balanced';
      if (count > 5) status = 'excess';
      if (count < 4) status = 'shortage';
      return {
        id: color.id,
        name: color.name,
        count,
        status
      };
    });

    const shortInterp = generateShortInterpretation(colorResults, lang);
    const detailedInterp = generateDetailedInterpretation(colorResults, lang);

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

          {/* Short Interpretation - 3 rows */}
          <div className="max-w-4xl mx-auto mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {dictionary.shortInterpretation}
            </h3>
            <div className="space-y-4">
              {/* Excess row */}
              {colorResults.some(c => c.status === 'excess') && (
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md border border-orange-500/30 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-orange-300 font-semibold mb-2 uppercase text-sm tracking-wide">
                        {dictionary.interpretation.excess}
                      </h4>
                      <p className="text-red-400 leading-relaxed">
                        {shortInterp.excess}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Balanced row */}
              {colorResults.some(c => c.status === 'balanced') && (
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-500/30 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-green-300 font-semibold mb-2 uppercase text-sm tracking-wide">
                        {dictionary.interpretation.balanced}
                      </h4>
                      <p className="text-white/90 leading-relaxed">
                        {shortInterp.balanced}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Shortage row */}
              {colorResults.some(c => c.status === 'shortage') && (
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md border border-blue-500/30 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-blue-300 font-semibold mb-2 uppercase text-sm tracking-wide">
                        {dictionary.interpretation.shortage}
                      </h4>
                      <p className="text-white/90 leading-relaxed">
                        {shortInterp.shortage}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Interpretation - Preview (will be locked in future) */}
          <div className="max-w-4xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {dictionary.detailedInterpretation}
            </h3>
            <div className="relative bg-gradient-to-br from-gray-700/30 to-gray-800/30 backdrop-blur-md border border-white/10 rounded-xl p-8">
              {/* Lock overlay (hidden for now, will be shown in future) */}
              <div className="hidden absolute inset-0 bg-gray-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                <div className="text-center text-white/40">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-lg text-white/70">
                    {dictionary.detailedNote}
                  </p>
                </div>
              </div>
              {/* Detailed interpretation content */}
              <div className="prose prose-invert max-w-none">
                <div className="text-white/80 whitespace-pre-line text-sm leading-relaxed">
                  {detailedInterp}
                </div>
              </div>
            </div>
          </div>

          {/* Booking CTA */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
              <p className="text-white/90 text-lg leading-relaxed mb-6 text-center">
                {dictionary.summary}
              </p>
              <div className="text-center">
                <a
                  href="/contact"
                  className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {dictionary.bookSession}
                </a>
              </div>
            </div>
          </div>

          {/* Restart button removed - tests can only be done once every 3 months */}
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

        {/* Grid - Only show current row and future rows */}
        <div className="space-y-2 md:space-y-3">
          {grid.map((row, rowIndex) => {
            // Hide completed rows (they disappear behind the menu)
            if (rowIndex < currentRow) {
              return null;
            }

            return (
              <div
                key={rowIndex}
                className={`relative flex justify-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg transition-all duration-500 ${
                  rowIndex === currentRow
                    ? 'bg-white/30 backdrop-blur-sm scale-105 shadow-2xl ring-4 ring-white/40'
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
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-black/95 backdrop-blur-[3px] rounded-lg pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
