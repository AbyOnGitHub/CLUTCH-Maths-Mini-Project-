"use client"

import { useEffect, useRef, useCallback } from "react"

interface Point {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  targetAlpha: number
  hue: number
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointsRef = useRef<Point[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>(0)

  const initPoints = useCallback((width: number, height: number) => {
    const points: Point[] = []
    const numPoints = Math.min(80, Math.floor((width * height) / 15000))

    // Create scatter plot-like distribution with some clustering
    for (let i = 0; i < numPoints; i++) {
      const baseX = Math.random() * width * 0.6 + width * 0.2
      const baseY = Math.random() * height * 0.6 + height * 0.2
      
      // Add noise for scatter effect
      const noise = Math.random() * 100 - 50
      const correlation = 0.7 // positive correlation
      
      points.push({
        x: baseX + noise,
        y: baseY - (baseX - width * 0.5) * correlation * 0.3 + noise * 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 2,
        alpha: Math.random() * 0.5 + 0.3,
        targetAlpha: Math.random() * 0.5 + 0.3,
        hue: Math.random() > 0.7 ? 160 : 195, // Mix of cyan and teal
      })
    }
    return points
  }, [])

  const drawRegressionLine = useCallback(
    (ctx: CanvasRenderingContext2D, points: Point[], width: number, height: number) => {
      if (points.length < 2) return

      // Calculate regression line
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
      const n = points.length

      points.forEach((p) => {
        sumX += p.x
        sumY += p.y
        sumXY += p.x * p.y
        sumX2 += p.x * p.x
      })

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
      const intercept = (sumY - slope * sumX) / n

      // Draw glowing regression line
      const startX = width * 0.1
      const endX = width * 0.9
      const startY = slope * startX + intercept
      const endY = slope * endX + intercept

      // Outer glow
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.strokeStyle = "rgba(45, 212, 191, 0.1)"
      ctx.lineWidth = 20
      ctx.stroke()

      // Mid glow
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.strokeStyle = "rgba(45, 212, 191, 0.2)"
      ctx.lineWidth = 8
      ctx.stroke()

      // Inner glow
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.strokeStyle = "rgba(45, 212, 191, 0.5)"
      ctx.lineWidth = 3
      ctx.stroke()

      // Core line
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.strokeStyle = "rgba(94, 234, 212, 0.9)"
      ctx.lineWidth = 1.5
      ctx.stroke()
    },
    []
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      pointsRef.current = initPoints(rect.width, rect.height)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
    window.addEventListener("mousemove", handleMouseMove)

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Update and draw points
      pointsRef.current.forEach((point, i) => {
        // Subtle movement
        point.x += point.vx
        point.y += point.vy

        // Bounce off edges softly
        if (point.x < rect.width * 0.1 || point.x > rect.width * 0.9) {
          point.vx *= -0.8
        }
        if (point.y < rect.height * 0.1 || point.y > rect.height * 0.9) {
          point.vy *= -0.8
        }

        // Mouse interaction - subtle repulsion
        const dx = point.x - mouseRef.current.x
        const dy = point.y - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const force = (150 - dist) / 150
          point.vx += (dx / dist) * force * 0.1
          point.vy += (dy / dist) * force * 0.1
        }

        // Damping
        point.vx *= 0.99
        point.vy *= 0.99

        // Alpha pulsing
        point.alpha += (point.targetAlpha - point.alpha) * 0.02
        if (Math.random() < 0.01) {
          point.targetAlpha = Math.random() * 0.5 + 0.3
        }

        // Draw glow
        const gradient = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          point.size * 4
        )
        
        if (point.hue === 195) {
          gradient.addColorStop(0, `rgba(34, 211, 238, ${point.alpha})`)
          gradient.addColorStop(0.4, `rgba(34, 211, 238, ${point.alpha * 0.3})`)
          gradient.addColorStop(1, "rgba(34, 211, 238, 0)")
        } else {
          gradient.addColorStop(0, `rgba(45, 212, 191, ${point.alpha})`)
          gradient.addColorStop(0.4, `rgba(45, 212, 191, ${point.alpha * 0.3})`)
          gradient.addColorStop(1, "rgba(45, 212, 191, 0)")
        }

        ctx.beginPath()
        ctx.arc(point.x, point.y, point.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw core
        ctx.beginPath()
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2)
        ctx.fillStyle = point.hue === 195 
          ? `rgba(34, 211, 238, ${point.alpha + 0.3})`
          : `rgba(45, 212, 191, ${point.alpha + 0.3})`
        ctx.fill()

        // Draw connections to nearby points
        for (let j = i + 1; j < pointsRef.current.length; j++) {
          const other = pointsRef.current[j]
          const distance = Math.sqrt(
            Math.pow(point.x - other.x, 2) + Math.pow(point.y - other.y, 2)
          )
          if (distance < 120) {
            ctx.beginPath()
            ctx.moveTo(point.x, point.y)
            ctx.lineTo(other.x, other.y)
            const lineAlpha = (1 - distance / 120) * 0.15
            ctx.strokeStyle = `rgba(45, 212, 191, ${lineAlpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      })

      // Draw regression line
      drawRegressionLine(ctx, pointsRef.current, rect.width, rect.height)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationRef.current)
    }
  }, [initPoints, drawRegressionLine])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "transparent" }}
    />
  )
}
