import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState, Fragment } from 'react'
import Entry from '../Entry'
import 'bootstrap/dist/css/bootstrap.css'
import OrderEntry from '../OrderEntry'

export default function Calculator() {
  const [quantity, setQuantity] = useState<number>(0.0)
  const [quantityToBuy, setQuantityToBuy] = useState<number>(0.0)
  const [resumeToBuy, setResumeToBuy] = useState<string>('')

  const [quantityToSell, setQuantityToSell] = useState<number>(0.0)
  const [resumeToSell, setResumeToSell] = useState<string>('')

  const [btcBRL, setBtcBRL] = useState<number>(0.0)
  const [btcUSD, setBtcUSD] = useState<number>(0.0)
  const [htmlInBtc, setHtmlInBtc] = useState<number>(0.0)

  const [bids, setBids] = useState<OrderEntry[]>([])
  const [asks, setAsks] = useState<OrderEntry[]>([])

  const onChange = (event) => {
    localStorage.setItem('quantityInLocalStorage', event.target.value)
    setQuantity(event.target.value)
  }

  const onChangeQuantityToBuy = (event) => {
    localStorage.setItem('quantityToBuyInLocalStorage', event.target.value)
    setQuantityToBuy(event.target.value)
  }

  const onChangeQuantityToSell = (event) => {
    localStorage.setItem('quantityToSellInLocalStorage', event.target.value)
    setQuantityToSell(event.target.value)
  }

  useEffect(() => {
    const quantity = quantityToBuy || parseFloat('0.0')

    let totalInBtc = 0.0
    let quantityDone = 0.0
    let lastAsk = 0.0

    asks.map((ask) => {
      if (quantityDone < quantity) {
        if (quantityDone + ask.quantity > quantity) {
          quantityDone += quantity - quantityDone
          totalInBtc += (quantity - quantityDone) * ask.price
        } else {
          quantityDone += ask.quantity
          totalInBtc += ask.quantity * ask.price
        }

        lastAsk = ask.price
      }
    })

    const text =
      'To buy ' +
      quantityDone.toFixed(0) +
      ' HTMLs with the currenty asks, you need to pay about ' +
      totalInBtc.toFixed(8) +
      ' (' +
      (totalInBtc * btcBRL).toFixed(2) +
      ' BRL or ' +
      (totalInBtc * btcUSD).toFixed(2) +
      ' USD)' +
      ' and you would move the price to ' +
      lastAsk.toFixed(11)

    setResumeToBuy(text)
  }, [quantityToBuy, asks])

  useEffect(() => {
    const quantity = quantityToSell || parseFloat('0.0')

    let totalInBtc = 0.0
    let quantityDone = 0.0
    let lastBid = 0.0

    bids.map((bid) => {
      if (quantityDone < quantity) {
        if (quantityDone + bid.quantity > quantity) {
          quantityDone += quantity - quantityDone
          totalInBtc += (quantity - quantityDone) * bid.price
        } else {
          quantityDone += bid.quantity
          totalInBtc += bid.quantity * bid.price
        }

        lastBid = bid.price
      }
    })

    const text =
      'To sell ' +
      quantityDone.toFixed(0) +
      ' HTMLs with the currenty asks, you need to pay about ' +
      totalInBtc.toFixed(8) +
      ' (' +
      (totalInBtc * btcBRL).toFixed(2) +
      ' BRL or ' +
      (totalInBtc * btcUSD).toFixed(2) +
      ' USD)' +
      ' and you would drop the price to ' +
      lastBid.toFixed(11)

    setResumeToSell(text)
  }, [quantityToSell, bids])

  useEffect(() => {
    const val = localStorage.getItem('quantityInLocalStorage')

    if (val) {
      setQuantity(parseFloat(val))
    }

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

    async function loadHitBtcDataOrders() {
      try {
        const url = '/api/hitbtc-orders'

        const { data } = await axios.get(url)

        setBids(data.bids)
        setAsks(data.asks)
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

        if (f) setHtmlInBtc(parseFloat(f.last))

        return data
      } catch (err) {
        console.error(err)
      }
    }

    loadBtcBRLData()
    loadBtcUSDData()
    loadHitBtcData()
    loadHitBtcDataOrders()
  }, [])

  const calculator = (
    <div className="d-flex align-items-center">
      <div className="table">
        <h1 className="main-title">HTMLCoin Calculator</h1>

        <form>
          <div className="form-group">
            <label htmlFor="HTML Quantity">HTML Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={onChange}
              className="form-control"
              id="HTML Quantity"
              placeholder="Enter HTML Quantity"
            />
          </div>
        </form>

        <div className="d-flex align-items-center">
          <div className="table">
            <Fragment>
              <h3 className="main-title">
                {quantity} HTML is about {(btcBRL * htmlInBtc * quantity).toFixed(2)} BRL
              </h3>
              <h3 className="main-title">
                {quantity} HTML is about {(btcUSD * htmlInBtc * quantity).toFixed(2)} USD
              </h3>

              <center>
                <small>
                  It is calculated using the last price traded in the pair HTML-BTC in HitBTC
                  <br />
                  and the price of Bitcoin in BRL and USD
                </small>
              </center>
            </Fragment>
          </div>
        </div>
      </div>
    </div>
  )

  const buy = (
    <div className="d-flex align-items-center">
      <div className="table">
        <h1 className="main-title">Buy HTML</h1>

        <form>
          <div className="form-group">
            <label htmlFor="htmlQuantityToBuy">HTML Quantity You want to Buy</label>
            <input
              type="number"
              value={quantityToBuy}
              onChange={onChangeQuantityToBuy}
              className="form-control"
              id="htmlQuantityToBuy"
              aria-describedby="emailHelp"
              placeholder="Enter HTML Quantity"
            />
          </div>
        </form>

        <div className="d-flex align-items-center">
          <div className="table">
            <Fragment>
              <p className="main-title">{resumeToBuy}</p>
            </Fragment>
          </div>
        </div>
      </div>
    </div>
  )

  const sell = (
    <div className="d-flex align-items-center">
      <div className="table">
        <h1 className="main-title">Sell HTML</h1>

        <form>
          <div className="form-group">
            <label htmlFor="htmlQuantityToSell">HTML Quantity You want to Sell</label>
            <input
              type="number"
              value={quantityToSell}
              onChange={onChangeQuantityToSell}
              className="form-control"
              id="htmlQuantityToSell"
              aria-describedby="emailHelp"
              placeholder="Enter HTML Quantity"
            />
          </div>
        </form>

        <div className="d-flex align-items-center">
          <div className="table">
            <Fragment>
              <p className="main-title">{resumeToSell}</p>
            </Fragment>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container">
      <Head>
        <title>HTMLCoin Calculator</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      {calculator}
      {buy}
      {sell}

      <footer className="fixed-bottom d-flex justify-content-center">
        <a href="https://twitter.com/JonathanVeg2" target="_blank" rel="noreferrer">
          Made by @JonathanVeg2
        </a>
      </footer>
    </div>
  )
}
