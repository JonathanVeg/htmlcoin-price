import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState, Fragment } from 'react'
import Entry from '../Entry'
import 'bootstrap/dist/css/bootstrap.css'

export default function Home() {
  const [entries, setEntries] = useState<[Entry]>([])

  function openLine(entry) {
    const index = entries.indexOf(entry)

    const newEntries = [...entries]

    newEntries[index].open = !newEntries[index].open

    setEntries(newEntries)
  }

  useEffect(() => {
    async function loadHitBtcData() {
      try {
        const url = '/api/hitbtc'

        const response = await axios.get(url)

        const data: [Entry] = response.data

        return data
      } catch (err) {
        console.log(err)
      }
    }

    async function loadCrexData() {
      try {
        const url = '/api/crex'

        const response = await axios.get(url)

        const data: [Entry] = response.data

        return data
      } catch (err) {
        console.log(err)
      }
    }

    async function load() {
      const data: [Entry] = []

      let d = await loadHitBtcData()
      data.push(...d)
      d = await loadCrexData()
      data.push(...d)

      console.log(data)

      setEntries(data)
    }

    load()
  }, [])

  return (
    <div className="container">
      <Head>
        <title>HTMLCoin Prices</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <div className="d-flex align-items-center">
          <div>
            <h1>HTMLCoin Prices</h1>
          </div>
        </div>

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
            {entries
              .filter((it) => it.exchange === 'Hitbtc')
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
      </div>

      <footer className="fixed-bottom d-flex justify-content-center">
        <a href="https://twitter.com/JonathanVeg2" target="_blank" rel="noreferrer">
          Made by @JonathanVeg2
        </a>
      </footer>
    </div>
  )
}
