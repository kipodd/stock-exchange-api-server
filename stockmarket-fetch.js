const fetch = require(`isomorphic-fetch`);

async function getCompanies(query) {
  let response = await fetch(
    `https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&exchange=NASDAQ&apikey=4c4b4a6db91e54a7db74a9de8c1895b6`
  );
  return await response.json();
}

async function getCompanyProfile(symbol) {
  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/company/profile/${symbol}?apikey=4c4b4a6db91e54a7db74a9de8c1895b6`
  );
  return await response.json();
}

async function getCompaniesProfiles(query) {
  const companies = await getCompanies(query);
  const companiesProfiles = companies.map(company => {
    return getCompanyProfile(company.symbol);
  });
  return await Promise.all(companiesProfiles);
}

module.exports = {getCompaniesProfiles};
