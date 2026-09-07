// ========================================
// GoogleスプレッドシートからDOを読み込む
// ========================================

const csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRzYV7KlATGhOIwnPBDN6mL-JZnsIEK5NV658DIlekZpBcq2cWHgiK5S66p1XRwxUnkmZJSGXGVByQ/pub?gid=1022653759&single=true&output=csv";


// ========================================
// Googleフォームの設定
// ========================================

const formUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSczouMSl_bMRbKQ6wwHiOQbhDUR0oFoFxvVSyl304rd2INIEA/viewform";

const formIdEntry = "entry.1366935255";
const formDoEntry = "entry.113286324";


// ========================================
// HTMLの要素を取得
// ========================================

const drawButton =
  document.getElementById("drawButton");

const doneButton =
  document.getElementById("doneButton");

const againButton =
  document.getElementById("againButton");

const card =
  document.getElementById("card");

const message =
  document.getElementById("message");

const cardNumber =
  document.getElementById("cardNumber");

const cardNumberBottom =
  document.getElementById("cardNumberBottom");

const cardSuit =
  document.getElementById("cardSuit");

const cardSuitBottom =
  document.getElementById("cardSuitBottom");

const cardCategory =
  document.getElementById("cardCategory");

const cardDo =
  document.getElementById("cardDo");

const cardTime =
  document.getElementById("cardTime");

const cardCost =
  document.getElementById("cardCost");

const cardDifficulty =
  document.getElementById("cardDifficulty");

const cardSolo =
  document.getElementById("cardSolo");

const cardPlace =
  document.getElementById("cardPlace");

const cardRepeat =
  document.getElementById("cardRepeat");


// ========================================
// データ
// ========================================

let dos = [];
let selectedDo = null;

const suits = ["♠", "♥", "♣", "♦"];


// ========================================
// CSVを読み込む
// ========================================

async function loadDos() {

  try {

    const response =
      await fetch(csvUrl);

    if (!response.ok) {
  throw new Error(`HTTP error: ${response.status}`);
}
    const text =
      await response.text();

    console.log(
      "スプレッドシートのデータ取得成功"
    );

    const rows =
      parseCSV(text);


    dos = rows
      .slice(1)

      .filter(
        row => row[1]
      )

      .filter(
        row =>
          String(row[9])
            .trim()
            .toUpperCase() === "TRUE"
      )

      .map(row => ({

        id: row[0],

        do: row[1],

        category: row[2],

        time: row[3],

        cost: row[4],

        difficulty: row[5],

        solo: row[6],

        place: row[7],

        repeat: row[8]

      }));


    console.log(
      "読み込んだDO:",
      dos
    );

    console.log(
      "DOの件数:",
      dos.length
    );


    if (dos.length === 0) {

      throw new Error(
        "DOが0件です"
      );

    }


  } catch (error) {

    console.error(
      "DOの読み込みに失敗しました:",
      error
    );

    message.textContent =
      "DOを読み込めませんでした。ページを更新してみてね。";

  }

}


// ========================================
// CSVを正しく読み込む
// ========================================

function parseCSV(text) {

  const rows = [];

  let row = [];

  let cell = "";

  let insideQuotes = false;


  for (
    let i = 0;
    i < text.length;
    i++
  ) {

    const char = text[i];

    const nextChar =
      text[i + 1];


    if (
      char === '"' &&
      insideQuotes &&
      nextChar === '"'
    ) {

      cell += '"';

      i++;

    }


    else if (
      char === '"'
    ) {

      insideQuotes =
        !insideQuotes;

    }


    else if (
      char === "," &&
      !insideQuotes
    ) {

      row.push(cell);

      cell = "";

    }


    else if (
      (
        char === "\n" ||
        char === "\r"
      ) &&
      !insideQuotes
    ) {

      if (
        char === "\r" &&
        nextChar === "\n"
      ) {

        i++;

      }

      row.push(cell);

      rows.push(row);

      row = [];

      cell = "";

    }


    else {

      cell += char;

    }

  }


  if (
    cell !== "" ||
    row.length > 0
  ) {

    row.push(cell);

    rows.push(row);

  }


  return rows;

}


// ========================================
// DOを引く
// ========================================

function drawDo() {

  if (dos.length === 0) {

    message.textContent =
      "DOを読み込んでいます。少し待ってね。";

    return;

  }


  const randomIndex =
    Math.floor(
      Math.random() * dos.length
    );


  selectedDo =
    dos[randomIndex];


  // カード番号
  const number =
    String(selectedDo.id)
      .padStart(2, "0");


  // カードのマーク
  const suit =
    suits[
      randomIndex % suits.length
    ];


  cardNumber.textContent =
    number;

  cardNumberBottom.textContent =
    number;

  cardSuit.textContent =
    suit;

  cardSuitBottom.textContent =
    suit;


  // DO
  cardDo.textContent =
    selectedDo.do;


  // カテゴリ
  cardCategory.textContent =
    selectedDo.category ||
    "その他";


  // 所要時間
  cardTime.textContent =
    selectedDo.time ||
    "---";


  // 費用
  cardCost.textContent =
    selectedDo.cost ||
    "---";


  // 難易度
  if (
    selectedDo.difficulty
  ) {

    const difficulty =
      Number(
        selectedDo.difficulty
      );

    cardDifficulty.textContent =
      "★".repeat(difficulty);

  } else {

    cardDifficulty.textContent =
      "---";

  }


  // 一人向き
  cardSolo.textContent =
    selectedDo.solo ||
    "---";


  // 場所
  cardPlace.textContent =
    selectedDo.place ||
    "---";


  // 繰り返し
  cardRepeat.textContent =
    selectedDo.repeat ||
    "---";


  // カードを開く
  card.classList.remove(
    "is-done"
  );

  card.classList.add(
    "is-open"
  );


  // DONEボタンを有効化
  doneButton.disabled =
    false;


  message.textContent =
    "今日はこれ。やってみよう。";

}


// ========================================
// DONE
// ========================================

function completeDo() {

  if (!selectedDo) {

    return;

  }


  // GoogleフォームのURLを作る
  const params =
    new URLSearchParams();


  params.set(
    "usp",
    "pp_url"
  );


  // IDを自動入力
  params.set(
    formIdEntry,
    selectedDo.id
  );


  // DOを自動入力
  params.set(
    formDoEntry,
    selectedDo.do
  );


  const url =
    `${formUrl}?${params.toString()}`;


  // Googleフォームへ移動
  window.location.href =
    url;

}


// ========================================
// もう一度引く
// ========================================

function drawAgain() {

  if (dos.length === 0) {

    message.textContent =
      "DOを読み込んでいます。少し待ってね。";

    return;

  }


  drawDo();

}


// ========================================
// ボタンイベント
// ========================================

drawButton.addEventListener(
  "click",
  drawDo
);


doneButton.addEventListener(
  "click",
  completeDo
);


againButton.addEventListener(
  "click",
  drawAgain
);

// ========================================
// カードをタップして表裏を切り替える
// ========================================

card.addEventListener("click", () => {

  // まだDOを引いていない場合は何もしない
  if (!selectedDo) {
    return;
  }

  card.classList.toggle("is-open");

});
// ========================================
// ページを開いたらDOを読み込む
// ========================================

loadDos();
