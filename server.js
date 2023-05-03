const express = require('express');
const app = express();
const port = 8000;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://psilwal50:y4AXI1Lbh5Gu6LT8@cluster0.po3udqy.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

var database;

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Get a reference to the database
    database = client.db('assignment');
    console.log("Connected to the database");
  } catch (e) {
    console.error("Failed to connect to the database:", e);
  }
}

run();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/scan', async(req, res) => {
await  database.collection('scannedData').find().toArray((err, result) => {
    if (err) {
      console.log('result');
      console.error("Failed to fetch data from the database:", err);
      return res.status(500).send("Failed to fetch data from the database");
    }
    console.log(result);
    res.json(result);
  });
  // const hero = await database.collection('scan_data').find().toArray()((err, result) => { 
  //   console.log(result);
  // });
  // res.send(hero);
});



app.post('/insertscandata', (req, res) => {
  const { field1, field2, field3, field4, field5 } = req.body;
  
  database.collection('scannedData').insertOne({ field1, field2, field3, field4, field5 }, (err, result) => {
    if (err) throw err;
    console.log("Data inserted successfully");
    res.send("Data inserted successfully");
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
