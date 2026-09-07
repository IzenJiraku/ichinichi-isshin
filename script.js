```javascript
// ========================================
// GoogleスプレッドシートからDOを読み込む
// ========================================

const csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRzYV7KlATGhOIwnPBDN6mL-JZnsIEK5NV658DIlekZpBcq2cWHgiK5S66p1XRwxUnkmZJSGXGVByQ/pub?gid=1022653759&single=true&output=csv";


// ========================================
// Googleフォームの設定
// ========================================

// 回答用Googleフォーム
const formUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSczouMSl_bMRbKQ6wwHiOQbhDUR0oFoFxvVSyl304rd2INIEA/viewform";

// フォーム内の質問番号
// ID → entry.1366935255
// DO → entry.113286324
const formIdEntry = "entry.1366935255";
const formDoEntry = "entry.113286324";


// ========================================
// HTMLの要素を取得
// ========================================

const drawButton = document.getElementById("drawButton");
const doneButton = document.getElementById("doneButton");
const againButton = document.getElementById("againButton");

const card = document.getElementById("card");
const message = document.getElementById("message");

const cardNumber = document.getElementById("cardNumber");
const cardNumberBottom =
  document.getElementById("cardNumberBottom");

const cardSuit = document.getElementById("cardSuit");
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

    const response = await fetch(csvUrl);

    if (!response.ok) {
      throw new Error(
        `HTTP error: ${response.status}`
      );
    }

    const text = await response.text();

    console.log(
      "スプレッドシートのデータ取得成功"
    );

    const rows = parseCSV(text);


    // ====================================
    // DOデータを整理
    // ====================================

    dos = rows
      .slice(1)

      // DOが入っている行だけ
      .filter(row => row[1])

      // 「有効」がTRUEのものだけ
      .filter(
        row =>
          String(row[9])
            .trim()
            .toUpperCase() === "TRUE"
      )

      .map(row => ({

        // A列：ID
        id: row[0],

        // B列：DO
        do: row[1],

        // C列：カテゴリ
        category: row[2],

        // D列：所要時間
        time: row[3],

        // E列：費用
        cost: row[4],

        // F列：難易度
        difficulty: row[5],

        // G列：一人向き
        solo: row[6],

        // H列：場所
        place: row[7],

        // I列：繰り返し
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
// CSVを正しく読み込むための関数
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


    // ダブルクォーテーションが
    // 2つ続いた場合
    if (
      char === '"' &&
      insideQuotes &&
      nextChar === '"'
    ) {

      cell += '"';

      i++;

    }


    // ダブルクォーテーション
    else if (char === '"') {

      insideQuotes =
        !insideQuotes;

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
      (char === "\n" ||
        char === "\r") &&
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


    // その他
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


// ========================================
// DOを引く
// ========================================

function drawDo() {

  // DOがまだ読み込まれていない
  if (dos.length === 0) {

    message.textContent =
      "DOを読み込んでいます。少し待ってね。";

    return;

  }


  // ランダムに1件選ぶ
  const randomIndex =
    Math.floor(
      Math.random() * dos.length
    );

  selectedDo =
    dos[randomIndex];


  // ====================================
  // カード番号
  // ====================================

  const number =
    String(selectedDo.id)
      .padStart(2, "0");


  // ====================================
  // カードのマーク
  // ====================================

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


  // ====================================
  // DO本体
  // ====================================

  cardDo.textContent =
    selectedDo.do;


  // ====================================
  // カテゴリ
  // ====================================

  cardCategory.textContent =
    selectedDo.category ||
    "その他";


  // ====================================
  // 所要時間
  // ====================================

  cardTime.textContent =
    selectedDo.time ||
    "---";


  // ====================================
  // 費用
  // ====================================

  cardCost.textContent =
    selectedDo.cost ||
    "---";


  // ====================================
  // 難易度
  // ====================================

  if (selectedDo.difficulty) {

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


  // ====================================
  // 一人向き
  // ====================================

  cardSolo.textContent =
    selectedDo.solo ||
    "---";


  // ====================================
  // 場所
  // ====================================

  cardPlace.textContent =
    selectedDo.place ||
    "---";


  // ====================================
  // 繰り返し
  // ====================================

  cardRepeat.textContent =
    selectedDo.repeat ||
    "---";


  // ====================================
  // カードを開く
  // ====================================

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

  // DOが選ばれていなければ何もしない
  if (!selectedDo) {
    return;
  }


  // ====================================
  // Googleフォーム用URLを作る
  // ====================================

  const params =
    new URLSearchParams({

      // フォームの事前入力機能
      usp: "pp_url",

      // ID
      [formIdEntry]:
        selectedDo.id,

      // DO
      [formDoEntry]:
        selectedDo.do

    });


  const url =
    `${formUrl}?${params.toString()}`;


  // ====================================
  // Googleフォームを新しいタブで開く
  // ====================================

  window.open(
    url,
    "_blank"
  );


  // ====================================
  // サイト側もDONE状態にする
  // ====================================

  card.classList.add(
    "is-done"
  );

  doneButton.disabled =
    true;


  message.textContent =
    "今日の一新、達成！ ✨";

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
// ページを開いたらDOを読み込む
// ========================================

loadDos();
```
