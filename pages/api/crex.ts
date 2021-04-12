// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios'
import Entry from '../../Entry'

export default async (req, res) => {
  const url = 'https://api.crex24.com/v2/public/tickers'
  let { data } = await axios.get(url)

  data = data.filter((it) => it.instrument.indexOf('HTML') !== -1)

  const entries = []

  data.map((item) => {
    const market = item.instrument.split('-').find((item) => item !== 'HTML')

    console.log(market)

    const entry = new Entry()
    entry.market = market
    entry.exchange = 'Crex'
    entry.ask = item.ask.toFixed(11)
    entry.bid = item.bid.toFixed(11)
    entry.last = item.last.toFixed(11)
    entry.low = item.low.toFixed(11)
    entry.high = item.high.toFixed(11)
    entry.volume = item.baseVolume.toFixed(11)
    entry.volumeQuote = item.quoteVolume.toFixed(11)

    entries.push(entry)
  })

  res.status(200).json(entries)
}
