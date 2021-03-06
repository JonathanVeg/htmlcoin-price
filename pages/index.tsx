import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState, Fragment } from 'react'
import Entry from '../Entry'
import 'bootstrap/dist/css/bootstrap.css'

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [btcBRL, setBtcBRL] = useState<number>(0.0)
  const [btcUSD, setBtcUSD] = useState<number>(0.0)
  const [htmlInBtc, setHtmlInBtc] = useState<number>(0.0)

  function openLine(entry) {
    const index = entries.indexOf(entry)

    const newEntries: Entry[] = [...entries]

    newEntries[index].open = !newEntries[index].open

    setEntries(newEntries)
  }

  useEffect(() => {
    async function loadBtcBRLData() {
      try {
        const url = '/api/bitcoin-brl'

        const { data } = await axios.get(url)

        setBtcBRL(data.ticker.last)
      } catch (err) {
        console.error(err)
      }
    }

    async function loadBtcUSDData() {
      try {
        const url = '/api/bitcoin-usd'

        const { data } = await axios.get(url)

        setBtcUSD(data.USD.last)
      } catch (err) {
        console.error(err)
      }
    }

    async function loadHitBtcData() {
      try {
        const url = '/api/hitbtc'

        const response = await axios.get(url)

        const data: Entry[] = response.data

        const f = data.find((it) => it.market.toLowerCase() === 'btc')

        if (f) setHtmlInBtc(parseFloat(f.bid))

        return data
      } catch (err) {
        console.error(err)
      }
    }

    async function loadCrexData() {
      try {
        const url = '/api/crex'

        const response = await axios.get(url)

        const data: Entry[] = response.data

        return data
      } catch (err) {
        console.error(err)
      }
    }

    async function loadBittrexData() {
      try {
        const url = '/api/bittrex'

        const response = await axios.get(url)

        const data: Entry[] = response.data

        return data
      } catch (err) {
        console.error(err)
      }
    }

    async function load() {
      const data: Entry[] = [new Entry()]

      let d = await loadHitBtcData()
      data.pop()
      data.push(...d)

      d = await loadCrexData()
      data.push(...d)

      d = await loadBittrexData()
      data.push(...d)

      setEntries(data)
    }

    loadBtcBRLData()
    loadBtcUSDData()
    load()
  }, [])

  const PrintTableByExchange = ({ exchangeName }) => (
    <Fragment>
      <h2 className="main-title">{exchangeName}</h2>
      {exchangeName === 'Hitbtc' && (
        <Fragment>
          <h3 className="main-title">
            1M HTML is about {(btcBRL * htmlInBtc * 1000000).toFixed(2)} BRL
          </h3>
          <h3 className="main-title">
            1M HTML is about {(btcUSD * htmlInBtc * 1000000).toFixed(2)} USD
          </h3>
        </Fragment>
      )}

      {(entries || []).length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <td>Market</td>
              <td>BID / ASK / Last</td>
              <td>Vol. (mkt)</td>
              {/* <td>Ask</td> */}
            </tr>
          </thead>
          <tbody>
            {(entries || [])
              .filter((it) => it.exchange === exchangeName)
              .map((entry) => {
                return (
                  <Fragment key={`${Math.random()}`}>
                    <tr key={`${Math.random()}`} onClick={() => openLine(entry)}>
                      <td>
                        {entry.market} {entry.open ? '???' : '???'}
                      </td>
                      <td>
                        {parseInt(entry.bid.toString().split('.')[1])}
                        {' / '}
                        {parseInt(entry.ask.toString().split('.')[1])}
                        {' / '}
                        {parseInt(entry.last.toString().split('.')[1])}
                      </td>
                      <td>{parseFloat(entry.volumeQuote).toFixed(4)}</td>
                    </tr>
                    {entry.open && (
                      <tr>
                        <td></td>
                        <td>
                          <small>
                            BID
                            <br />
                            ASK
                            <br />
                            LAST
                            <br />
                            HIGH
                            <br />
                            LOW
                          </small>
                        </td>
                        <td>
                          <small>
                            {entry.bid}
                            <br />
                            {entry.ask}
                            <br />
                            {entry.last}
                            <br />
                            {entry.high} / +
                            {((parseFloat(entry.high) / parseFloat(entry.last) - 1) * 100).toFixed(
                              2
                            )}
                            %
                            <br />
                            {entry.low} /
                            {((parseFloat(entry.low) / parseFloat(entry.last) - 1) * 100).toFixed(
                              2
                            )}
                            %
                          </small>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
          </tbody>
        </table>
      )}
    </Fragment>
  )

  return (
    <div className="container">
      <Head>
        <title>HTMLCoin Prices</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="d-flex align-items-center">
        <div className="table">
          <h1 className="main-title">HTMLCoin Prices</h1>
          <PrintTableByExchange exchangeName="Hitbtc" />
          <PrintTableByExchange exchangeName="Bittrex" />
          {/* <PrintTableByExchange exchangeName="Crex" /> */}
        </div>
      </div>

      <footer className="fixed-bottom d-flex justify-content-center">
        <a href="https://twitter.com/JonathanVeg2" target="_blank" rel="noreferrer">
          Made by @JonathanVeg2
        </a>
      </footer>
    </div>
  )
}
