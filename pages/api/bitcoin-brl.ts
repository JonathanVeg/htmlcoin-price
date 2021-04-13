import axios from 'axios'

export default async (req, res) => {
  const url = 'https://www.mercadobitcoin.net/api/BTC/ticker/'
  const { data } = await axios.get(url)

  res.status(200).json(data)
}
