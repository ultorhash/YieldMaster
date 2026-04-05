export type Chain = 'Ethereum' | 'Arbitrum' | 'Base' | 'Optimism' | 'Polygon' | 'Avalanche'
export type Protocol = 'Aave V3' | 'Morpho' | 'Euler' | 'Compound V3' | 'Spark' | 'Fluid'
export type RiskLevel = 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D'
export type AssetType = 'Stablecoin' | 'Blue Chip' | 'LST' | 'LRT' | 'Volatile'

export interface VaultComposition {
  asset: string
  percentage: number
  color: string
}

export interface LendingPool {
  id: string
  protocol: string
  chain: string
  asset: string
  assetType: AssetType
  supplyApy: number
  borrowApy: number
  tvl: number
  utilization: number
  riskRating: RiskLevel
  vaultComposition?: VaultComposition[]
  description: string
  oracleSource: string
  audited: boolean
  insuranceCoverage: boolean
  hadExploit: boolean
  exploitDetails?: string
  poolUrl?: string
  defiLlamaPoolId?: string
}

export const CHAINS: Chain[] = ['Ethereum', 'Arbitrum', 'Base', 'Optimism', 'Polygon', 'Avalanche']
export const PROTOCOLS: Protocol[] = ['Aave V3', 'Morpho', 'Euler', 'Compound V3', 'Spark', 'Fluid']
export const ASSET_TYPES: AssetType[] = ['Stablecoin', 'Blue Chip', 'LST', 'LRT', 'Volatile']

export const CHAIN_COLORS: Record<Chain, string> = {
  'Ethereum': '#627EEA',
  'Arbitrum': '#28A0F0',
  'Base': '#0052FF',
  'Optimism': '#FF0420',
  'Polygon': '#8247E5',
  'Avalanche': '#E84142'
}

export const PROTOCOL_COLORS: Record<Protocol, string> = {
  'Aave V3': '#B6509E',
  'Morpho': '#1E88E5',
  'Euler': '#E6007A',
  'Compound V3': '#00D395',
  'Spark': '#F7931A',
  'Fluid': '#6366F1'
}

export const RISK_COLORS: Record<RiskLevel, string> = {
  'A': '#22C55E',
  'B+': '#84CC16',
  'B': '#EAB308',
  'C+': '#F97316',
  'C': '#EF4444',
  'D': '#DC2626'
}

// Protocol app URLs
export const PROTOCOL_URLS: Record<Protocol, string> = {
  'Aave V3': 'https://app.aave.com/',
  'Morpho': 'https://app.morpho.org/vaults',
  'Euler': 'https://app.euler.finance/',
  'Compound V3': 'https://app.compound.finance/',
  'Spark': 'https://app.spark.fi/',
  'Fluid': 'https://fluid.io/lending/1',
}

// Helper to generate protocol URLs
export function getProtocolUrl(protocol: string, chain: string, asset: string): string {
  return PROTOCOL_URLS[protocol as Protocol] || `https://defillama.com/protocol/${protocol.toLowerCase().replace(/\s+/g, '-')}`
}

export function formatTVL(tvl: number): string {
  if (tvl >= 1_000_000_000) {
    return `$${(tvl / 1_000_000_000).toFixed(2)}B`
  }
  if (tvl >= 1_000_000) {
    return `$${(tvl / 1_000_000).toFixed(0)}M`
  }
  return `$${(tvl / 1_000).toFixed(0)}K`
}

export function formatAPY(apy: number): string {
  return `${apy.toFixed(2)}%`
}
