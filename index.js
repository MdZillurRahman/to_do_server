const express = require('express')
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId  } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cnzif.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();

        const toDoCollection = client.db('to_do_list').collection('to_do');
       
        app.get('/task', async (req, res) => {
            const date = req.query.date;
            const query = {date: date};
            const cursor = toDoCollection.find(query);
            const taskList = await cursor.toArray();
            res.send(taskList);
        })

        app.post('/task', async (req, res) => {
            const task = req.body;
            const taskAdd = await toDoCollection.insertOne(task);
            res.send(taskAdd);
        })

        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await toDoCollection.deleteOne(query);
            res.send(result);
        });

        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id)  };
            const options = { upsert: true };
            const updateDoc = {
                $set: { role: 'completed' },
            };
            const result = await toDoCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.patch('/task/:id',async (req, res) => {
            const id = req.params.id;
            const task = req.body;
            const options = { upsert: true };
            const query = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: task,
            };
            const updateTask = await toDoCollection.updateOne(query, updatedDoc, options);
            res.send(updateTask);
        })



    }
    finally {

    }
}

run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})