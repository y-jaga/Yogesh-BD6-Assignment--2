const request = require('supertest');
const http = require('http');
const { app } = require('../index');
const { getAllStocks, getStockByTicker, addTrade } = require('../helper');

jest.mock('../helper', () => ({
  ...jest.requireActual('../helper'),
  getAllStocks: jest.fn(),
  getStockByTicker: jest.fn(),
  addTrade: jest.fn(),
}));

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll(() => {
  server.close(done);
});

describe('API Endpoint Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //Test 1: Get All Stocks
  it('GET API /stocks endpoint retrieves all stocks.', async () => {
    let mockStocks = [
      { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
      {
        stockId: 2,
        ticker: 'GOOGL',
        companyName: 'Alphabet Inc.',
        price: 2750.1,
      },
      { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.5 },
    ];

    getAllStocks.mockResolvedValue(mockStocks);
    const res = await request(server).get('/stocks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      stocks: [
        {
          stockId: 1,
          ticker: 'AAPL',
          companyName: 'Apple Inc.',
          price: 150.75,
        },
        {
          stockId: 2,
          ticker: 'GOOGL',
          companyName: 'Alphabet Inc.',
          price: 2750.1,
        },
        {
          stockId: 3,
          ticker: 'TSLA',
          companyName: 'Tesla, Inc.',
          price: 695.5,
        },
      ],
    });
    expect(res.body.stocks.length).toBe(3);
  });

  //Test 2: Get Stock by Ticker
  it('GET API /stocks/:ticker endpoint retrieves a specific stock by ticker.', async () => {
    let mockStock = {
      stockId: 1,
      ticker: 'AAPL',
      companyName: 'Apple Inc.',
      price: 150.75,
    };

    getStockByTicker.mockResolvedValue(mockStock);
    const res = await request(server).get('/stocks/AAPL');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      stock: mockStock,
    });
  });

  //Test 3: Add a New Trade
  it('POST API /trades endpoint adds a new trade with valid input.', async () => {
    let mockAddedTrade = {
      tradeId: 4,
      stockId: 1,
      quantity: 15,
      tradeType: 'buy',
      tradeDate: '2024-08-08',
    };

    addTrade.mockResolvedValue(mockAddedTrade);
    const res = await request(server).post('/trades/new').send({
      stockId: 1,
      quantity: 15,
      tradeType: 'buy',
      tradeDate: '2024-08-08',
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      trade: mockAddedTrade,
    });
  });

  //Test 4: Error Handling for Get Stock by Invalid Ticker
  it('GET API /stocks/:ticker endpoint returns a 404 when provided with an invalid ticker.', async () => {
    getStockByTicker.mockResolvedValue(null);
    const res = await request(server).get('/stocks/LPAA');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'No stock found.' });
  });

  //Test 5: Input Validation for Add Trade
  it('POST API /trades endpoint returns a 400 when provided with invalid input.', async () => {
    const res = await request(server).post('/trades/new').send({
      quantity: 15,
      tradeType: 'buy',
      tradeDate: '2024-08-08',
    });
    expect(res.status).toBe(400);
    expect(res.text).toEqual('stockId is required and should be number.');
  });
});

describe('Helper Functions Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //Test 6: Mock getAllStocks Function
  it('should returns all stocks', () => {
    const mockstocks = [
      {
        stockId: 1,
        ticker: 'AAPL',
        companyName: 'Apple Inc.',
        price: 150.75,
      },
      {
        stockId: 2,
        ticker: 'GOOGL',
        companyName: 'Alphabet Inc.',
        price: 2750.1,
      },
      {
        stockId: 3,
        ticker: 'TSLA',
        companyName: 'Tesla, Inc.',
        price: 695.5,
      },
    ];

    getAllStocks.mockReturnValue(mockstocks);

    const result = getAllStocks();
    expect(result).toEqual(mockstocks);
    expect(result.length).toBe(mockstocks.length);
  });

  //Test 7: Mock Add Trade Function (Async)
  it('should add new trade', async () => {
    const mockNewTrade = {
      stockId: 1,
      quantity: 15,
      tradeType: 'buy',
      tradeDate: '2024-08-08',
    };

    const res = await addTrade(mockNewTrade);
    expect(res).toEqual({
      tradeId: 4,
      stockId: 1,
      quantity: 15,
      tradeType: 'buy',
      tradeDate: '2024-08-08',
    });
  });
});
