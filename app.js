const express = require(`express`);
const path = require(`path`);
const stockFetch = require(`./stockmarket-fetch.js`);
const MongoClient = require(`mongodb`).MongoClient;
const ObjectId = require("mongodb").ObjectID;
const password = require(`./password.js`);

const uri = `mongodb+srv://kipodd:${password}@cluster0-omfb6.gcp.mongodb.net/test?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const PORT = process.env.PORT || 5000;
const app = express();

client.connect(err => {
    if (!err) {
        console.log("Mongodb connected successfully");
    } else {
        console.log(err);
        client.close();
    }
});

app.get(`/api/search`, async (req, res) => {
    const userQuery = req.query.query;

    if (userQuery) {
        const companiesProfiles = await stockFetch.getCompaniesProfiles(userQuery);
        const data = {
            query: userQuery,
            result: companiesProfiles,
            date: Date()
        };

        const collection = client.db(`nodejs_itc`).collection(`stocks`);
        collection.insertOne(data);
        res.json(companiesProfiles);
    } else {
        res.status(400).json({ msg: `No query parameter` })
    }
});

app.get(`/api/search-history`, (req, res) => {
    const collection = client.db(`nodejs_itc`).collection(`stocks`);
    collection.find({}).sort({ date: -1 }).toArray((err, result) => {
        res.json(result);
    });
});

app.delete('/api/search-history/:id', (req, res) => {
    const collection = client.db("nodejs_itc").collection("stocks");
    collection.deleteOne({ "_id": ObjectId(`${req.params.id}`) });
    res.json({ msg: `Document ${req.params.id} deleted.` });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'search-history.html'))
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));