// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios'
import Entry from '../../Entry'

export default async (req, res) => {
  const url = 'https://www.mercadobitcoin.net/api/BTC/ticker/'
  const { data } = await axios.get(url)

  res.status(200).json(data)
}
