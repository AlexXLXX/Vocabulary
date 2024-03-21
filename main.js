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

function addWord() {
  const rusWord = inputRus.value.trim().replace(/\s+/g, " ");
  const espWord = inputEsp.value.trim().replace(/\s+/g, " ");

  if (rusWord === "" || espWord === "") return;

  const words = getWordsToLocalStorage();
  words.push({
    id: Number(new Date()),
    rus: rusWord,
    esp: espWord,
    category: listPickCat.value,
    position: 1000,
  });

  inputRus.value = "";
  inputEsp.value = "";

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
  console.log(arrLS);
}

function renderTable(words) {
  if (!words || !words.length) return;
  words
    .sort((a, b) => a.position - b.position)
    .forEach((element, index) => {
      const tableTemplate = `
      <tr class="table__string" data-table-string-id="${
        element.id
      }" dragable="true">
      <td>${index + 1}</td>
      <td>${element.rus}</td>
      <td>${element.esp}</td>
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
