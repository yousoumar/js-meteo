const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

let date = new Date();
let localDay = date.toLocaleDateString('fr-FR', {weekday: 'long'});

localDay = localDay.charAt(0).toUpperCase() + localDay.slice(1);

let ordredDays = days.slice(days.indexOf(localDay)).concat(days.slice(0, days.indexOf(localDay)));
export default ordredDays;
