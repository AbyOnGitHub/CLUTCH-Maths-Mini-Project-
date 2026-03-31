//Developed by Soham Dugade 24101A0037 INFT-A
"use client"
import { useMemo, useEffect } from "react"
import { Calculator, TrendingUp, Activity, Lightbulb, ChevronRight, BarChart3 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SolutionPanelProps {
  xValues: number[]
  yValues: number[]
  onRegressionCalculated?: (line: { slope: number; intercept: number } | null) => void
}

interface Step {
  title: string
  formula?: string
  calculation: string
  result: string
}

export function SolutionPanel({ xValues, yValues, onRegressionCalculated }: SolutionPanelProps) {
  const analysis = useMemo(() => {
    if (xValues.length < 2) return null

    const n = xValues.length

    // Calculate means
    const meanX = xValues.reduce((a, b) => a + b, 0) / n
    const meanY = yValues.reduce((a, b) => a + b, 0) / n

    // Calculate sums for correlation and regression
    let sumXY = 0
    let sumX2 = 0
    let sumY2 = 0
    let sumXX = 0
    let sumYY = 0

    for (let i = 0; i < n; i++) {
      sumXY += xValues[i] * yValues[i]
      sumX2 += xValues[i] * xValues[i]
      sumY2 += yValues[i] * yValues[i]
      sumXX += (xValues[i] - meanX) * (xValues[i] - meanX)
      sumYY += (yValues[i] - meanY) * (yValues[i] - meanY)
    }

    const sumX = xValues.reduce((a, b) => a + b, 0)
    const sumY = yValues.reduce((a, b) => a + b, 0)

    // Pearson correlation coefficient
    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
    const r = denominator !== 0 ? numerator / denominator : 0

    // R-squared
    const rSquared = r * r

    // Linear regression (least squares)
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    // Standard error
    let ssResidual = 0
    for (let i = 0; i < n; i++) {
      const predicted = slope * xValues[i] + intercept
      ssResidual += (yValues[i] - predicted) * (yValues[i] - predicted)
    }
    const standardError = Math.sqrt(ssResidual / (n - 2))

    return {
      n,
      meanX,
      meanY,
      sumX,
      sumY,
      sumXY,
      sumX2,
      sumY2,
      r,
      rSquared,
      slope,
      intercept,
      standardError,
    }
  }, [xValues, yValues])

  // Notify parent of regression line changes
  useEffect(() => {
    if (analysis && onRegressionCalculated) {
      onRegressionCalculated({ slope: analysis.slope, intercept: analysis.intercept })
    } else if (!analysis && onRegressionCalculated) {
      onRegressionCalculated(null)
    }
  }, [analysis, onRegressionCalculated])

  const getCorrelationStrength = (r: number) => {
    const abs = Math.abs(r)
    if (abs >= 0.9) return { text: "Very Strong", color: "text-green-400" }
    if (abs >= 0.7) return { text: "Strong", color: "text-emerald-400" }
    if (abs >= 0.5) return { text: "Moderate", color: "text-yellow-400" }
    if (abs >= 0.3) return { text: "Weak", color: "text-orange-400" }
    return { text: "Very Weak", color: "text-red-400" }
  }

  const getCorrelationDirection = (r: number) => {
    if (r > 0.1) return "Positive"
    if (r < -0.1) return "Negative"
    return "No"
  }

  if (!analysis) {
    return (
      <div className="h-full flex flex-col p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Analysis</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary/50 flex items-center justify-center">
              <Activity className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Waiting for data</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Enter at least 2 data points
            </p>
          </div>
        </div>
      </div>
    )
  }

  const correlationInfo = getCorrelationStrength(analysis.r)

  const steps: Step[] = [
    {
      title: "Step 1: Calculate Means",
      formula: "x̄ = Σx/n, ȳ = Σy/n",
      calculation: `x̄ = ${analysis.sumX.toFixed(2)}/${analysis.n} = ${analysis.meanX.toFixed(4)}\nȳ = ${analysis.sumY.toFixed(2)}/${analysis.n} = ${analysis.meanY.toFixed(4)}`,
      result: `x̄ = ${analysis.meanX.toFixed(4)}, ȳ = ${analysis.meanY.toFixed(4)}`,
    },
    {
      title: "Step 2: Calculate Σxy, Σx², Σy²",
      formula: "Sum of products and squares",
      calculation: `Σxy = ${analysis.sumXY.toFixed(4)}\nΣx² = ${analysis.sumX2.toFixed(4)}\nΣy² = ${analysis.sumY2.toFixed(4)}`,
      result: `Σxy = ${analysis.sumXY.toFixed(4)}`,
    },
    {
      title: "Step 3: Correlation Coefficient (r)",
      formula: "r = [nΣxy - (Σx)(Σy)] / √[(nΣx² - (Σx)²)(nΣy² - (Σy)²)]",
      calculation: `r = [${analysis.n} × ${analysis.sumXY.toFixed(2)} - ${analysis.sumX.toFixed(2)} × ${analysis.sumY.toFixed(2)}] / √[...]`,
      result: `r = ${analysis.r.toFixed(6)}`,
    },
    {
      title: "Step 4: Coefficient of Determination (R²)",
      formula: "R² = r²",
      calculation: `R² = (${analysis.r.toFixed(6)})²`,
      result: `R² = ${analysis.rSquared.toFixed(6)} (${(analysis.rSquared * 100).toFixed(2)}%)`,
    },
    {
      title: "Step 5: Regression Line",
      formula: "y = mx + b where m = slope, b = y-intercept",
      calculation: `m = (nΣxy - ΣxΣy) / (nΣx² - (Σx)²)\nb = (Σy - mΣx) / n`,
      result: `y = ${analysis.slope.toFixed(4)}x ${analysis.intercept >= 0 ? "+" : ""} ${analysis.intercept.toFixed(4)}`,
    },
  ]

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Step-by-Step Analysis</h2>
      </div>

      <ScrollArea className="flex-1 -mr-4 pr-4">
        {/* Summary Card */}
        <div className="glass rounded-lg p-4 mb-4 border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">Quick Summary</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/30 rounded-lg p-3">
              <div className="text-[10px] text-muted-foreground mb-1">Correlation (r)</div>
              <div className="text-lg font-bold text-primary font-mono">{analysis.r.toFixed(4)}</div>
              <div className={`text-[10px] ${correlationInfo.color}`}>
                {getCorrelationDirection(analysis.r)} • {correlationInfo.text}
              </div>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              <div className="text-[10px] text-muted-foreground mb-1">R-Squared</div>
              <div className="text-lg font-bold text-accent font-mono">{(analysis.rSquared * 100).toFixed(2)}%</div>
              <div className="text-[10px] text-muted-foreground">Variance Explained</div>
            </div>
          </div>
          <div className="mt-3 p-2 bg-secondary/20 rounded text-xs">
            <span className="font-mono text-primary">y = {analysis.slope.toFixed(4)}x {analysis.intercept >= 0 ? "+" : ""} {analysis.intercept.toFixed(4)}</span>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="glass rounded-lg p-3 border border-border/30 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded bg-primary/20 text-primary text-[10px] flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <span className="text-xs font-medium text-foreground">{step.title.replace(/Step \d+: /, "")}</span>
              </div>
              
              {step.formula && (
                <div className="text-[10px] text-muted-foreground font-mono mb-2 bg-secondary/30 rounded px-2 py-1">
                  {step.formula}
                </div>
              )}
              
              <div className="text-[11px] text-muted-foreground font-mono whitespace-pre-line mb-2">
                {step.calculation}
              </div>
              
              <div className="flex items-center gap-1 text-xs">
                <ChevronRight className="w-3 h-3 text-primary" />
                <span className="text-primary font-mono font-medium">{step.result}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Insight */}
        <div className="mt-4 glass rounded-lg p-4 border border-accent/30">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium text-accent">Insight</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {Math.abs(analysis.r) >= 0.7 ? (
              <>
                There is a <span className={correlationInfo.color}>{correlationInfo.text.toLowerCase()}</span>{" "}
                {analysis.r > 0 ? "positive" : "negative"} linear relationship between X and Y.{" "}
                {(analysis.rSquared * 100).toFixed(1)}% of the variance in Y can be explained by X.
                {analysis.r > 0 
                  ? " As X increases, Y tends to increase."
                  : " As X increases, Y tends to decrease."}
              </>
            ) : Math.abs(analysis.r) >= 0.3 ? (
              <>
                There is a <span className={correlationInfo.color}>{correlationInfo.text.toLowerCase()}</span>{" "}
                {analysis.r > 0 ? "positive" : "negative"} relationship. Only{" "}
                {(analysis.rSquared * 100).toFixed(1)}% of the variance is explained,
                suggesting other factors may influence Y.
              </>
            ) : (
              <>
                There is <span className={correlationInfo.color}>little to no linear relationship</span> between
                X and Y. The regression line may not be meaningful for predictions.
              </>
            )}
          </p>
        </div>

        {/* Data Summary */}
        <div className="mt-4 glass rounded-lg p-4 border border-border/30">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Data Summary</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sample Size:</span>
              <span className="font-mono">{analysis.n}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Std Error:</span>
              <span className="font-mono">{analysis.standardError.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slope (m):</span>
              <span className="font-mono">{analysis.slope.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Intercept (b):</span>
              <span className="font-mono">{analysis.intercept.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
