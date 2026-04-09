'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { Header } from '@/components/lending/header'
import { Filters } from '@/components/lending/filters'
import { PoolTable } from '@/components/lending/pool-table'
import { StatsCards } from '@/components/lending/stats-cards'
import { AssetType, LendingPool } from '@/lib/lending-data'
import { useNewDataToast } from '@/hooks/use-new-data-toast'

export default function LendingAggregator() {
  // Mounted state to prevent hydration mismatch from browser extensions
  const [mounted, setMounted] = useState(false)

  // Filter states
  const [selectedChains, setSelectedChains] = useState<string[]>([])
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([])
  const [selectedAssetTypes, setSelectedAssetTypes] = useState<AssetType[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [minApy, setMinApy] = useState<number | null>(null)
  const [minTvl, setMinTvl] = useState(10_000)

  // Data states
  const [pools, setPools] = useState<LendingPool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Fetch real data from DeFiLlama API
  const fetchPools = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/yields')
      if (!response.ok) throw new Error('Failed to fetch')

      const data = await response.json()
      setPools(data.pools)
      setLastUpdated(new Date(data.lastUpdated))
    } catch (error) {
      setLastUpdated(new Date())
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    fetchPools()
  }, [fetchPools])

  // Refresh handler
  const handleRefresh = useCallback(() => {
    fetchPools()
  }, [fetchPools])

  useNewDataToast(pools)

  const filteredPools = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    return pools.filter(p =>
      (selectedChains.length === 0 || selectedChains.includes(p.chain)) &&
      (selectedProtocols.length === 0 || selectedProtocols.includes(p.protocol)) &&
      (selectedAssetTypes.length === 0 || selectedAssetTypes.includes(p.assetType)) &&
      (minApy === null || p.supplyApy >= minApy) && p.tvl >= minTvl &&
      (query === '' || p.asset.toLowerCase().includes(query))
    )
  }, [pools, selectedChains, selectedProtocols, selectedAssetTypes, minApy, minTvl, searchQuery])

  // Show loading state during initial hydration to prevent mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">YA</span>
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-foreground tracking-tight">
                    Yield Master
                  </h1>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    DeFi Lending Rates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card border border-border p-4 lg:p-5 h-32" />
              ))}
            </div>
            <div className="bg-card border border-border p-4 lg:p-5 h-64" />
            <div className="bg-card border border-border h-96" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onRefresh={handleRefresh}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* Stats Overview */}
        <StatsCards pools={filteredPools} isLoading={isLoading} />

        {/* Filters Section */}
        <div className="bg-card border border-border p-4 lg:p-5">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-medium text-foreground uppercase tracking-wider">
              Filters
            </h2>
            <span className="text-xs text-muted-foreground">
              ({filteredPools.length} of {pools.length} pools)
            </span>
          </div>
          <Filters
            selectedChains={selectedChains}
            setSelectedChains={setSelectedChains}
            selectedProtocols={selectedProtocols}
            setSelectedProtocols={setSelectedProtocols}
            selectedAssetTypes={selectedAssetTypes}
            setSelectedAssetTypes={setSelectedAssetTypes}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            minApy={minApy}
            setMinApy={setMinApy}
            minTvl={minTvl}
            setMinTvl={setMinTvl}
          />
        </div>

        {/* Pools Table */}
        <PoolTable pools={filteredPools} isLoading={isLoading} />

        {/* Footer */}
        <footer className="pt-6 border-t border-border">
          <div className="flex flex-col items-center text-xs text-muted-foreground">
            <p className="text-center">
              Data is presented for informational purposes only. It does not constitute investment advice.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
