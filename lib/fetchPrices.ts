import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const COINPAPRIKA_API = 'https://api.coinpaprika.com/v1';
const BINANCE_API = 'https://api.binance.com/api/v3';
const CRYPTOCOMPARE_API = 'https://min-api.cryptocompare.com';
const CRYPTOCOMPARE_API_KEY = process.env.CRYPTOCOMPARE_API_KEY || '';

interface CoinGeckoPriceData {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_market_cap: number;
  };
}

interface CoinPaprikaTicker {
  quotes: {
    USD: {
      price: number;
      market_cap: number;
      percent_change_24h: number;
    };
  };
}

interface CryptoPrice {
  price: number;
  change24h: number;
  marketCap: number;
}

interface CryptoPrices {
  bitcoin: CryptoPrice;
  litecoin: CryptoPrice;
  monero: CryptoPrice;
  dogecoin: CryptoPrice;
  kaspa: CryptoPrice;
  ethereumClassic: CryptoPrice;
  ravencoin: CryptoPrice;
  zcash: CryptoPrice;
  bitcoinCash: CryptoPrice;
  ergo: CryptoPrice;
  conflux: CryptoPrice;
}

// CoinPaprika coin IDs mapping
const COINPAPRIKA_IDS = {
  bitcoin: 'btc-bitcoin',
  litecoin: 'ltc-litecoin',
  monero: 'xmr-monero',
  dogecoin: 'doge-dogecoin',
  kaspa: 'kas-kaspa',
  ethereumClassic: 'etc-ethereum-classic',
  ravencoin: 'rvn-ravencoin',
  zcash: 'zec-zcash',
  bitcoinCash: 'bch-bitcoin-cash',
  ergo: 'efyt-ergo',
  conflux: 'cfx-conflux-network',
};

async function fetchFromCoinGecko(): Promise<CryptoPrices | null> {
  try {
    const response = await axios.get<CoinGeckoPriceData>(
      `${COINGECKO_API}/simple/price`,
      {
        params: {
          ids: 'bitcoin,litecoin,monero,dogecoin,kaspa,ethereum-classic,ravencoin,zcash,bitcoin-cash,ergo',
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_market_cap: true,
        },
        timeout: 5000,
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
      ravencoin: {
        price: response.data.ravencoin.usd,
        change24h: response.data.ravencoin.usd_24h_change,
        marketCap: response.data.ravencoin.usd_market_cap,
      },
      zcash: {
        price: response.data.zcash.usd,
        change24h: response.data.zcash.usd_24h_change,
        marketCap: response.data.zcash.usd_market_cap,
      },
      bitcoinCash: {
        price: response.data['bitcoin-cash'].usd,
        change24h: response.data['bitcoin-cash'].usd_24h_change,
        marketCap: response.data['bitcoin-cash'].usd_market_cap,
      },
      ergo: {
        price: response.data.ergo.usd,
        change24h: response.data.ergo.usd_24h_change,
        marketCap: response.data.ergo.usd_market_cap,
      },
      conflux: {
        price: 0,
        change24h: 0,
        marketCap: 0,
      },
    };
  } catch (error) {
    console.error('CoinGecko API failed:', error);
    return null;
  }
}

async function fetchFromCoinPaprika(): Promise<CryptoPrices | null> {
  try {
    // Fetch all coins in parallel
    const [btc, ltc, xmr, doge, kas, etc, rvn, zec, bch, erg, cfx] = await Promise.all([
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.bitcoin}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.litecoin}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.monero}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.dogecoin}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.kaspa}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.ethereumClassic}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.ravencoin}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.zcash}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.bitcoinCash}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.ergo}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.conflux}`, { timeout: 5000 }),
    ]);

    return {
      bitcoin: {
        price: btc.data.quotes.USD.price,
        change24h: btc.data.quotes.USD.percent_change_24h,
        marketCap: btc.data.quotes.USD.market_cap,
      },
      litecoin: {
        price: ltc.data.quotes.USD.price,
        change24h: ltc.data.quotes.USD.percent_change_24h,
        marketCap: ltc.data.quotes.USD.market_cap,
      },
      monero: {
        price: xmr.data.quotes.USD.price,
        change24h: xmr.data.quotes.USD.percent_change_24h,
        marketCap: xmr.data.quotes.USD.market_cap,
      },
      dogecoin: {
        price: doge.data.quotes.USD.price,
        change24h: doge.data.quotes.USD.percent_change_24h,
        marketCap: doge.data.quotes.USD.market_cap,
      },
      kaspa: {
        price: kas.data.quotes.USD.price,
        change24h: kas.data.quotes.USD.percent_change_24h,
        marketCap: kas.data.quotes.USD.market_cap,
      },
      ethereumClassic: {
        price: etc.data.quotes.USD.price,
        change24h: etc.data.quotes.USD.percent_change_24h,
        marketCap: etc.data.quotes.USD.market_cap,
      },
      ravencoin: {
        price: rvn.data.quotes.USD.price,
        change24h: rvn.data.quotes.USD.percent_change_24h,
        marketCap: rvn.data.quotes.USD.market_cap,
      },
      zcash: {
        price: zec.data.quotes.USD.price,
        change24h: zec.data.quotes.USD.percent_change_24h,
        marketCap: zec.data.quotes.USD.market_cap,
      },
      bitcoinCash: {
        price: bch.data.quotes.USD.price,
        change24h: bch.data.quotes.USD.percent_change_24h,
        marketCap: bch.data.quotes.USD.market_cap,
      },
      ergo: {
        price: erg.data.quotes.USD.price,
        change24h: erg.data.quotes.USD.percent_change_24h,
        marketCap: erg.data.quotes.USD.market_cap,
      },
      conflux: {
        price: cfx.data.quotes.USD.price,
        change24h: cfx.data.quotes.USD.percent_change_24h,
        marketCap: cfx.data.quotes.USD.market_cap,
      },
    };
  } catch (error) {
    console.error('CoinPaprika API failed:', error);
    return null;
  }
}

async function fetchConfluxFromBinance(): Promise<CryptoPrice | null> {
  try {
    const response = await axios.get(
      `${BINANCE_API}/ticker/24hr`,
      {
        params: { symbol: 'CFXUSDT' },
        timeout: 5000,
      }
    );

    return {
      price: parseFloat(response.data.lastPrice),
      change24h: parseFloat(response.data.priceChangePercent),
      marketCap: 0, // Binance doesn't provide market cap
    };
  } catch (error) {
    console.error('Binance API failed for Conflux:', error);
    return null;
  }
}

async function fetchConfluxFromCryptoCompare(): Promise<CryptoPrice | null> {
  try {
    if (!CRYPTOCOMPARE_API_KEY) {
      console.log('CryptoCompare API key not configured');
      return null;
    }

    const response = await axios.get(
      `${CRYPTOCOMPARE_API}/data/pricemultifull`,
      {
        params: { fsyms: 'CFX', tsyms: 'USD' },
        headers: { authorization: `Apikey ${CRYPTOCOMPARE_API_KEY}` },
        timeout: 5000,
      }
    );

    const cfxData = response.data.RAW.CFX.USD;
    return {
      price: cfxData.PRICE,
      change24h: cfxData.CHANGEPCT24HOUR,
      marketCap: cfxData.MKTCAP,
    };
  } catch (error) {
    console.error('CryptoCompare API failed for Conflux:', error);
    return null;
  }
}

// CryptoCompare fallback for ALL coins
async function fetchFromCryptoCompare(): Promise<CryptoPrices | null> {
  try {
    if (!CRYPTOCOMPARE_API_KEY) {
      console.log('CryptoCompare API key not configured for full fetch');
      return null;
    }

    const response = await axios.get(
      `${CRYPTOCOMPARE_API}/data/pricemultifull`,
      {
        params: { fsyms: 'BTC,LTC,XMR,DOGE,KAS,ETC,RVN,ZEC,BCH,ERG,CFX', tsyms: 'USD' },
        headers: { authorization: `Apikey ${CRYPTOCOMPARE_API_KEY}` },
        timeout: 10000,
      }
    );

    const raw = response.data.RAW;

    const extractCoin = (symbol: string): CryptoPrice => {
      if (raw[symbol]?.USD) {
        return {
          price: raw[symbol].USD.PRICE || 0,
          change24h: raw[symbol].USD.CHANGEPCT24HOUR || 0,
          marketCap: raw[symbol].USD.MKTCAP || 0,
        };
      }
      return { price: 0, change24h: 0, marketCap: 0 };
    };

    return {
      bitcoin: extractCoin('BTC'),
      litecoin: extractCoin('LTC'),
      monero: extractCoin('XMR'),
      dogecoin: extractCoin('DOGE'),
      kaspa: extractCoin('KAS'),
      ethereumClassic: extractCoin('ETC'),
      ravencoin: extractCoin('RVN'),
      zcash: extractCoin('ZEC'),
      bitcoinCash: extractCoin('BCH'),
      ergo: extractCoin('ERG'),
      conflux: extractCoin('CFX'),
    };
  } catch (error) {
    console.error('CryptoCompare API failed:', error);
    return null;
  }
}

export async function fetchCryptoPrices(): Promise<CryptoPrices> {
  // Fetch both sources in parallel (CoinGecko for most coins, CoinPaprika for Conflux)
  console.log('Attempting to fetch prices from CoinGecko and CoinPaprika...');
  const [coinGeckoData, coinPaprikaData] = await Promise.all([
    fetchFromCoinGecko(),
    fetchFromCoinPaprika(),
  ]);

  // If CoinGecko succeeded, merge with CoinPaprika for Conflux
  if (coinGeckoData && coinPaprikaData) {
    console.log('✅ Successfully fetched prices from CoinGecko + CoinPaprika (Conflux)');
    return {
      ...coinGeckoData,
      conflux: coinPaprikaData.conflux, // Use CoinPaprika for Conflux
    };
  }

  // If only CoinGecko succeeded, try CryptoCompare then Binance for Conflux
  if (coinGeckoData) {
    // Try CryptoCompare first (has market cap + 24h change)
    const cryptoCompareConflux = await fetchConfluxFromCryptoCompare();
    if (cryptoCompareConflux) {
      console.log('✅ Successfully fetched prices from CoinGecko + CryptoCompare (Conflux)');
      return {
        ...coinGeckoData,
        conflux: cryptoCompareConflux,
      };
    }

    // Fallback to Binance (has 24h change, no market cap)
    const binanceConflux = await fetchConfluxFromBinance();
    if (binanceConflux) {
      console.log('✅ Successfully fetched prices from CoinGecko + Binance (Conflux)');
      return {
        ...coinGeckoData,
        conflux: binanceConflux,
      };
    }

    console.log('✅ Successfully fetched prices from CoinGecko (Conflux unavailable)');
    return coinGeckoData;
  }

  // If only CoinPaprika succeeded, use it for all coins
  if (coinPaprikaData) {
    console.log('✅ Successfully fetched prices from CoinPaprika (fallback)');
    return coinPaprikaData;
  }

  // Try CryptoCompare as third-tier fallback for ALL coins
  console.log('Attempting CryptoCompare fallback for all coins...');
  const cryptoCompareData = await fetchFromCryptoCompare();
  if (cryptoCompareData) {
    console.log('✅ Successfully fetched prices from CryptoCompare (fallback for all coins)');
    return cryptoCompareData;
  }

  // Final fallback: return zeros (Minerstat will be used in the data merge layer)
  console.error('❌ All price APIs failed, returning zeros (Minerstat will be used as final fallback)');
  return {
    bitcoin: { price: 0, change24h: 0, marketCap: 0 },
    litecoin: { price: 0, change24h: 0, marketCap: 0 },
    monero: { price: 0, change24h: 0, marketCap: 0 },
    dogecoin: { price: 0, change24h: 0, marketCap: 0 },
    kaspa: { price: 0, change24h: 0, marketCap: 0 },
    ethereumClassic: { price: 0, change24h: 0, marketCap: 0 },
    ravencoin: { price: 0, change24h: 0, marketCap: 0 },
    zcash: { price: 0, change24h: 0, marketCap: 0 },
    bitcoinCash: { price: 0, change24h: 0, marketCap: 0 },
    ergo: { price: 0, change24h: 0, marketCap: 0 },
    conflux: { price: 0, change24h: 0, marketCap: 0 },
  };
}
