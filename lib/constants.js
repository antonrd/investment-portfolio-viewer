var Constants = {
  BUY: 'BUY',
  SELL: 'SELL',

  STOCK_BY_GEO: ["US", "INT"],
  STOCK_BY_CLASS: ["STOCK", "BOND", "REIT", "COMM"],
  STOCK_ALL: "ALL",

  STOCKS_FILE: 'stocks.csv',
  TRADES_FILE: 'trades.csv',

  NEXT_AMOUNT: 5000,

  RATIOS: {
    USSTOCK: 34,
    USBOND: 25,
    USREIT: 9,
    USCOMM: 0,
    INTSTOCK: 15,
    INTBOND: 3,
    INTREIT: 9,
    INTCOMM: 5,
  }
}

// USSTOCK -> VTI
// USBOND -> BND
// USREIT -> VNQ
// INTSTOCK -> VXUS
// INTBOND -> BOND
// INTREIT -> VNQI
// INTCOMM -> VDE, IAU
