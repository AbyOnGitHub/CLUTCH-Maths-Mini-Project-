"use client"
//Developed by shaikh Abdul Hakim
import { useMemo, useState } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Table } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PearsonTableProps {
  xValues: number[]
  yValues: number[]
}

type TheoryMode = "beginner" | "exam"

// Sample data when no user data is provided
const SAMPLE_X = [2, 4, 5, 7, 9, 11]
const SAMPLE_Y = [3, 5, 7, 8, 11, 13]

export function PearsonTable({ xValues, yValues }: PearsonTableProps) {
  const [theoryMode, setTheoryMode] = useState<TheoryMode>("beginner")
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null)

  // Use sample data if no data provided
  const dataX = xValues.length >= 2 ? xValues : SAMPLE_X
  const dataY = yValues.length >= 2 ? yValues : SAMPLE_Y
  const usingSampleData = xValues.length < 2

  const calculations = useMemo(() => {
    const n = dataX.length
    const sumX = dataX.reduce((a, b) => a + b, 0)
    const sumY = dataY.reduce((a, b) => a + b, 0)
    const meanX = sumX / n
    const meanY = sumY / n

    const rows = dataX.map((x, i) => {
      const y = dataY[i]
      const xMinusMeanX = x - meanX
      const yMinusMeanY = y - meanY
      const product = xMinusMeanX * yMinusMeanY
      const xMinusMeanX2 = xMinusMeanX * xMinusMeanX
      const yMinusMeanY2 = yMinusMeanY * yMinusMeanY

      return {
        i: i + 1,
        x,
        y,
        xMinusMeanX,
        yMinusMeanY,
        product,
        xMinusMeanX2,
        yMinusMeanY2,
      }
    })

    // Calculate totals
    const sumProduct = rows.reduce((a, r) => a + r.product, 0)
    const sumXMinusMeanX2 = rows.reduce((a, r) => a + r.xMinusMeanX2, 0)
    const sumYMinusMeanY2 = rows.reduce((a, r) => a + r.yMinusMeanY2, 0)

    // Correlation coefficient
    const r = sumXMinusMeanX2 !== 0 && sumYMinusMeanY2 !== 0
      ? sumProduct / Math.sqrt(sumXMinusMeanX2 * sumYMinusMeanY2)
      : 0

    // Regression
    const slope = sumXMinusMeanX2 !== 0 ? sumProduct / sumXMinusMeanX2 : 0
    const intercept = meanY - slope * meanX

    return {
      n,
      sumX,
      sumY,
      meanX,
      meanY,
      rows,
      sumProduct,
      sumXMinusMeanX2,
      sumYMinusMeanY2,
      r,
      rSquared: r * r,
      slope,
      intercept,
    }
  }, [dataX, dataY])

  

  const theoryContent = {
    beginner: {
      step1: "The mean (average) tells us the central value. We divide the sum by the count.",
      step2: "Deviation shows how far each value is from the average. Subtract the mean from each value.",
      step3: "The product of deviations reveals relationship direction. Same signs = positive correlation.",
      step4: "Squaring removes negative signs and emphasizes larger deviations.",
      step5: "The formula standardizes the relationship to a -1 to +1 scale.",
      interpretation: `A correlation of ${calculations.r.toFixed(4)} means the variables ${
        Math.abs(calculations.r) > 0.7 ? "have a strong" :
        Math.abs(calculations.r) > 0.4 ? "have a moderate" : "have a weak"
      } ${calculations.r >= 0 ? "positive" : "negative"} relationship.`,
    },
    exam: {
      step1: "Mean: x̄ = Σxᵢ/n, ȳ = Σyᵢ/n. This gives us the first moment (central tendency) of the distribution.",
      step2: "Deviation (xᵢ - x̄) represents the signed distance from mean. Note: Σ(xᵢ - x̄) = 0 always.",
      step3: "Covariance = Σ(xᵢ - x̄)(yᵢ - ȳ)/(n-1) measures joint variability. Used in numerator of r.",
      step4: "Variance = Σ(xᵢ - x̄)²/(n-1). The sum of squared deviations (SS) appears in denominator.",
      step5: "Pearson r = Cov(X,Y)/(Sₓ·Sᵧ) = Σ(xᵢ-x̄)(yᵢ-ȳ)/√[Σ(xᵢ-x̄)²·Σ(yᵢ-ȳ)²]",
      interpretation: `r = ${calculations.r.toFixed(6)}, R² = ${(calculations.rSquared * 100).toFixed(2)}%. The coefficient of determination (R²) indicates ${(calculations.rSquared * 100).toFixed(1)}% of variance in Y is explained by the linear relationship with X. Standard error of estimate measures prediction accuracy.`,
    },
  }

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Karl Pearson Correlation Table</h2>
          {usingSampleData && (
            <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
              Sample Data
            </span>
          )}
        </div>
        
        <Tabs value={theoryMode} onValueChange={(v) => setTheoryMode(v as TheoryMode)}>
          <TabsList className="h-7 bg-secondary/30 border border-border/30">
            <TabsTrigger value="beginner" className="text-[10px] h-5 px-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Beginner
            </TabsTrigger>
            <TabsTrigger value="exam" className="text-[10px] h-5 px-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Exam-Ready
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-secondary/30 rounded-lg p-2 text-center">
          <div className="text-[10px] text-muted-foreground">n</div>
          <div className="text-sm font-bold text-foreground font-mono">{calculations.n}</div>
        </div>
        <div className="bg-secondary/30 rounded-lg p-2 text-center">
          <div className="text-[10px] text-muted-foreground">x̄</div>
          <div className="text-sm font-bold text-primary font-mono">{calculations.meanX.toFixed(2)}</div>
        </div>
        <div className="bg-secondary/30 rounded-lg p-2 text-center">
          <div className="text-[10px] text-muted-foreground">ȳ</div>
          <div className="text-sm font-bold text-accent font-mono">{calculations.meanY.toFixed(2)}</div>
        </div>
        <div className="bg-secondary/30 rounded-lg p-2 text-center">
          <div className="text-[10px] text-muted-foreground">r</div>
          <div className="text-sm font-bold text-primary font-mono">{calculations.r.toFixed(4)}</div>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 min-h-0 glass rounded-lg border border-border/30 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="min-w-[700px]">
            <table className="w-full text-xs">
              <thead className="bg-secondary/50 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground border-b border-border/30">#</th>
                  <th className="px-3 py-2 text-right font-semibold text-primary border-b border-border/30">X</th>
                  <th className="px-3 py-2 text-right font-semibold text-accent border-b border-border/30">Y</th>
                  <th className="px-3 py-2 text-right font-semibold text-primary/70 border-b border-border/30">x - x̄</th>
                  <th className="px-3 py-2 text-right font-semibold text-accent/70 border-b border-border/30">y - ȳ</th>
                  <th className="px-3 py-2 text-right font-semibold text-yellow-400/80 border-b border-border/30">(x-x̄)(y-ȳ)</th>
                  <th className="px-3 py-2 text-right font-semibold text-primary/60 border-b border-border/30">(x-x̄)²</th>
                  <th className="px-3 py-2 text-right font-semibold text-accent/60 border-b border-border/30">(y-ȳ)²</th>
                </tr>
              </thead>
              <tbody>
                {calculations.rows.map((row, i) => (
                  <tr 
                    key={i}
                    className={`transition-colors ${
                      highlightedRow === i ? "bg-primary/10" : "hover:bg-secondary/30"
                    }`}
                    onMouseEnter={() => setHighlightedRow(i)}
                    onMouseLeave={() => setHighlightedRow(null)}
                  >
                    <td className="px-3 py-2 text-muted-foreground font-mono border-b border-border/20">{row.i}</td>
                    <td className="px-3 py-2 text-right font-mono text-primary border-b border-border/20">{row.x.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right font-mono text-accent border-b border-border/20">{row.y.toFixed(2)}</td>
                    <td className={`px-3 py-2 text-right font-mono border-b border-border/20 ${row.xMinusMeanX >= 0 ? "text-green-400/80" : "text-red-400/80"}`}>
                      {row.xMinusMeanX.toFixed(4)}
                    </td>
                    <td className={`px-3 py-2 text-right font-mono border-b border-border/20 ${row.yMinusMeanY >= 0 ? "text-green-400/80" : "text-red-400/80"}`}>
                      {row.yMinusMeanY.toFixed(4)}
                    </td>
                    <td className={`px-3 py-2 text-right font-mono border-b border-border/20 ${row.product >= 0 ? "text-yellow-400" : "text-orange-400"}`}>
                      {row.product.toFixed(4)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-primary/60 border-b border-border/20">{row.xMinusMeanX2.toFixed(4)}</td>
                    <td className="px-3 py-2 text-right font-mono text-accent/60 border-b border-border/20">{row.yMinusMeanY2.toFixed(4)}</td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="bg-primary/5 font-semibold">
                  <td className="px-3 py-2 text-foreground border-t-2 border-primary/30">Σ</td>
                  <td className="px-3 py-2 text-right font-mono text-primary border-t-2 border-primary/30">{calculations.sumX.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right font-mono text-accent border-t-2 border-primary/30">{calculations.sumY.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right font-mono text-muted-foreground border-t-2 border-primary/30">0.0000</td>
                  <td className="px-3 py-2 text-right font-mono text-muted-foreground border-t-2 border-primary/30">0.0000</td>
                  <td className="px-3 py-2 text-right font-mono text-yellow-400 border-t-2 border-primary/30">{calculations.sumProduct.toFixed(4)}</td>
                  <td className="px-3 py-2 text-right font-mono text-primary/60 border-t-2 border-primary/30">{calculations.sumXMinusMeanX2.toFixed(4)}</td>
                  <td className="px-3 py-2 text-right font-mono text-accent/60 border-t-2 border-primary/30">{calculations.sumYMinusMeanY2.toFixed(4)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Theory Explanation */}
      <div className="mt-4 space-y-3">
        <div className="glass rounded-lg p-3 border border-border/30">
          <h4 className="text-xs font-semibold text-primary mb-2">Formula Breakdown</h4>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-muted-foreground">Step 1 (Means): </span>
              <span className="text-foreground">{theoryContent[theoryMode].step1}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Step 2 (Deviations): </span>
              <span className="text-foreground">{theoryContent[theoryMode].step2}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Step 3 (Products): </span>
              <span className="text-foreground">{theoryContent[theoryMode].step3}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Step 4 (Squares): </span>
              <span className="text-foreground">{theoryContent[theoryMode].step4}</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-3 border border-accent/30">
          <h4 className="text-xs font-semibold text-accent mb-2">Interpretation</h4>
          <p className="text-[11px] text-muted-foreground">{theoryContent[theoryMode].interpretation}</p>
        </div>

        {/* Final Calculation */}
        <div className="glass rounded-lg p-3 border border-primary/30">
          <h4 className="text-xs font-semibold text-primary mb-2">Final Calculation</h4>
          <div className="bg-secondary/30 rounded p-2 font-mono text-xs text-primary overflow-x-auto">
            <div className="mb-1">r = Σ(x-x̄)(y-ȳ) / √[Σ(x-x̄)² × Σ(y-ȳ)²]</div>
            <div className="mb-1">r = {calculations.sumProduct.toFixed(4)} / √[{calculations.sumXMinusMeanX2.toFixed(4)} × {calculations.sumYMinusMeanY2.toFixed(4)}]</div>
            <div className="mb-1">r = {calculations.sumProduct.toFixed(4)} / √[{(calculations.sumXMinusMeanX2 * calculations.sumYMinusMeanY2).toFixed(4)}]</div>
            <div className="mb-1">r = {calculations.sumProduct.toFixed(4)} / {Math.sqrt(calculations.sumXMinusMeanX2 * calculations.sumYMinusMeanY2).toFixed(4)}</div>
            <div className="text-lg font-bold">r = {calculations.r.toFixed(6)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
