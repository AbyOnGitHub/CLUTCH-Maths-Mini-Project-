import { Suspense } from "react"
import { ClutchApp } from "@/components/clutch-app"
import { Spinner } from "@/components/ui/spinner"

export default function AppPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-8 h-8 text-primary" />
          <span className="text-sm text-muted-foreground">Loading C.L.U.T.C.H...</span>
        </div>
      </div>
    }>
      <ClutchApp />
    </Suspense>
  )
}
