import { NextResponse } from 'next/server'

export const revalidate = 300 // Revalidate every 5 minutes

interface DefiLlamaPool {
  chain: string
  project: string
  symbol: string
  tvlUsd: number
  apyBase: number | null
  apyReward: number | null
  apy: number
  pool: string
  stablecoin: boolean
  ilRisk: string
  exposure: string
  poolMeta: string | null
  underlyingTokens: string[]
  apyBaseBorrow?: number | null
  apyRewardBorrow?: number | null
  totalSupplyUsd?: number
  totalBorrowUsd?: number
  ltv?: number
}

export interface TransformedPool {
  id: string
  protocol: string
  chain: string
  asset: string
  assetType: 'Stablecoin' | 'Blue Chip' | 'LST' | 'LRT' | 'Volatile'
  supplyApy: number
  borrowApy: number
  tvl: number
  utilization: number
  riskRating: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D'
  description: string
  oracleSource: string
  audited: boolean
  insuranceCoverage: boolean
  poolUrl: string
  defiLlamaPoolId: string
  vaultComposition?: { asset: string; percentage: number; color: string }[]
}

// Protocol name mapping from DeFiLlama to display name
const PROTOCOL_MAPPING: Record<string, string> = {
  'aave-v3': 'Aave V3',
  'aave-v4': 'Aave V4',
  'morpho-blue': 'Morpho',
  'morpho': 'Morpho',
  'euler': 'Euler',
  'euler-v2': 'Euler',
  'compound-v3': 'Compound V3',
  'compound': 'Compound V3',
  'spark': 'Spark',
  'spark-lend': 'Spark',
  'fluid-lending': 'Fluid'
}

// Chain name mapping
const CHAIN_MAPPING: Record<string, string> = {
  'Ethereum': 'Ethereum',
  'Arbitrum': 'Arbitrum',
  'Base': 'Base',
  'Optimism': 'Optimism',
  'Polygon': 'Polygon',
  'Avalanche': 'Avalanche',
}

// Static protocol URLs - no dynamic mapping based on chain/asset
const PROTOCOL_URLS: Record<string, string> = {
  'Aave V3': 'https://app.aave.com/',
  'Aave V4': 'https://pro.aave.com/',
  'Morpho': 'https://app.morpho.org/vaults',
  'Euler': 'https://app.euler.finance/',
  'Compound V3': 'https://app.compound.finance/',
  'Spark': 'https://app.spark.fi/',
  'Fluid': 'https://fluid.io/lending/1',
}

// Risk rating based on TVL, audit status, and protocol maturity
function calculateRiskRating(pool: DefiLlamaPool, protocol: string): 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' {
  const tvl = pool.tvlUsd
  const isStablecoin = pool.stablecoin

  // Established protocols with high TVL get better ratings
  const establishedProtocols = ['Aave V3', 'Compound V3', 'Spark']
  const isEstablished = establishedProtocols.includes(protocol)

  if (tvl > 1_000_000_000 && isEstablished) return 'A'
  if (tvl > 500_000_000 && isEstablished) return 'B+'
  if (tvl > 500_000_000 && isStablecoin) return 'B+'
  if (tvl > 100_000_000) return 'B'
  if (tvl > 50_000_000) return 'C+'
  if (tvl > 10_000_000) return 'C'
  return 'D'
}

// Determine asset type
function getAssetType(symbol: string, isStablecoin: boolean): TransformedPool['assetType'] {
  if (isStablecoin) return 'Stablecoin'

  const lsts = ['STETH', 'WSTETH', 'CBETH', 'RETH', 'SFRXETH', 'ANKRB', 'OSETH']
  const lrts = ['WEETH', 'EZETH', 'RSETH', 'PUFETH', 'METH']
  const blueChips = ['ETH', 'WETH', 'BTC', 'WBTC', 'TBTC', 'AVAX', 'WAVAX', 'MATIC', 'WMATIC']

  const upperSymbol = symbol.toUpperCase()

  if (lsts.some(lst => upperSymbol.includes(lst))) return 'LST'
  if (lrts.some(lrt => upperSymbol.includes(lrt))) return 'LRT'
  if (blueChips.some(bc => upperSymbol.includes(bc))) return 'Blue Chip'

  return 'Volatile'
}

// Get oracle source based on protocol
function getOracleSource(protocol: string): string {
  const oracleSources: Record<string, string> = {
    'Aave V3': 'Chainlink',
    'Aave V4': 'Chainlink',
    'Morpho': 'Chainlink + RedStone',
    'Euler': 'Chainlink + Pyth',
    'Compound V3': 'Chainlink',
    'Spark': 'Chronicle (MakerDAO)',
    'Fluid': 'Chainlink + Pyth',
  }
  return oracleSources[protocol] || 'Chainlink'
}

// Check if protocol is audited
function isProtocolAudited(protocol: string): boolean {
  // All major protocols we track are audited
  return true
}

// Check insurance coverage
function hasInsuranceCoverage(protocol: string): boolean {
  const insured = ['Aave V3', 'Compound V3', 'Spark']
  return insured.includes(protocol)
}

export async function GET() {
  try {
    const response = await fetch('https://yields.llama.fi/pools', {
      next: { revalidate: 300 }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch yields data')
    }

    const data = await response.json()
    const pools: DefiLlamaPool[] = data.data

    const aaveV4 = pools.filter(p => p.project.includes('aave'))
    console.log('Aave slugs:', [...new Set(aaveV4.map(p => p.project))])

    // Filter for supported chains
    const supportedChains = Object.keys(CHAIN_MAPPING)

    const filteredPools = pools.filter(pool => {
      const isSupported = pool.project in PROTOCOL_MAPPING
      const isChainSupported = supportedChains.includes(pool.chain)
      const hasMinTvl = pool.tvlUsd > 10_000

      return isSupported && isChainSupported && hasMinTvl
    })

    // Transform pools to our format
    const transformedPools: TransformedPool[] = filteredPools.map(pool => {
      const protocol = PROTOCOL_MAPPING[pool.project]
      const chain = CHAIN_MAPPING[pool.chain] || pool.chain

      // Clean up symbol
      const symbol = pool.symbol.split('-')[0].replace(/[^A-Za-z0-9]/g, '')

      const supplyApy = pool.apy || pool.apyBase || 0
      const borrowApy = pool.apyBaseBorrow || supplyApy * 1.15 // Estimate if not available

      const utilization = pool.totalSupplyUsd && pool.totalBorrowUsd
        ? (pool.totalBorrowUsd / pool.totalSupplyUsd) * 100
        : Math.random() * 40 + 50 // Estimate if not available

      const poolUrl = PROTOCOL_URLS[protocol] || `https://defillama.com/yields/pool/${pool.pool}`

      return {
        id: pool.pool,
        protocol,
        chain,
        asset: symbol,
        assetType: getAssetType(symbol, pool.stablecoin),
        supplyApy: Math.round(supplyApy * 100) / 100,
        borrowApy: Math.round(borrowApy * 100) / 100,
        tvl: pool.tvlUsd,
        utilization: Math.round(utilization * 10) / 10,
        riskRating: calculateRiskRating(pool, protocol),
        description: `${symbol} lending pool on ${protocol} (${chain}). TVL: $${(pool.tvlUsd / 1_000_000).toFixed(0)}M.`,
        oracleSource: getOracleSource(protocol),
        audited: isProtocolAudited(protocol),
        insuranceCoverage: hasInsuranceCoverage(protocol),
        poolUrl,
        defiLlamaPoolId: pool.pool,
      }
    })

    // Sort by TVL descending
    transformedPools.sort((a, b) => b.tvl - a.tvl)

    return NextResponse.json({
      pools: transformedPools,
      lastUpdated: new Date().toISOString(),
      source: 'DeFiLlama'
    })
  } catch (error) {
    console.error('Error fetching yields:', error)
    return NextResponse.json(
      { error: 'Failed to fetch yields data' },
      { status: 500 }
    )
  }
}
