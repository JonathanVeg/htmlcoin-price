import axios from 'axios'
import Entry from '../../Entry'
import OrderEntry from '../../OrderEntry'

export default async (req, res) => {
  const url = 'https://api.hitbtc.com/api/2/public/orderbook/HTMLBTC?limit=0'
  const { data } = await axios.get(url)

  const bids: OrderEntry[] = []

  data.bid.map((item) => {
    const entry = new OrderEntry()
    entry.type = 'bid'
    entry.price = parseFloat(item.price)
    entry.quantity = parseFloat(item.size)

    bids.push(entry)
  })

  const asks: OrderEntry[] = []

  data.ask.map((item) => {
    const entry = new OrderEntry()
    entry.type = 'bid'
    entry.price = parseFloat(item.price)
    entry.quantity = parseFloat(item.size)

    asks.push(entry)
  })

  res.status(200).json({ bids, asks })
}
