// (1)LONG
// const body = { "stub": "binance_future", "ticker": "ETHUSDT", "market_position": "long", "market_position_size": "0.0386", "position_size": "0.0386", "interval": "1", "timenow": "2022-02-24T23:16:00Z", "action": "buy", "contracts": "0.0386", "price": "2588.2000000000003", "comment": "Long", "botType": "ANN", "maxsize": "0.0965922263", "basecurrency": "ETH", "currency": "USDT" }

// (2)SHORT
// const body = { "stub": "binance_future", "ticker": "ETHUSDT", "market_position": "short", "market_position_size": "0.0386", "position_size": "-0.0386", "interval": "1", "timenow": "2022-02-24T23:17:00Z", "action": "sell", "contracts": "0.0772", "price": "2587.71", "comment": "Short", "botType": "ANN", "maxsize": "0.0965922437", "basecurrency": "ETH", "currency": "USDT" }

// (3)CLOSE SHORT
// const body = { "stub": "binance_future", "ticker": "ETHUSDT", "market_position": "flat", "market_position_size": "0", "position_size": "0", "interval": "1", "timenow": "2022-02-24T23:18:00Z", "action": "buy", "contracts": "0.0386", "price": "2584.75", "comment": "SL", "botType": "ANN", "maxsize": "0.0968043944", "basecurrency": "ETH", "currency": "USDT" }

// (4)LONG
// const body = { "stub": "binance_future", "ticker": "ETHUSDT", "market_position": "long", "market_position_size": "0.0387", "position_size": "0.0387", "interval": "1", "timenow": "2022-02-24T23:19:00Z", "action": "buy", "contracts": "0.0387", "price": "2584.55", "comment": "Long", "botType": "ANN", "maxsize": "0.0968208605", "basecurrency": "ETH", "currency": "USDT" }

// (5)CLOSE LONG
const body = { "stub": "binance_future", "ticker": "ETHUSDT", "market_position": "flat", "market_position_size": "0", "position_size": "0", "interval": "1", "timenow": "2022-02-24T23:20:00Z", "action": "sell", "contracts": "0.0387", "price": "2585.84", "comment": "SL", "botType": "ANN", "maxsize": "0.0968208251", "basecurrency": "ETH", "currency": "USDT" }


// (6)SHORT
// (7)CLOSE ALL




// const body = { "stub": "binance_future", "ticker": "ETHUSDT", "market_position": "short", "market_position_size": "2.779", "position_size": "-2.779", "interval": "60", "timenow": "2022-02-24T21:55:00Z", "action": "sell", "contracts": "5.558", "price": "2635", "comment": "Short", "botType": "ANN", "maxsize": "6.9475320756", "basecurrency": "ETH", "currency": "USDT" }

// 기존봇
// { "stub": "binance_future", "ticker": "ETHUSDT", "market_position": "long", "market_position_size": "0.171", "position_size": "0.171", "interval": "60", "timenow": "2022-02-18T02:00:00Z", "action": "buy", "contracts": "0.171", "price": "2908.35","comment": "LEn" ,"maxsize":"0.8554879781","basecurrency":"ETH","currency":"USDT" }


// console.log('body', body)

let command = ''
let cmd = ''
let maxsize
let symbol
let base
let stub = body.stub

if (body.botType === 'ANN') {
  if (body.market_position === 'long' || body.market_position === 'short') {
    cmd = 'trade:' + body.stub + ':' + body.market_position + ' symbol=' + body.basecurrency + '/' + body.currency + ' maxsize=' + body.maxsize + ' base=' + body.market_position_size
    command = 'trade:' + body.market_position
    symbol = body.basecurrency + '/' + body.currency
    maxsize = body.maxsize
    base = body.market_position_size
  } else {
    cmd = 'trade:' + body.stub + ':close symbol=' + body.basecurrency + '/' + body.currency + ' base=' + body.contracts

    command = 'trade:close'
    symbol = body.basecurrency + '/' + body.currency
    base = body.market_position_size
  }
} else {
  // 기존봇

}
if (cmd) {
  console.log({ cmd, stub, command, symbol, maxsize, base, })
  // var url = await global.frostybot._modules_['core'].url();
  // Create new request for the signal processing
  // axios.post(url + '/frostybot', { command, symbol, maxsize, base, stub })
}