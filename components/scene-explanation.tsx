"use client"
//Developed by shaikh Abdul Hakim
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Volume2, VolumeX, Maximize2 } from "lucide-react"

interface SceneExplanationProps {
  xValues: number[]
  yValues: number[]
  onSceneChange?: (sceneIndex: number) => void
}

interface Scene {
  id: number
  title: string
  description: string
  conceptExplanation: string
  mathExplanation: string
  showPoints: boolean
  showMeans: boolean
  showDeviations: boolean
  showRegression: boolean
  showResiduals: boolean
  showCorrelation: boolean
  highlightFormula?: string
}

const SCENES: Scene[] = [
  {
    id: 1,
    title: "Data Points Visualization",
    description: "Each point represents a paired observation (xᵢ, yᵢ) from your dataset.",
    conceptExplanation: "In correlation analysis, we examine pairs of measurements. Each data point represents a single observation where we've measured two variables simultaneously. The position on the x-axis shows one variable's value, and the y-axis shows the other.",
    mathExplanation: "Given n data pairs: (x₁, y₁), (x₂, y₂), ..., (xₙ, yₙ)",
    showPoints: true,
    showMeans: false,
    showDeviations: false,
    showRegression: false,
    showResiduals: false,
    showCorrelation: false,
  },
  {
    id: 2,
    title: "Calculate Means (Central Tendency)",
    description: "The means x̄ and ȳ represent the center of our data distribution.",
    conceptExplanation: "The arithmetic mean is the 'balance point' of the data. It tells us where the center of each variable's distribution lies. The mean lines divide our scatter plot into four quadrants.",
    mathExplanation: "x̄ = (Σxᵢ) / n\nȳ = (Σyᵢ) / n",
    showPoints: true,
    showMeans: true,
    showDeviations: false,
    showRegression: false,
    showResiduals: false,
    showCorrelation: false,
    highlightFormula: "mean",
  },
  {
    id: 3,
    title: "Measure Deviations from Mean",
    description: "Deviations show how far each point is from its respective mean.",
    conceptExplanation: "For each point, we calculate its deviation: how far it lies from the mean in both x and y directions. Points in opposite quadrants (relative to the means) contribute negatively to correlation, while points in the same quadrant contribute positively.",
    mathExplanation: "(xᵢ - x̄) = deviation of xᵢ from mean\n(yᵢ - ȳ) = deviation of yᵢ from mean",
    showPoints: true,
    showMeans: true,
    showDeviations: true,
    showRegression: false,
    showResiduals: false,
    showCorrelation: false,
    highlightFormula: "deviation",
  },
  {
    id: 4,
    title: "Calculate Products of Deviations",
    description: "The product (xᵢ - x̄)(yᵢ - ȳ) determines the direction of correlation.",
    conceptExplanation: "When both deviations have the same sign (both positive or both negative), the product is positive—contributing to positive correlation. When they have opposite signs, the product is negative—contributing to negative correlation.",
    mathExplanation: "Product = (xᵢ - x̄)(yᵢ - ȳ)\nΣ(xᵢ - x̄)(yᵢ - ȳ) = Sum of products",
    showPoints: true,
    showMeans: true,
    showDeviations: true,
    showRegression: false,
    showResiduals: false,
    showCorrelation: false,
    highlightFormula: "product",
  },
  {
    id: 5,
    title: "Fit the Regression Line",
    description: "The best-fit line minimizes the sum of squared vertical distances.",
    conceptExplanation: "Linear regression finds the line y = mx + b that best represents the relationship. 'Best' means the line that minimizes the total squared error—the sum of squared vertical distances from points to the line.",
    mathExplanation: "Slope: m = Σ(xᵢ - x̄)(yᵢ - ȳ) / Σ(xᵢ - x̄)²\nIntercept: b = ȳ - m·x̄",
    showPoints: true,
    showMeans: false,
    showDeviations: false,
    showRegression: true,
    showResiduals: false,
    showCorrelation: false,
    highlightFormula: "regression",
  },
  {
    id: 6,
    title: "Visualize Residuals (Errors)",
    description: "Residuals are the vertical distances between actual and predicted values.",
    conceptExplanation: "Each residual eᵢ = yᵢ - ŷᵢ measures how much the actual y value differs from what the regression line predicts. Smaller residuals mean a better fit. The sum of squared residuals (SSE) measures overall model error.",
    mathExplanation: "Residual: eᵢ = yᵢ - (m·xᵢ + b)\nSSE = Σeᵢ² = Σ(yᵢ - ŷᵢ)²",
    showPoints: true,
    showMeans: false,
    showDeviations: false,
    showRegression: true,
    showResiduals: true,
    showCorrelation: false,
    highlightFormula: "residual",
  },
  {
    id: 7,
    title: "Correlation Coefficient Result",
    description: "The Pearson r quantifies the strength and direction of linear relationship.",
    conceptExplanation: "The correlation coefficient r ranges from -1 to +1. Values near ±1 indicate strong linear relationships, while values near 0 indicate weak or no linear relationship. R² (coefficient of determination) tells us what percentage of variance is explained.",
    mathExplanation: "r = Σ(xᵢ - x̄)(yᵢ - ȳ) / √[Σ(xᵢ - x̄)² · Σ(yᵢ - ȳ)²]\nR² = r² (proportion of variance explained)",
    showPoints: true,
    showMeans: false,
    showDeviations: false,
    showRegression: true,
    showResiduals: false,
    showCorrelation: true,
    highlightFormula: "correlation",
  },
]

// Sample data for demonstration when no data is provided
const SAMPLE_X = [2, 4, 5, 7, 9, 11]
const SAMPLE_Y = [3, 5, 7, 8, 11, 13]

export function SceneExplanation({ xValues, yValues, onSceneChange }: SceneExplanationProps) {
  const [currentScene, setCurrentScene] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Use sample data if no data provided
  const dataX = xValues.length >= 2 ? xValues : SAMPLE_X
  const dataY = yValues.length >= 2 ? yValues : SAMPLE_Y
  const usingSampleData = xValues.length < 2
  
  // Safe scene access with fallback
  const scene = SCENES[currentScene] || SCENES[0]
  const hasData = true // Always have data (either user or sample)

  // Calculate statistics using dataX/dataY (which includes fallback to sample)
  const stats = useCallback(() => {
    const n = dataX.length
    const meanX = dataX.reduce((a, b) => a + b, 0) / n
    const meanY = dataY.reduce((a, b) => a + b, 0) / n

    let sumXY = 0
    let sumX2 = 0
    let sumY2 = 0

    for (let i = 0; i < n; i++) {
      const dx = dataX[i] - meanX
      const dy = dataY[i] - meanY
      sumXY += dx * dy
      sumX2 += dx * dx
      sumY2 += dy * dy
    }

    const slope = sumX2 !== 0 ? sumXY / sumX2 : 0
    const intercept = meanY - slope * meanX
    const r = sumX2 !== 0 && sumY2 !== 0 ? sumXY / Math.sqrt(sumX2 * sumY2) : 0

    return { n, meanX, meanY, slope, intercept, r, sumXY, sumX2, sumY2 }
  }, [dataX, dataY])

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setAnimationProgress((prev) => {
        if (prev >= 1) {
          // Move to next scene after completion
          setTimeout(() => {
            if (currentScene < SCENES.length - 1) {
              setCurrentScene((s) => s + 1)
              setAnimationProgress(0)
            } else {
              setIsPlaying(false)
            }
          }, 1000)
          return 1
        }
        return prev + 0.01
      })
    }, 30)

    return () => clearInterval(interval)
  }, [isPlaying, currentScene])

  // Reset animation on scene change
  useEffect(() => {
    setAnimationProgress(0)
    onSceneChange?.(currentScene)
  }, [currentScene, onSceneChange])

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = 60
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    ctx.clearRect(0, 0, width, height)

    const statistics = stats()
    if (!statistics) return

    const { meanX, meanY, slope, intercept, r } = statistics

    // Calculate scales using dataX/dataY
    const xMin = Math.min(...dataX) - 1
    const xMax = Math.max(...dataX) + 1
    const yMin = Math.min(...dataY) - 1
    const yMax = Math.max(...dataY) + 1

    const scaleX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * chartWidth
    const scaleY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * chartHeight

    // Draw grid
    ctx.strokeStyle = "rgba(45, 212, 191, 0.08)"
    ctx.lineWidth = 1
    for (let i = 0; i <= 8; i++) {
      const x = padding + (chartWidth / 8) * i
      const y = padding + (chartHeight / 8) * i
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Axis labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
    ctx.font = "12px sans-serif"
    ctx.fillText("X", width - padding + 10, height - padding + 5)
    ctx.fillText("Y", padding - 5, padding - 10)

    // Draw mean lines
    if (scene.showMeans) {
      const alpha = Math.min(1, animationProgress * 2)
      ctx.strokeStyle = `rgba(45, 212, 191, ${alpha * 0.6})`
      ctx.lineWidth = 2
      ctx.setLineDash([8, 8])

      // Mean X line
      ctx.beginPath()
      ctx.moveTo(scaleX(meanX), padding)
      ctx.lineTo(scaleX(meanX), height - padding)
      ctx.stroke()

      // Mean Y line
      ctx.beginPath()
      ctx.moveTo(padding, scaleY(meanY))
      ctx.lineTo(width - padding, scaleY(meanY))
      ctx.stroke()

      ctx.setLineDash([])

      // Labels
      ctx.fillStyle = `rgba(45, 212, 191, ${alpha})`
      ctx.font = "bold 14px JetBrains Mono, monospace"
      ctx.fillText(`x̄ = ${meanX.toFixed(2)}`, scaleX(meanX) + 8, padding + 20)
      ctx.fillText(`ȳ = ${meanY.toFixed(2)}`, width - padding - 80, scaleY(meanY) - 8)
    }

    // Draw regression line
    if (scene.showRegression) {
      const alpha = Math.min(1, animationProgress * 2)
      const x1 = xMin
      const x2 = xMax
      const y1 = slope * x1 + intercept
      const y2 = slope * x2 + intercept

      // Glow layers
      ctx.strokeStyle = `rgba(45, 212, 191, ${alpha * 0.1})`
      ctx.lineWidth = 20
      ctx.beginPath()
      ctx.moveTo(scaleX(x1), scaleY(y1))
      ctx.lineTo(scaleX(x2), scaleY(y2))
      ctx.stroke()

      ctx.strokeStyle = `rgba(45, 212, 191, ${alpha * 0.3})`
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.moveTo(scaleX(x1), scaleY(y1))
      ctx.lineTo(scaleX(x2), scaleY(y2))
      ctx.stroke()

      ctx.strokeStyle = `rgba(94, 234, 212, ${alpha})`
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(scaleX(x1), scaleY(y1))
      ctx.lineTo(scaleX(x2), scaleY(y2))
      ctx.stroke()

      // Equation label
      ctx.fillStyle = `rgba(94, 234, 212, ${alpha})`
      ctx.font = "bold 14px JetBrains Mono, monospace"
      const equation = `y = ${slope.toFixed(3)}x ${intercept >= 0 ? "+" : ""} ${intercept.toFixed(3)}`
      ctx.fillText(equation, width / 2 - 80, padding + 25)
    }

    // Draw deviations
    if (scene.showDeviations) {
      dataX.forEach((x, i) => {
        const y = dataY[i]
        const alpha = Math.min(1, animationProgress * 3 - i * 0.2)
        if (alpha <= 0) return

        ctx.strokeStyle = `rgba(255, 180, 100, ${alpha * 0.7})`
        ctx.lineWidth = 1.5
        ctx.setLineDash([4, 4])

        // X deviation (horizontal to mean line)
        ctx.beginPath()
        ctx.moveTo(scaleX(x), scaleY(y))
        ctx.lineTo(scaleX(meanX), scaleY(y))
        ctx.stroke()

        // Y deviation (vertical to mean line)
        ctx.beginPath()
        ctx.moveTo(scaleX(x), scaleY(y))
        ctx.lineTo(scaleX(x), scaleY(meanY))
        ctx.stroke()

        ctx.setLineDash([])
      })
    }

    // Draw residuals
    if (scene.showResiduals) {
      dataX.forEach((x, i) => {
        const y = dataY[i]
        const predictedY = slope * x + intercept
        const alpha = Math.min(1, animationProgress * 3 - i * 0.2)
        if (alpha <= 0) return

        ctx.strokeStyle = `rgba(255, 100, 100, ${alpha * 0.8})`
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(scaleX(x), scaleY(y))
        ctx.lineTo(scaleX(x), scaleY(predictedY))
        ctx.stroke()
        ctx.setLineDash([])

        // Residual value label
        const residual = y - predictedY
        ctx.fillStyle = `rgba(255, 100, 100, ${alpha})`
        ctx.font = "10px JetBrains Mono, monospace"
        ctx.fillText(`e=${residual.toFixed(2)}`, scaleX(x) + 5, (scaleY(y) + scaleY(predictedY)) / 2)
      })
    }

    // Draw data points (always last for visibility)
    if (scene.showPoints) {
      dataX.forEach((x, i) => {
        const y = dataY[i]
        const alpha = Math.min(1, animationProgress * 4 - i * 0.15)
        if (alpha <= 0) return

        const px = scaleX(x)
        const py = scaleY(y)

        // Outer glow
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, 25)
        gradient.addColorStop(0, `rgba(34, 211, 238, ${alpha * 0.5})`)
        gradient.addColorStop(1, "rgba(34, 211, 238, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(px, py, 25, 0, Math.PI * 2)
        ctx.fill()

        // Inner point
        ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`
        ctx.beginPath()
        ctx.arc(px, py, 8, 0, Math.PI * 2)
        ctx.fill()

        // Point label
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`
        ctx.font = "11px JetBrains Mono, monospace"
        ctx.fillText(`(${x}, ${y})`, px + 12, py - 12)
      })
    }

    // Draw correlation result
    if (scene.showCorrelation && animationProgress > 0.3) {
      const alpha = (animationProgress - 0.3) / 0.7
      
      // Result box
      const boxWidth = 240
      const boxHeight = 100
      const boxX = width / 2 - boxWidth / 2
      const boxY = height / 2 - boxHeight / 2

      ctx.fillStyle = `rgba(15, 15, 25, ${alpha * 0.95})`
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight)
      ctx.strokeStyle = `rgba(45, 212, 191, ${alpha * 0.6})`
      ctx.lineWidth = 2
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight)

      // Correlation value
      ctx.fillStyle = `rgba(45, 212, 191, ${alpha})`
      ctx.font = "bold 32px JetBrains Mono, monospace"
      ctx.textAlign = "center"
      ctx.fillText(`r = ${r.toFixed(4)}`, width / 2, boxY + 45)

      // Interpretation
      const rAbs = Math.abs(r)
      let strength = "Very Weak"
      let color = "rgba(255, 100, 100, 1)"
      if (rAbs >= 0.9) { strength = "Very Strong"; color = "rgba(100, 255, 150, 1)" }
      else if (rAbs >= 0.7) { strength = "Strong"; color = "rgba(150, 255, 150, 1)" }
      else if (rAbs >= 0.5) { strength = "Moderate"; color = "rgba(255, 220, 100, 1)" }
      else if (rAbs >= 0.3) { strength = "Weak"; color = "rgba(255, 150, 100, 1)" }

      ctx.fillStyle = color.replace("1)", `${alpha})`)
      ctx.font = "16px sans-serif"
      ctx.fillText(`${strength} ${r >= 0 ? "Positive" : "Negative"}`, width / 2, boxY + 75)
      ctx.textAlign = "left"

      // R² value
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`
      ctx.font = "14px JetBrains Mono, monospace"
      ctx.fillText(`R² = ${(r * r * 100).toFixed(2)}%`, boxX + 10, boxY + boxHeight + 25)
    }
  }, [dataX, dataY, scene, animationProgress, stats])

  const goToScene = (index: number) => {
    setCurrentScene(Math.max(0, Math.min(SCENES.length - 1, index)))
    setAnimationProgress(0)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div ref={containerRef} className="h-full flex flex-col bg-background">
      {/* Canvas visualization */}
      <div className="flex-1 relative min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        {/* Scene info overlay */}
        <div className="absolute top-4 left-4 right-4">
          <div className="glass rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center">
                {scene.id}
              </span>
              <h3 className="text-sm font-semibold text-foreground">{scene.title}</h3>
              {usingSampleData && (
                <span className="ml-auto text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                  Sample Data
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{scene.description}</p>
          </div>
        </div>
      </div>

      {/* Explanation panel */}
      <div className="flex-shrink-0 border-t border-border/30 p-4 glass-strong">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-secondary/30 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-primary mb-2">Concept</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{scene.conceptExplanation}</p>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-accent mb-2">Mathematics</h4>
            <pre className="text-xs text-accent/80 font-mono whitespace-pre-wrap">{scene.mathExplanation}</pre>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToScene(currentScene - 1)}
              disabled={currentScene === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-8 w-8 p-0"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToScene(currentScene + 1)}
              disabled={currentScene === SCENES.length - 1}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { goToScene(0); setAnimationProgress(0) }}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress indicators */}
          <div className="flex items-center gap-1.5">
            {SCENES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToScene(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentScene 
                    ? "w-6 bg-primary" 
                    : i < currentScene 
                    ? "w-1.5 bg-primary/50" 
                    : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 w-8 p-0"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
