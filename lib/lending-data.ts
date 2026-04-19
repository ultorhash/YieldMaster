export const ASSET_TYPES = ['Stablecoin', 'Blue Chip', 'LST', 'LRT', 'Volatile'] as const
export const RISK_LEVELS = ['A', 'B+', 'B', 'C+', 'C', 'D'] as const
export const CHAINS = [
  'Ethereum', 'Arbitrum', 'Base', 'Optimism', 'Polygon', 'Avalanche',
  'HyperEVM', 'Solana', 'Sui'
] as const
export const PROTOCOLS = [
  'Aave V3', 'Aave V4', 'Morpho', 'Euler', 'Compound V3', 'Spark', 'Fluid',
  'ExtraFi XLend', 'Auto', 'Moonwell', '40acres', 'Dolomite', 'Flux', 'YO',
  'Maple', 'TermMax', 'HyperLend', 'HypurrFi', 'Kamino', 'Save', 'Project Φ',
  'Loopscale', 'Navi', 'Scallop'
] as const

export type Chain = typeof CHAINS[number]
export type Protocol = typeof PROTOCOLS[number]
export type AssetType = typeof ASSET_TYPES[number]
export type RiskLevel = typeof RISK_LEVELS[number]

export interface ExploitRecord {
  type: 'logic' | 'oracle'
}

export interface LendingPool {
  id: string
  protocol: string
  chain: string
  asset: string
  assetType: AssetType
  supplyApy: number
  rewardApy: number
  totalApy: number
  tvl: number
  riskRating: RiskLevel
  audited: boolean
  insurance: boolean
  sigma: number
}

export const RISK_COLORS: Record<RiskLevel, string> = {
  'A': '#22C55E',
  'B+': '#84CC16',
  'B': '#EAB308',
  'C+': '#F97316',
  'C': '#EF4444',
  'D': '#DC2626'
}

export const CHAIN_COLORS: Record<Chain, string> = {
  'Ethereum': '#627EEA',
  'Arbitrum': '#28A0F0',
  'Base': '#0052FF',
  'Optimism': '#FF0420',
  'Polygon': '#8247E5',
  'Avalanche': '#E84142',
  'HyperEVM': '#0F3933',
  'Solana': '#00FFA3',
  'Sui': '#4DA2FF'
}

export const CHAIN_MAPPING: Record<string, string> = {
  'Ethereum': 'Ethereum',
  'Arbitrum': 'Arbitrum',
  'Base': 'Base',
  'Optimism': 'Optimism',
  'Polygon': 'Polygon',
  'Avalanche': 'Avalanche',
  'Hyperliquid L1': 'HyperEVM',
  'Solana': 'Solana',
  'Sui': 'Sui'
}

export const PROTOCOL_COLORS: Record<Protocol, string> = {
  'Aave V3': '#A463AF',
  'Aave V4': '#9D0AFF',
  'Morpho': '#1E88E5',
  'Euler': '#E6007A',
  'Compound V3': '#00D395',
  'Spark': '#F7931A',
  'Fluid': '#0A3898',
  'ExtraFi XLend': '#5052C9',
  'Auto': '#000000',
  'Moonwell': '#0069D3',
  '40acres': '#0A5631',
  'Dolomite': '#FFFFFF',
  'Flux': '#757575',
  'YO': '#D6FF34',
  'Maple': '#FE9D66',
  'TermMax': '#60C2FF',
  'HyperLend': '#13584E',
  'HypurrFi': '#A8E11A',
  'Kamino': '#272F7D',
  'Save': '#FF4F0F',
  'Project Φ': '#9658E6',
  'Loopscale': '#018CE2',
  'Navi': '#0DC3A4',
  'Scallop': '#F1D6C8',
}

export const PROTOCOL_MAPPING: Record<string, string> = {
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
  'dolomite': 'Dolomite',
  'flux-finance': 'Flux',
  'yo-protocol': 'YO',
  'maple': 'Maple',
  'termmax': 'TermMax',
  'hyperlend-pooled': 'HyperLend',
  'hypurrfi-isolated': 'HypurrFi',
  'hypurrfi-pooled': 'HypurrFi',
  'kamino-lend': 'Kamino',
  'save': 'Save',
  'project-0': 'Project Φ',
  'loopscale': 'Loopscale',
  'navi-lending': 'Navi',
  'scallop-lend': 'Scallop'
}

export const PROTOCOL_URLS: Record<Protocol, string> = {
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
  'Dolomite': 'https://app.dolomite.io/earn',
  'Flux': 'https://fluxfinance.com/lend',
  'YO': 'https://app.yo.xyz/',
  'Maple': 'https://app.maple.finance/earn',
  'TermMax': 'https://app.termmax.ts.finance/earn',
  'HyperLend': 'https://app.hyperlend.finance/markets',
  'HypurrFi': 'https://hypurrfi.com/lend',
  'Kamino': 'https://kamino.com/lend',
  'Save': 'https://save.finance/',
  'Project Φ': 'https://app.0.xyz/',
  'Loopscale': 'https://app.loopscale.com/lend',
  'Navi': 'https://app.naviprotocol.io/',
  'Scallop': 'https://app.scallop.io/'
}

export const EXPLOITED_PROTOCOLS: Record<string, ExploitRecord> = {
  'Aave V3': { type: 'oracle' },
  'Morpho': { type: 'oracle' },
  'Moonwell': { type: 'logic' },
  'Dolomite': { type: 'logic' },
  'YO': { type: 'logic' },
  'Save': { type: 'oracle' },
  'Loopscale': { type: 'oracle' }
}

export const EXPLOIT_PENALTY: Record<ExploitRecord['type'], number> = {
  logic: 2,
  oracle: 1
}

export function getProtocolUrl(protocol: string): string {
  return PROTOCOL_URLS[protocol as Protocol] ?? `https://defillama.com/protocol/${protocol.toLowerCase().replace(/\s+/g, '-')}`
}

export function formatTVL(tvl: number): string {
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(2)}B`
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(0)}M`
  return `$${(tvl / 1_000).toFixed(0)}K`
}

export function formatAPY(apy: number): string {
  return `${apy.toFixed(2)}%`
}
