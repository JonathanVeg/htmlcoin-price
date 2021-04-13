import axios from 'axios'

export default async (req, res) => {
  const url = 'https://blockchain.info/ticker'
  const { data } = await axios.get(url)

  res.status(200).json(data)
}
