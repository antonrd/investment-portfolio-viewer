let Constants = {
  BUY: 'BUY',
  SELL: 'SELL',
  SPLIT: 'SPLIT',

  STOCK_BY_GEO: ["US", "INT"],
  STOCK_BY_CLASS: ["STOCK", "BOND", "REIT", "COMM"],
  STOCK_ALL: "ALL",

  STOCKS_FILE: 'stocks.csv',
  TRADES_FILE: 'trades.csv',
  DIVIDENDS_FILE: 'dividends.csv',

  // Amount of cash available to invest in the next period
  NEXT_AMOUNT: 1000,

  // Target allocation ratios (should sum to 100)
  RATIOS: {
    USSTOCK: 50,
    USBOND: 7,
    USREIT: 6,
    USCOMM: 0,
    INTSTOCK: 30,
    INTBOND: 2,
    INTREIT: 0,
    INTCOMM: 5,
  },

  // Exchange rates relative to USD
  CURRENCIES: {
    USD: 1.00,
    CHF: 1.00,
    EUR: 1.00,
  },

  DISPLAY_CURRENCY: "USD",
}

// USSTOCK -> VTI
// USBOND -> BND
// USREIT -> VNQ
// INTSTOCK -> VXUS
// INTBOND -> BOND
// INTREIT -> VNQI
// INTCOMM -> VDE, IAU
