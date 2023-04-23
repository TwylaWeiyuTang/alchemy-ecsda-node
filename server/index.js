const express = require("express");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "039c93ae178d6c90ecd219cf8ddaa84e34f58f8bd6c9984bd76a0895f7d0234e0b": 100,
  "03ca0a8ebcbfb6e824444b403564edeb2b2041d049a8f8a4561429c9e8da26fc0": 50,
  "0326aa9b9a05844b624048581a7b5afc22b9736c524129e4e79ed2e20a90891b12": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //TODO: get a signature from the client-side application
  // recover the public address from the signature

  const { sender, privateKey, recipient, amount } = req.body;
  console.log(toHex(secp.secp256k1.getPublicKey(privateKey)).toString());

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (sender === toHex(secp.secp256k1.getPublicKey(privateKey)).toString()) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
