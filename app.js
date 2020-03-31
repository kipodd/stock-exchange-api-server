const express = require(`express`);
const fetch = require(`isomorphic-fetch`);
const path = require(`path`);
const stockFetch = require(`./stockmarket-fetch.js`);

const PORT = process.env.PORT || 5000;
const app = express();

app.get(`/search`, async (req, res) => {
    const userQuery = req.query.query;
    if (userQuery) {
        const companiesProfiles = await stockFetch.getCompaniesWithProfiles(userQuery);
        // console.log(companiesProfiles);
        await res.json(companiesProfiles);
    } else {
        res.status(400).json({ msg: `No query parameter` })
    }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));