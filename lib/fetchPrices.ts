import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

interface CoinGeckoPriceData {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_market_cap: number;
  };
}

export async function fetchCryptoPrices() {
  try {
    const response = await axios.get<CoinGeckoPriceData>(
      `${COINGECKO_API}/simple/price`,
      {
        params: {
          ids: 'bitcoin,litecoin,monero,dogecoin,kaspa,ethereum-classic',
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_market_cap: true,
        },
      }
    );

    return {
      bitcoin: {
        price: response.data.bitcoin.usd,
        change24h: response.data.bitcoin.usd_24h_change,
        marketCap: response.data.bitcoin.usd_market_cap,
      },
      litecoin: {
        price: response.data.litecoin.usd,
        change24h: response.data.litecoin.usd_24h_change,
        marketCap: response.data.litecoin.usd_market_cap,
      },
      monero: {
        price: response.data.monero.usd,
        change24h: response.data.monero.usd_24h_change,
        marketCap: response.data.monero.usd_market_cap,
      },
      dogecoin: {
        price: response.data.dogecoin.usd,
        change24h: response.data.dogecoin.usd_24h_change,
        marketCap: response.data.dogecoin.usd_market_cap,
      },
      kaspa: {
        price: response.data.kaspa.usd,
        change24h: response.data.kaspa.usd_24h_change,
        marketCap: response.data.kaspa.usd_market_cap,
      },
      ethereumClassic: {
        price: response.data['ethereum-classic'].usd,
        change24h: response.data['ethereum-classic'].usd_24h_change,
        marketCap: response.data['ethereum-classic'].usd_market_cap,
      },
    };
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    // Return fallback data if API fails
    return {
      bitcoin: { price: 0, change24h: 0, marketCap: 0 },
      litecoin: { price: 0, change24h: 0, marketCap: 0 },
      monero: { price: 0, change24h: 0, marketCap: 0 },
      dogecoin: { price: 0, change24h: 0, marketCap: 0 },
      kaspa: { price: 0, change24h: 0, marketCap: 0 },
      ethereumClassic: { price: 0, change24h: 0, marketCap: 0 },
    };
  }
}
