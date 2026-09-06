// Googleスプレッドシートの「ウェブに公開」URL
const csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQwnNBPlkS3LrwKseCwEELS1KO0gpOHgxDqY5eT2fYRg7Qv3oD7KlH5FBnRztNjYXMMckUsqVbAu7YK/pub?gid=791015566&single=true&output=csv";

const drawButton = document.getElementById("drawButton");
const result = document.getElementById("result");

let dos = [];


// CSVを読み込む
async function loadDos() {

  try {

    const response = await fetch(csvUrl);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const text = await response.text();

    console.log("スプレッドシートのデータ取得成功");
    console.log(text);

    // CSVを正しく読み込む
    const rows = parseCSV(text);

    // 1行目は見出しなので除外
    dos = rows
      .slice(1)

      // B列（DO）が空欄でないもの
      .filter(row => row[1])

      // J列（有効）がTRUEのものだけ
      .filter(row => {
        return String(row[9]).trim().toUpperCase() === "TRUE";
      })

      // B列のDOだけ取り出す
      .map(row => row[1]);

    console.log("読み込んだDO:", dos);
    console.log("DOの件数:", dos.length);

  } catch (error) {

    console.error("DOの読み込みに失敗しました:", error);

    result.innerHTML = `
      <span>⚠️</span>
      <p>DOを読み込めませんでした。<br>
      ページを更新してもう一度試してみてね。</p>
    `;
  }
}


// CSVを正しく解析する関数
function parseCSV(text) {

  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {

    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {

      cell += '"';
      i++;

    } else if (char === '"') {

      insideQuotes = !insideQuotes;

    } else if (char === "," && !insideQuotes) {

      row.push(cell);
      cell = "";

    } else if ((char === "\n" || char === "\r") && !insideQuotes) {

      if (char === "\r" && nextChar === "\n") {
        i++;
      }

      row.push(cell);
      rows.push(row);

      row = [];
      cell = "";

    } else {

      cell += char;
    }
  }

  // 最後のセル
  if (cell !== "" || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}


// 「DOを引く」ボタン
drawButton.addEventListener("click", () => {

  if (dos.length === 0) {

    result.innerHTML = `
      <span>⚠️</span>
      <p>DOを読み込んでいます。<br>
      少し待ってからもう一度押してね。</p>
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


// ページを開いたときにDOを読み込む
loadDos();
