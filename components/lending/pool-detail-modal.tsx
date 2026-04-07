'use client'

import { LendingPool, formatTVL, formatAPY, RISK_COLORS, getProtocolUrl, EXPLOITED_PROTOCOLS } from '@/lib/lending-data'
import { X, Shield, ShieldCheck, ExternalLink, AlertTriangle, Bug } from 'lucide-react'
import { useEffect } from 'react'

interface PoolDetailModalProps {
  pool: LendingPool | null
  onClose: () => void
}

export function PoolDetailModal({ pool, onClose }: PoolDetailModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!pool) return null

  const exploit = EXPLOITED_PROTOCOLS[pool.protocol]

  return (
    <div
      className="fixed inset-0 z-50 min-h-screen w-full bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-foreground font-mono">{pool.asset}</h2>
              <span className="text-xs px-2 py-1 bg-muted text-muted-foreground">
                {pool.assetType}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {pool.protocol} · {pool.chain}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className={`grid gap-4 ${pool.rewardApy > 0 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <div className="bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Supply APY</p>
              <p className="text-2xl font-mono font-bold text-primary">{formatAPY(pool.supplyApy)}</p>
            </div>
            {pool.rewardApy > 0 && (
              <div className="bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Reward APY</p>
                <p className="text-2xl font-mono font-bold text-violet-500">+{formatAPY(pool.rewardApy)}</p>
              </div>
            )}
            <div className="bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">TVL</p>
              <p className="text-2xl font-mono font-bold text-foreground">{formatTVL(pool.tvl)}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wider">
              Risk Assessment
            </h3>
            <div className="bg-muted/30 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Rating</span>
                <span
                  className="px-3 py-1 text-sm font-bold"
                  style={{
                    backgroundColor: RISK_COLORS[pool.riskRating] + '20',
                    color: RISK_COLORS[pool.riskRating]
                  }}
                >
                  {pool.riskRating}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`h-4 w-4 ${pool.audited ? 'text-primary' : 'text-muted-foreground/30'}`} />
                  <span className={`text-sm ${pool.audited ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {pool.audited ? 'Audited Contracts' : 'Not Audited'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className={`h-4 w-4 ${pool.insurance ? 'text-chart-4' : 'text-muted-foreground/30'}`} />
                  <span className={`text-sm ${pool.insurance ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {pool.insurance ? 'Insurance' : 'No Insurance'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Bug className={`h-4 w-4 ${exploit?.type === 'logic' ? 'text-destructive' :
                    exploit?.type === 'oracle' ? 'text-yellow-500' :
                      'text-muted-foreground/30'
                    }`} />
                  <span className={`text-sm ${exploit ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {exploit?.type === 'logic' ? 'Logic Exploit' :
                      exploit?.type === 'oracle' ? 'Oracle Exploit' :
                        'No Past Exploits'}
                  </span>
                </div>
              </div>

              {exploit && (
                <div className="pt-2 border-t border-border">
                  <div className="flex items-start gap-2 text-sm">
                    <Bug className={`h-4 w-4 shrink-0 mt-0.5 ${exploit.type === 'logic' ? 'text-destructive' : 'text-yellow-500'}`} />
                    <span className="text-muted-foreground">
                      {exploit.type === 'logic'
                        ? 'This protocol suffered a logic exploit. Flaw in smart contract business logic allowed attackers to drain funds.'
                        : 'This protocol suffered an oracle exploit. Price manipulation was used to attack the protocol.'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-muted/20 border border-border p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-chart-3 shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Warning:</strong> Risk ratings are indicative and do not constitute investment advice.
                Always conduct your own research before depositing funds.
                Smart contract risk, oracle manipulation, and depeg risk are always present in DeFi.
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex flex-col sm:flex-row justify-between gap-3">
          <a
            href={`https://defillama.com/yields/pool/${pool.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 cursor-pointer"
          >
            View on DeFiLlama
            <ExternalLink className="h-3 w-3" />
          </a>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Close
            </button>
            <a
              href={getProtocolUrl(pool.protocol)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 cursor-pointer"
            >
              Open in {pool.protocol}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
