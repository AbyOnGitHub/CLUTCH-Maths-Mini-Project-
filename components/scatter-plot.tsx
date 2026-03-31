"use client"

import { useMemo } from "react"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ZAxis,
} from "recharts"

interface ScatterPlotProps {
  xValues: number[]
  yValues: number[]
  regressionLine?: { slope: number; intercept: number } | null
}

export function ScatterPlot({ xValues, yValues, regressionLine }: ScatterPlotProps) {
  const data = useMemo(() => {
    return xValues.map((x, i) => ({
      x,
      y: yValues[i],
    }))
  }, [xValues, yValues])

  const xDomain = useMemo(() => {
    if (xValues.length === 0) return [0, 10]
    const min = Math.min(...xValues)
    const max = Math.max(...xValues)
    const padding = (max - min) * 0.15 || 1
    return [min - padding, max + padding]
  }, [xValues])

  const yDomain = useMemo(() => {
    if (yValues.length === 0) return [0, 10]
    const min = Math.min(...yValues)
    const max = Math.max(...yValues)
    const padding = (max - min) * 0.15 || 1
    return [min - padding, max + padding]
  }, [yValues])

  // Calculate regression line endpoints for the reference line
  const regressionSegment = useMemo(() => {
    if (!regressionLine || xValues.length === 0) return null
    
    const minX = Math.min(...xValues)
    const maxX = Math.max(...xValues)
    const padding = (maxX - minX) * 0.1
    
    const x1 = minX - padding
    const x2 = maxX + padding
    const y1 = regressionLine.slope * x1 + regressionLine.intercept
    const y2 = regressionLine.slope * x2 + regressionLine.intercept
    
    return { x1, y1, x2, y2 }
  }, [regressionLine, xValues])

  if (xValues.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary/50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="6" cy="18" r="2" />
              <circle cx="10" cy="10" r="2" />
              <circle cx="14" cy="14" r="2" />
              <circle cx="18" cy="6" r="2" />
              <path d="M4 20l16-16" strokeDasharray="2 2" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Enter data to visualize</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Your scatter plot will appear here
          </p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(45, 212, 191)" stopOpacity={0.3} />
            <stop offset="50%" stopColor="rgb(45, 212, 191)" stopOpacity={1} />
            <stop offset="100%" stopColor="rgb(34, 211, 238)" stopOpacity={0.3} />
          </linearGradient>
          <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgb(34, 211, 238)" stopOpacity={1} />
            <stop offset="100%" stopColor="rgb(34, 211, 238)" stopOpacity={0.6} />
          </radialGradient>
        </defs>
        
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          vertical={true}
          horizontal={true}
        />
        
        <XAxis
          dataKey="x"
          type="number"
          domain={xDomain}
          tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
          tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          name="X"
          label={{
            value: "X",
            position: "bottom",
            fill: "rgba(255,255,255,0.5)",
            fontSize: 12,
            offset: 0,
          }}
        />
        
        <YAxis
          dataKey="y"
          type="number"
          domain={yDomain}
          tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
          tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          name="Y"
          label={{
            value: "Y",
            angle: -90,
            position: "insideLeft",
            fill: "rgba(255,255,255,0.5)",
            fontSize: 12,
          }}
        />

        <ZAxis range={[80, 80]} />
        
        <Tooltip
          cursor={{ strokeDasharray: '3 3', stroke: 'rgba(45, 212, 191, 0.3)' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const point = payload[0].payload
              return (
                <div className="glass-strong rounded-lg px-3 py-2 text-xs shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">X:</span>
                    <span className="text-primary font-mono font-medium">{point.x?.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Y:</span>
                    <span className="text-accent font-mono font-medium">{point.y?.toFixed(2)}</span>
                  </div>
                </div>
              )
            }
            return null
          }}
        />

        {/* Regression line as ReferenceLine */}
        {regressionSegment && (
          <ReferenceLine
            segment={[
              { x: regressionSegment.x1, y: regressionSegment.y1 },
              { x: regressionSegment.x2, y: regressionSegment.y2 },
            ]}
            stroke="rgb(45, 212, 191)"
            strokeWidth={2}
            strokeOpacity={0.8}
            filter="url(#glow)"
          />
        )}

        {/* Data points */}
        <Scatter
          data={data}
          fill="url(#dotGradient)"
          filter="url(#glow)"
          isAnimationActive={true}
          animationDuration={800}
        />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
