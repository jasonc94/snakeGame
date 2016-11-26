var canva = document.getElementById('mycanva');
var cxt = canva.getContext('2d');
var width = 15;
var direction;
var snake = [];
var food = new Food(20,20);
var pause = false;
var score = 0;
var speed = 500;



//create snake cell
function snakeCell(x,y,dir){
    this.x = x;
    this.y = y;
    this.dir = dir;
}

//create food
function Food(x,y){
    this.x = x;
    this.y = y;
}

//init snake
for(var i = 0; i<6; i++){
    var newCell = new snakeCell(i,0,1);
    snake.push(newCell);   
}

//draw the grid 40x40
function createGrid(){
    //horizontal lines
    cxt.strokeStyle = 'white';
    for(var i = 0; i < 40; i++){
        cxt.beginPath();
        cxt.moveTo(0,width*i);
        cxt.lineTo(600, width*i);
        cxt.closePath();
        cxt.stroke();
    }

    //vertical lines
    for(var i = 0; i < 40; i++){
        cxt.beginPath();
        cxt.moveTo(width*i,0);
        cxt.lineTo(width*i, 600);
        cxt.closePath();
        cxt.stroke();
    }
}

//draw food
function drawFood(){
    cxt.fillStyle = 'green';
    cxt.beginPath();
    cxt.rect(food.x*15,food.y*15,width,width);
    cxt.closePath(); 
    cxt.fill();
}

//draw snake
function drawSnake(){
    for(var i = 0; i<snake.length; i++){
        cxt.fillStyle = 'blue';
        if(i == snake.length-1)
           cxt.fillStyle = 'red';
        cxt.beginPath();
        cxt.rect(snake[i].x*15,snake[i].y*15,width,width);
        cxt.closePath(); 
        cxt.fill();
    }
}


//listener
// leftkey = 37, topkey = 38, rightkey = 39, downkey = 40
document.onkeydown = function(e){
    var key = e.keyCode;
    //left -1, right 1, top 2, down -2
    //alert(key);
    switch(key){
        case 37: 
            direction = -1;
            break;
        case 38:
            direction = 2;
            break;
        case 39:
            direction = 1;
            break;
        case 40:
            direction = -2;
            break;
        case 80:
            if(pause == false)
                pause = true;
            else
                pause = false;
            break;
        default:
            direction = 0;
            break;
    }
    move(direction);
}

//move snake
function move(dir){
    var tempSnake = [];
    var snakeHead = snake[snake.length-1];
    var newCell = new snakeCell(snakeHead.x,snakeHead.y, snakeHead.dir)
    for(var i = 0; i < snake.length-1; i++){
        tempSnake[i] = snake[i+1];
    }
    tempSnake[snake.length-1] = newCell;
    newCell.dir = dir;
    switch(dir){
        case 1: 
            newCell.x++;
            break;
        case -1:
            newCell.x--;
            break;
        case  2:
            newCell.y--;
            break; 
        case -2:
            newCell.y++;
            break; 
        default:
            break;
    }
    if(dir!=0 && !pause){
        snake = tempSnake;
    }
    drawAll();
}



//draw all
function drawAll(){
    $('#score').html(score);
    $('#speed').html(Math.round(1000/speed*100)/100 + "c/s");
    cxt.clearRect(0,0,600,600);
    createGrid();
    drawSnake();
    var head = snake[snake.length-1];
    
    //if ate food generate a new one
    if(head.x == food.x && head.y == food.y){
        score++;
        if(speed > 50)
            speed-=30;
        generateFood();
        appendNewCell(head.x,head.y,head.dir);
    }
    
    //draw food
    drawFood();
    //gameOverCheck();

    
}

//generate food at random
function generateFood(){
    var foodX = Math.ceil(Math.random()*39);
    var foodY = Math.ceil(Math.random()*39);
    for(var i = 0; i < snake.length; i++){
        if(foodX == snake[i].x && foodY == snake[i].y)
            generateFood();
    }
    food = new Food(foodX,foodY);
}

function appendNewCell(x,y,dir){
    var newCell = new snakeCell(x,y,dir);
        switch(dir){
        case 1: 
            newCell.x++;
            break;
        case -1:
            newCell.x--;
            break;
        case  2:
            newCell.y--;
            break; 
        case -2:
            newCell.y++;
            break; 
        default:
            break;
    }
    snake.push(newCell);
    drawAll();
}

function gameOverCheck(){
   if(ateSelf() || hitWall()){
       alert("Game Over!");
        location.reload();  
   } 
}

function ateSelf(){
    var head = snake[snake.length-1];
    for(var i = 0; i < snake.length-1; i++){
        if(head.x == snake[i].x && head.y == snake[i].y){
            return true;
        }
    }
}

function hitWall(){
    var head = snake[snake.length-1];
    if(head.x<0 || head.x>39 || head.y<0 || head.y>39)
        return true;
}

function moveClock(){
    var head = snake[snake.length-1];
    move(head.dir);
    setTimeout(moveClock(),500);   
}

moveClock();
drawAll();



