async function getQueryHistory(HOSTNAME, PORT) {
  let response = await fetch(`http://${HOSTNAME}:${PORT}/api/search-history`);
  return await response.json();
}

async function renderQueryHistory(parentElement, queryHistory, HOSTNAME, PORT) {
  clearStockList(parentElement);
  queryHistory.map(query => {
    parentElement.insertAdjacentHTML(
      `beforeend`,
      `
            <li class="list-group-item">
                <a href="http://${HOSTNAME}:${PORT}/api/search?query=${query.query}">
                    <span>Query: ${query.query}</span>
                    <span>Date: ${query.date}</span>
                </a>
                <button type="button" id="deleteButton${query._id}" class="btn btn-outline-danger float-right">Delete</button>
            </li>
      `
    );
    const deleteButton = document.getElementById(`deleteButton${query._id}`);
    deleteButton.addEventListener(`click`, () => {
      deleteDocumentDB(query._id, HOSTNAME, PORT);
      createQueryHistory();
    });
  });
}

async function deleteDocumentDB(id, HOSTNAME, PORT) {
  const response = await fetch(
    `http://${HOSTNAME}:${PORT}/api/search-history/${id}`,
    {method: `DELETE`}
  );
  await response.json();
}

function clearStockList(parentElement) {
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.lastChild);
  }
}

async function createQueryHistory() {
  const HOSTNAME = `localhost`;
  const PORT = `5000`;
  const resultsList = document.getElementById(`resultsList`);
  const queryHistory = await getQueryHistory(HOSTNAME, PORT);
  await renderQueryHistory(resultsList, queryHistory, HOSTNAME, PORT);
}

createQueryHistory();
