/* ========================================
   Googleスプレッドシート
======================================== */

const csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRzYV7KlATGhOIwnPBDN6mL-JZnsIEK5NV658DIlekZpBcq2cWHgiK5S66p1XRwxUnkmZJSGXGVByQ/pub?gid=1022653759&single=true&output=csv";


/* ========================================
   HTML要素
======================================== */

const drawButton = document.getElementById("drawButton");
const doneButton = document.getElementById("doneButton");
const againButton = document.getElementById("againButton");

const card = document.getElementById("card");

const message = document.getElementById("message");

const cardNumber = document.getElementById("cardNumber");
const cardNumberBottom = document.getElementById("cardNumberBottom");

const cardSuit = document.getElementById("cardSuit");
const cardSuitBottom = document.getElementById("cardSuitBottom");

const cardCategory = document.getElementById("cardCategory");
const cardDo = document.getElementById("cardDo");

const cardTime = document.getElementById("cardTime");
const cardCost = document.getElementById("cardCost");
const cardDifficulty = document.getElementById("cardDifficulty");

const cardSolo = document.getElementById("cardSolo");
const cardPlace = document.getElementById("cardPlace");
const cardRepeat = document.getElementById("cardRepeat");


/* ========================================
   データ
======================================== */

let dos = [];

let selectedDo = null;


/* トランプのマーク */

const suits = ["♠", "♥", "♣", "♦"];


/* ========================================
   CSV読み込み
======================================== */

async function loadDos() {

  try {

    const response = await fetch(csvUrl);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }


    const text = await response.text();

    console.log("スプレッドシートのデータ取得成功");


    const rows = parseCSV(text);


    /*
      1行目は見出し

      列の順番：

      0 ID
      1 DO
      2 カテゴリ
      3 所要時間
      4 費用
      5 難易度
      6 一人向き
      7 場所
      8 繰り返し
      9 有効
      10 達成日
      11 感想
      12 評価
      13 登録日
    */


    dos = rows
      .slice(1)

      // DOが空欄の行を除外
      .filter(row => row[1])

      // 「有効」がTRUEのものだけ
      .filter(row => {

        return String(row[9])
          .trim()
          .toUpperCase() === "TRUE";

      })


      // オブジェクトに変換
      .map(row => {

        return {

          id: row[0],

          do: row[1],

          category: row[2],

          time: row[3],

          cost: row[4],

          difficulty: row[5],

          solo: row[6],

          place: row[7],

          repeat: row[8]

        };

      });


    console.log("読み込んだDO:", dos);

    console.log("DOの件数:", dos.length);


    if (dos.length === 0) {

      throw new Error("DOが0件です");

    }


  } catch (error) {

    console.error("DOの読み込みに失敗しました:", error);


    message.textContent =
      "DOを読み込めませんでした。ページを更新してみてね。";

  }

}


/* ========================================
   CSV解析
======================================== */

function parseCSV(text) {

  const rows = [];

  let row = [];

  let cell = "";

  let insideQuotes = false;


  for (let i = 0; i < text.length; i++) {

    const char = text[i];

    const nextChar = text[i + 1];


    // "" → "
    if (
      char === '"' &&
      insideQuotes &&
      nextChar === '"'
    ) {

      cell += '"';

      i++;

    }


    // " の開始・終了
    else if (char === '"') {

      insideQuotes = !insideQuotes;

    }


    // カンマ
    else if (
      char === "," &&
      !insideQuotes
    ) {

      row.push(cell);

      cell = "";

    }


    // 改行
    else if (
      (char === "\n" || char === "\r") &&
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


  // 最後のセル
  if (
    cell !== "" ||
    row.length > 0
  ) {

    row.push(cell);

    rows.push(row);

  }


  return rows;

}


/* ========================================
   DOを引く
======================================== */

function drawDo() {

  if (dos.length === 0) {

    message.textContent =
      "DOを読み込んでいます。少し待ってね。";

    return;

  }


  /* ランダムに選ぶ */

  const randomIndex =
    Math.floor(Math.random() * dos.length);


  selectedDo = dos[randomIndex];


  /* カード番号 */

  const number =
    String(selectedDo.id).padStart(2, "0");


  /* マーク */

  const suit =
    suits[randomIndex % suits.length];


  cardNumber.textContent = number;

  cardNumberBottom.textContent = number;

  cardSuit.textContent = suit;

  cardSuitBottom.textContent = suit;


  /* DO */

  cardDo.textContent =
    selectedDo.do;


  /* 情報 */

  cardCategory.textContent =
    selectedDo.category || "その他";


  cardTime.textContent =
    selectedDo.time || "---";


  cardCost.textContent =
    selectedDo.cost || "---";


  /* 難易度 */

  if (selectedDo.difficulty) {

    const difficulty =
      Number(selectedDo.difficulty);

    cardDifficulty.textContent =
      "★".repeat(difficulty);

  } else {

    cardDifficulty.textContent =
      "---";

  }


  /* 一人向き */

  cardSolo.textContent =
    selectedDo.solo || "---";


  /* 場所 */

  cardPlace.textContent =
    selectedDo.place || "---";


  /* 繰り返し */

  cardRepeat.textContent =
    selectedDo.repeat || "---";


  /* カードを開く */

  card.classList.remove("is-done");

  card.classList.add("is-open");


  /* DONEボタンを有効化 */

  doneButton.disabled = false;


  message.textContent =
    "今日はこれ。やってみよう。";

}


/* ========================================
   DONE
======================================== */

function completeDo() {
  if (!selectedDo) {
    return;
  }

  card.classList.add("is-done");
  doneButton.disabled = true;

  message.textContent =
    "今日の一新、達成！ ✨";
}


  /*
    今はここではGoogleスプレッドシートを
    書き換えていません。

    次の段階で、

    ・達成日
    ・感想
    ・評価

    をGoogleスプレッドシートへ
    保存できるようにします。
  */

}


/* ========================================
   もう一度引く
======================================== */

function drawAgain() {

  if (dos.length === 0) {

    message.textContent =
      "DOを読み込んでいます。少し待ってね。";

    return;

  }


  drawDo();

}


/* ========================================
   ボタン
======================================== */

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


/* ========================================
   起動時に読み込み
======================================== */

loadDos();
