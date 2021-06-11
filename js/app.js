"use strict"
const locationButton = document.querySelector('.location');
const toggle = document.querySelector('#toggle-form');
const city = document.querySelector('.city span:last-child');
let fulfilledCity= false; 
const description = document.querySelector('.main-temperature-description div:first-child');
const temperature = document.querySelector('.main-temperature span');
const today = document.querySelector('.today');
const timeImg = document.querySelector('.main-time-img img');
const loader = document.querySelector('.loader');
const weekend = document.querySelectorAll('.weekend > div');
const myForm = document.querySelector('form');
const myInput = document.querySelector('input');
const info = document.querySelector('.info');
const hightlights = document.querySelectorAll('.hightlights .content > div');

const APIKEY = "50021d7620cf40fe0d17ecde68cfceeb";

let lat = localStorage.getItem('lat');
let long = localStorage.getItem('long');

let b = true;
toggle.addEventListener('click', (e)=>{
   e.currentTarget.parentElement.classList.toggle('show-form');
   if (b){
        e.currentTarget.innerText ="X"
        b=false;
   }else{
        e.currentTarget.innerText ="Chercher une ville";
        b=true;
   }
  
});


const options = {weekday: 'long', month: 'long', day: 'numeric'};
today.innerText = new Date().toLocaleDateString('fr-FR', options);

if (lat && long){
   callApiLatLong(lat, long);           
}else{
     callApiCity('London');
}


locationButton.addEventListener('click', ()=>{
     fulfilledCity = false;
     if (!(lat && long)){
          infoHandle(`<p>Veuillez autoriser la géolocalisation lorsque votre navigateur vous la demande.<p>`);
          setTimeout(()=>{
               if (navigator.geolocation){
                    navigator.geolocation.getCurrentPosition((position)=>{
                         lat = position.coords.latitude;
                         localStorage.setItem('lat', lat);
                         long = position.coords.longitude;
                         localStorage.setItem('long', long);
                         callApiLatLong(lat, long);
                      
          
                    }, ()=>{
                          infoHandle(`<p>Vous avez refusé la géolocalisation.
                          Changer les paramètres de votre navigateur ou chercher directement votre ville par son nom.</p>`);
                    });
               }else{
                    infoHandle(`<p>Votre navigateur ne peut faire de la géolocalisation. Chercher votre ville par son nom.</p>`);
               }
          },3000)
          
     }else{
     
          callApiLatLong(lat, long);
          
     }
     
});



myForm.addEventListener('submit', (e)=>{
     e.preventDefault();
     let city = myInput.value;
     myInput.value="";
     callApiCity(city);
     if (b){
          toggle.innerText ="X"
          b=false;
     }else{
          toggle.innerText ="Chercher une ville";
          b=true;
     }
    
     myForm.parentElement.classList.remove('show-form');
});



function infoHandle(message){
     info.innerHTML = message;
     info.style.display = "flex";
     setTimeout(()=>{
          info.style.display = "none"
     },3000);
}

function callApiLatLong(lat, long){
     fetch(`https://api.openweathermap.org/data/2.5/onecall?lang=fr&units=metric&lat=${lat}&lon=${long}&appid=${APIKEY}`)
     .then(response=>{
          return response.json();    
     })
     .then(data =>{
          
          temperature.innerHTML = Math.trunc(data.current.temp);
          if(!fulfilledCity){
               city.innerText = data.timezone;
          }
        
          description.innerText = data.current.weather[0].description;
          timeImg.src = `images/${data.current.weather[0].icon}.svg`; 
         
          const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
          let date = new Date();
          let localDay = date.toLocaleDateString('fr-FR', {weekday: 'long'});
          localDay = localDay.charAt(0).toUpperCase() + localDay.slice(1);
          let ordredDays = days.slice(days.indexOf(localDay)).concat(days.slice(0, days.indexOf(localDay)));

          for(let m = 0; m < weekend.length; m++){
               weekend[m].innerHTML = `<div>${ordredDays[m]}</div>
                                       <div><img src = images/${data.daily[m].weather[0].icon}.svg = ></img></div>
                                       <div><span class="max">${Math.trunc(data.daily[m].temp.max)}°C</span> <span class="min">${Math.trunc(data.daily[m].temp.min)}°C</span></div>`;
      
          }
          
          hightlights[0].innerHTML = `<div>Vitesse du vent</div>
                                      <div class = "number"><span>${data.current.wind_speed}</span> m/s</div>
                                      <div class ="icon-container"> 
                                        <i class="fas fa-location-arrow"></i>
                                        <div> WSW</div>
                                      </div>`;
          hightlights[1].innerHTML = `<div>Humidité</div>
                                      <div class = "number"><span>${data.current.humidity}</span> %</div>
                                      <div>
                                        <div class = "percent">
                                             <span>0</span> <span>50</span>  <span>100</span>
                                        </div>
                                        
                                        <div class = "rang-container">
                                             <div class= "rang" style = "width : ${data.current.humidity}%"></div>
                                        </div>
                                        <div class ="unit"><span>%</span></div>
                                        
                                      </div>`;

          hightlights[2].innerHTML = `<div>Visibilité</div>
                                      <div class = "number">
                                        <span>${Math.trunc(data.current.visibility*0.001)}</span> km
                                      </div>`;
          hightlights[3].innerHTML = `<div>Pression</div>
                                      <div class = "number">
                                        <span>${data.current.pressure}</span> hPa
                                      </div>`;
     })
     .catch(() => {
          infoHandle(`<p>Oups, il y a un petit soucis, revenez plus tard. :)<p>`);
     });

    
}
function callApiCity(searchedCity){
     fulfilledCity = true;
     fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${APIKEY}`)
     .then(response=>{  
          return response.json();        
     })
     .then(data =>{
          let lat = data.coord.lat;
          let long = data.coord.lon;
          city.innerText = data.name;  
          callApiLatLong(lat, long);
          

     })
     .catch(()=>{
          infoHandle(`<p>Oups, je ne connais pas cette ville, on y travaille. :)<p>`);
     });
   
}
window.addEventListener('load', ()=>{
     setTimeout(()=>{
          loader.style.display="none";
         }, 1000);
});
