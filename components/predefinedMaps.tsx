import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

type CellType = 'empty' | 'wall' | 'start' | 'goal' | 'traversed' | 'path';

interface Cell {
  type: CellType;
  x: number;
  y: number;
}

interface GridProps {
  sizex: number;
  sizey: number;
  grid: Cell[][];
}

interface MapProps {
  onMapClick: (props: GridProps) => void;
}

const generateRandomGrid = (sizex: number, sizey: number) => {
  return Array.from({ length: sizey }, (_, y) =>
    Array.from({ length: sizex }, (_, x) => ({
      type:
        Math.random() < 0.2 && x > 0 && y > 0 && x < sizex - 1 && y < sizey - 1
          ? ('wall' as CellType)
          : ('empty' as CellType),
      x,
      y,
    }))
  );
};

export default function PredefinedMap({ onMapClick }: MapProps) {
  const [maps, setMaps] = useState<GridProps[]>([]);

  // Generate the random grids only once, when the component is mounted
  useEffect(() => {
    const randomGrid20 = generateRandomGrid(20, 20);
    const randomGrid30 = generateRandomGrid(30, 30);
    const randomGrid40 = generateRandomGrid(40, 40);

    const predefinedMaps = [
      {
        sizex: 4,
        sizey: 4,
        grid: [
          [
            { type: 'empty' as CellType, x: 0, y: 0 },
            { type: 'empty' as CellType, x: 1, y: 0 },
            { type: 'wall' as CellType, x: 2, y: 0 },
            { type: 'wall' as CellType, x: 3, y: 0 },
          ],
          [
            { type: 'empty' as CellType, x: 0, y: 1 },
            { type: 'empty' as CellType, x: 1, y: 1 },
            { type: 'empty' as CellType, x: 2, y: 1 },
            { type: 'empty' as CellType, x: 3, y: 1 },
          ],
          [
            { type: 'empty' as CellType, x: 0, y: 2 },
            { type: 'wall' as CellType, x: 1, y: 2 },
            { type: 'empty' as CellType, x: 2, y: 2 },
            { type: 'empty' as CellType, x: 3, y: 2 },
          ],
          [
            { type: 'empty' as CellType, x: 0, y: 3 },
            { type: 'empty' as CellType, x: 1, y: 3 },
            { type: 'empty' as CellType, x: 2, y: 3 },
            { type: 'empty' as CellType, x: 3, y: 3 },
          ],
        ],
      },
      {
          sizex: 5,
          sizey: 4,
          grid: [
          [{ type: 'empty' as CellType, x: 0, y: 0 }, { type: 'empty' as CellType, x: 1, y: 0 }, { type: 'empty' as CellType, x: 2, y: 0 }, { type: 'empty' as CellType, x: 3, y: 0 }, { type: 'empty' as CellType, x: 4, y: 0 }],
          [{ type: 'empty' as CellType, x: 0, y: 1 }, { type: 'empty' as CellType, x: 1, y: 1 }, { type: 'wall' as CellType, x: 2, y: 1 }, { type: 'empty' as CellType, x: 3, y: 1 }, { type: 'empty' as CellType, x: 4, y: 1 }],
          [{ type: 'empty' as CellType, x: 0, y: 2 }, { type: 'empty' as CellType, x: 1, y: 2 }, { type: 'empty' as CellType, x: 2, y: 2 }, { type: 'wall' as CellType, x: 3, y: 2 }, { type: 'empty' as CellType, x: 4, y: 2 }],
          [{ type: 'empty' as CellType, x: 0, y: 3 }, { type: 'empty' as CellType, x: 1, y: 3 }, { type: 'empty' as CellType, x: 2, y: 3 }, { type: 'wall' as CellType, x: 3, y: 3 }, { type: 'empty' as CellType, x: 4, y: 3 }]
          ]
      },
      {
          sizex: 5,
          sizey: 5,
          grid: [
          [{ type: 'empty' as CellType, x: 0, y: 0 }, { type: 'empty' as CellType, x: 1, y: 0 }, { type: 'empty' as CellType, x: 2, y: 0 }, { type: 'empty' as CellType, x: 3, y: 0 }, { type: 'empty' as CellType, x: 4, y: 0 }],
          [{ type: 'empty' as CellType, x: 0, y: 1 }, { type: 'empty' as CellType, x: 1, y: 1 }, { type: 'wall' as CellType, x: 2, y: 1 }, { type: 'wall' as CellType, x: 3, y: 1 }, { type: 'empty' as CellType, x: 4, y: 1 }],
          [{ type: 'empty' as CellType, x: 0, y: 2 }, { type: 'empty' as CellType, x: 1, y: 2 }, { type: 'empty' as CellType, x: 2, y: 2 }, { type: 'wall' as CellType, x: 3, y: 2 }, { type: 'empty' as CellType, x: 4, y: 2 }],
          [{ type: 'empty' as CellType, x: 0, y: 3 }, { type: 'empty' as CellType, x: 1, y: 3 }, { type: 'empty' as CellType, x: 2, y: 3 }, { type: 'wall' as CellType, x: 3, y: 3 }, { type: 'empty' as CellType, x: 4, y: 3 }],
          [{ type: 'empty' as CellType, x: 0, y: 4 }, { type: 'empty' as CellType, x: 1, y: 4 }, { type: 'empty' as CellType, x: 2, y: 4 }, { type: 'empty' as CellType, x: 3
          , y: 4 }, { type: 'empty' as CellType, x: 4, y: 4 }]
          ]
      },
      {
          sizex: 6,
          sizey: 6,
          grid: [
          [{ type: 'empty' as CellType, x: 0, y: 0 }, { type: 'empty' as CellType, x: 1, y: 0 }, { type: 'empty' as CellType, x: 2, y: 0 }, { type: 'empty' as CellType, x: 3, y: 0 }, { type: 'empty' as CellType, x: 4, y: 0 }, { type: 'empty' as CellType, x: 5, y: 0 }],
          [{ type: 'empty' as CellType, x: 0, y: 1 }, { type: 'empty' as CellType, x: 1, y: 1 }, { type: 'wall' as CellType, x: 2, y: 1 }, { type: 'wall' as CellType, x: 3, y: 1 }, { type: 'empty' as CellType, x: 4, y: 1 }, { type: 'empty' as CellType, x: 5, y: 1 }],
          [{ type: 'empty' as CellType, x: 0, y: 2 }, { type: 'empty' as CellType, x: 1, y: 2 }, { type: 'empty' as CellType, x: 2, y: 2 }, { type: 'wall' as CellType, x: 3, y: 2 }, { type: 'empty' as CellType, x: 4, y: 2 }, { type: 'empty' as CellType, x: 5, y: 2 }],
          [{ type: 'empty' as CellType, x: 0, y: 3 }, { type: 'empty' as CellType, x: 1, y: 3 }, { type: 'empty' as CellType, x: 2, y: 3 }, { type: 'wall' as CellType, x: 3, y: 3 }, { type: 'empty' as CellType, x: 4, y: 3 }, { type: 'empty' as CellType, x: 5, y: 3 }],
          [{ type: 'empty' as CellType, x: 0, y: 4 }, { type: 'empty' as CellType, x: 1, y: 4 }, { type: 'empty' as CellType, x: 2, y: 4 }, { type: 'wall' as CellType, x: 3, y: 4 }, { type: 'empty' as CellType, x: 4, y: 4 }, { type: 'empty' as CellType, x: 5, y: 4 }],
          [{ type: 'empty' as CellType, x: 0, y: 5 }, { type: 'empty' as CellType, x: 1, y: 5 }, { type: 'empty' as CellType, x: 2, y: 5 }, { type: 'empty' as CellType, x: 3, y: 5 }, { type: 'empty' as CellType, x: 4, y: 5 }, { type: 'empty' as CellType, x: 5, y: 5 }]
          ]
      }
    ];

    const randomMaps = [
      { sizex: 20, sizey: 20, grid: randomGrid20 },
      { sizex: 30, sizey: 30, grid: randomGrid30 },
      { sizex: 40, sizey: 40, grid: randomGrid40 },
    ];

    setMaps([...predefinedMaps, ...randomMaps]);
  }, []);

  return (
    <div className="flex flex-col gap-y-2 h-full overflow-auto">
      {maps.map((map, index) => (
        <Card key={index} onClick={() => onMapClick(map)}>
          <CardHeader>
            <CardTitle>
              Size {map.sizex} x {map.sizey}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {map.grid.length > 0 &&
              map.grid.map((row, y) => (
                <div key={y} className="flex">
                  {row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`w-6 h-6 border border-gray-200 ${
                        cell.type === 'wall'
                          ? 'bg-gray-500'
                          : cell.type === 'goal'
                          ? 'bg-green-500'
                          : cell.type === 'start'
                          ? 'bg-red-500'
                          : cell.type === 'traversed'
                          ? 'bg-blue-500'
                          : cell.type === 'path'
                          ? 'bg-yellow-500'
                          : ''
                      }`}
                    />
                  ))}
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
