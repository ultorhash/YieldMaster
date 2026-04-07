import { CHAIN_MAPPING, EXPLOIT_PENALTY, EXPLOITED_PROTOCOLS, getProtocolUrl, PROTOCOL_MAPPING, RiskLevel } from '@/lib/lending-data'
import { NextResponse } from 'next/server'

interface DefiLlamaPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase: number | null;
  apyReward: number | null;
  apy: number;
  rewardTokens: string[] | null;
  pool: string;
  apyPct1D: number | null;
  apyPct7D: number | null;
  apyPct30D: number | null;
  stablecoin: boolean;
  ilRisk: string;
  exposure: string;
  predictions: {
    predictedClass: string;
    predictedProbability: number;
    binnedConfidence: number;
  };
  poolMeta: string | null;
  mu: number;
  sigma: number;
  count: number;
  outlier: boolean;
  underlyingTokens: string[] | null;
  il7d: number | null;
  apyBase7d: number | null;
  apyMean30d: number;
  volumeUsd1d: number | null;
  volumeUsd7d: number | null;
  apyBaseInception: number | null;
}

export interface TransformedPool {
  id: string
  protocol: string
  chain: string
  asset: string
  assetType: 'Stablecoin' | 'Blue Chip' | 'LST' | 'LRT' | 'Volatile'
  supplyApy: number
  rewardApy: number
  totalApy: number
  tvl: number
  riskRating: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D'
  audited: boolean
  insurance: boolean
  poolUrl: string
}

function calculateRiskRating(pool: DefiLlamaPool, protocol: string): RiskLevel {
  const { tvlUsd: tvl, stablecoin, exposure, ilRisk } = pool
  const exploit = EXPLOITED_PROTOCOLS[protocol]

  const base =
    tvl > 100_000_000 ? 6 :
      tvl > 50_000_000 && stablecoin ? 5 :
        tvl > 10_000_000 ? 4 :
          tvl > 5_000_000 ? 3 :
            tvl > 1_000_000 ? 2 : 1

  const bonus = (exposure === 'single' ? 1 : 0) + (ilRisk === 'no' ? 1 : 0)
  const penalty = exploit ? EXPLOIT_PENALTY[exploit.type] : 0

  const ratings: RiskLevel[] = ['D', 'C', 'C+', 'B', 'B+', 'A']
  return ratings[Math.min(Math.max(base + bonus - penalty - 1, 0), ratings.length - 1)]
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
  return ['Aave V3', 'Compound V3', 'Spark', 'Maple'].includes(protocol)
}

export async function GET() {
  try {
    const response = await fetch('https://yields.llama.fi/pools')

    if (!response.ok) throw new Error('Failed to fetch yields data')

    const data = await response.json()
    const pools: DefiLlamaPool[] = data.data
    const supportedChains = Object.keys(CHAIN_MAPPING)

    const filteredPools = pools.filter(pool => {
      return (
        pool.project in PROTOCOL_MAPPING &&
        supportedChains.includes(pool.chain) &&
        pool.tvlUsd > 10_000 &&
        (pool.apyBase ?? pool.apy) > 0.01
      )
    })

    const transformedPools: TransformedPool[] = filteredPools.map(pool => {
      const protocol = PROTOCOL_MAPPING[pool.project]
      const chain = CHAIN_MAPPING[pool.chain] || pool.chain
      const symbol = pool.symbol.split('-')[0].replace(/[^A-Za-z0-9]/g, '')
      const supplyApy = pool.apyBase != null ? pool.apyBase : pool.apy ?? 0
      const rewardApy = pool.apyReward ?? 0
      const poolUrl = getProtocolUrl(protocol)

      return {
        id: pool.pool,
        protocol,
        chain,
        asset: symbol,
        assetType: getAssetType(symbol, pool.stablecoin),
        supplyApy: Math.round(supplyApy * 100) / 100,
        rewardApy: Math.round(rewardApy * 100) / 100,
        totalApy: Math.round((pool.apy ?? 0) * 100) / 100,
        tvl: pool.tvlUsd,
        riskRating: calculateRiskRating(pool, protocol),
        audited: true,
        insurance: hasInsuranceCoverage(protocol),
        poolUrl
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
