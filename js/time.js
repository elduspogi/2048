function updateDateTime() {
    let currentDate = new Date();
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let dateTimeString = currentDate.toLocaleDateString(undefined, options) + " " + currentDate.toLocaleTimeString();
    
    document.getElementById("currentDateTime").textContent = dateTimeString;
}

updateDateTime();

setInterval(updateDateTime, 1000);
