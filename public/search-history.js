async function getQueryHistory(HOSTNAME, PORT) {
    let response = await fetch(`http://${HOSTNAME}:${PORT}/api/search-history`);
    return await response.json();
}

async function createQueryHistory(parentElement, queryHistory, HOSTNAME, PORT) {
    // console.log(queryHistory);
    queryHistory.map((query) => {
        parentElement.insertAdjacentHTML(`beforeend`, `
            <li class="list-group-item">
                <a href="http://${HOSTNAME}:${PORT}/api/search?query=${query.query}">
                    <span>Query: ${query.query}</span>
                    <span>Date: ${query.date}</span>
                </a>
            </li>
        `);
    });
}


const HOSTNAME = `localhost`;
const PORT = `5000`;
const resultsList = document.getElementById(`resultsList`);

(async () => {
    const queryHistory = await getQueryHistory(HOSTNAME, PORT);
    await createQueryHistory(resultsList, queryHistory, HOSTNAME, PORT);
})();