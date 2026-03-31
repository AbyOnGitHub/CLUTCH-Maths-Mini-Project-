// Developed by Soham Dugade 24101A0037 INFT-A
"use client"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { DataInputPanel } from "./data-input-panel"
import { ScatterPlot } from "./scatter-plot"
import { SolutionPanel } from "./solution-panel"
import { Sparkles, Home, Menu, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ClutchApp() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"
  
  const [xValues, setXValues] = useState<number[]>([])
  const [yValues, setYValues] = useState<number[]>([])
  const [regressionLine, setRegressionLine] = useState<{ slope: number; intercept: number } | null>(null)
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [mobilePanel, setMobilePanel] = useState<"input" | "graph" | "solution">("graph")

  // Loading the demo data.
  useEffect(() => {
    if (isDemo) {
      const demoX = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      const demoY = [2.3, 4.1, 5.9, 8.2, 10.1, 11.8, 14.2, 15.9, 18.1, 20.0, 22.3, 24.1]
      setXValues(demoX)
      setYValues(demoY)
    }
  }, [isDemo])

  const handleDataChange = useCallback((x: number[], y: number[]) => {
    setXValues(x)
    setYValues(y)
  }, [])

  const handleRegressionCalculated = useCallback((line: { slope: number; intercept: number } | null) => {
    setRegressionLine(line)
  }, [])

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(45,212,191,0.05)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(34,211,238,0.03)_0%,_transparent_40%)]" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(45,212,191,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(45,212,191,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 h-14 flex-shrink-0 border-b border-border/30 glass-strong">
        <div className="h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-sm font-bold tracking-tight text-primary hidden sm:block">
                C.L.U.T.C.H.
              </span>
            </Link>
            <div className="hidden md:block h-4 w-px bg-border/50" />
            <span className="hidden md:block text-xs text-muted-foreground">
              Correlation Analysis
            </span>
          </div>

          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-1">
            <Button
              variant={mobilePanel === "input" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMobilePanel("input")}
              className={`h-8 text-xs ${mobilePanel === "input" ? "bg-primary/20 text-primary" : ""}`}
            >
              Input
            </Button>
            <Button
              variant={mobilePanel === "graph" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMobilePanel("graph")}
              className={`h-8 text-xs ${mobilePanel === "graph" ? "bg-primary/20 text-primary" : ""}`}
            >
              Graph
            </Button>
            <Button
              variant={mobilePanel === "solution" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMobilePanel("solution")}
              className={`h-8 text-xs ${mobilePanel === "solution" ? "bg-primary/20 text-primary" : ""}`}
            >
              Solution
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop panel toggles */}
            <div className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                {leftPanelOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                {rightPanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>
            
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground">
                <Home className="w-3.5 h-3.5 mr-1.5" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex overflow-hidden">
        {/* Desktop layout */}
        <div className="hidden md:flex flex-1">
          {/* Left panel - Data Input */}
          <div 
            className={`flex-shrink-0 border-r border-border/30 glass transition-all duration-300 overflow-hidden ${
              leftPanelOpen ? "w-80" : "w-0"
            }`}
          >
            {leftPanelOpen && <DataInputPanel onDataChange={handleDataChange} />}
          </div>

          {/* Center - Graph */}
          <div className="flex-1 min-w-0 p-4">
            <div className="h-full glass rounded-xl border border-border/30 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground">Scatter Plot Visualization</h2>
                {xValues.length > 0 && (
                  <span className="text-xs text-muted-foreground font-mono">
                    {xValues.length} data points
                  </span>
                )}
              </div>
              <div className="flex-1 min-h-0">
                <ScatterPlot 
                  xValues={xValues} 
                  yValues={yValues} 
                  regressionLine={regressionLine} 
                />
              </div>
            </div>
          </div>

          {/* Right panel - Solution */}
          <div 
            className={`flex-shrink-0 border-l border-border/30 glass transition-all duration-300 overflow-hidden ${
              rightPanelOpen ? "w-96" : "w-0"
            }`}
          >
            {rightPanelOpen && (
              <SolutionPanel 
                xValues={xValues} 
                yValues={yValues} 
                onRegressionCalculated={handleRegressionCalculated}
              />
            )}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="flex md:hidden flex-1 overflow-hidden">
          {mobilePanel === "input" && (
            <div className="flex-1 glass">
              <DataInputPanel onDataChange={handleDataChange} />
            </div>
          )}
          {mobilePanel === "graph" && (
            <div className="flex-1 p-4">
              <div className="h-full glass rounded-xl border border-border/30 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-foreground">Scatter Plot</h2>
                  {xValues.length > 0 && (
                    <span className="text-xs text-muted-foreground font-mono">
                      {xValues.length} points
                    </span>
                  )}
                </div>
                <div className="flex-1 min-h-0">
                  <ScatterPlot 
                    xValues={xValues} 
                    yValues={yValues} 
                    regressionLine={regressionLine} 
                  />
                </div>
              </div>
            </div>
          )}
          {mobilePanel === "solution" && (
            <div className="flex-1 glass overflow-auto">
              <SolutionPanel 
                xValues={xValues} 
                yValues={yValues} 
                onRegressionCalculated={handleRegressionCalculated}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 h-8 flex-shrink-0 border-t border-border/30 glass-strong">
        <div className="h-full flex items-center justify-between px-4 text-[10px] text-muted-foreground">
          <span>C.L.U.T.C.H. © 2026</span>
          <span className="font-mono">
            {xValues.length > 0 && regressionLine
              ? `y = ${regressionLine.slope.toFixed(3)}x ${regressionLine.intercept >= 0 ? "+" : ""} ${regressionLine.intercept.toFixed(3)}`
              : "Ready for analysis"}
          </span>
        </div>
      </footer>
    </div>
  )
}
