const API_KEY = "c85f5435d4fba3b15cc67530b626c83d";

let cityinput = document.getElementById("cityInput")
let searchBtn = document.getElementById("searchBtn")
let weatherCard = document.getElementById("weatherCard")
let errorMsg = document.getElementById("errorMsg")
let favsection=document.getElementById("favsection")
let load=document.getElementById("loading")

async function getweather(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
  if (!response.ok) {
    if (response.status == 401) {
      throw new Error("Invalid API")
    }
     if (response.status == 404) {
      throw new Error("City Not Found")
    }
    throw new Error("something went wrong")
  }
  
  const data= await response.json() 
  // console.log(data);

    return {
            city: data.name,
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        };
}

let currentcity="";
async function searchweather(){
  let city = await cityinput.value.trim();
  if (city===""){
    errorMsg.style.display="block";
    errorMsg.textContent="Enter City Name";
    errorMsg.style.color="red"
    weatherCard.style.display="none"


    // alert("enter city name")
    return

  }
  // favoritesList.style.display="none"
  load.style.display="block";
  errorMsg.style.display="none"
  

  try{
    let data=await getweather(city)
    currentcity = data.city;
    weatherCard.innerHTML=`
    <h1>${data.city}</h1>
    <p>Temprature :${data.temp}°C</p>
    <p>Feelslike :${data.feelsLike}°C</p>
    <p>Description :${data.description}°C</p>
    <p>Humidity :${data.humidity} m/s</p>
    <p>Windspeed :${data.windSpeed}°C</p>`
    
    weatherCard.style.display="block"
    errorMsg.style.display="none"
  }catch(error){
    errorMsg.textContent=error.message;
    errorMsg.style.display="block"
    weatherCard.style.display="none"

  }finally{
     favsection.style.display="block"
     load.style.display="none"
  }
 
}

searchBtn.addEventListener("click",()=>{
  showfav.style.margin="15px"
  favoritesList.style.margin="10px"
  searchweather()
})

function debounce (z){
  let timer;
  return function(){
    clearTimeout(timer)
    timer= setTimeout(()=>{
      z()
    },500)
  }
}

let bounce=debounce(searchweather)
cityinput.addEventListener("input",bounce)
cityinput.addEventListener("keydown",Event=>{
  if(Event.key==="Enter"){
    if(0<cityinput.value.length){
      searchweather()
    }
    
  }
}
)

let favoritesList = document.getElementById("favoritesList")
let fav=JSON.parse(localStorage.getItem("favorites")) || [];  
let add=document.getElementById("add")
let remove=document.getElementById("remove")
let showfav=document.getElementById("show")
let allfav=document.getElementById("allfav")
let favsec=document.getElementById("favsec")

showfav.addEventListener("click",()=>{
  allfav.style.maxWidth="700px"
  favsec.style.margin="15px 15px 15px 15px"
  showfav.style.margin="15px"
  favoritesList.style.margin="10px"
  // favoritesList.style.display="none"
  displayfav()
})

function addFavorite() {
  if(currentcity===""){
    errorMsg.style.display="block"
    errorMsg.textContent="Enter Any City Name"
    errorMsg.style.color="red"
    return
  }
  if(fav.includes(currentcity)){
    errorMsg.style.display="block"
    errorMsg.textContent="Already Added"
    errorMsg.style.color="red"
    return;
  }
  fav.push(currentcity)
 localStorage.setItem("favorites",JSON.stringify(fav))
 errorMsg.style.display="none"
 displayfav()
}

function displayfav(){
favoritesList.style.display="block"
favoritesList.innerHTML=""
fav.forEach(x => {
  const div=document.createElement("div")
  div.textContent=x
  div.addEventListener("click",()=>{
    cityinput.value=x
    searchweather()
  })
  favoritesList.appendChild(div)
});
}
add.addEventListener("click",()=>{
  addFavorite()
})

function removefav(){
  fav = fav.filter(y=> y !== currentcity);
localStorage.setItem("favorites", JSON.stringify(fav))
cityinput.value=""
displayfav()
weatherCard.style.display="none"
errorMsg.style.display="none"

}
remove.addEventListener("click",removefav)

let theming = document.getElementById("themeBtn")
theming.addEventListener("click",themer)


function themer(){
  document.body.classList.toggle("Dark")
  if (document.body.classList.contains("Dark")) {
    theming.textContent="🌙 Dark"
    document.body.style.backgroundColor="rgb(173, 159, 140)"
    document.body.style.color="black"
  }
  else{
    theming.textContent="☀️ Light"
    document.body.style.backgroundColor=" rgb(36, 24, 9)"
    document.body.style.color="white"
  }
}

themer()




