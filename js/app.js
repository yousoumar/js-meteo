const toogle = document.querySelector('#toggle');
let b = true;
toogle.addEventListener('click', (e)=>{
   e.currentTarget.parentElement.classList.toggle('show-form');
   if (b){
        e.currentTarget.innerText ="X"
        b=false;
   }else{
        e.currentTarget.innerText ="Chercher une ville"
        b=true;
   }
  
});
