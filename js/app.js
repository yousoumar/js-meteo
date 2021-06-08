"use strict"
const toogle = document.querySelector('#toggle-form');
let b = true;
toogle.addEventListener('click', (e)=>{
   e.currentTarget.parentElement.classList.toggle('show-form');
   if (b){
        e.currentTarget.innerText ="X"
        b=false;
   }else{
        e.currentTarget.innerText ="Chercher une ville";
        b=true;
   }
  
});

const info = document.querySelector('.info');
let lat = localStorage.getItem('lat');
let long = localStorage.getItem('long');
const APIKEY = "50021d7620cf40fe0d17ecde68cfceeb";
const locationButton = document.querySelector('.location');

if (lat && long){
   callAPI(lat, long);           
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
                         callAPI(lat, long);
                      
          
                    }, ()=>{
                          infoHandle(`<p>Vous avez refusé la géolocalisation.
                          Changer les paramètres de votre navigateur ou chercher directement votre ville par son nom.</p>`);
                    });
               }else{
                    infoHandle(`<p>Votre navigateur ne peut faire de la géolocalisation. Chercher votre ville par son nom.</p>`);
               }
          },3000)
          
     }else{
     
          callAPI(lat, long);
          
     }
     
});

const infoHandle = (message)=>{
     info.innerHTML = message;
     info.style.display = "flex";
     setTimeout(()=>{
          info.style.display = "none"
     },3000);
}

const city = document.querySelector('.city span:last-child');
const description = document.querySelector('.main-temperature-description div:first-child');
const temperature = document.querySelector('.main-temperature span');
const today = document.querySelector('.today');
const options = { weekday: 'long', month: 'long', day: 'numeric' };
today.innerText = new Date().toLocaleDateString('fr-FR', options);
const timeImg = document.querySelector('.main-time-img img');
const loader = document.querySelector('.loader');
console.log(loader)


function callAPI(lat, long){
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
         timeImg.src = `images/${data.current.weather[0].main}.png`; 
         
       
         


     })
     .catch(() => {
          infoHandle(`<p>Oups, il y a un petit soucis, revenez plus tard !:)<p>`);
          

     });

    
}
setTimeout(()=>{
     loader.style.display="none";
    }, 1000)