import { NextResponse } from 'next/server'

export const revalidate = 300

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
  tvl: number
  riskRating: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D'
  description: string
  audited: boolean
  insuranceCoverage: boolean
  poolUrl: string
  defiLlamaPoolId: string
  vaultComposition?: { asset: string; percentage: number; color: string }[]
}

const PROTOCOL_MAPPING: Record<string, string> = {
  'aave-v3': 'Aave V3',
  'aave-v4': 'Aave V4',
  'morpho-v1': 'Morpho',
  'euler-v2': 'Euler',
  'compound-v3': 'Compound V3',
  'spark-savings': 'Spark',
  'sparklend': 'Spark',
  'fluid-lending': 'Fluid',
  'extra-finance-xlend': 'ExtraFi XLend',
  'autofinance': 'Auto',
  'moonwell-lending': 'Moonwell',
  '40-acres': '40acres',
  'dolomite': 'Dolomite'
}

const CHAIN_MAPPING: Record<string, string> = {
  'Ethereum': 'Ethereum',
  'Arbitrum': 'Arbitrum',
  'Base': 'Base',
  'Optimism': 'Optimism',
  'Polygon': 'Polygon',
  'Avalanche': 'Avalanche',
}

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

function calculateRiskRating(pool: DefiLlamaPool, protocol: string): 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' {
  const tvl = pool.tvlUsd
  const isStablecoin = pool.stablecoin
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

function getAssetType(symbol: string, isStablecoin: boolean): TransformedPool['assetType'] {
  if (isStablecoin) return 'Stablecoin'
  const lsts = ['STETH', 'WSTETH', 'CBETH', 'RETH', 'SFRXETH', 'ANKRB', 'OSETH']
  const lrts = ['WEETH', 'EZETH', 'RSETH', 'PUFETH', 'METH']
  const blueChips = ['ETH', 'WETH', 'BTC', 'WBTC']
  const upperSymbol = symbol.toUpperCase()
  if (lsts.some(lst => upperSymbol.includes(lst))) return 'LST'
  if (lrts.some(lrt => upperSymbol.includes(lrt))) return 'LRT'
  if (blueChips.some(bc => upperSymbol.includes(bc))) return 'Blue Chip'
  return 'Volatile'
}

function hasInsuranceCoverage(protocol: string): boolean {
  return ['Aave V3', 'Compound V3', 'Spark'].includes(protocol)
}

export async function GET() {
  try {
    const response = await fetch('https://yields.llama.fi/pools', {
      next: { revalidate: 300 }
    })

    if (!response.ok) throw new Error('Failed to fetch yields data')

    const data = await response.json()
    const pools: DefiLlamaPool[] = data.data
    const supportedChains = Object.keys(CHAIN_MAPPING)

    const filteredPools = pools.filter(pool => {
      return (
        pool.project in PROTOCOL_MAPPING &&
        supportedChains.includes(pool.chain) &&
        pool.tvlUsd > 10_000 &&
        pool.apy > 0.01
      )
    })

    const transformedPools: TransformedPool[] = filteredPools.map(pool => {
      const protocol = PROTOCOL_MAPPING[pool.project]
      const chain = CHAIN_MAPPING[pool.chain] || pool.chain
      const symbol = pool.symbol.split('-')[0].replace(/[^A-Za-z0-9]/g, '')
      const supplyApy = pool.apy || pool.apyBase || 0
      const poolUrl = PROTOCOL_URLS[protocol] || `https://defillama.com/yields/pool/${pool.pool}`

      return {
        id: pool.pool,
        protocol,
        chain,
        asset: symbol,
        assetType: getAssetType(symbol, pool.stablecoin),
        supplyApy: Math.round(supplyApy * 100) / 100,
        tvl: pool.tvlUsd,
        riskRating: calculateRiskRating(pool, protocol),
        description: `${symbol} lending pool on ${protocol} (${chain}). TVL: $${(pool.tvlUsd / 1_000_000).toFixed(0)}M.`,
        audited: true,
        insuranceCoverage: hasInsuranceCoverage(protocol),
        poolUrl,
        defiLlamaPoolId: pool.pool,
      }
    })

    transformedPools.sort((a, b) => b.tvl - a.tvl)

    return NextResponse.json({
      pools: transformedPools,
      lastUpdated: new Date().toISOString(),
      source: 'DeFiLlama'
    })
  } catch (error) {
    console.error('Error fetching yields:', error)
    return NextResponse.json({ error: 'Failed to fetch yields data' }, { status: 500 })
  }
}
