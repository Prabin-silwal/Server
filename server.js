const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env || 8000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// url for the database
const uri = "mongodb+srv://psilwal50:S2EhyyJcIb88hEW6@assignment.lhchzfr.mongodb.net/Assignment2";

// mongodb connection
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
// body-parser
client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
    const server = app.listen(port, () => {
  
      console.log(`Server running at http://localhost:${port}`);
    });
    
  })
  .catch((err) => {
    console.error(err);
  });

 // routes
app.get('/api', (req, res) => {
  res.send('Hello World!');
});

// get all albums
app.get('/api/scan', async(req, res) => {
  try {
    const collection = client.db('Assignment2').collection('scanned_data');
    const result = await collection.find().toArray();
    console.log(result);
    res.json(result);
  } catch (err) {
    console.error("Failed to fetch data from the database:", err);
    res.status(500).send("Failed to fetch data from the database");
  }
});

//add the scanned data to the database
app.post('/api/uploadToCloud', async (req, res) => { 
  const data = req.body;

  client.db('Assignment2').collection('albums').insertMany(data).then(result => {
    
    console.log(`${result.insertedCount} document inserted`);
    res.status(200).json(result);
  }).catch(err => { 
    res.status(500).send("Failed to insert data into the database");
  });
});

//fetch the data from the database
app.get('/api/displayCloudData', async(req, res) => {
  try {
    const collection = client.db('Assignment2').collection('albums');
    const result = await collection.find().toArray();
    console.log(result);
    res.json(result); 
  } catch (err) {
    console.error("Failed to fetch data from the database:", err);
    res.status(500).send("Failed to fetch data from the database");
  }
});

// delete data from cloud

app.delete('/api/delete', async (req, res) => {
  try {
    const collection = client.db('Assignment2').collection('albums'); 
    const result = await db.collection('albums').deleteMany({});
    res.status(200).json({ message: `${result.deletedCount} documents deleted from ${collection} collection` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while deleting documents from the collection' });
  } finally {
    await client.close();
  }
});