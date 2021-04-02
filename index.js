const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ykirh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("ChainSmoker").collection("products");
  const ordersCollection = client.db("ChainSmoker").collection("orders");


  app.post('/addProducts', (req, res) => {
    const products = req.body;
    productCollection.insertMany(products)
    .then(result => {
      res.send(result.insertedCount);
    })
  })

  app.get('/products', (req, res) => {
    productCollection.find({})
    .toArray((err, documents) => {
    	res.send(documents);
    })
  })
  
  app.get('/product/:id', (req, res) => {
        productCollection.find({_id: ObjectId(req.params.id)})
        .toArray( (err, documents) => {
            res.send(documents[0]);
        })
    })
    
    app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  })
  
  app.get('/client/:email', (req, res) => {
  		console.log(req.params.email);
        ordersCollection.find({ clientGmail:req.params.email })
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })
  
});

app.get('/', (req,res) => {
	res.send("Hello World");
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})











