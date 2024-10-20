import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
// import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, AlertCircle } from "lucide-react"
import { Input } from "./ui/input";
import { motion, AnimatePresence } from 'framer-motion'

interface Cell {
  type: 'empty' | 'start' | 'goal' | 'wall'
  x: number
  y: number
}

interface GridUploaderProps {
  setGrid: (grid: Cell[][]) => void
  setRows: (rows: number) => void
  setColumns: (columns: number) => void
  setGoalCell: (goalCell: Cell[]) => void
  setStartCell: (startCell: Cell) => void
}

export default function GridUploader({ setGrid, setRows, setColumns, setGoalCell, setStartCell }: GridUploaderProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileUpload(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone(
    {
      onDrop,
      accept: {
        'text/plain': ['.txt']
      },
      multiple: false
    })

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        parseFileContent(text)
        setSuccess(true)
        setError(null)
      } catch (err) {
        setError('Error parsing file. Please check the file format.')
        setSuccess(false)
      }
    }
    reader.onerror = () => {
      setError('Error reading file. Please try again.')
      setSuccess(false)
    }
    reader.readAsText(file)
  }

  const parseFileContent = (content: string) => {
    const lines = content.trim().split('\n').map(line => line.trim())
    if (lines.length < 3) throw new Error('Invalid file format')

    const [gridRows, gridCols] = parseIntArray(lines[0], 2)
    setRows(gridRows)
    setColumns(gridCols)

    const [startX, startY] = parseIntArray(lines[1], 2)
    setStartCell({ type: 'start', x: startX, y: startY })

    const goals = lines[2].split('|').map(goal => {
      const [goalX, goalY] = parseIntArray(goal, 2)
      return { type: 'goal' as const, x: goalX, y: goalY }
    })
    setGoalCell(goals)

    const walls = lines.slice(3).map(line => {
      const [x, y, width, height] = parseIntArray(line, 4)
      return { x, y, width, height }
    })

    generateGrid(gridRows, gridCols, { startX, startY }, goals, walls)
  }

  const parseIntArray = (str: string, expectedLength: number): number[] => {
    const nums = str.replace(/[\[\]()]/g, '').split(',').map(Number)
    if (nums.length !== expectedLength || nums.some(isNaN)) {
      throw new Error(`Invalid format: expected ${expectedLength} numbers`)
    }
    return nums
  }

  const generateGrid = (rows: number, cols: number, start: { startX: number, startY: number }, goals: Cell[], walls: { x: number, y: number, width: number, height: number }[]) => {
    const newGrid: Cell[][] = Array.from({ length: rows }, (_, y) =>
      Array.from({ length: cols }, (_, x) => ({ type: 'empty', x, y }))
    )

    const isInBounds = (x: number, y: number) => x >= 0 && x < cols && y >= 0 && y < rows

    if (isInBounds(start.startX, start.startY)) {
      const cell = newGrid[start.startY][start.startX];
      cell.type = 'start'
      setStartCell(cell);
    } else {
      throw new Error(`Start position (${start.startX}, ${start.startY}) is out of bounds.`)
    }

    goals.forEach(goal => {
      if (isInBounds(goal.x, goal.y)) {
        newGrid[goal.y][goal.x].type = 'goal'
      } else {
        throw new Error(`Goal position (${goal.x}, ${goal.y}) is out of bounds.`)
      }
    })

    walls.forEach(wall => {
      for (let i = wall.x; i < wall.x + wall.width; i++) {
        for (let j = wall.y; j < wall.y + wall.height; j++) {
          if (isInBounds(i, j)) {
            newGrid[j][i].type = 'wall'
          } else {
            throw new Error(`Wall at (${i}, ${j}) is out of bounds.`)
          }
        }
      }
    })

    setGrid(newGrid)
  }
  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'

          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Input {...getInputProps()} />
        {/* <Upload className="mx-auto h-12 w-12 text-gray-400" /> */}
        <motion.img
          src={isHovered ? "/images/ellen-open.gif" : "/images/ellen-close.gif"}
          alt="Dragon animation"
          className="mx-auto h-24 w-24 text-gray-400"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        />
        <p className="mt-2 text-sm text-gray-600">
          Drag 'n' drop a text file here, or click to select a file
        </p>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>File uploaded and parsed successfully.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}