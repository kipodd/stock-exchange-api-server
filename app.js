const express = require(`express`);
const fetch = require(`isomorphic-fetch`);
const path = require(`path`);
const stockFetch = require(`./stockmarket-fetch.js`);
const MongoClient = require(`mongodb`).MongoClient;
const password = require(`./password.js`);

const uri = `mongodb+srv://kipodd:${password}@cluster0-omfb6.gcp.mongodb.net/test?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

const PORT = process.env.PORT || 5000;
const app = express();

app.get(`/search`, async (req, res) => {
    const userQuery = req.query.query;

    if (userQuery) {
        const companiesProfiles = await stockFetch.getCompaniesWithProfiles(userQuery);
        const data = {
            query: userQuery,
            result: companiesProfiles,
            date: Date()
        };

        await client.connect(async err => {
            const collection = client.db(`nodejs_itc`).collection(`stocks`);
            await collection.insertOne(data);
            await client.close();
        });
        await res.json(companiesProfiles);
    } else {
        res.status(400).json({ msg: `No query parameter` })
    }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));