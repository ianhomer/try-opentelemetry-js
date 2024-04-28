const express = require("express");
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const port = 4318;

app.post("/v1/traces", (req, res) => {
  console.log(new Date());
  console.log(req.route);
  console.log(JSON.stringify(req.body, null, "  "));
  console.log(req.headers);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
