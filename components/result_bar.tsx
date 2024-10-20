import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ResultBarProps {
  result: string[][]
  totalNodes: number
  goalPositions: { x: number; y: number }[]
}

export default function ResultBar({ result, totalNodes, goalPositions }: ResultBarProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Result</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            <p>Total nodes explored: {totalNodes}</p>
            {result && result.map((path, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold">Goal {index + 1} (Position: {goalPositions[index].x}, {goalPositions[index].y})</h3>
                <p>Path: {path.join(' → ')}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}