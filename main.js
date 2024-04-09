"use strict";

const counterWords = document.querySelector("#section__word-counter");
const listSortCat = document.querySelector("#tags");
const inputSearch = document.querySelector(".section__search__input");
const inputRus = document.querySelector("#text-rus");
const inputEsp = document.querySelector("#text-esp");
const listPickCat = document.querySelector("#tags-tables");
const btnAdd = document.querySelector(".section-input__add__input");
const table = document.querySelector("#tableBody");

updateTable();
countWords();

btnAdd.addEventListener("click", addWord);
table.addEventListener("click", deleteWord);
listSortCat.addEventListener("change", filterWordsByCat);
inputSearch.addEventListener("keyup", searchInTable);
table.addEventListener("dblclick", editWordText);

function addWord() {
  const rusWord = inputRus.value.trim().replace(/\s+/g, " ");
  const espWord = inputEsp.value.trim().replace(/\s+/g, " ");

  if (rusWord === "" || espWord === "") return;

  const words = getWordsToLocalStorage();
  words.unshift({
    id: Number(new Date()),
    rus: rusWord,
    esp: espWord,
    category: listPickCat.value,
    position: -1000,
  });

  inputRus.value = "";
  inputEsp.value = "";
  listPickCat.value = "Все";
  listSortCat.value = "Все";

  setWordsToLocalStorage(words);
  updateTable();
  countWords();
}

function deleteWord(e) {
  if (e.target.dataset.action === "delete") {
    const parentNode = e.target.closest(".table__string");
    const id = Number(parentNode.dataset.tableStringId);
    const arrLS = getWordsToLocalStorage();

    const newArr = arrLS.filter((el) => el.id !== id);
    setWordsToLocalStorage(newArr);
    updateTable();
    countWords();
  }
}

function countWords() {
  const arrLS = getWordsToLocalStorage();
  counterWords.textContent = `Выученные слова: ${arrLS.length}`;
}

function getWordsToLocalStorage() {
  const wordsJSON = localStorage.getItem("words");
  return wordsJSON ? JSON.parse(wordsJSON) : [];
}

function setWordsToLocalStorage(arr) {
  localStorage.setItem("words", JSON.stringify(arr));
}

function updateTable() {
  table.textContent = "";
  const arrLS = getWordsToLocalStorage();
  renderTable(arrLS);
}

function renderTable(words) {
  if (!words || !words.length) return;
  words
    .sort((a, b) => a.position - b.position)
    .forEach((element, index) => {
      const tableTemplate = `
      <tr class="table__string" data-table-string-id="${element.id}">
      <td>${index + 1}</td>
      <td data-action="rus">${element.rus}</td>
      <td data-action="esp">${element.esp}</td>
      <td>${element.category}</td>
      <td><input type="button" class="table__main__button" data-action="delete"></td>
  </tr>
  `;
      table.insertAdjacentHTML("beforeend", tableTemplate);
    });
}

function filterWordsByCat(e) {
  function renderFilterCat(category) {
    const arrLS = getWordsToLocalStorage();
    let sortArr = arrLS.filter((el) => el.category === category);
    table.textContent = "";
    renderTable(sortArr);
  }

  switch (e.target.value) {
    case "Все":
      updateTable();
      break;

    case "Числа и цифры":
      renderFilterCat("Числа и цифры");
      break;

    case "Местоимения":
      renderFilterCat("Местоимения");
      break;

    case "Предлоги и союзы":
      renderFilterCat("Предлоги и союзы");
      break;

    case "Цвета и свойства":
      renderFilterCat("Цвета и свойства");
      break;

    case "Время":
      renderFilterCat("Время");
      break;

    case "Глаголы":
      renderFilterCat("Глаголы");
      break;

    case "Человек":
      renderFilterCat("Человек");
      break;

    case "Еда":
      renderFilterCat("Еда");
      break;

    case "Дом и быт":
      renderFilterCat("Дом и быт");
      break;

    case "Работа и увлечения":
      renderFilterCat("Работа и увлечения");
      break;

    case "Путешествия":
      renderFilterCat("Путешествия");
      break;

    case "Природа":
      renderFilterCat("Природа");
      break;
  }
}

function searchInTable() {
  let search = inputSearch.value.toUpperCase().trim();
  let rows = document.querySelectorAll(".table__string");

  for (let i = 0; i < rows.length; i++) {
    let rowContent = rows[i].textContent.toUpperCase();
    rows[i].style.display = rowContent.includes(search) ? "" : "none";
  }
}

function editWordText(e) {
  const tableBlock = e.target;
  const parentNode = e.target.closest(".table__string");
  const id = Number(parentNode.dataset.tableStringId);
  const arrLS = getWordsToLocalStorage();
  const stringElem = arrLS.find((el) => el.id === id);

  if (e.target.dataset.action === "rus" || e.target.dataset.action === "esp") {
    const newInput = document.createElement("input");
    newInput.className = "newInput";
    tableBlock.append(newInput);
    newInput.focus();
    newInput.value = tableBlock.textContent;
    tableBlock.childNodes[0].remove();

    function save() {
      tableBlock.textContent = newInput.value;
      newInput.remove();
      stringElem.rus = parentNode.cells[1].textContent;
      stringElem.esp = parentNode.cells[2].textContent;
      setWordsToLocalStorage(arrLS);

      return;
    }

    newInput.addEventListener("blur", function () {
      if (newInput.value === "" || newInput.value.trim() === 0) {
        newInput.remove();
        tableBlock.textContent = "???";
        return;
      }
      save();
    });

    newInput.addEventListener("keydown", function (e) {
      if (e.keyCode === 13 || e.keyCode == 27) {
        newInput.blur();
      }
    });
  }
}

function editWordTextByDobleTouch(e) {
  let expired;
  if (e.touches.length === 1) {
    if (!expired) {
      expired = e.timeStamp + 400;
    } else if (e.timeStamp <= expired) {
      e.preventDefault();
      editWordText();
      expired = null;
    } else {
      expired = e.timeStamp + 400;
    }
  }
}

new Sortable(table, {
  sort: true,  // sorting inside list
	delay: 600, // time in milliseconds to define when the sorting should start
	delayOnTouchOnly: true,
  animation: 250,
  ghostClass: 'dragging',
  chosenClass: 'dragging',
  forceFallback: true,
  scroll: true,
  bubbleScroll: true,
  onSort: function () {
    const arrLS = getWordsToLocalStorage();
    const arrRows = [...document.querySelectorAll(".table__string")];
  
    arrRows.forEach((item, i) => {
      const id = Number(item.dataset.tableStringId);
      const index = arrLS.findIndex((value) => value.id === id);
      if (index !== -1) {
        arrLS[index].position = i;
      }
    });
    setWordsToLocalStorage(arrLS);
    updateTable();
  }
 });

// function activationDrag() {
//   const arrRows = [...document.querySelectorAll(".table__string")];
//   arrRows.forEach((item) => {
//     setTimeout(() => {
//       item.draggable = true;
//       item.addEventListener("dragstart", addClass);
//       function addClass() {
//         setTimeout(() => {
//           item.classList.add("dragging");
//         }, 0);
//       }
//     }, 1000);

//     item.addEventListener("dragend", removeClass);
//     function removeClass() {
//       item.draggable = false;
//       item.classList.remove("dragging");
//       if (arrRows.length > 1) {
//         savePositionRow();
//       }
//     }
//   });
// }

// function savePositionRow() {
//   const arrLS = getWordsToLocalStorage();
//   const arrRows = [...document.querySelectorAll(".table__string")];

//   arrRows.forEach((item, i) => {
//     const id = Number(item.dataset.tableStringId);
//     const index = arrLS.findIndex((value) => value.id === id);
//     if (index !== -1) {
//       arrLS[index].position = i;
//     }
//   });
//   setWordsToLocalStorage(arrLS);
//   updateTable();
// }

// function moveDragElement(e) {
//   e.preventDefault();

//   const activeElement = table.querySelector(`.dragging`);
//   const currentElement = e.target.closest(".table__string");
//   const isMoveable =
//     activeElement !== currentElement &&
//     currentElement.classList.contains(`table__string`);

//   if (!isMoveable) {
//     return;
//   }

//   const nextElement =
//     currentElement === activeElement.nextElementSibling
//       ? currentElement.nextElementSibling
//       : currentElement;

//   table.insertBefore(activeElement, nextElement);
// }

