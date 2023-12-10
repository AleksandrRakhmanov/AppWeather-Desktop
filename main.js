import conditions from "./conditions.js";

const apiKey = "2ae59a7f06e4462e9d9105122233110";

// Элементы на странице
const header = document.querySelector(".header");
const form = document.querySelector("#form");
const input = document.querySelector("#inputCity");

function removeCard() {
  // Удаляем предыдущую карточку
  const prevCard = document.querySelector(".card");
  if (prevCard) prevCard.remove();
}

function showError() {
  // Отображаем карточку на странице
  const html = `<div class="card">Данный город не найден</div>`;
  header.insertAdjacentHTML("afterend", html);
}

function showCard({ name, country, temp, condition, imgPath }) {
  // разметка для карточки
  const html = `
<div class="card">
  <h2 class="card-city">${name} <span>${country}</span></h2>
  <div class="card-weather">
    <div class="card-value">${temp}<sup>°c</sup></div>
    <img class="card-img" src="${imgPath}" alt="" />
  </div>
  <div class="card-discription">${condition}</div>
</div>`;

  // Отображаем карточку на странице
  header.insertAdjacentHTML("afterend", html);
}
async function getWeather(city) {
  // Адресс запроса
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// слушаем отправку формы
form.onsubmit = async function (e) {
  // отменяем дефолтную отправку формы
  e.preventDefault();
  // берем значение из инпута, обрезаем пробелы
  let city = input.value.trim();

  // получаем данные с сервера
  const data = await getWeather(city);

  //   делаем запрос на сервер
  // адрес запроса

  if (data.error) {
    // Если есть ошибка, выводим её
    removeCard();
    showError();
  } else {
    // Если ошибки нет - выводит карточку
    // Отображаем полученные данные в карточке
    // Удаляем предыдущую карточку
    removeCard();

    const info = conditions.find(
      (obj) => obj.code === data.current.condition.code
    );

    const filePath = "./img/" + (data.current.is_day ? "day" : "night") + "/";
    const fileName = (data.current.is_day ? info.day : info.night) + ".png";
    const imgPath = filePath + fileName;

    const weatherData = {
      name: data.location.name,
      country: data.location.country,
      temp: data.current.temp_c,
      condition: data.current.is_day
        ? info.languages[23]["day_text"]
        : info.languages[23]["night_text"],
      imgPath,
    };

    showCard(weatherData);
  }
};
