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

export const mockLendingPools: LendingPool[] = [
  {
    id: '1',
    protocol: 'Aave V3',
    chain: 'Ethereum',
    asset: 'USDC',
    assetType: 'Stablecoin',
    supplyApy: 4.82,
    borrowApy: 5.91,
    tvl: 2_840_000_000,
    utilization: 81.6,
    riskRating: 'A',
    description: 'Main USDC pool on Aave V3. High liquidity, audited smart contracts, Chainlink oracle.',
    oracleSource: 'Chainlink',
    audited: true,
    insuranceCoverage: true,
    hadExploit: false,
    poolUrl: 'https://app.aave.com/'
  },
  {
    id: '2',
    protocol: 'Morpho',
    chain: 'Base',
    asset: 'USDC',
    assetType: 'Stablecoin',
    supplyApy: 6.24,
    borrowApy: 7.12,
    tvl: 485_000_000,
    utilization: 87.3,
    riskRating: 'B+',
    vaultComposition: [
      { asset: 'USDC', percentage: 65, color: '#2775CA' },
      { asset: 'cbETH collateral', percentage: 25, color: '#0052FF' },
      { asset: 'wstETH collateral', percentage: 10, color: '#00A3FF' }
    ],
    description: 'Morpho Blue vault with rate optimization. Collateral: cbETH, wstETH.',
    oracleSource: 'Chainlink + RedStone',
    audited: true,
    insuranceCoverage: false,
    hadExploit: false,
    poolUrl: 'https://app.morpho.org/vaults'
  },
  {
    id: '3',
    protocol: 'Euler',
    chain: 'Arbitrum',
    asset: 'ETH',
    assetType: 'Blue Chip',
    supplyApy: 2.14,
    borrowApy: 3.28,
    tvl: 892_000_000,
    utilization: 65.2,
    riskRating: 'B+',
    description: 'Native ETH pool on Euler v2. Low utilization, stable APY.',
    oracleSource: 'Chainlink',
    audited: true,
    insuranceCoverage: true,
    hadExploit: true,
    exploitDetails: 'Euler v1 exploited in March 2023 for $197M. Funds recovered. This is Euler v2.',
    poolUrl: 'https://app.euler.finance/'
  },
  {
    id: '4',
    protocol: 'Compound V3',
    chain: 'Ethereum',
    asset: 'WETH',
    assetType: 'Blue Chip',
    supplyApy: 1.89,
    borrowApy: 2.54,
    tvl: 1_230_000_000,
    utilization: 74.3,
    riskRating: 'A',
    description: 'Compound III with isolated markets. Safest option for ETH.',
    oracleSource: 'Chainlink',
    audited: true,
    insuranceCoverage: true,
    hadExploit: false,
    poolUrl: 'https://app.compound.finance/'
  },
  {
    id: '5',
    protocol: 'Spark',
    chain: 'Ethereum',
    asset: 'DAI',
    assetType: 'Stablecoin',
    supplyApy: 5.00,
    borrowApy: 5.53,
    tvl: 1_890_000_000,
    utilization: 90.4,
    riskRating: 'A',
    description: 'Spark Protocol - Aave fork managed by MakerDAO. DSR pass-through.',
    oracleSource: 'MakerDAO Oracle',
    audited: true,
    insuranceCoverage: true,
    hadExploit: false,
    poolUrl: 'https://app.spark.fi/'
  },
  {
    id: '6',
    protocol: 'Aave V3',
    chain: 'Arbitrum',
    asset: 'USDT',
    assetType: 'Stablecoin',
    supplyApy: 4.12,
    borrowApy: 5.67,
    tvl: 678_000_000,
    utilization: 72.8,
    riskRating: 'B+',
    description: 'USDT on Arbitrum with lower gas fees. High L2 liquidity.',
    oracleSource: 'Chainlink',
    audited: true,
    insuranceCoverage: true,
    hadExploit: false,
    poolUrl: 'https://app.aave.com/'
  },
  {
    id: '7',
    protocol: 'Morpho',
    chain: 'Ethereum',
    asset: 'wstETH',
    assetType: 'LST',
    supplyApy: 0.52,
    borrowApy: 1.84,
    tvl: 1_456_000_000,
    utilization: 28.4,
    riskRating: 'B',
    vaultComposition: [
      { asset: 'wstETH', percentage: 100, color: '#00A3FF' }
    ],
    description: 'Wrapped staked ETH vault. Additionally earn staking rewards (~3.2% APR).',
    oracleSource: 'Chainlink + Lido Oracle',
    audited: true,
    insuranceCoverage: false,
    hadExploit: false,
    poolUrl: 'https://app.morpho.org/vaults'
  },
  {
    id: '8',
    protocol: 'Fluid',
    chain: 'Ethereum',
    asset: 'USDC',
    assetType: 'Stablecoin',
    supplyApy: 3.77,
    borrowApy: 4.85,
    tvl: 234_000_000,
    utilization: 85.6,
    riskRating: 'B',
    vaultComposition: [
      { asset: 'USDC', percentage: 70, color: '#2775CA' },
      { asset: 'weETH collateral', percentage: 20, color: '#7C3AED' },
      { asset: 'rsETH collateral', percentage: 10, color: '#EC4899' }
    ],
    description: 'Fluid DEX with automatic rebalancing. Higher APY, higher smart contract risk.',
    oracleSource: 'RedStone + Pyth',
    audited: true,
    insuranceCoverage: false,
    hadExploit: false,
    poolUrl: 'https://fluid.io/lending/1'
  },
  {
    id: '9',
    protocol: 'Aave V3',
    chain: 'Base',
    asset: 'cbETH',
    assetType: 'LST',
    supplyApy: 0.34,
    borrowApy: 1.12,
    tvl: 345_000_000,
    utilization: 30.3,
    riskRating: 'B+',
    description: 'Coinbase staked ETH on Base. Native L2 with low costs.',
    oracleSource: 'Chainlink',
    audited: true,
    insuranceCoverage: true,
    hadExploit: false,
    poolUrl: 'https://app.aave.com/'
  },
  {
    id: '10',
    protocol: 'Euler',
    chain: 'Ethereum',
    asset: 'weETH',
    assetType: 'LRT',
    supplyApy: 0.89,
    borrowApy: 2.34,
    tvl: 567_000_000,
    utilization: 38.1,
    riskRating: 'C+',
    vaultComposition: [
      { asset: 'weETH', percentage: 100, color: '#7C3AED' }
    ],
    description: 'EtherFi wrapped eETH. Liquid restaking token with EigenLayer exposure.',
    oracleSource: 'RedStone',
    audited: true,
    insuranceCoverage: false,
    hadExploit: true,
    exploitDetails: 'Euler v1 exploited in March 2023 for $197M. Funds recovered. This is Euler v2.',
    poolUrl: 'https://app.euler.finance/'
  },
  {
    id: '11',
    protocol: 'Morpho',
    chain: 'Optimism',
    asset: 'USDC',
    assetType: 'Stablecoin',
    supplyApy: 5.67,
    borrowApy: 6.89,
    tvl: 189_000_000,
    utilization: 82.1,
    riskRating: 'B',
    vaultComposition: [
      { asset: 'USDC', percentage: 75, color: '#2775CA' },
      { asset: 'OP collateral', percentage: 25, color: '#FF0420' }
    ],
    description: 'Morpho on Optimism with OP token as collateral. Incentivized by OP Foundation.',
    oracleSource: 'Chainlink',
    audited: true,
    insuranceCoverage: false,
    hadExploit: false,
    poolUrl: 'https://app.morpho.org/vaults'
  },
  {
    id: '12',
    protocol: 'Compound V3',
    chain: 'Polygon',
    asset: 'USDC',
    assetType: 'Stablecoin',
    supplyApy: 3.45,
    borrowApy: 4.12,
    tvl: 412_000_000,
    utilization: 83.8,
    riskRating: 'B+',
    description: 'Compound on Polygon PoS. Low gas fees, stable network.',
    oracleSource: 'Chainlink',
    audited: true,
    insuranceCoverage: true,
    hadExploit: false,
    poolUrl: 'https://app.compound.finance/'
  },
  {
    id: '13',
    protocol: 'Aave V3',
    chain: 'Avalanche',
    asset: 'AVAX',
    assetType: 'Blue Chip',
    supplyApy: 1.23,
    borrowApy: 3.89,
    tvl: 234_000_000,
    utilization: 31.6,
    riskRating: 'B+',
    description: 'Native AVAX lending on Avalanche C-Chain.',
    oracleSource: 'Chainlink',
    audited: true,
    insuranceCoverage: true,
    hadExploit: false,
    poolUrl: 'https://app.aave.com/'
  },
  {
    id: '14',
    protocol: 'Spark',
    chain: 'Ethereum',
    asset: 'sDAI',
    assetType: 'Stablecoin',
    supplyApy: 5.00,
    borrowApy: 0,
    tvl: 2_100_000_000,
    utilization: 0,
    riskRating: 'A',
    description: 'Savings DAI - automatic DSR. No borrowing, pure yield.',
    oracleSource: 'MakerDAO Oracle',
    audited: true,
    insuranceCoverage: true,
    hadExploit: false,
    poolUrl: 'https://app.spark.fi/'
  },
  {
    id: '15',
    protocol: 'Fluid',
    chain: 'Arbitrum',
    asset: 'ETH',
    assetType: 'Blue Chip',
    supplyApy: 2.85,
    borrowApy: 3.92,
    tvl: 156_000_000,
    utilization: 68.4,
    riskRating: 'B',
    vaultComposition: [
      { asset: 'ETH', percentage: 60, color: '#627EEA' },
      { asset: 'ARB collateral', percentage: 40, color: '#28A0F0' }
    ],
    description: 'Fluid on Arbitrum with ARB as additional collateral.',
    oracleSource: 'Chainlink + Pyth',
    audited: true,
    insuranceCoverage: false,
    hadExploit: false,
    poolUrl: 'https://fluid.io/lending/1'
  }
]

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
