import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState, Fragment } from 'react'
import Entry from '../Entry'
import 'bootstrap/dist/css/bootstrap.css'

export default function Home() {
  const [entries, setEntries] = useState<[Entry] | null>(null)
  const [btcBRL, setBtcBRL] = useState<number>(0.0)
  const [btcUSD, setBtcUSD] = useState<number>(0.0)
  const [htmlInBtc, setHtmlInBtc] = useState<number>(0.0)

  useEffect(() => {
    console.log(btcBRL)
  }, [btcBRL])
  useEffect(() => {
    console.log(btcUSD)
  }, [btcUSD])

  function openLine(entry) {
    const index = entries.indexOf(entry)

    const newEntries: [Entry] = [...entries]

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

        const data: [Entry] = response.data

        console.log(data)

        const f = data.find((it) => it.market.toLowerCase() === 'btcBRL')

        if (f) setHtmlInBtc(parseFloat(f.last))

        return data
      } catch (err) {
        console.error(err)
      }
    }

    async function loadCrexData() {
      try {
        const url = '/api/crex'

        const response = await axios.get(url)

        const data: [Entry] = response.data

        return data
      } catch (err) {
        console.error(err)
      }
    }

    async function load() {
      const data: [Entry] = [new Entry()]

      let d = await loadHitBtcData()
      data.pop()
      data.push(...d)
      d = await loadCrexData()
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

      <table className="table">
        <thead>
          <tr>
            <td>Market</td>
            <td>Last</td>
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
                      {entry.market} {entry.open ? '▲' : '▼'}
                    </td>
                    <td>{entry.last}</td>
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
                        </small>
                      </td>
                      <td>
                        <small>
                          {entry.bid}
                          <br />
                          {entry.ask}
                        </small>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
        </tbody>
      </table>
    </Fragment>
  )

  return (
    <div className="container">
      <Head>
        <title>HTMLCoin Prices</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <div className="container"> */}
      <div className="d-flex align-items-center">
        <div className="table">
          <h1 className="main-title">HTMLCoin Prices</h1>
          <PrintTableByExchange exchangeName="Hitbtc" />
          <PrintTableByExchange exchangeName="Crex" />
        </div>
      </div>
      {/* </div> */}

      <footer className="fixed-bottom d-flex justify-content-center">
        <a href="https://twitter.com/JonathanVeg2" target="_blank" rel="noreferrer">
          Made by @JonathanVeg2
        </a>
      </footer>
    </div>
  )
}
