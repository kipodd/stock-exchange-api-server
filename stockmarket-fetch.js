async function getCompanies(query) {
    let response = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&exchange=NASDAQ`);
    return await response.json();
}

async function getCompanyProfile(symbol) {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/company/profile/${symbol}`);
    return await response.json();
}

async function getCompaniesWithProfiles(query) {
    const companies = await getCompanies(query); // returns a promise
    const companiesWithProfiles = companies.map(company => {
        return getCompanyProfile(company.symbol);
    }); // returns a promise
    return await Promise.all(companiesWithProfiles);
}



module.exports = {getCompanies, getCompanyProfile, getCompaniesWithProfiles};