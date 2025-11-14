export interface HashrateData {
  timestamp: number;
  hashrate: number; // in EH/s for Bitcoin
  difficulty: number;
}

export interface NetworkStats {
  coin: string;
  symbol: string;
  currentHashrate: number;
  currentDifficulty: number;
  change7d: number;
  change30d: number;
  change90d: number;
  lastUpdated: number;
  historicalData: HashrateData[];
}

export interface CoinConfig {
  id: string;
  name: string;
  symbol: string;
  algorithm: string;
  unit: string; // EH/s, TH/s, MH/s
  enabled: boolean;
}
