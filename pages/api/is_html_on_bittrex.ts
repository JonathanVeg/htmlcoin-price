import axios from 'axios'

export default async (_, res) => {
  const url = 'https://api.bittrex.com/api/v1.1/public/getmarketsummary?market=btc-html'
  let { data } = await axios.get(url)

  if (!data.success) {
    return res.json({ added: false })
  }

  data = data.result[0]
  return res.json({ added: true, data })
}
