import axios from 'axios'

export default async (_, res) => {
  const url = 'https://api.bittrex.com/api/v1.1/public/getmarketsummary?market=btc-html'
  let { data } = await axios.get(url)

  if (!data.success) {
    return res.json({ added: false, data: 'When added will notify on slack' })
  }

  const slack = 'https://hooks.slack.com/services/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'
  axios.post(slack, { text: 'HTML ADDED ON BITTREX' })

  data = data.result[0]
  return res.json({ added: true, data })
}
