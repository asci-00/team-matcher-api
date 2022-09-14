const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');

const env_path =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';
require('dotenv').config({ path: path.join(__dirname, env_path) });

const authorization = require('@/controllers/authorization');
const member = require('@/controllers/member');

const app = express();

console.log(process.env.ALLOW_ORIGIN);

app
  .use(cors({ origin: process.env.ALLOW_ORIGIN, credentials: true }))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cookieParser());

app.use('/health-check', (req, res) =>
  res.status(200).send({ message: 'health!' })
);
app.use('/member', member);
app.use('/', authorization);

app.listen(process.env.PORT, () => {
  console.log(`application listening on port ${process.env.PORT}`);
});
