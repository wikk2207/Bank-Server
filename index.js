const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const port = process.env.SERVER_PORT || 4000;
const app = express();

app.use(bodyParser.json());
app.use(cors({credentials: true, origin: true}));
app.use(cookieParser());
app.use('/api', apiRoutes);

app.get('/ping', (req, res, next)  => {
    res.status(200).json('pong!');
  });

app.listen(port, () => {
    console.log(`listening on ${port}`);
});
