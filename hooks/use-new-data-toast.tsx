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

interface ToastContentProps {
  t: string | number
  label: string
  value: string
}

function ToastContent({ t, label, value }: ToastContentProps) {
  return (
    <div className="relative bg-zinc-950 border border-green-500 p-3 w-[calc(100vw-32px)] sm:w-[356px] flex items-center justify-between gap-3">
      <p className="text-xs text-white flex items-center gap-1.5 min-w-0">
        <SquarePlus className="h-3 w-3 text-green-500 shrink-0" />
        <span className="text-muted-foreground shrink-0">{label}:</span>
        <span className="font-medium truncate">{value}</span>
      </p>
      <button
        onClick={() => toast.dismiss(t)}
        className="shrink-0 flex items-center px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground border border-border hover:border-muted-foreground transition-colors cursor-pointer"
      >
        Got it!
      </button>
    </div>
  )
}

export function useNewDataToast(pools: LendingPool[]) {
  const alreadyRan = useRef(false)

  useEffect(() => {
    if (!pools.length || alreadyRan.current) return

    alreadyRan.current = true

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

    saveBaseline(pools)

    newProtocols.forEach((protocol, i) => {
      setTimeout(() => {
        toast.custom((t) => (
          <ToastContent t={t} label="New protocol" value={protocol} />
        ), { duration: Infinity })
      }, i * 200)
    })

    newChains.forEach((chain, i) => {
      setTimeout(() => {
        toast.custom((t) => (
          <ToastContent t={t} label="New chain" value={chain} />
        ), { duration: Infinity })
      }, i * 200)
    })
  }, [pools])
}
