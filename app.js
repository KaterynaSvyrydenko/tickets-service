document.addEventListener('DOMContentLoaded', () => {

    const films = document.getElementById('#films');
    const layout = document.getElementById('#layout');
    const nextDates = document.getElementById('#buttonNext');
    const prevDates = document.getElementById('#buttonPrev');
    const exitBtn = document.getElementById('#buttonExit');
    const sessionTime = [10, 12, 14, 16, 18, 20];
    const sessions = document.getElementById('#sessions');
    const places = document.getElementById('#places');
    const seatButton = document.getElementById('#seatButton');
    const seatFree = 0;
    const seatSelected = 1;
    const seatBooked = 2;
    

    var step = 0;
    var currentSession = 0;
    var currentSeats = [];

//========================================================================================================================
    const saveSeatsBySession = (time,seats) => {
        localStorage.setItem(time, JSON.stringify(seats));
    }

    const getBookedSeatsBySession = (time) => {
        return JSON.parse(localStorage.getItem(time)) || [];
    }

//========================================================================================================================
    const formatDate = (date) => {
        let monthNames = [
          "January", "February", "March",
          "April", "May", "June", "July",
          "August", "September", "October",
          "November", "December"
        ];
        var monthIndex = date.getMonth();
        var day = date.getDate();
    
        return monthNames[monthIndex] + ' ' + day;
    }

//========================================================================================================================
    const generateDayItems = () => {
        for(i=0; i < 7; i++){
            for(i=0; i < 7; i++){
                var day = new Date();
                day.setDate(day.getDate() + i + step);

                films.innerHTML += `
                    <div class="film_item" id='${i}' data-date=${day.getTime()}>${formatDate(day)}</div>`;
            }           
        }    
    };    

    const generateSessionItems = (date) => {
        for(i=0; i< sessionTime.length; i++){
    
            let time = new Date(date);
            time.setHours(sessionTime[i], 0, 0, 0);
            
    
            sessions.innerHTML += `
            <div class='session_item' data-date=${time.getTime()}>
               ${time.getHours() + ':' + (time.getMinutes()<10 ? '0' : '') + time.getMinutes()}
            </div>`;
        }
    };

    const generateSeats = () => {
        for(i=0; i < currentSeats.length; i++){

            var elemClass = currentSeats[i] == seatBooked ? 'place_item-booked' : 'place_item-free';
            places.innerHTML += `
                <div class='place_item ${elemClass}' value=${i}>${i+1}</div>`;
        }
    };

//========================================================================================================================
    const sessionSelected = (time) => {
        currentSession = time;
        currentSeats = getBookedSeatsBySession(currentSession);
        if(currentSeats.length == 0) {
            currentSeats.length = 30;
        }
        generateSeats();
    };


    const seatClicked = (target) => {
        var seat = Number(target.getAttribute('value'));
        if(currentSeats[seat] == seatBooked){
            return;
        }
        if(currentSeats[seat] == seatSelected){
            currentSeats[seat] = seatFree;
            target.classList.add('place_item-free');
            target.classList.remove('place_item-selected');
            return;
        }
        currentSeats[seat] = seatSelected;
        target.classList.add('place_item-selected');
        target.classList.remove('place_item-free');
    };


    const buyButtonClicked = () => {
        for(i=0; i < currentSeats.length; i++){      
            if(currentSeats[i] == seatSelected){
                currentSeats[i] = seatBooked
            }
        }

        saveSeatsBySession(currentSession,currentSeats);
        generateSeats();
    };


    const clickListener = (event) => {

        const filmItems = document.querySelectorAll('.film_item');
        let target = event.target;

        if(target == nextDates){
            films.textContent = '';
            step += 7;
            generateDayItems();
            prevDates.style.opacity = '1';
        }
        if(target == prevDates){
            films.textContent = '';
            step -= 7;
            if( step < 0 ) { 
                step = 0;
                prevDates.style.opacity = '0.7';
            }
            generateDayItems();
        }
        if(target == exitBtn){
            filmItems.forEach(item => {
                item.style.display = "block";
            })
            exitBtn.style.display = 'none';
            nextDates.style.display = 'block';
            prevDates.style.display = 'block';
            places.textContent = '';
            seatButton.style.display = 'none';
            sessions.textContent = '';

        }
        if(target.className == "film_item"){

            let newDate = new Date(Number(target.getAttribute("data-date")));

            filmItems.forEach(item => {
                item.classList.remove('date_active');
            })
            target.classList.add('date_active');

            if(window.innerWidth < 820){
                filmItems.forEach(item => {
                    item.style.display = "none";
                })
                target.style.display = 'block';
                exitBtn.style.display = 'block';
                nextDates.style.display = 'none';
                prevDates.style.display = 'none';
                
            }

            sessions.textContent = '';
            places.textContent = '';
            seatButton.style.display = 'none';
            generateSessionItems(newDate);
        }
        if(target.className == 'session_item'){

            const sessionItem = document.querySelectorAll('.session_item');
            const selectedItemTime = Number(target.getAttribute("data-date"));


            sessionItem.forEach(item => {
                item.classList.remove('session_active');
            })
            target.classList.add('session_active');

            places.textContent = '';

            if(selectedItemTime > Date.now()){
                seatButton.style.display = 'block';
                sessionSelected(selectedItemTime);
            }else{
                places.innerHTML += `
                <div class='alert'>We are sorry</br> But this session is over</div>`;
                seatButton.style.display = 'none';
            }
        }
        if(target.classList.contains('place_item')){
            seatClicked(target); 
        }
        if(target == seatButton){
            places.textContent = '';
            buyButtonClicked();
        }
    };


    layout.addEventListener('click', clickListener);
    generateDayItems();
});

