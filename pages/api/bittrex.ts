import axios from 'axios'
import Entry from '../../Entry'

export default async (_, res) => {
  const url = 'https://api.bittrex.com/api/v1.1/public/getmarketsummary?market=btc-html'
  let { data } = await axios.get(url)

  if (!data.success) {
    return res.json([])
  }

  data = data.result[0]

  const entry = new Entry()
  entry.market = 'BTC'
  entry.exchange = 'T1'
  entry.ask = data.Ask.toFixed(11)
  entry.bid = data.Bid.toFixed(11)
  entry.last = data.Last.toFixed(11)
  entry.low = data.Low.toFixed(11)
  entry.high = data.High.toFixed(11)
  entry.volumeQuote = data.BaseVolume.toFixed(11)
  entry.volume = data.Volume.toFixed(11)

  res.status(200).json([entry])
}
