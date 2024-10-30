const express = require('express');
const app = express();
const { getAllStocks, getStockByTicker, addTrade } = require('./helper');
app.use(express.json());

//Exercise 1: Retrieve All Stocks
//API Call: http://localhost:3000/stocks

app.get('/stocks', async (req, res) => {
  let stocks = await getAllStocks();

  res.json({ stocks });
});

//Exercise 2: Retrieve Stock by Ticker
//API Call: http://localhost:3000/stocks/AAPL

app.get('/stocks/:ticker', async (req, res) => {
  let ticker = req.params.ticker;
  let stock = await getStockByTicker(ticker);

  if (!stock) {
    return res.status(404).json({ message: 'No stock found.' });
  }

  res.json({ stock });
});

//Exercise 3: Add a New Trade
//API Call: http://localhost:3000/trades/new

function validateTrade(newTrade) {
  if (!newTrade.stockId && typeof newTrade.stockId !== 'number') {
    return 'stockId is required and should be number.';
  }
  if (!newTrade.quantity && typeof newTrade.quantity !== 'number') {
    return 'quantity is required and should be number.';
  }
  if (!newTrade.tradeType && typeof newTrade.tradeType !== 'string') {
    return 'tradeType is required and should be number.';
  }
  if (!newTrade.tradeDate && typeof newTrade.tradeDate !== 'string') {
    return 'tradeDate is required and should be number.';
  }
  return null;
}

app.post('/trades/new', async (req, res) => {
  let newTrade = req.body;
  let error = validateTrade(newTrade);

  if (error) {
    return res.status(400).send(error);
  }

  let addedTrade = await addTrade(newTrade);
  res.status(201).json({ trade: addedTrade });
});

module.exports = { app };
