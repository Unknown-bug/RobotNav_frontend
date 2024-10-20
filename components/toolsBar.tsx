import { FC } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ToolsBarProps {
  sizex: number;
  sizey: number;
  setSizeX: (value: number) => void;
  setSizeY: (value: number) => void;
  algorithm: string;
  setAlgorithm: (value: string) => void;
}

const ToolsBar: FC<ToolsBarProps> = ({
  sizex, sizey, setSizeX, setSizeY, algorithm, setAlgorithm
}) => {
  return (
    <div className='flex gap-5'>
      {/* Size input */}
      <div>
        <h2>X size:</h2>
        <Input
          type="number"
          value={sizex}
          onChange={(e) => setSizeX(Number(e.target.value))}
        />
        <h2>Y size:</h2>
        <Input
          type="number"
          value={sizey}
          onChange={(e) => setSizeY(Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col items-center space-y-5 justify-end">
        <Select value={algorithm} onValueChange={setAlgorithm}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select algorithm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bfs">Breadth-First Search</SelectItem>
            <SelectItem value="dfs">Depth-First Search</SelectItem>
            <SelectItem value="as">A* Search</SelectItem>
            <SelectItem value="gbfs">Greedy Best-First Search</SelectItem>
            <SelectItem value="cus1">Custom 1</SelectItem>
            <SelectItem value="cus2">Custom 2</SelectItem>
          </SelectContent>
        </Select>

        {/* <Button onClick={handleStart} className='w-full'>Start</Button> */}
      </div>
      {/* <Button onClick={Reset} className='w-full h-full'>Reset</Button> */}
    </div>
  )
}

export default ToolsBar;