        // Function to update the displayed time
        function updateDateTime() {
            let currentDate = new Date();
            let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            let dateTimeString = currentDate.toLocaleDateString(undefined, options) + " " + currentDate.toLocaleTimeString();
            
            document.getElementById("currentDateTime").textContent = dateTimeString;
        }
    
        // Call the function initially to set the time
        updateDateTime();
    
        // Set up an interval to update the time every second
        setInterval(updateDateTime, 1000);
