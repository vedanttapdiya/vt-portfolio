import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
        <p className="text-zinc-400">Loading security information...</p>
      </div>
    </div>
  )
}
