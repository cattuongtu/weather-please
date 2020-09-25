// Update Days
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let date = new Date();
let currentDay = date.getDay();
// Hide searches section
let locations = document.querySelector("#locations");
locations.style.display = "none";

// Disable temperature conversions
let conversions = document.querySelectorAll(".conversion");
conversions.disabled = true;

// Is the weather forecast in Fahrenheit temperature units?
let isFahrenheit = true;

// Rotate the array so today is the first day
function rotateArray(days, currentDay) {
  currentDay = 7 - currentDay;
  reverse(0, 6, days);
  reverse(0, (currentDay % 7) - 1, days);
  reverse(currentDay % 7, 6, days);
}

function reverse(start, end, array) {
  while (start < end) {
    let temp = array[start];
    array[start] = array[end];
    array[end] = temp;
    start++;
    end--;
  }
}

rotateArray(days, currentDay);

function cToF(num) {
  isFahrenheit = true;
  num = (num / 5) * 9 + 32;
  return num;
}

function fToC(num) {
  isFahrenheit = false;
  num = (num - 32) * (5 / 9);
  return num;
}

// Updates the days
for (let i = 0; i < 6; i++) {
  document.getElementById("day" + i).innerHTML = days[i];
}

// Updates temperatures
function updateWeather(woeid) {
  fetch(
    `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${woeid}/`
  )
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      document.getElementById("place").innerHTML = data.title;
      for (let i = 0; i < 6; i++) {
        let dayWeather = data.consolidated_weather[i];
        let lowIcon = dayWeather.weather_state_abbr;
        // Change Temperature Display
        document.getElementById(`temp${i}`).innerHTML =
          Math.floor(cToF(dayWeather.max_temp)) + "°";
        document.getElementById(`temp${i + 6}`).innerHTML =
          Math.floor(cToF(dayWeather.min_temp)) + "°";
        document.querySelector(`#curr${i}`).innerHTML =
          Math.floor(cToF(dayWeather.the_temp)) + "°";
        // Change Temperature Icon
        document.getElementById(
          `icon${i}`
        ).src = `https://www.metaweather.com/static/img/weather/png/64/${lowIcon}.png`;
      }
      // Hide search locations
      locations.style.display = "none";

      // Re-enable temperature conversions
      conversions.disabled = false;
    })
    .catch((error) => {
      alert(error.message);
    });
}

// San Diego Default Weather
updateWeather(2487889);

let searchResultsLength;

// Search function
function searchLocations() {
  let queryText = document.getElementById("search-input").value;
  fetch(
    `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${queryText}`
  )
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      searchResultsLength = data.length;
      for (let i = 0; i < data.length; i++) {
        let div = document.createElement("div");
        div.innerHTML = `<button class="search-results" id="btn${i}" type="submit"><h3>${data[i].title}</h3></button>`;
        locations.appendChild(div);
        document
          .getElementById("btn" + i)
          .addEventListener("click", updateWeather.bind(null, data[i].woeid));
      }
    })
    .catch((error) => {
      alert(error.message);
    });
}

let fBtn = document.querySelector("#f-btn");
let cBtn = document.querySelector("#c-btn");

// Add event listeners for both F and C temperature conversions
fBtn.addEventListener("click", function() {
  if (!isFahrenheit) {
    for (let i = 0; i < 6; i++) {
      let high = document.getElementById(`temp${i}`);
      let highValue = high.innerHTML.replace("°", "");
      let low = document.getElementById(`temp${i + 6}`);
      let lowValue = low.innerHTML.replace("°", "");
      let curr = document.getElementById(`curr${i}`);
      let currValue = curr.innerHTML.replace("°", "");
      for (let i = 0; i < 6; i++) {
        high.innerHTML = Math.floor(cToF(highValue)) + "°";
        low.innerHTML = Math.floor(cToF(lowValue)) + "°";
        curr.innerHTML = Math.floor(cToF(currValue)) + "°";
      }
      // Updates button interface
      isFahrenheit = true;
      fBtn.classList.remove("not-in-use");
      fBtn.classList.add("in-use");
      cBtn.classList.remove("in-use");
      cBtn.classList.add("not-in-use");
    }
  }
});

cBtn.addEventListener("click", function() {
  if (isFahrenheit) {
    for (let i = 0; i < 6; i++) {
      let high = document.getElementById(`temp${i}`);
      let highValue = high.innerHTML.replace("°", "");
      let low = document.getElementById(`temp${i + 6}`);
      let lowValue = low.innerHTML.replace("°", "");
      let curr = document.getElementById(`curr${i}`);
      let currValue = curr.innerHTML.replace("°", "");
      for (let i = 0; i < 6; i++) {
        high.innerHTML = Math.floor(fToC(highValue)) + "°";
        low.innerHTML = Math.floor(fToC(lowValue)) + "°";
        curr.innerHTML = Math.floor(fToC(currValue)) + "°";
      }
      // Updates button interface
      isFahrenheit = false;
      cBtn.classList.remove("not-in-use");
      cBtn.classList.add("in-use");
      fBtn.classList.remove("in-use");
      fBtn.classList.add("not-in-use");
    }
  }
});

document.getElementById("btn").onclick = function() {
  searchLocations();
  locations.style.display = "block";
};
