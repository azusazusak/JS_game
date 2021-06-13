// the parameters are passed from GameEngine object in main.js
const Timer = function(elementID, time, onTimesUpFn){ 
    const timer = this;
    timer.element = document.getElementById(elementID); //elementID= #timer div
    timer.startingTime = time; //time= ge.timeLimit
    timer.timeRemaining = time;
    timer.onTimesUpFn = onTimesUpFn; //onTimesUpFn= ge.gameOver() 

    timer.init = function(){
        timer.updateTimerDisplay(timer.startingTime); //set the default time limit
        timer.timeRemaining = time;
        timer.start();
    }

    timer.updateTimerDisplay = function (displayedTime) {//displayedTime= timer.timeRemaining
        timer.element.innerHTML = displayedTime;
    }

    timer.start = function(){
        timer.interval = setInterval(function(){
            timer.timeRemaining--; //Subtract 1 from the time remaining

            timer.updateTimerDisplay(timer.timeRemaining); //the time remaining as a parameter to display

            //stop the timer when the time remaining reaches zero
            if(timer.timeRemaining == 0){ 
                timer.stop();
                timer.onTimesUpFn(); //invoke ge.gameOver(); function in main.js with callback
            }
        }, 1000); //every one second
    }

    timer.stop = function(){
        clearInterval(timer.interval);
    }

    // timer.init(); is invoked in ge.gameStart function in the main.js file.

}