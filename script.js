const sheetId = "1ndqDBKQPEqPKM2HP__fS_PSA9mqTvsoeA8kMrtGOKc0";

const csvUrl =
  `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

async function loadDos() {

  const response = await fetch(csvUrl);
  const text = await response.text();

  const rows = text
    .trim()
    .split("\n")
    .map(row => row.split(","));

  console.log(rows);
}

loadDos();