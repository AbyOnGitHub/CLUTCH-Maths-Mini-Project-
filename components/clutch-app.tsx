"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { DataInputPanel } from "./data-input-panel"
import { ScatterPlot } from "./scatter-plot"
import { SolutionPanel } from "./solution-panel"
import { SceneExplanation } from "./scene-explanation"
import { PearsonTable } from "./pearson-table"
import { 
  Sparkles, Home, ChevronLeft, ChevronRight, 
  BarChart3, Table, Play, Calculator, 
  LineChart, GraduationCap, Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ViewMode = "graph" | "scene" | "table"
type RightPanelMode = "solution" | "learn"

function ClutchAppContent() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"
  
  const [xValues, setXValues] = useState<number[]>([])
  const [yValues, setYValues] = useState<number[]>([])
  const [regressionLine, setRegressionLine] = useState<{ slope: number; intercept: number } | null>(null)
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [mobilePanel, setMobilePanel] = useState<"input" | "graph" | "solution">("graph")
  const [viewMode, setViewMode] = useState<ViewMode>("graph")
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>("solution")

  // Load demo data
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
    <div className="h-screen w-full flex flex-col bg-background overflow-auto">
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
              {xValues.length > 0 ? `${xValues.length} data points` : "Correlation Analysis"}
            </span>
          </div>

          {/* View mode switcher (desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-secondary/30 rounded-lg p-1 border border-border/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("graph")}
              className={`h-7 text-xs px-3 ${viewMode === "graph" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
            >
              <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
              Graph
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("scene")}
              className={`h-7 text-xs px-3 ${viewMode === "scene" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
            >
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Scene
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("table")}
              className={`h-7 text-xs px-3 ${viewMode === "table" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
            >
              <Table className="w-3.5 h-3.5 mr-1.5" />
              Table
            </Button>
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
                title={leftPanelOpen ? "Hide input panel" : "Show input panel"}
              >
                {leftPanelOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                title={rightPanelOpen ? "Hide analysis panel" : "Show analysis panel"}
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
      <main className="relative z-10 flex-1 flex min-h-0 overflow-auto">
        {/* Desktop layout */}
        <div className="hidden md:flex flex-1">
          {/* Left panel - Data Input (25%) */}
          <div 
            className={`flex-shrink-0 border-r border-border/30 glass transition-all duration-300 overflow-hidden ${
              leftPanelOpen ? "w-72" : "w-0"
            }`}
            style={{ maxWidth: leftPanelOpen ? '25%' : 0 }}
          >
            {leftPanelOpen && <DataInputPanel onDataChange={handleDataChange} />}
          </div>

          {/* Center - Main visualization (50% or more) */}
          <div className="flex-1 min-w-0 p-4 flex flex-col" style={{ minWidth: '50%' }}>
            <div className="flex-1 glass rounded-xl border border-border/30 flex flex-col overflow-hidden" style={{ minHeight: '400px' }}>
              {/* View mode content */}
              {viewMode === "graph" && (
                <>
                  <div className="flex items-center justify-between p-3 border-b border-border/30 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <LineChart className="w-4 h-4 text-primary" />
                      <h2 className="text-sm font-semibold text-foreground">Scatter Plot Visualization</h2>
                    </div>
                    {xValues.length > 0 && regressionLine && (
                      <span className="text-xs text-muted-foreground font-mono bg-secondary/30 px-2 py-1 rounded">
                        y = {regressionLine.slope.toFixed(3)}x {regressionLine.intercept >= 0 ? "+" : ""} {regressionLine.intercept.toFixed(3)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 p-4" style={{ minHeight: '350px' }}>
                    <ScatterPlot 
                      xValues={xValues} 
                      yValues={yValues} 
                      regressionLine={regressionLine} 
                    />
                  </div>
                </>
              )}

              {viewMode === "scene" && (
                <SceneExplanation 
                  xValues={xValues} 
                  yValues={yValues} 
                />
              )}

              {viewMode === "table" && (
                <PearsonTable 
                  xValues={xValues} 
                  yValues={yValues} 
                />
              )}
            </div>
          </div>

          {/* Right panel - Solution/Learn (25%) */}
          <div 
            className={`flex-shrink-0 border-l border-border/30 glass transition-all duration-300 overflow-hidden ${
              rightPanelOpen ? "w-80" : "w-0"
            }`}
            style={{ maxWidth: rightPanelOpen ? '25%' : 0 }}
          >
            {rightPanelOpen && (
              <div className="h-full flex flex-col">
                {/* Panel mode tabs */}
                <div className="p-3 border-b border-border/30">
                  <Tabs value={rightPanelMode} onValueChange={(v) => setRightPanelMode(v as RightPanelMode)}>
                    <TabsList className="w-full bg-secondary/30 border border-border/30">
                      <TabsTrigger 
                        value="solution" 
                        className="flex-1 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                      >
                        <Calculator className="w-3.5 h-3.5 mr-1.5" />
                        Solution
                      </TabsTrigger>
                      <TabsTrigger 
                        value="learn" 
                        className="flex-1 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                      >
                        <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                        Learn
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Panel content */}
                <div className="flex-1 overflow-hidden">
                  {rightPanelMode === "solution" ? (
                    <SolutionPanel 
                      xValues={xValues} 
                      yValues={yValues} 
                      onRegressionCalculated={handleRegressionCalculated}
                    />
                  ) : (
                    <LearnPanel xValues={xValues} yValues={yValues} />
                  )}
                </div>
              </div>
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
            <div className="flex-1 p-4 flex flex-col">
              {/* Mobile view mode tabs */}
              <div className="mb-3">
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                  <TabsList className="w-full bg-secondary/30 border border-border/30">
                    <TabsTrigger value="graph" className="flex-1 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      Graph
                    </TabsTrigger>
                    <TabsTrigger value="scene" className="flex-1 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      Scene
                    </TabsTrigger>
                    <TabsTrigger value="table" className="flex-1 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      Table
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex-1 min-h-0 glass rounded-xl border border-border/30 overflow-hidden">
                {viewMode === "graph" && (
                  <div className="h-full p-4">
                    <ScatterPlot 
                      xValues={xValues} 
                      yValues={yValues} 
                      regressionLine={regressionLine} 
                    />
                  </div>
                )}
                {viewMode === "scene" && (
                  <SceneExplanation xValues={xValues} yValues={yValues} />
                )}
                {viewMode === "table" && (
                  <PearsonTable xValues={xValues} yValues={yValues} />
                )}
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

// Learn Panel Component
function LearnPanel({ xValues, yValues }: { xValues: number[]; yValues: number[] }) {
  const hasData = xValues.length >= 2

  const concepts = [
    {
      title: "What is Correlation?",
      content: "Correlation measures the strength and direction of a linear relationship between two variables. It ranges from -1 (perfect negative) to +1 (perfect positive), with 0 indicating no linear relationship.",
    },
    {
      title: "Pearson Correlation Coefficient (r)",
      content: "The Pearson r is calculated by dividing the covariance of X and Y by the product of their standard deviations. It standardizes the measure to always fall between -1 and +1.",
      formula: "r = Σ(x-x̄)(y-ȳ) / √[Σ(x-x̄)²·Σ(y-ȳ)²]",
    },
    {
      title: "Coefficient of Determination (R²)",
      content: "R² represents the proportion of variance in Y that can be explained by the linear relationship with X. If r = 0.8, then R² = 0.64, meaning 64% of Y's variance is explained.",
      formula: "R² = r²",
    },
    {
      title: "Linear Regression",
      content: "Linear regression finds the best-fit line y = mx + b that minimizes the sum of squared residuals (vertical distances from points to the line).",
      formula: "m = Σ(x-x̄)(y-ȳ)/Σ(x-x̄)², b = ȳ - mx̄",
    },
    {
      title: "Interpreting Correlation Strength",
      content: "|r| ≥ 0.9: Very strong\n|r| ≥ 0.7: Strong\n|r| ≥ 0.5: Moderate\n|r| ≥ 0.3: Weak\n|r| < 0.3: Very weak",
    },
  ]

  if (!hasData) {
    return (
      <div className="h-full flex flex-col p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary/50" />
            </div>
            <p className="text-sm text-muted-foreground">Enter data to see contextual explanations</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto p-4">
      <div className="space-y-4">
        {concepts.map((concept, i) => (
          <div key={i} className="glass rounded-lg p-4 border border-border/30">
            <h3 className="text-sm font-semibold text-foreground mb-2">{concept.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{concept.content}</p>
            {concept.formula && (
              <div className="mt-2 p-2 bg-secondary/30 rounded font-mono text-xs text-primary">
                {concept.formula}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ClutchApp() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm text-muted-foreground">Loading C.L.U.T.C.H...</span>
        </div>
      </div>
    }>
      <ClutchAppContent />
    </Suspense>
  )
}
