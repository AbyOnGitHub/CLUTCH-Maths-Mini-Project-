"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ParticleCanvas } from "./particle-canvas"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"

export function LandingHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
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
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#demo" className="hover:text-primary transition-colors">Demo</Link>
            <Link href="#docs" className="hover:text-primary transition-colors">Documentation</Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
            <Button size="sm" className="bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 glow-cyan">
              Get Started
            </Button>
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
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-border/50 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
