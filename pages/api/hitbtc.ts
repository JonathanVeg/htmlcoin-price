import axios from 'axios'
import Entry from '../../Entry'

export default async (req, res) => {
  const url = 'https://api.hitbtc.com/api/2/public/ticker'
  let { data } = await axios.get(url)

  data = data.filter((it) => it.symbol.indexOf('HTML') !== -1)

  const entries = []

  data.map((item) => {
    const market = item.symbol.replace('HTML', '')

    const entry = new Entry()
    entry.market = market
    entry.exchange = 'Hitbtc'
    entry.ask = parseFloat(item.ask).toFixed(11)
    entry.bid = parseFloat(item.bid).toFixed(11)
    entry.last = parseFloat(item.last).toFixed(11)
    entry.low = parseFloat(item.low).toFixed(11)
    entry.high = parseFloat(item.high).toFixed(11)
    entry.volume = parseFloat(item.volume).toFixed(11)
    entry.volumeQuote = parseFloat(item.volumeQuote).toFixed(11)

    entries.push(entry)
  })

  res.status(200).json(entries)
}
