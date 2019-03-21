const express = require('express');

const app = express();

const port = 65174;

app.use((req, res, next) => {
  res.send('hello world.')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}.`)
})