var express = require('express');
var bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
var context = require('express-http-context');
const cookieParser = require('cookie-parser');

// Load Modules

const loader = require('./core/core.loader');
loader.load_all()

// Routers

var apiRouter = require('./routes/routes.api');
var guiRouter = require('./routes/routes.gui');

// Load Express

var app = express();

// Get Listen Port

const portfile = __dirname + '/.port';
var port = 80
try {
  var port = fs.readFileSync(portfile, { encoding: 'utf8', flag: 'r' })
} catch {
  var port = 80;
}
app.set('port', port);
fs.writeFileSync(portfile, port.toString())

// Set App Title

process.title = "fb-" + port.toString();

// Reverse Proxy / Load Balancer Support

app.set('trust proxy', function (ip) {
  var proxies = global.frostybot._modules_['core'].get_proxies();
  if (proxies !== false) {
    if (proxies.includes[ip]) return true;
  }
  return false;
});

// Save raw buffer for command parsing

function rawBufferSaver (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8')
  }
}

// Body parsers

app.use(bodyParser.raw({ type: 'text/plain', verify: rawBufferSaver }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Unique Request ID (HTTP Context)

app.use(context.middleware);
app.use(function (req, res, next) {
  context.set('reqId', uuidv4());
  var ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).replace('::ffff:', '').replace('::1, ', '');
  context.set('srcIp', ip);
  var reqId = context.get('reqId');
  next();
});

// Cookie Middleware

app.use(cookieParser());

// Setting up Views

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Static Assets

app.use(express.static('views/assets'))

// Router Configuration

app.use('/rest', apiRouter);      // REST API
app.use('/frostybot', apiRouter); // WebSocket API
app.use('/ui', guiRouter);        // GUI

app.post('/webhook', async function (req, res) {
  try {
    if (!req.rawBody) {
      const axios = require('axios')
      console.log('webhook', req.body)

      let command = ''
      let cmd = ''
      let maxsize
      let symbol
      let base
      let stub = req.body.stub

      if (req.body.action === 'buy') {
        cmd = 'trade:' + req.body.stub + ':' + req.body.market_position + ' symbol=' + req.body.basecurrency + '/' + req.body.currency + ' maxsize=' + req.body.maxsize + ' base=+' + req.body.contracts
        command = 'trade:' + req.body.market_position
        symbol = req.body.basecurrency + '/' + req.body.currency
        maxsize = req.body.maxsize
        base = '+' + req.body.contracts
      } else if (req.body.action === 'sell') {
        // 'frostybot trade:binance_future:close symbol=ETH/USDT base='

        cmd = 'trade:' + req.body.stub + ':close symbol=' + req.body.basecurrency + '/' + req.body.currency + ' base=' + req.body.contracts

        command = 'trade:close'
        symbol = req.body.basecurrency + '/' + req.body.currency
        base = req.body.contracts
      }

      if (cmd) {
        console.log({ cmd, stub, command, symbol, maxsize, base, })
        var url = await global.frostybot._modules_['core'].url();
        // Create new request for the signal processing
        axios.post(url + '/frostybot', { command, symbol, maxsize, base, stub })
      }
    }
  } catch (error) {
    console.error(error)
  }
})
// Redirect to the GUI
app.all('/', async function (req, res) {
  res.redirect('/ui')
  //  next();
});

// Exception Handler
app.use(function (err, req, res, next) {
  res.status(500).send(err.message);
});



// Export app

module.exports = app;
