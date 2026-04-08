import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { LendingPool } from '@/lib/lending-data'
import { SquarePlus } from 'lucide-react'

const STORAGE_KEY = 'new-data'

interface SeenBaseline {
  protocols: string[]
  chains: string[]
}

function getBaseline(): SeenBaseline | null {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
  } catch {
    return null
  }
}

function saveBaseline(pools: LendingPool[]) {
  if (typeof window === 'undefined') return
  const baseline: SeenBaseline = {
    protocols: Array.from(new Set(pools.map((p) => p.protocol))),
    chains: Array.from(new Set(pools.map((p) => p.chain))),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(baseline))
}

export function useNewDataToast(pools: LendingPool[]) {
  const alreadyRan = useRef(false)

  useEffect(() => {
    if (!pools.length || alreadyRan.current) return

    alreadyRan.current = true

    // First run — silently save current protocols and chains as baseline
    if (getBaseline() === null) {
      saveBaseline(pools)
      return
    }

    const baseline = getBaseline()!
    const newProtocols = Array.from(new Set(pools.map((p) => p.protocol)))
      .filter((p) => !baseline.protocols.includes(p))
    const newChains = Array.from(new Set(pools.map((p) => p.chain)))
      .filter((c) => !baseline.chains.includes(c))

    if (!newProtocols.length && !newChains.length) return

    // Update baseline so next visit won't show these again
    saveBaseline(pools)

    newProtocols.forEach((protocol, i) => {
      setTimeout(() => {
        toast.custom((t) => (
          <div className="relative bg-zinc-950 border border-green-500 p-4 w-[356px] flex items-center justify-between">
            <p className="text-white font-medium flex items-center gap-2">
              <SquarePlus className="h-3.5 w-3.5 text-green-500" />
              New protocol: {protocol}
            </p>
            <button
              onClick={() => toast.dismiss(t)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border hover:border-muted-foreground transition-colors cursor-pointer"
            >
              Got it!
            </button>
          </div>
        ), { duration: Infinity })
      }, i * 200)
    })

    newChains.forEach((chain, i) => {
      setTimeout(() => {
        toast.custom((t) => (
          <div className="relative bg-zinc-950 border border-green-500 p-4 w-[356px] flex items-center justify-between">
            <p className="text-white font-medium flex items-center gap-2">
              <SquarePlus className="h-3.5 w-3.5 text-green-500" />
              New chain: {chain}
            </p>
            <button
              onClick={() => toast.dismiss(t)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border hover:border-muted-foreground transition-colors cursor-pointer"
            >
              Got it!
            </button>
          </div>
        ), { duration: Infinity })
      }, i * 200)
    })
  }, [pools])
}
