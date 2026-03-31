"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { ParticleCanvas } from "@/components/particle-canvas"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles, ChevronDown, TrendingUp, Calculator, Eye, Zap, BookOpen, BarChart3, ArrowUpRight, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"

// Demo scene data
const DEMO_SCENES = [
  {
    title: "Data Points Appear",
    description: "Each point represents a paired observation (x, y) from your dataset. These are the raw measurements we want to analyze.",
    data: [[2, 3], [4, 5], [5, 7], [7, 8], [9, 11], [11, 13]],
    showMeans: false,
    showDeviations: false,
    showRegression: false,
    showResiduals: false,
  },
  {
    title: "Calculate Means",
    description: "The mean (average) of X (x̄) and Y (ȳ) represents the central tendency of each variable. These become our reference points.",
    data: [[2, 3], [4, 5], [5, 7], [7, 8], [9, 11], [11, 13]],
    showMeans: true,
    showDeviations: false,
    showRegression: false,
    showResiduals: false,
  },
  {
    title: "Measure Deviations",
    description: "Deviations show how far each point is from the mean. We calculate (x - x̄) and (y - ȳ) for correlation analysis.",
    data: [[2, 3], [4, 5], [5, 7], [7, 8], [9, 11], [11, 13]],
    showMeans: true,
    showDeviations: true,
    showRegression: false,
    showResiduals: false,
  },
  {
    title: "Fit Regression Line",
    description: "The best-fit line minimizes the sum of squared errors. The equation y = mx + b describes the linear relationship.",
    data: [[2, 3], [4, 5], [5, 7], [7, 8], [9, 11], [11, 13]],
    showMeans: true,
    showDeviations: false,
    showRegression: true,
    showResiduals: false,
  },
  {
    title: "Calculate Residuals",
    description: "Residuals are the differences between observed Y values and predicted values from the regression line (error).",
    data: [[2, 3], [4, 5], [5, 7], [7, 8], [9, 11], [11, 13]],
    showMeans: false,
    showDeviations: false,
    showRegression: true,
    showResiduals: true,
  },
  {
    title: "Correlation Result",
    description: "The Pearson correlation coefficient (r = 0.997) indicates a very strong positive relationship. R² = 0.994 means 99.4% of variance is explained.",
    data: [[2, 3], [4, 5], [5, 7], [7, 8], [9, 11], [11, 13]],
    showMeans: false,
    showDeviations: false,
    showRegression: true,
    showResiduals: false,
    showResult: true,
  },
]

function DemoVisualization({ scene }: { scene: typeof DEMO_SCENES[0] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationProgress, setAnimationProgress] = useState(0)

  useEffect(() => {
    setAnimationProgress(0)
    const interval = setInterval(() => {
      setAnimationProgress((p) => Math.min(1, p + 0.02))
    }, 16)
    return () => clearInterval(interval)
  }, [scene])

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
    const padding = 50
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    ctx.clearRect(0, 0, width, height)

    // Calculate scales
    const xValues = scene.data.map((d) => d[0])
    const yValues = scene.data.map((d) => d[1])
    const xMin = Math.min(...xValues) - 1
    const xMax = Math.max(...xValues) + 1
    const yMin = Math.min(...yValues) - 1
    const yMax = Math.max(...yValues) + 1

    const scaleX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * chartWidth
    const scaleY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * chartHeight

    // Draw grid
    ctx.strokeStyle = "rgba(45, 212, 191, 0.1)"
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const x = padding + (chartWidth / 5) * i
      const y = padding + (chartHeight / 5) * i
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
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    const meanX = xValues.reduce((a, b) => a + b, 0) / xValues.length
    const meanY = yValues.reduce((a, b) => a + b, 0) / yValues.length

    // Draw mean lines
    if (scene.showMeans) {
      const alpha = animationProgress
      ctx.strokeStyle = `rgba(45, 212, 191, ${alpha * 0.5})`
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      
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
      ctx.font = "12px JetBrains Mono, monospace"
      ctx.fillText(`x̄ = ${meanX.toFixed(1)}`, scaleX(meanX) + 5, padding + 15)
      ctx.fillText(`ȳ = ${meanY.toFixed(1)}`, width - padding - 50, scaleY(meanY) - 5)
    }

    // Calculate regression
    let slope = 0
    let intercept = 0
    if (scene.showRegression || scene.showResiduals) {
      const n = xValues.length
      const sumX = xValues.reduce((a, b) => a + b, 0)
      const sumY = yValues.reduce((a, b) => a + b, 0)
      const sumXY = xValues.reduce((a, x, i) => a + x * yValues[i], 0)
      const sumX2 = xValues.reduce((a, x) => a + x * x, 0)
      slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
      intercept = (sumY - slope * sumX) / n
    }

    // Draw regression line
    if (scene.showRegression) {
      const alpha = animationProgress
      const x1 = xMin
      const x2 = xMax
      const y1 = slope * x1 + intercept
      const y2 = slope * x2 + intercept

      // Glow effect
      ctx.strokeStyle = `rgba(45, 212, 191, ${alpha * 0.2})`
      ctx.lineWidth = 12
      ctx.beginPath()
      ctx.moveTo(scaleX(x1), scaleY(y1))
      ctx.lineTo(scaleX(x2), scaleY(y2))
      ctx.stroke()

      ctx.strokeStyle = `rgba(45, 212, 191, ${alpha * 0.4})`
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.moveTo(scaleX(x1), scaleY(y1))
      ctx.lineTo(scaleX(x2), scaleY(y2))
      ctx.stroke()

      ctx.strokeStyle = `rgba(45, 212, 191, ${alpha})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(scaleX(x1), scaleY(y1))
      ctx.lineTo(scaleX(x2), scaleY(y2))
      ctx.stroke()
    }

    // Draw deviations
    if (scene.showDeviations) {
      scene.data.forEach((point, i) => {
        const alpha = Math.min(1, animationProgress * 2 - i * 0.15)
        if (alpha <= 0) return

        ctx.strokeStyle = `rgba(255, 150, 100, ${alpha * 0.6})`
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])

        // X deviation
        ctx.beginPath()
        ctx.moveTo(scaleX(point[0]), scaleY(point[1]))
        ctx.lineTo(scaleX(meanX), scaleY(point[1]))
        ctx.stroke()

        // Y deviation
        ctx.beginPath()
        ctx.moveTo(scaleX(point[0]), scaleY(point[1]))
        ctx.lineTo(scaleX(point[0]), scaleY(meanY))
        ctx.stroke()

        ctx.setLineDash([])
      })
    }

    // Draw residuals
    if (scene.showResiduals) {
      scene.data.forEach((point, i) => {
        const alpha = Math.min(1, animationProgress * 2 - i * 0.15)
        if (alpha <= 0) return

        const predictedY = slope * point[0] + intercept
        ctx.strokeStyle = `rgba(255, 100, 100, ${alpha * 0.8})`
        ctx.lineWidth = 2
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(scaleX(point[0]), scaleY(point[1]))
        ctx.lineTo(scaleX(point[0]), scaleY(predictedY))
        ctx.stroke()
        ctx.setLineDash([])
      })
    }

    // Draw data points
    scene.data.forEach((point, i) => {
      const alpha = Math.min(1, animationProgress * 3 - i * 0.2)
      if (alpha <= 0) return

      const x = scaleX(point[0])
      const y = scaleY(point[1])

      // Glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20)
      gradient.addColorStop(0, `rgba(34, 211, 238, ${alpha * 0.4})`)
      gradient.addColorStop(1, "rgba(34, 211, 238, 0)")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, 20, 0, Math.PI * 2)
      ctx.fill()

      // Point
      ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fill()

      // Label
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`
      ctx.font = "10px JetBrains Mono, monospace"
      ctx.fillText(`(${point[0]}, ${point[1]})`, x + 10, y - 10)
    })

    // Draw result
    if (scene.showResult && animationProgress > 0.5) {
      const alpha = (animationProgress - 0.5) * 2
      ctx.fillStyle = `rgba(20, 20, 30, ${alpha * 0.9})`
      ctx.fillRect(width / 2 - 100, height / 2 - 50, 200, 100)
      ctx.strokeStyle = `rgba(45, 212, 191, ${alpha * 0.5})`
      ctx.lineWidth = 1
      ctx.strokeRect(width / 2 - 100, height / 2 - 50, 200, 100)

      ctx.fillStyle = `rgba(45, 212, 191, ${alpha})`
      ctx.font = "bold 24px JetBrains Mono, monospace"
      ctx.textAlign = "center"
      ctx.fillText("r = 0.997", width / 2, height / 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`
      ctx.font = "14px JetBrains Mono, monospace"
      ctx.fillText("Very Strong Positive", width / 2, height / 2 + 25)
      ctx.textAlign = "left"
    }
  }, [scene, animationProgress])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: "100%", height: "100%" }}
    />
  )
}

function SignInModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-8 w-full max-w-md border border-primary/20 shadow-2xl">
        <h2 className="text-2xl font-bold mb-2 text-foreground">Sign In to C.L.U.T.C.H.</h2>
        <p className="text-muted-foreground text-sm mb-6">Access your saved analyses and preferences</p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-input/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-lg bg-input/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan">
            Sign In
          </Button>
        </div>
        
        <p className="text-center text-xs text-muted-foreground mt-6">
          Don&apos;t have an account? <span className="text-primary cursor-pointer hover:underline">Sign up free</span>
        </p>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const [currentScene, setCurrentScene] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const demoRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const docsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setCurrentScene((s) => (s + 1) % DEMO_SCENES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isPlaying])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  const features = [
    {
      icon: Calculator,
      title: "Step-by-Step Solutions",
      description: "Watch every calculation unfold with detailed explanations at both beginner and advanced levels.",
    },
    {
      icon: Eye,
      title: "Visual Learning",
      description: "See abstract statistical concepts come alive through interactive, cinematic visualizations.",
    },
    {
      icon: TrendingUp,
      title: "Regression Analysis",
      description: "Calculate best-fit lines and understand the relationship between variables instantly.",
    },
    {
      icon: BarChart3,
      title: "Karl Pearson Table",
      description: "View the complete correlation table with all intermediate calculations clearly displayed.",
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Modify data and watch all calculations and visualizations update simultaneously.",
    },
    {
      icon: BookOpen,
      title: "Theory Integration",
      description: "Learn the mathematical foundations alongside practical computation with exam-ready explanations.",
    },
  ]

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      {/* HERO SECTION */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(45,212,191,0.08)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(34,211,238,0.05)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(45,212,191,0.05)_0%,_transparent_50%)]" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(45,212,191,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(45,212,191,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Particle visualization */}
        <div className="absolute inset-0">
          <ParticleCanvas />
        </div>

        {/* Noise texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Header */}
        <header className={`absolute top-0 left-0 right-0 z-20 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center glow-cyan">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-primary">C.L.U.T.C.H.</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
              <button onClick={() => scrollToSection(featuresRef)} className="hover:text-primary transition-colors cursor-pointer">Features</button>
              <button onClick={() => scrollToSection(demoRef)} className="hover:text-primary transition-colors cursor-pointer">Demo</button>
              <button onClick={() => scrollToSection(docsRef)} className="hover:text-primary transition-colors cursor-pointer">Documentation</button>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowSignIn(true)}
              >
                Sign In
              </Button>
              <Link href="/app">
                <Button size="sm" className="bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 glow-cyan">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Main hero content */}
        <main className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-6 text-center">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 mb-8 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-medium text-primary">Correlation Logic Unit for Trend Cohesion & Heuristics</span>
            </div>

            {/* Title */}
            <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="text-foreground">See Data.</span>
              <br />
              <span className="text-glow text-primary">Understand Relationships.</span>
            </h1>

            {/* Subtitle */}
            <p className={`text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Advanced correlation analysis with real-time visualization. 
              Uncover patterns, calculate regression lines, and gain insights from your data.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Link href="/app">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-teal group px-8">
                  Enter C.L.U.T.C.H.
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/app?demo=true">
                <Button size="lg" variant="outline" className="border-border/50 hover:bg-secondary/50 group">
                  <Play className="mr-2 w-4 h-4" />
                  Try Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className={`flex items-center justify-center gap-12 mt-16 transition-all duration-1000 delay-900 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary text-glow">r = 0.95</div>
                <div className="text-xs text-muted-foreground mt-1">Correlation</div>
              </div>
              <div className="w-px h-10 bg-border/30" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary text-glow">R² = 0.90</div>
                <div className="text-xs text-muted-foreground mt-1">Coefficient</div>
              </div>
              <div className="w-px h-10 bg-border/30" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary text-glow">y = mx + b</div>
                <div className="text-xs text-muted-foreground mt-1">Regression</div>
              </div>
            </div>
          </div>
        </main>

        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-1000 delay-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={() => scrollToSection(featuresRef)}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <span className="text-xs">Scroll to explore</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section ref={featuresRef} className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(45,212,191,0.03)_0%,_transparent_50%)]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/20 text-xs text-primary mb-4">
              <Zap className="w-3 h-3" />
              Features
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground text-balance">
              Powerful Tools for <span className="text-primary text-glow">Statistical Analysis</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
              Everything you need to understand correlation and regression analysis, 
              from beginner concepts to advanced mathematical theory.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:glow-cyan transition-shadow">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO SECTION */}
      <section ref={demoRef} className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(45,212,191,0.05)_0%,_transparent_60%)]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-accent/20 text-xs text-accent mb-4">
              <Play className="w-3 h-3" />
              Interactive Demo
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground text-balance">
              Watch the <span className="text-accent">Analysis Unfold</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
              Experience correlation analysis step by step. See how data points become insights.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="glass rounded-2xl border border-border/30 overflow-hidden">
              {/* Demo visualization */}
              <div className="aspect-video bg-background/50 relative">
                <DemoVisualization scene={DEMO_SCENES[currentScene]} />
                
                {/* Scene info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Scene {currentScene + 1}: {DEMO_SCENES[currentScene].title}
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-xl">
                        {DEMO_SCENES[currentScene].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="p-4 border-t border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentScene((s) => (s - 1 + DEMO_SCENES.length) % DEMO_SCENES.length)}
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
                    onClick={() => setCurrentScene((s) => (s + 1) % DEMO_SCENES.length)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentScene(0)}
                    className="h-8 w-8 p-0"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                {/* Progress dots */}
                <div className="flex items-center gap-2">
                  {DEMO_SCENES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentScene(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentScene ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                    />
                  ))}
                </div>

                <Link href="/app?demo=true">
                  <Button size="sm" className="bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20">
                    Try Full Demo
                    <ArrowUpRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOCUMENTATION SECTION */}
      <section ref={docsRef} className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(45,212,191,0.03)_0%,_transparent_50%)]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/20 text-xs text-primary mb-4">
              <BookOpen className="w-3 h-3" />
              Documentation
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground text-balance">
              Learn the <span className="text-primary text-glow">Mathematics</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
              Understand the theory behind every calculation with detailed explanations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Pearson Correlation */}
            <div className="glass rounded-2xl p-6 border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold font-mono">r</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Pearson Correlation</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                The Pearson correlation coefficient measures the linear relationship between two variables.
              </p>
              <div className="bg-secondary/30 rounded-lg p-4 font-mono text-sm text-primary">
                r = Σ(x-x̄)(y-ȳ) / √[Σ(x-x̄)²·Σ(y-ȳ)²]
              </div>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  r = +1: Perfect positive correlation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  r = 0: No linear correlation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  r = -1: Perfect negative correlation
                </li>
              </ul>
            </div>

            {/* Linear Regression */}
            <div className="glass rounded-2xl p-6 border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Linear Regression</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Find the best-fit line that minimizes the sum of squared residuals.
              </p>
              <div className="bg-secondary/30 rounded-lg p-4 font-mono text-sm text-accent">
                y = mx + b
              </div>
              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Slope (m):</span>
                  <span className="font-mono">m = Σ(x-x̄)(y-ȳ) / Σ(x-x̄)²</span>
                </div>
                <div className="flex justify-between">
                  <span>Intercept (b):</span>
                  <span className="font-mono">b = ȳ - m·x̄</span>
                </div>
                <div className="flex justify-between">
                  <span>R² (Variance Explained):</span>
                  <span className="font-mono">R² = r²</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto px-6 relative z-10">
          <div className="glass rounded-3xl p-12 md:p-16 border border-primary/20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(45,212,191,0.1)_0%,_transparent_70%)]" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground text-balance">
                Ready to <span className="text-primary text-glow">Understand Your Data?</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-balance">
                Start analyzing correlations with powerful visualizations and step-by-step explanations.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/app">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-teal group px-8">
                    Enter C.L.U.T.C.H.
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/app?demo=true">
                  <Button size="lg" variant="outline" className="border-border/50 hover:bg-secondary/50">
                    <Play className="mr-2 w-4 h-4" />
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/30 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-primary" />
              </div>
              <span className="text-sm font-semibold text-primary">C.L.U.T.C.H.</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Correlation Logic Unit for Trend Cohesion & Heuristics © 2026
            </p>
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
      <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </div>
  )
}
