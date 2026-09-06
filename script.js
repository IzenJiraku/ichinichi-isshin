const sheetId = "1ndqDBKQPEqPKM2HP__fS_PSA9mqTvsoeA8kMrtGOKc0";

const csvUrl =
  `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

const drawButton = document.getElementById("drawButton");
const result = document.getElementById("result");

let dos = [];

// GoogleスプレッドシートからDOを読み込む
async function loadDos() {

  try {

    const response = await fetch(csvUrl);
    const text = await response.text();

    const rows = text
      .trim()
      .split("\n")
      .map(row => row.split(","));

    // 1行目は見出しなので除外
    dos = rows
      .slice(1)
      .filter(row => row[1])
      .map(row => row[1]);

    console.log("読み込んだDO:", dos);

  } catch (error) {

    console.error("DOの読み込みに失敗しました:", error);

    result.innerHTML = `
      <span>⚠️</span>
      <p>DOを読み込めませんでした。</p>
    `;

  }
}


// DOを引く
drawButton.addEventListener("click", () => {

  if (dos.length === 0) {

    result.innerHTML = `
      <span>⚠️</span>
      <p>まだDOを読み込んでいます。<br>少し待ってからもう一度押してね。</p>
    `;

    return;
  }

  const randomIndex = Math.floor(Math.random() * dos.length);
  const selectedDo = dos[randomIndex];

  result.innerHTML = `
    <span>✨</span>
    <p>${selectedDo}</p>
  `;

});


// 最初にDOを読み込む
loadDos();
