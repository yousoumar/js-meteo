"use strict"

const toogle = document.querySelector('#toggle-form');
const city = document.querySelector('.city span:last-child');
const description = document.querySelector('.main-temperature-description div:first-child');
const temperature = document.querySelector('.main-temperature span');
const today = document.querySelector('.today');
const options = { weekday: 'long', month: 'long', day: 'numeric' };
today.innerText = new Date().toLocaleDateString('fr-FR', options);
const timeImg = document.querySelector('.main-time-img img');
const loader = document.querySelector('.loader');
const weekend = document.querySelectorAll('.weekend > div');
const myForm = document.querySelector('form');
const myInput = document.querySelector('input');
const info = document.querySelector('.info');
let lat = localStorage.getItem('lat');
let long = localStorage.getItem('long');
const APIKEY = "50021d7620cf40fe0d17ecde68cfceeb";
const locationButton = document.querySelector('.location');

let b = true;


toogle.addEventListener('click', (e)=>{
   e.currentTarget.parentElement.classList.toggle('show-form');
   if (b){
        e.currentTarget.innerText ="X"
        b=false;
   }else{
        e.currentTarget.innerText ="Chercher une capitale";
        b=true;
   }
  
});


if (lat && long){
   callApiLatLong(lat, long);           
}else{
     callApiCity('London');
}


locationButton.addEventListener('click', ()=>{
    
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
          toogle.innerText ="X"
          b=false;
     }else{
          toogle.innerText ="Chercher une capitale";
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
         
          if (response.ok){
               
               return response.json();
          }else{
               infoHandle(`<p>Oups, il y a un petit soucis, revenez plus tard ! :)<p>`);
          }
     })
     .then(data =>{
          console.log(data);
          temperature.innerHTML = Math.trunc(data.current.temp);
          let timezone = data.timezone;
          city.innerText = timezone.slice(timezone.indexOf('/')+1)
          description.innerText = data.current.weather[0].description;
          timeImg.src = `images/${data.current.weather[0].icon}.svg`; 
         
          const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

          let date = new Date();
          let localDay = date.toLocaleDateString('fr-FR', {weekday: 'long'});

          localDay = localDay.charAt(0).toUpperCase() + localDay.slice(1);

          let ordredDays = days.slice(days.indexOf(localDay)).concat(days.slice(0, days.indexOf(localDay)));
          for(let m = 0; m < weekend.length; m++){
               let inner = `<div>${ordredDays[m]}</div>
                              <div><img src = images/${data.daily[m].weather[0].icon}.svg = ></img></div>
                              <div>${Math.trunc(data.daily[m].temp.max)}° - ${Math.trunc(data.daily[m].temp.min)}°</div>`;

                    weekend[m].innerHTML = inner
                    
                    
          }

     })
     .catch(() => {
          infoHandle(`<p>Oups, il y a un petit soucis, revenez plus tard !:)<p>`);
          

     });

    
}
function callApiCity(city){
     fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`)
     .then(response=>{
         
          if (response.ok){
               
               return response.json();
          }else{
               
               infoHandle(`<p>Oups, je ne connais pas cette ville, on y travaille ! :)<p>`);
          }
     })
     .then(data =>{
          let lat = data.coord.lat;
          let long = data.coord.lon;
          callApiLatLong(lat, long);
          

     });
     

    
}

setTimeout(()=>{
     loader.style.display="none";
    }, 1000);