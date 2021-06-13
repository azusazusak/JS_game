// the object that creates the element of each fruit (and vegetable) and drop it from the sky
const Fruit = function(pickedFruit, ge){
    const fruit = this;
    fruit.pickedFruit = pickedFruit; //pickedFruit= { name: , point: } from FruitFarm object
    fruit.ge = ge; //ge= GameEngine object
    fruit.gameArea = fruit.ge.gameArea; //now we can use ge.gameArea in Fruit object
    fruit.element = document.createElement("img"); //create img element for each fruit
    fruit.left = 0;
    fruit.top = 0;
    fruit.point = 0;

    //set a random left position of the fruit between 0 and 1080
    //1080 = 1200px(gameArea's width) - 120px(maximum fruit width; watermelon) 
    fruit.setFruitLeftPosition = function(){
        let min = 0;
        let max = fruit.gameArea.clientWidth -120;
        fruit.left = Math.floor(Math.random() * (max + 1 - min)) + min;
    }

    //create a fruit element on the screen with class name and img file name to style it with css
    fruit.shipFruit = function(){
        fruit.element.style.left = fruit.left + "px";
        fruit.element.classList.add("fruit");
        fruit.element.classList.add(fruit.pickedFruit.name);
        fruit.element.src = "imgs/" + fruit.pickedFruit.name + ".png";
        fruit.element.alt = fruit.pickedFruit.name;
        fruit.gameArea.appendChild(fruit.element);
    }

    //set a random dropping speed and make it work
    fruit.dropFruit = function(){
        let min = 10;
        let max = 70;
        let intervalTime = Math.floor(Math.random() * (max + 1 - min)) + min;
        setInterval(function(){
            fruit.top = fruit.top + 5;
            fruit.element.style.top = fruit.top + "px"; 
        }, intervalTime)
    }

    fruit.getFruitInfo = function(){
        //getComputedStyle() is the method that gets all the actual (computed) CSS property and values of the specified element.
        fruit.positionData = getComputedStyle(fruit.element);
        //pass the infomation of the fruit as parameters to GameEngine to detect a collision with basket in GE object
        //invoke ge.detectCollision function which is set in GameEngine
        fruit.ge.detectCollision(fruit.positionData, fruit.pickedFruit.point, fruit.element);       
    }

    fruit.init = function(){
        fruit.setFruitLeftPosition();
        fruit.shipFruit();
        fruit.dropFruit();
        fruit.getFruitInfo();
    }

    fruit.init();
}



//the object that creates the contents of each fruit (and vegetable)
//FruitFarm instance is created in GameEngine and all GE functions are passed to FruitFarm as a paraneter, then FruitFarm also passes GE functions as a parameter to Fruit to use ge.gameArea in Fruit object.
const FruitFarm = function(ge){
    const ff = this;
    ff.ge = ge;
    ff.fruitOptions = [ //set fruit options with names and points as an array 
        { name: "strawberry", point: 50 },
        { name: "lemon", point: 40 },
        { name: "apple", point: 30 }, 
        { name: "grape", point: 20 },
        { name: "pineapple", point: 10 }, 
        { name: "watermelon", point: 5 }, ];

    ff.vegetableOptions = [ // vegetable as well
        { name: "carrot", point: -5 },
        { name: "tomato", point: -10},
        { name: "eggplant", point: -20 },
        { name: "broccoli", point: -30 },
        { name: "cabbage", point: -40 }, ];

    // pick a random fruit option from ff.fruitOptions array
    ff.pickFruit = function(){
        return ff.fruitOptions[Math.floor(Math.random() * ff.fruitOptions.length)];
    }

    // vegetable as well
    ff.pickVegetable = function () {
        return ff.vegetableOptions[Math.floor(Math.random() * ff.vegetableOptions.length)];
    }

    // the function to stop picking fruits and vegetables
    ff.stopPicking = function(){
        clearInterval(ff.fruitpicking);
        clearInterval(ff.vegetablepicking);
    }

    ff.init = function(){

        //pick a random fruit from options every 2 seconds
        ff.fruitpicking = setInterval(function(){
            new Fruit(ff.pickFruit(), ff.ge); //pass the contents of each fruit and GameEngine function as paraneters
        },2000)

        //pick a random vegetable from options every 3.8 seconds
        ff.vegetablepicking = setInterval(function () {
            new Fruit(ff.pickVegetable(), ff.ge); //pass the contents of each fruit and GameEngine as paraneters
        }, 3800)
    }
    // ff.init(); is invoked in ge.gameStart
}



// the object that creates the basket
//Basket instance is created in GameEngine and all GE functions are passed to Basket as a paraneter
const Basket = function(ge){
    const basket = this;
    basket.ge = ge; //ge= GameEngine object
    basket.gameArea = basket.ge.gameArea; //now we can use ge.gameArea in Basket object
    basket.element = document.getElementById("basket");
   
    basket.init = function(){
        basket.left = 550; //set the basket on the center. the width of gameArea is 1200px
        basket.element.style.left = basket.left + "px";

        basket.moton = setInterval(function(){
            //the width of the basket is 130px so subtract 130 px to make it fit within the game area.
            //ge.keyPressed comes from GameEngine object
            if (basket.left < (basket.gameArea.clientWidth - 130) && basket.ge.keyPressed == "ArrowRight")
            {
                basket.left = basket.left + 25;
                basket.element.style.left = basket.left + "px";
            } else if (basket.left >10 && basket.ge.keyPressed == "ArrowLeft")
            {
                basket.left = basket.left - 25;
                basket.element.style.left = basket.left + "px";                
            }
        },50)
    }
    // basket.init(); is invoked in ge.gameStart
}



// the object that detects the elements on the screen and controls them so that they function as a game.
const GameEngine = function(){
    const ge = this;
    ge.gameArea = document.getElementById("gameArea");
    ge.keyPressed = false;
    ge.instruction = document.getElementById("instruction");
    ge.startBtn = document.getElementById("startBtn");
    ge.playAgainBtn = document.getElementById("playAgainBtn");
    ge.timesUpMsg = document.getElementById("timesUp");
    ge.scoreBoard = document.getElementById("score");
    ge.timeLimit = 60;
    //substitute Timer's instance for ge.timer to use Timer's functions in GameEngine
    //pass the element of #timer div, time limit and ge.gameOver(); as parameters to use them in Timer object in timer.js
    ge.timer = new Timer("timer", ge.timeLimit, function(){
        ge.gameOver();
    });
    ge.farm = new FruitFarm(ge) //create FruitFarm's instance in GE and pass GE to FruitFarm to connect both functions
    ge.basket = new Basket(ge); //Basket as well
    //getComputedStyle() is the method that gets all the actual (computed) CSS property and values of the specified element.
    ge.basket.positionData = getComputedStyle(ge.basket.element);


    //the function that detect collisions between the basket and fruits, and set the action that occurs after the collision is detected
    //the parameters are passed from fruit.ge.detectCollision in Fruit object
    ge.detectCollision = function(fruitData, point, element){
        setInterval(function () {

            //substitute the values of the basket and the fruit(left, top, width, height) for the variables as an array
            //The parseInt() function parses a string and returns an integer.
            let basket = { x: parseInt(ge.basket.positionData.left), y: parseInt(ge.basket.positionData.top), w: parseInt(ge.basket.positionData.width), h:parseInt(ge.basket.positionData.height)};
            let fruit = { x: parseInt(fruitData.left), y: parseInt(fruitData.top), w: parseInt(fruitData.width), h: parseInt(fruitData.height)};
            
            if (basket.x < fruit.x + fruit.w && 
                basket.x + basket.w > fruit.x &&
                basket.y < fruit.y + fruit.h &&
                basket.y + basket.h > fruit.y) 
                //These four conditions are met = There is an overlap between the basket and the fruit element.
            {
                ge.sumScore(point); //add the point of each fruit
                element.remove(); //then remove the element

                //create a point icon element and display it
                let pointIcon = document.createElement("div");
                pointIcon.classList.add("pointIcon");
                pointIcon.innerHTML = point;
                pointIcon.style.left = (basket.x + 45) + "px";
                pointIcon.style.top = basket.y + "px";
                if(point>0){
                    pointIcon.style.backgroundColor = "green";
                } else {
                    pointIcon.style.backgroundColor = "red";
                }                
                ge.gameArea.appendChild(pointIcon);

                //make the icon move upward.
                setInterval(function () {
                    let top = basket.y - 20;
                    pointIcon.style.top = top + "px";
                }, 50) 

                //make the icon fade out 0.5 seconds after the collision.
                setTimeout(function(){
                    pointIcon.style.opacity = 0;                   
                },500)

                //remove the icon 1 seconds after the collision.
                setTimeout(function () {
                    pointIcon.remove();
                }, 1000)
            }
        }, 50); //detect collisions every 0.05 seconds
    }

    //Add the points of the collided fruit to the total points and desplay it
    ge.sumScore = function(point){
        ge.score = ge.score + point;
        ge.scoreBoard.innerHTML = ge.score;
    }

    //remove all fruit elements on the browser (when the game is over)
    ge.removeFruits = function(){
        let fruits = document.querySelectorAll(".fruit");
        fruits.forEach(function (fruit) {
            fruit.remove();
        })
    }

    ge.gameOver = function(){
        ge.timer.stop();
        ge.farm.stopPicking();
        ge.removeFruits();
        clearInterval(ge.basket.moton); //stop the basket motion
        ge.timesUpMsg.style.display = "block"; //display the message of game over
        ge.playAgainBtn.style.display = "inline-block";//and the button
    }

    //set the events when a user press keys and use them in Basket object
    ge.setKeydown = function(){
        document.addEventListener("keydown", function (e) {
            ge.keyPressed = e.key;
        })
    }

    ge.setKeyup = function(){
        document.addEventListener("keyup", function (e) {
            ge.keyPressed = false;
        })
    }

    ge.gameStart = function(){
        ge.timer.init();
        ge.farm.init();
    }

    //set the event of the start button
    ge.startBtn.addEventListener("click", function(e){
        e.preventDefault();
        ge.gameStart();
        ge.instruction.style.display = "none";
        ge.startBtn.style.display = "none";
    })

    //set the event of the play again button
    ge.playAgainBtn.addEventListener("click", function (e){
        e.preventDefault();
        ge.init();
    })

    ge.init = function(){
        ge.setKeydown();
        ge.setKeyup();
        ge.instruction.style.display = "block";
        ge.startBtn.style.display = "inline-block";
        ge.timesUpMsg.style.display = "none";
        ge.playAgainBtn.style.display = "none";
        ge.timer.element.innerHTML = ge.timer.startingTime;
        ge.score = 0;
        ge.scoreBoard.innerHTML = ge.score;
        ge.basket.init();
    }

    ge.init();
}

new GameEngine();