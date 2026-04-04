'use client'

import { CHAINS, PROTOCOLS, ASSET_TYPES, AssetType, CHAIN_COLORS, PROTOCOL_COLORS } from '@/lib/lending-data'
import { Search } from 'lucide-react'

interface FiltersProps {
  selectedChains: string[]
  setSelectedChains: (chains: string[]) => void
  selectedProtocols: string[]
  setSelectedProtocols: (protocols: string[]) => void
  selectedAssetTypes: AssetType[]
  setSelectedAssetTypes: (types: AssetType[]) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  minApy: number | null
  setMinApy: (apy: number | null) => void
}

export function Filters({
  selectedChains,
  setSelectedChains,
  selectedProtocols,
  setSelectedProtocols,
  selectedAssetTypes,
  setSelectedAssetTypes,
  searchQuery,
  setSearchQuery,
  minApy,
  setMinApy
}: FiltersProps) {
  const toggleChain = (chain: string) => {
    if (selectedChains.includes(chain)) {
      setSelectedChains(selectedChains.filter(c => c !== chain))
    } else {
      setSelectedChains([...selectedChains, chain])
    }
  }

  const toggleProtocol = (protocol: string) => {
    if (selectedProtocols.includes(protocol)) {
      setSelectedProtocols(selectedProtocols.filter(p => p !== protocol))
    } else {
      setSelectedProtocols([...selectedProtocols, protocol])
    }
  }

  const toggleAssetType = (type: AssetType) => {
    if (selectedAssetTypes.includes(type)) {
      setSelectedAssetTypes(selectedAssetTypes.filter(t => t !== type))
    } else {
      setSelectedAssetTypes([...selectedAssetTypes, type])
    }
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by asset name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary text-sm"
          />
        </div>
        <div className="relative">
          <input
            type="number"
            placeholder="Min APY %"
            value={minApy ?? ''}
            onChange={(e) => setMinApy(e.target.value ? parseFloat(e.target.value) : null)}
            className="w-36 h-10 px-3 bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono"
          />
        </div>

      </div>

      {/* Filter sections */}
      <div className="space-y-3">
        {/* Chains */}
        <div className="flex items-start gap-3">
          <span className="text-xs text-muted-foreground w-20 pt-2 shrink-0">Chain</span>
          <div className="flex flex-wrap gap-2">
            {CHAINS.map(chain => (
              <button
                key={chain}
                onClick={() => toggleChain(chain)}
                className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                  selectedChains.includes(chain)
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-card border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground'
                }`}
              >
                <span 
                  className="inline-block w-2 h-2 mr-2"
                  style={{ backgroundColor: CHAIN_COLORS[chain as keyof typeof CHAIN_COLORS] || '#888' }}
                />
                {chain}
              </button>
            ))}
          </div>
        </div>

        {/* Protocols */}
        <div className="flex items-start gap-3">
          <span className="text-xs text-muted-foreground w-20 pt-2 shrink-0">Protocol</span>
          <div className="flex flex-wrap gap-2">
            {PROTOCOLS.map(protocol => (
              <button
                key={protocol}
                onClick={() => toggleProtocol(protocol)}
                className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                  selectedProtocols.includes(protocol)
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-card border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground'
                }`}
              >
                <span 
                  className="inline-block w-2 h-2 mr-2"
                  style={{ backgroundColor: PROTOCOL_COLORS[protocol as keyof typeof PROTOCOL_COLORS] || '#888' }}
                />
                {protocol}
              </button>
            ))}
          </div>
        </div>

        {/* Asset Types */}
        <div className="flex items-start gap-3">
          <span className="text-xs text-muted-foreground w-20 pt-2 shrink-0">Asset Type</span>
          <div className="flex flex-wrap gap-2">
            {ASSET_TYPES.map(type => (
              <button
                key={type}
                onClick={() => toggleAssetType(type)}
                className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                  selectedAssetTypes.includes(type)
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-card border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
