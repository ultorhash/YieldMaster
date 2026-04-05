'use client'

import { LendingPool, formatTVL, formatAPY, RISK_COLORS } from '@/lib/lending-data'
import { X, Shield, ShieldCheck, ExternalLink, AlertTriangle, Bug } from 'lucide-react'
import { useEffect } from 'react'

// Static protocol URLs - no dynamic mapping
const PROTOCOL_URLS: Record<string, string> = {
  'Aave V3': 'https://app.aave.com/',
  'Aave V4': 'https://pro.aave.com/',
  'Morpho': 'https://app.morpho.org/vaults',
  'Euler': 'https://app.euler.finance/',
  'Compound V3': 'https://app.compound.finance/',
  'Spark': 'https://app.spark.fi/',
  'Fluid': 'https://fluid.io/lending/1',
  'ExtraFi XLend': 'https://xlend.extrafi.io/',
  'Auto': 'https://app.auto.finance/',
  'Moonwell': 'https://moonwell.fi/markets',
  '40acres': 'https://www.40acres.finance/',
  'Dolomite': 'https://app.dolomite.io/earn'
}

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

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div className="bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Supply APY</p>
              <p className="text-2xl font-mono font-bold text-primary">{formatAPY(pool.supplyApy)}</p>
            </div>
            <div className="bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">TVL</p>
              <p className="text-2xl font-mono font-bold text-foreground">{formatTVL(pool.tvl)}</p>
            </div>
          </div>

          {/* Vault Composition */}
          {pool.vaultComposition && pool.vaultComposition.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wider">
                Vault Composition / Exposure
              </h3>
              <div className="space-y-3">
                {/* Progress bar */}
                <div className="h-3 flex overflow-hidden">
                  {pool.vaultComposition.map((item, index) => (
                    <div
                      key={index}
                      className="h-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  ))}
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-4">
                  {pool.vaultComposition.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-foreground">{item.asset}</span>
                      <span className="text-sm font-mono text-muted-foreground">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Risk Assessment */}
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
                  <ShieldCheck
                    className={`h-4 w-4 ${pool.audited ? 'text-primary' : 'text-muted-foreground/30'}`}
                  />
                  <span className={`text-sm ${pool.audited ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {pool.audited ? 'Audited Contracts' : 'Not Audited'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Shield
                    className={`h-4 w-4 ${pool.insuranceCoverage ? 'text-chart-3' : 'text-muted-foreground/30'}`}
                  />
                  <span className={`text-sm ${pool.insuranceCoverage ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {pool.insuranceCoverage ? 'Insurance Coverage' : 'No Insurance'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Bug
                    className={`h-4 w-4 ${pool.hadExploit ? 'text-destructive' : 'text-muted-foreground/30'}`}
                  />
                  <span className={`text-sm ${pool.hadExploit ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {pool.hadExploit ? 'Past Exploit' : 'No Past Exploits'}
                  </span>
                </div>
              </div>

              {pool.hadExploit && pool.exploitDetails && (
                <div className="pt-2 border-t border-border">
                  <div className="flex items-start gap-2 text-sm">
                    <Bug className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{pool.exploitDetails}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Risk Description */}
          <div className="bg-muted/20 border border-border p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-chart-3 shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Warning:</strong> Risk ratings are indicative and do not constitute investment advice.
                Always conduct your own research (DYOR) before depositing funds.
                Smart contract risk, oracle manipulation, and depeg risk are always present in DeFi.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex flex-col sm:flex-row justify-between gap-3">
          <a
            href={`https://defillama.com/yields/pool/${pool.defiLlamaPoolId || pool.id}`}
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
              href={PROTOCOL_URLS[pool.protocol] || `https://defillama.com/protocol/${pool.protocol.toLowerCase().replace(/\s+/g, '-')}`}
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
