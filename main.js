var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

var gameAreaH = window.innerHeight;
var gameAreaW = window.innerWidth;
canvas.width = gameAreaW;
canvas.height = gameAreaH;
var up = false;
var right = false;
var down = false;
var left = false;
var actions = [up,right,down,left];
var dy;
var dx;
var shooting = false;
var shootingSpeed = 50;

window.addEventListener('resize',function(){
    gameAreaW = window.innerWidth;
    gameAreaH = window.innerHeight;
    canvas.width = gameAreaW;
    canvas.height = gameAreaH;
})

window.addEventListener('keypress',function(e){
    if(e.key == 'w'){
        actions[0] = true;
    }if(e.key == 's'){
        actions[2] = true;
    }if(e.key == 'a'){
        actions[3] = true;
    }if(e.key == 'd'){
        actions[1] = true;
    }if(e.key ==' '){
        if(!shooting){
            shooting = true;
            player.isShooting();
            setTimeout(function(){
                shooting = false;
            },shootingSpeed);
        }
    }
})

window.addEventListener('keyup',function(e){
    if(e.key == 'w'){
        actions[0] = false;
    }if(e.key == 's'){
        actions[2] = false;
    }if(e.key == 'a'){
        actions[3] = false;
    }if(e.key == 'd'){
        actions[1] = false;
    }
})



function Player(){
    this.x = gameAreaW/2;
    this.y = gameAreaH/2;
    this.size = 40;
    this.speed = 2;
    this.shoot = [];
    this.health = 100;
    this.enemies = [new Enemies];

    this.center = {
        y : this.y-this.size/20,
        x : this.x-this.size/20
    }

    this.draw = function(){
        this.drawBullets();
        this.drawTank();
        this.drawEnemies();
    }

    this.drawTank = function(){
        this.update();
        this.constrain();
        c.save();
        c.translate(this.center.x,this.center.y);
        c.rotate(-angle);
        c.fillStyle = 'green';
        c.beginPath();
        c.fillRect(-20,-20,this.size,this.size);
        c.stroke();
        c.closePath();
        c.beginPath();
        c.fillRect(-10,-5,-30,10);
        c.stroke();
        c.closePath();
        c.restore();
    }

    this.drawBullets = function(){
        if(this.shoot.length>0){
            this.shoot.forEach(function(el,i){
                if(el.centerX < 0 || el.centerX >gameAreaW || el.centerY < 0 || el.centerY > gameAreaH){
                    player.shoot.splice(i,1);
                }
                el.draw();
            })
        }
    }

    this.drawEnemies = function(){
        this.enemies.forEach(function(el){
            el.draw();
        })        
    }
    
    this.update = function(){
        if(actions[0]){
            this.center.y+=this.speed*Math.sin(angle);
            this.center.x-=this.speed*Math.cos(angle);
        }if(actions[1]){
            this.center.y-=this.speed*Math.cos(angle);
            this.center.x-=this.speed*Math.sin(angle);
        }if(actions[2]){
            this.center.y-=this.speed*Math.sin(angle);
            this.center.x+=this.speed*Math.cos(angle);
        }if(actions[3]){
            this.center.y+=this.speed*Math.cos(angle);
            this.center.x+=this.speed*Math.sin(angle);
        }
        actions.forEach(function(el){
            if(!el){
                this.y+=0;
                this.x+=0;
            }
        })
    }
    this.constrain = function(){
        if(this.center.y<this.size/2){
            this.center.y = this.size/2;
        }if(this.center.x<this.size/2){
            this.center.x = this.size/2;
        }if(this.center.y>gameAreaH-this.size/2){
            this.center.y = gameAreaH-this.size/2;
        }if(this.center.x>gameAreaW-this.size/2){
            this.center.x = gameAreaW-this.size/2;
        }
    }

    this.isShooting = function(){
        player.shoot.push(new Bullets);
    }

}

function Bullets(){
    this.speed = 10;
    this.centerX = player.center.x;
    this.centerY = player.center.y;
    this.angle = angle;

    this.draw = function(){
        this.update();
        c.save();
        c.translate(this.centerX,this.centerY);
        c.rotate(-this.angle);
        c.beginPath()
        c.fillStyle = 'yellow';
        c.fillRect(-40,-5,20,10);
        c.fill();
        c.restore();
    }
    this.update = function(){
        this.centerX-=this.speed*Math.cos(this.angle);
        this.centerY+=this.speed*Math.sin(this.angle);
    }

    this.draw();
}


var player = new Player;
var angle = 0;

canvas.addEventListener('mousemove',function(e){
    angle = Math.atan2(e.offsetY - player.center.y, - (e.offsetX - player.center.x));
})

function Enemies(){
    this.x = Math.random()*gameAreaW;
    this.y = Math.random()*gameAreaH;
    this.size = 40;
    this.center = {
        x : this.x - this.size/2,
        y : this.y - this.size/2
    }
    this.speed = 2;

    this.draw = function(){
        this.update();
        c.save();
        c.translate(this.center.x,this.center.y);
        c.beginPath();
        c.fillRect(0,0,this.size,this.size);
        c.closePath();
        c.restore();
    }

    this.update = function(){
        this.angle = Math.atan2(player.center.y - this.center.y, -(player.center.x - this.center.x));
        this.center.x-=this.speed*Math.cos(this.angle);
        this.center.y+=this.speed*Math.sin(this.angle);
    }
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,gameAreaW,gameAreaH);
    player.draw(player.x,player.y);
}

animate();
