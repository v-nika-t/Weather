const form = document.querySelector("form"),
      select = form.querySelector('select'),
      apiKey ="f26f972a03b34e47a2f5ca24a787280b",
      divWeather = document.querySelector('#weather');
 
function addOptions(arr,  createNewArr = true, newArr = []) {//заполнить нашу форму данными 
    select.innerHTML = "<option disabled selected> Выберите </option>";
    arr.forEach( (element, index) => {
        let option = document.createElement('option');
        option.innerText = arr[index].name;
        select.append(option);
       
        if (createNewArr) {
            newArr[index] = arr[index].name;
        }
    });
    return newArr;
};

function addButton(region, blockWherePut) { // кнопка смены области
    const button = document.createElement('button');
    button.innerText = "Выбрать другую область";
    button.addEventListener('click', () => {
        addOptions(region);
    });
    blockWherePut.append(button); 
}

async function getWeather(lat,lng, key) {// получить данные погоды
   
    let returnArr = [];
    await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=current,minutely,hourly&units=metric&dt=&appid=${key}`)
    .then(data =>  {
            data = data.json();
            return data;
        })
        .then ( (data) => {
            data['daily'].forEach( (el) => {
                let day = new Date(el.dt * 1000);
                let obj = {
                    weekday:day.toLocaleString('ru', {weekday: "long"}),
                    date:day.getDate(),
                    month:day.toLocaleString('ru', {month: "long"}),
                    day_temp: Math.round(el.temp.day),
                    night_temp: Math.round(el.temp.night),
                    weather:el.weather[0].main,
                }; 
                returnArr.push(obj);
            });
        })
        .catch((e) => { throw new Error(e) });

    return  await returnArr;

};

function addkWeatherOnDocument(weatherDate = [], blockWherePut) {// добавляем блоки с погодой на страницу
    blockWherePut.innerHTML = "";
    weatherDate.forEach( (day) => {
        let div = document.createElement('div');
        div.innerText = `${day.date} ${day.month}, ${day.weekday}
            Температура днем: ${day.day_temp} °C
            Температура ночью:  ${day.night_temp} °C
            Погода: ${day.weather}`;
        blockWherePut.append(div);
    });
}
 
fetch('https://gist.githubusercontent.com/alex-oleshkevich/6946d85bf075a6049027306538629794/raw/3986e8e1ade2d4e1186f8fee719960de32ac6955/by-cities.json')
    .then( (response) => response.json())
    .then ( (data) => { return data[0]['regions'] })
    .then ( (data) => {
        let arrRegion = addOptions(data);
        return [data, arrRegion];
    })
    .then( ( [data, arrRegion] ) => {
        let cities = [];
        let arrCities = [];
        addButton(data, form);
        select.addEventListener('change', (el) => {// 
            
            if ( arrRegion.includes(el.target.value) ) { // выбрали область
                let index = arrRegion.indexOf(el.target.value);
                cities = data[index].cities;
                arrCities = addOptions(cities);
            } else { // выбрали город
                  let index = arrCities.indexOf(el.target.value);
                  let weather = getWeather(cities[index].lat, cities[index].lng, apiKey); 
                  weather.then(data => {
                    addkWeatherOnDocument(data, divWeather); 
                  });
                   
            };
        });  
    })
    .catch( (e) => {
        throw new Error(e);
    })
 
 
   


