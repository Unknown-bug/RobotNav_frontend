"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Play, RotateCcw, Trash2 } from "lucide-react"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import api from "@/components/api"
import ResultBar from '@/components/result_bar'
import ToolsBar from '@/components/toolsBar'
import PredefinedMap from '@/components/predefinedMaps'
import GridUploader from '@/components/uploadFile'

type CellType = 'empty' | 'wall' | 'start' | 'goal' | 'traversed' | 'path' | 'glow'

interface ResultModel {
  path: string[],
  traversed: number[][],
  total_nodes: number,
}

interface Cell {
  type: CellType
  x: number
  y: number
  direction?: string
}

interface GridProps {
  sizex: number
  sizey: number
  grid: Cell[][]
}

const transformGrid = (grid: Cell[][]) => {
  let newGrid: number[][] = Array.from({ length: grid[0].length }, () => Array(grid.length).fill(0));

  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.type === 'wall') {
        newGrid[x][y] = 1;
      }
    });
  });

  return newGrid;
}

const getGoalState = (goalCell: Cell[]) => {
  let goalState: number[][] = Array(goalCell.length).fill(null).map(() => Array(2).fill(0))
  goalCell.map((cell, index) => {
    goalState[index] = [cell.x, cell.y]
  })
  return (goalState)
}

const moveTranslator = (initialpos: number[], move: string[]) => {
  let moveList: number[][] = []
  let pos = initialpos
  move.map((m) => {
    if (m === "up")
      pos = [pos[0], pos[1] - 1]
    if (m === "down")
      pos = [pos[0], pos[1] + 1]
    if (m === "left")
      pos = [pos[0] - 1, pos[1]]
    if (m === "right")
      pos = [pos[0] + 1, pos[1]]
    moveList.push(pos)
  })
  return moveList
}

export default function PathFinder() {
  const [currentType, setCurrentType] = useState<CellType>('wall')
  const [algorithm, setAlgorithm] = useState<string>('bfs')
  const [startCell, setStartCell] = useState<Cell | null>(null)
  const [goalCell, setGoalCell] = useState<Cell[]>([])
  const [sizex, setSizeX] = useState<number>(4)
  const [sizey, setSizeY] = useState<number>(4)
  const [grid, setGrid] = useState<Cell[][]>([])
  const [result, setResult] = useState<ResultModel[]>([])
  const [totalNodes, setTotalNodes] = useState<number>(0)
  const [traversedNodes, setTraversedNodes] = useState<number[][]>([])
  const [delay, setDelay] = useState(10);
  const [displayingPath, setDisplayingPath] = useState(0);
  const [path, setPath] = useState<number[][]>([]);
  const [drawPath, setDrawPath] = useState(false);
  const [emphasePath, setEmphasePath] = useState(-1);

  const getArrowDirection = (current: number[], next: number[]) => {
    if (next[1] < current[1]) return 'up'
    if (next[1] > current[1]) return 'down'
    if (next[0] < current[0]) return 'left'
    if (next[0] > current[0]) return 'right'
    return 'up' // default direction
  }

  const renderArrow = (direction: string) => {
    switch (direction) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-white" />
      case 'down':
        return <ArrowDown className="w-4 h-4 text-white" />
      case 'left':
        return <ArrowLeft className="w-4 h-4 text-white" />
      case 'right':
        return <ArrowRight className="w-4 h-4 text-white" />
      default:
        return null
    }
  }

  useEffect(() => {
    if (emphasePath === -1) return
    setGrid(prevGrid => {
      const newGrid = [...prevGrid]
      newGrid.forEach(row => row.forEach(cell => {
        if (cell.type === 'glow') {
          cell.type = 'path'
        }
      }))
      if (startCell) {
        const pathMoves = moveTranslator([startCell.x, startCell.y], result[emphasePath].path)
        pathMoves.forEach((move, index) => {
          if (newGrid[move[1]][move[0]].type !== 'goal' && newGrid[move[1]][move[0]].type !== 'start') {
            newGrid[move[1]][move[0]].type = 'glow'
            if (index < pathMoves.length - 1) {
              newGrid[move[1]][move[0]].direction = getArrowDirection(move, pathMoves[index + 1])
            }
          }
        })
      }
      return newGrid
    })
  }, [emphasePath])


  const onMapClick = (props: GridProps) => {
    setResult([]);
    setTotalNodes(0);
    setDrawPath(false);
    setPath([]);
    setTraversedNodes([]);
    setStartCell(null);
    setGoalCell([]);
    setDisplayingPath(0);
    setEmphasePath(-1);

    props.grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.type === 'start') {
          setStartCell(cell);
        } else if (cell.type === 'goal') {
          setGoalCell([...goalCell, cell]);
        }
      });
    })
    setGrid(props.grid);
    setSizeX(props.sizex);
    setSizeY(props.sizey);
  };

  const Reset = () => {
    const newGrid = grid.map(row => row.map(cell => {
      if (cell.type === 'traversed' || cell.type === 'path' || cell.type === 'glow') {
        cell.type = 'empty'
      }
      return cell
    }))
    setGrid(newGrid)
    setResult([])
    setTotalNodes(0)
    setDrawPath(false)
    setPath([])
    setTraversedNodes([])
    setDisplayingPath(0)
    setEmphasePath(-1)
  }

  const DeleteWholeMap = () => {
    const newGrid = Array(sizey).fill(null).map((_, y) =>
      Array(sizex).fill(null).map((_, x) => ({ type: 'empty' as CellType, x, y }))
    )
    setGrid(newGrid)
    setResult([])
    setTotalNodes(0)
    setDrawPath(false)
    setPath([])
    setTraversedNodes([])
    setDisplayingPath(0)
    setEmphasePath(-1)
    setStartCell(null)
    setGoalCell([])
  }

  useEffect(() => {
    if (drawPath && path.length > 0) {
      let currentIndex = 0;

      const intervalId = setInterval(() => {
        if (currentIndex < path.length) {
          const node = path[currentIndex];
          setGrid((prevGrid) => {
            const newGrid = [...prevGrid];
            const cell = newGrid[node[1]][node[0]];

            // Update cell type
            if (cell && cell.type === "traversed") {
              cell.type = "path";
            }
            return newGrid;
          });

          currentIndex++;
        } else {
          clearInterval(intervalId); // Clear the interval once all nodes are processed

          if (displayingPath < result.length - 1) {
            setDrawPath(false); // Stop drawing current path
            setDisplayingPath(displayingPath + 1); // Increment to the next path
          }
        }
      }, 100);

      return () => {
        clearInterval(intervalId);
      };
    }
    else if (drawPath && path.length === 0) {
      setDrawPath(false); // Stop drawing current path
      setDisplayingPath(displayingPath + 1); // Increment to the next path
    }
  }, [drawPath, path, displayingPath]);

  // This effect triggers drawing whenever the `displayingPath` is updated
  useEffect(() => {
    if (displayingPath < result.length) {
      if (startCell)
        setPath(moveTranslator([startCell.x, startCell.y], result[displayingPath].path));
      setDrawPath(true); // Start drawing the updated path
    }
  }, [displayingPath]);

  useEffect(() => {
    if (traversedNodes && traversedNodes.length > 0) {
      let currentIndex = 0;

      const intervalId = setInterval(() => {
        if (currentIndex < traversedNodes.length) {
          const node = traversedNodes[currentIndex];
          setGrid((prevGrid) => {
            const newGrid = [...prevGrid];
            const cell = newGrid[node[1]][node[0]];

            // Update cell type
            if (cell.type === "empty") {
              cell.type = "traversed";
            }
            return newGrid;
          });

          currentIndex++;

          // Trigger the path drawing when we reach the last node
          if (currentIndex === traversedNodes.length) {
            clearInterval(intervalId);
            // Ensure the drawPath is set AFTER this is finished
            setDrawPath(true); // Triggers the first useEffect
            if (startCell) {
              setPath(moveTranslator([startCell.x, startCell.y], result[displayingPath].path));
            }
          }
        }
      }, delay);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [traversedNodes, startCell, result, delay]); // Also depend on these values

  useEffect(() => {
    setGrid(prevGrid => {
      const newGrid = Array(sizey).fill(null).map((_, y) =>
        Array(sizex).fill(null).map((_, x) => {
          // Check if the cell already exists in the previous grid
          if (prevGrid[y] && prevGrid[y][x]) {
            return prevGrid[y][x];
          }
          // Otherwise, return an empty cell or the corresponding cell from the predefined template
          return { type: 'empty' as CellType, x, y };
        })
      );
      return newGrid;
    });
  }, [sizex, sizey]);

  const handleCellClick = (x: number, y: number) => {
    if (traversedNodes.length > 0) {
      const choosenPath = goalCell.findIndex(goal => goal.x === x && goal.y === y)
      if (choosenPath === emphasePath) {
        setEmphasePath(-1)
        return
      }
      setEmphasePath(goalCell.findIndex(goal => goal.x === x && goal.y === y))
      return
    }
    setGrid(prevGrid => {
      const newGrid = [...prevGrid]
      const cell = newGrid[y][x]

      if (currentType === 'start') {
        // Remove previous start cell if exists
        if (cell.type === 'start') {
          cell.type = 'empty'
          setStartCell(null)
        } else if (cell.type === 'goal') {
          setGoalCell(goalCell.filter(goal => goal.x !== x || goal.y !== y))
          cell.type = 'start'
          if (startCell) {
            startCell.type = 'empty'
          }
          setStartCell(cell)
        } else {
          if (startCell) {
            startCell.type = 'empty'
          }
          setStartCell(cell)
          cell.type = 'start'
        }
      }
      if (currentType === 'wall') {
        if (cell.type === 'wall') {
          cell.type = 'empty'
        }
        else if (cell.type === 'goal') {
          setGoalCell(goalCell.filter(goal => goal.x !== x || goal.y !== y))
          cell.type = 'wall'
        }
        else if (cell.type === 'start') {
          setStartCell(null)
          cell.type = 'wall'
        }
        else {
          cell.type = 'wall'
        }
      }
      if (currentType === 'goal') {
        if (cell.type === 'goal') {
          setGoalCell(goalCell.filter(goal => goal.x !== x || goal.y !== y))
          cell.type = 'empty'
        }
        else if (cell.type === 'start') {
          setStartCell(null)
          cell.type = 'goal'
          setGoalCell([...goalCell, cell])
        }
        else {
          cell.type = 'goal'
          setGoalCell([...goalCell, cell])
        }
      }
      return newGrid
    })
  }

  const handleStart = () => {
    Reset()
    if (!startCell) {
      alert('Please select a start cell')
      return
    }
    if (goalCell.length === 0) {
      alert('Please select a goal cell')
      return
    }
    const getResult = async () => {
      const response = await api.post('/getResult', {
        algorithm: algorithm,
        initialstate: [startCell?.x, startCell?.y],
        goalstate: getGoalState(goalCell),
        grid: transformGrid(grid)
      })
      if (response.status === 200) {
        if (response.data.error) {
          alert('Error: ' + response.data.error)
        }
        else {
          console.log(response.data)
          setResult(response.data.path)
          setTotalNodes(response.data.total_nodes)
          setTraversedNodes(response.data.traversed)
        }
      }
      else {
        alert('Error' + response.data)
      }
    }
    getResult()
  }

  return (
    <div className="flex h-screen bg-background">
      <Card className="w-1/4 h-full overflow-y-auto">
        <CardHeader>
          <CardTitle>Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="draw" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="draw">Draw</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="draw">
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() => setCurrentType('wall')}
                    variant={currentType === 'wall' ? 'default' : 'outline'}
                    className="w-full"
                  >
                    Wall
                  </Button>
                  <Button
                    onClick={() => setCurrentType('goal')}
                    variant={currentType === 'goal' ? 'default' : 'outline'}
                    className="w-full"
                  >
                    Goal
                  </Button>
                  <Button
                    onClick={() => setCurrentType('start')}
                    variant={currentType === 'start' ? 'default' : 'outline'}
                    className="w-full"
                  >
                    Start
                  </Button>
                </div>
                <ToolsBar
                  sizex={sizex}
                  sizey={sizey}
                  setSizeX={setSizeX}
                  setSizeY={setSizeY}
                  algorithm={algorithm}

                  setAlgorithm={setAlgorithm}
                />
                <div className="flex flex-col space-y-2">
                  <Button onClick={handleStart} className="w-full">
                    <Play className="mr-2 h-4 w-4" /> Start
                  </Button>
                  <Button onClick={Reset} variant="outline" className="w-full">
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                  <Button onClick={DeleteWholeMap} variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Map
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="upload">
              <GridUploader
                setGrid={setGrid}
                setRows={setSizeY}
                setColumns={setSizeX}
                setGoalCell={setGoalCell}
                setStartCell={setStartCell}
              />
              <PredefinedMap onMapClick={onMapClick} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ScrollArea className="flex-1 h-screen">
        <div className="px-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-4">
                <label htmlFor="speed-slider" className="text-sm font-medium">
                  Animation Speed
                </label>
                <Slider
                  id="speed-slider"
                  min={1}
                  max={100}
                  step={1}
                  value={[delay]}
                  onValueChange={(value) => setDelay(value[0])}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pathfinder Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="grid gap-0 border border-border rounded-lg overflow-hidden">
                  {grid.map((row, y) => (
                    <div key={y} className="flex">
                      {row.map((cell, x) => (
                        <div
                          key={`${x}-${y}`}
                          className={`w-8 h-8 border border-border cursor-pointer transition-all duration-200 ${emphasePath !== -1 && cell.type !== 'glow' ? "opacity-50" : ""
                            } ${cell.type === 'wall' ? 'bg-gray-500' :
                              cell.type === 'goal' ? 'bg-green-500' :
                                cell.type === 'start' ? 'bg-red-500' :
                                  cell.type === 'traversed' ? 'bg-blue-500' :
                                    cell.type === 'path' ? 'bg-yellow-500' :
                                      cell.type === 'glow' ? 'bg-purple-500 flex items-center justify-center' : ''
                            }`}
                          onClick={() => handleCellClick(x, y)}
                        >
                          {cell.type === 'glow' && cell.direction && renderArrow(cell.direction)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <ResultBar
            result={result.map(r => r.path)}
            totalNodes={totalNodes}
            goalPositions={goalCell}
          />

          {!startCell && (
            <div className="flex items-center p-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50" role="alert">
              <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">Note:</span> Please select a start cell to begin.
              </div>
            </div>
          )}

          {startCell && goalCell.length === 0 && (
            <div className="flex items-center p-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50" role="alert">
              <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">Note:</span> Please select at least one goal cell to continue.
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}