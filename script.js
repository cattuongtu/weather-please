// Update Days
let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
let date = new Date();
let currentDay = date.getDay();


// Rotate the array so today is the first day
function rotateArray(days, currentDay) {
    currentDay = 7 - currentDay;
    reverse(0, 6, days);
    reverse(0, (currentDay % 7)-1, days);
    reverse((currentDay % 7), 6, days);
};

function reverse(start, end, array) {
    while(start < end) {
        let temp = array[start];
        array[start] = array[end];
        array[end] = temp;
        start++;
        end--;
    }
};

rotateArray(days, currentDay);

function convert(num) {
    num = (num/5) * 9 +32;
    return num;
}
// Updates the days
for(let i = 0; i < 6; i++) {
    document.getElementById('day' + i).innerHTML = days[i] + ' High';
}

// Updates temperatures
function updateWeather(woeid) {
    fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${woeid}/`)
    .then(result => {
        return result.json();
    })
    .then(data => {
        document.getElementById('place').innerHTML = data.title;
        for(let i = 0; i < 6; i++) {
            let dayWeather = data.consolidated_weather[i];
            let lowIcon = dayWeather.weather_state_abbr;
            // Change Temperature Display
            document.getElementById(`temp${i}`).innerHTML = Math.floor(convert(dayWeather.max_temp)) + '°';
            document.getElementById(`temp${(i+6)}`).innerHTML = Math.floor(convert(dayWeather.min_temp)) + '°';
            // Change Temperature Icon
            document.getElementById(`icon${i}`).src = `https://www.metaweather.com/static/img/weather/png/64/${lowIcon}.png`;
        
        }
    })
    .catch(error => {
        console.log(error);
    })
}
let searchResultsLength;
let searchResultsData;

// Search function
searchResultsData = document.getElementById('btn').onclick = function() {
    let queryText = document.getElementById('search-input').value;
    fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${queryText}`)
    .then(result => {
        return result.json();
    })
    .then(data => {
        searchResultsLength = data.length;
        for(let i = 0; i < data.length; i++) {
            let div = document.createElement('div');
            div.innerHTML = `<button id="btn${i}" type="submit">${data[i].title}</button>`;
            document.getElementById("locations").appendChild(div);
            document.getElementById('btn' + i).addEventListener('click', updateWeather.bind(null,(data[i].woeid)));
            
        }
    })
    .catch(error => {
        console.log(error);
    })
}
