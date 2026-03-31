"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Trash2, Plus, Database, FileSpreadsheet } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DataInputPanelProps {
  onDataChange: (xValues: number[], yValues: number[]) => void
}

export function DataInputPanel({ onDataChange }: DataInputPanelProps) {
  const [xInput, setXInput] = useState("")
  const [yInput, setYInput] = useState("")
  const [csvData, setCsvData] = useState("")
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseAndSubmit = (x: string, y: string) => {
    setError("")
    try {
      const xValues = x
        .split(/[,\n\s]+/)
        .filter((v) => v.trim())
        .map((v) => {
          const num = parseFloat(v.trim())
          if (isNaN(num)) throw new Error(`Invalid X value: ${v}`)
          return num
        })

      const yValues = y
        .split(/[,\n\s]+/)
        .filter((v) => v.trim())
        .map((v) => {
          const num = parseFloat(v.trim())
          if (isNaN(num)) throw new Error(`Invalid Y value: ${v}`)
          return num
        })

      if (xValues.length !== yValues.length) {
        throw new Error("X and Y must have the same number of values")
      }

      if (xValues.length < 2) {
        throw new Error("Need at least 2 data points")
      }

      onDataChange(xValues, yValues)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid input")
    }
  }

  const handleManualSubmit = () => {
    parseAndSubmit(xInput, yInput)
  }

  const handleCSVParse = () => {
    setError("")
    try {
      const lines = csvData.trim().split("\n")
      const xValues: number[] = []
      const yValues: number[] = []

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue
        
        // Skip header row if it contains non-numeric values
        const parts = line.split(/[,\t;]/).map((p) => p.trim())
        if (parts.length < 2) continue
        
        const x = parseFloat(parts[0])
        const y = parseFloat(parts[1])
        
        if (isNaN(x) || isNaN(y)) {
          if (i === 0) continue // Likely a header row
          throw new Error(`Invalid data on line ${i + 1}`)
        }
        
        xValues.push(x)
        yValues.push(y)
      }

      if (xValues.length < 2) {
        throw new Error("Need at least 2 data points")
      }

      onDataChange(xValues, yValues)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid CSV format")
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setCsvData(text)
    }
    reader.readAsText(file)
  }

  const loadSampleData = () => {
    setXInput("1, 2, 3, 4, 5, 6, 7, 8, 9, 10")
    setYInput("2.1, 4.2, 5.8, 8.1, 9.9, 12.2, 14.0, 16.1, 18.3, 20.0")
    parseAndSubmit(
      "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
      "2.1, 4.2, 5.8, 8.1, 9.9, 12.2, 14.0, 16.1, 18.3, 20.0"
    )
  }

  const clearData = () => {
    setXInput("")
    setYInput("")
    setCsvData("")
    setError("")
    onDataChange([], [])
  }

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Data Input</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadSampleData}
            className="h-7 text-xs text-muted-foreground hover:text-primary"
          >
            <Plus className="w-3 h-3 mr-1" />
            Sample
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearData}
            className="h-7 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="manual" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full bg-secondary/30 border border-border/30">
          <TabsTrigger value="manual" className="flex-1 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Manual Entry
          </TabsTrigger>
          <TabsTrigger value="csv" className="flex-1 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            CSV Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="flex-1 flex flex-col gap-4 mt-4 min-h-0 overflow-auto">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-primary/20 text-primary text-[10px] flex items-center justify-center font-mono">X</span>
              X Values
            </label>
            <Textarea
              value={xInput}
              onChange={(e) => setXInput(e.target.value)}
              placeholder="1, 2, 3, 4, 5..."
              className="min-h-[80px] bg-input/50 border-border/50 text-sm font-mono resize-none focus:border-primary/50 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-accent/20 text-accent text-[10px] flex items-center justify-center font-mono">Y</span>
              Y Values
            </label>
            <Textarea
              value={yInput}
              onChange={(e) => setYInput(e.target.value)}
              placeholder="2, 4, 6, 8, 10..."
              className="min-h-[80px] bg-input/50 border-border/50 text-sm font-mono resize-none focus:border-primary/50 focus:ring-primary/20"
            />
          </div>

          <Button
            onClick={handleManualSubmit}
            className="w-full bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30"
          >
            Analyze Data
          </Button>
        </TabsContent>

        <TabsContent value="csv" className="flex-1 flex flex-col gap-4 mt-4 min-h-0 overflow-auto">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
          >
            <FileSpreadsheet className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Click to upload CSV
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              First column: X, Second column: Y
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="space-y-2 flex-1 min-h-0 flex flex-col">
            <label className="text-xs font-medium text-muted-foreground">
              Or paste CSV data:
            </label>
            <Textarea
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="x,y&#10;1,2&#10;2,4&#10;3,6..."
              className="flex-1 min-h-[100px] bg-input/50 border-border/50 text-sm font-mono resize-none focus:border-primary/50 focus:ring-primary/20"
            />
          </div>

          <Button
            onClick={handleCSVParse}
            className="w-full bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30"
          >
            <Upload className="w-4 h-4 mr-2" />
            Parse CSV
          </Button>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
          {error}
        </div>
      )}
    </div>
  )
}
