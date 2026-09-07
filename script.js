```js
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

const doneButton =
  document.getElementById("doneButton");

const againButton =
  document.getElementById("againButton");

const card =
  document.getElementById("card");

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

      throw new Error(
        `HTTP error: ${response.status}`
      );

    }

    const text =
      await response.text();

    const rows =
      parseCSV(text);


    dos = rows
      .slice(1)

      // DOが入力されている行だけ
      .filter(row => row[1])

      // 「有効」がTRUEのものだけ
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
      "DOの読み込み成功:",
      dos
    );

    console.log(
      "DOの件数:",
      dos.length
    );


    if (dos.length === 0) {

      throw new Error(
        "有効なDOがありません"
      );

    }


  } catch (error) {

    console.error(
      "DOの読み込みに失敗しました:",
      error
    );

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
    else if (
      char === '"'
    ) {

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
// DOをカードに表示
// ========================================

function displayDo(doItem) {

  if (!doItem) {

    return;

  }


  // 現在のDOとして保存
  selectedDo =
    doItem;


  // ----------------------------------------
  // カード番号
  // ----------------------------------------

  const number =
    String(selectedDo.id)
      .padStart(2, "0");


  cardNumber.textContent =
    number;

  cardNumberBottom.textContent =
    number;


  // ----------------------------------------
  // カードのマーク
  // ----------------------------------------

  const index =
    dos.findIndex(
      item =>
        item.id === selectedDo.id
    );

  const suit =
    suits[
      (index >= 0 ? index : 0)
      % suits.length
    ];


  cardSuit.textContent =
    suit;

  cardSuitBottom.textContent =
    suit;


  // ----------------------------------------
  // DO
  // ----------------------------------------

  cardDo.textContent =
    selectedDo.do;


  // ----------------------------------------
  // カテゴリ
  // ----------------------------------------

  cardCategory.textContent =
    selectedDo.category ||
    "その他";


  // ----------------------------------------
  // 所要時間
  // ----------------------------------------

  if (cardTime) {

    cardTime.textContent =
      selectedDo.time ||
      "---";

  }


  // ----------------------------------------
  // 費用
  // ----------------------------------------

  if (cardCost) {

    cardCost.textContent =
      selectedDo.cost ||
      "---";

  }


  // ----------------------------------------
  // 難易度
  // ----------------------------------------

  if (cardDifficulty) {

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

  }


  // ----------------------------------------
  // 一人向き
  // ----------------------------------------

  if (cardSolo) {

    cardSolo.textContent =
      selectedDo.solo ||
      "---";

  }


  // ----------------------------------------
  // 場所
  // ----------------------------------------

  if (cardPlace) {

    cardPlace.textContent =
      selectedDo.place ||
      "---";

  }


  // ----------------------------------------
  // 繰り返し
  // ----------------------------------------

  if (cardRepeat) {

    cardRepeat.textContent =
      selectedDo.repeat ||
      "---";

  }


  // ----------------------------------------
  // DONE状態を解除
  // ----------------------------------------

  card.classList.remove(
    "is-done"
  );


  // ----------------------------------------
  // カードを表にする
  // ----------------------------------------

  card.classList.add(
    "is-open"
  );


  // ----------------------------------------
  // DONEボタンを有効化
  // ----------------------------------------

  doneButton.disabled =
    false;

}


// ========================================
// DOをランダムに引く
// ========================================

function drawDo() {

  if (dos.length === 0) {

    return;

  }


  const randomIndex =
    Math.floor(
      Math.random() * dos.length
    );


  const newDo =
    dos[randomIndex];


  // DOを表示
  displayDo(newDo);


  // ----------------------------------------
  // 引いたDOを保存
  // ----------------------------------------

  localStorage.setItem(
    "selectedDo",
    JSON.stringify(newDo)
  );


  console.log(
    "保存したDO:",
    newDo
  );

}


// ========================================
// 保存したDOを復元
// ========================================

function restoreDo() {

  if (!selectedDo) {

    return;

  }


  // 現在のスプレッドシートに
  // このDOが存在するか確認
  const exists =
    dos.some(
      item =>
        item.id === selectedDo.id
    );


  // DOが削除されていた場合
  if (!exists) {

    localStorage.removeItem(
      "selectedDo"
    );

    selectedDo =
      null;

    return;

  }


  // カードに表示
  displayDo(
    selectedDo
  );


  console.log(
    "保存したDOを復元:",
    selectedDo
  );

}


// ========================================
// DONE
// ========================================

function completeDo() {

  if (!selectedDo) {

    return;

  }


  // ----------------------------------------
  // 保存しているDOを削除
  // ----------------------------------------

  localStorage.removeItem(
    "selectedDo"
  );


  // ----------------------------------------
  // Googleフォーム用URLを作成
  // ----------------------------------------

  const params =
    new URLSearchParams();


  params.set(
    "usp",
    "pp_url"
  );


  // ID
  params.set(
    formIdEntry,
    selectedDo.id
  );


  // DO
  params.set(
    formDoEntry,
    selectedDo.do
  );


  const url =
    `${formUrl}?${params.toString()}`;


  // ----------------------------------------
  // Googleフォームへ移動
  // ----------------------------------------

  window.location.href =
    url;

}


// ========================================
// リセット
// ========================================

function resetDo() {

  // 保存したDOを削除
  localStorage.removeItem(
    "selectedDo"
  );


  // 現在のDOを削除
  selectedDo =
    null;


  // カードを裏面に戻す
  card.classList.remove(
    "is-open"
  );


  // DONEボタンを無効化
  doneButton.disabled =
    true;


  console.log(
    "DOをリセットしました"
  );

}


// ========================================
// カードをタップ
// ========================================

card.addEventListener(
  "click",
  () => {

    // --------------------------------------
    // 裏面なら
    // → 新しいDOを引く
    // --------------------------------------

    if (
      !card.classList.contains(
        "is-open"
      )
    ) {

      drawDo();

      return;

    }


    // --------------------------------------
    // 表面なら
    // → 裏面に戻す
    // --------------------------------------

    card.classList.remove(
      "is-open"
    );

  }
);


// ========================================
// DONEボタン
// ========================================

doneButton.addEventListener(
  "click",
  completeDo
);


// ========================================
// リセットボタン
// ========================================

againButton.addEventListener(
  "click",
  resetDo
);


// ========================================
// ページを開いたとき
// ========================================

const savedDo =
  localStorage.getItem(
    "selectedDo"
  );


if (savedDo) {

  try {

    selectedDo =
      JSON.parse(savedDo);

  } catch (error) {

    console.error(
      "保存データの読み込みに失敗:",
      error
    );

    localStorage.removeItem(
      "selectedDo"
    );

    selectedDo =
      null;

  }

}


// ========================================
// スプレッドシート読み込み完了後
// ========================================

loadDos().then(() => {

  // 保存されたDOがあれば復元
  if (selectedDo) {

    restoreDo();

  }

});
```
