/**
 * Created by jack on 5/16/16.
 */

const RIGHT_ARROW = 39;
const LEFT_ARROW = 37;
const SPACEBAR = 83;
const HEIGHT = 425;
const WIDTH = 400;

var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, {backgroundColor: 0});
gameport.appendChild(renderer.view);
var graphics = new PIXI.Graphics();
var stage = new PIXI.Container();
var text = new PIXI.Text(" Press 'S' to begin.\n Use the arrow keys \nto move your paddle.",
    {fill: 0xffffff});
text.anchor.set(0.5, 0.5);
text.position.x = WIDTH/2;
text.position.y = HEIGHT/2;
var lost_text = new PIXI.Text("         You Lose!\nRefresh to play again", {fill:0xffffff});
lost_text.anchor.set(0.5, 0.5);
lost_text.position.x = WIDTH/2;
lost_text.position.y = HEIGHT/2;
var right = false;
var left = false;
var space = false;
var ball_dx = 2;
var ball_dy = -2;
var padd_dx = 7;
var bricks = [];

function Ball(rad) {
    this.radius = rad;
    this.x = WIDTH/2;
    this.y = HEIGHT-50;
    this.draw = function(graphics) {
        graphics.beginFill(0x0095DD);
        graphics.drawCircle(this.x, this.y, this.radius);
        graphics.endFill();
    };
    this.move = function(graphics) {
        if (this.x + this.radius + ball_dx >= WIDTH || this.x - this.radius + ball_dx <= 0) {
            ball_dx = -ball_dx;
        }
        if (this.y + this.radius + ball_dy >= HEIGHT) {
            graphics.clear();
            stage.addChild(lost_text);
            cancelAnimationFrame(draw);
            lost_screen();
        }
        else if (this.y-this.radius+ball_dy <= 0) {
            ball_dy = -ball_dy;
        }
        this.x += ball_dx;
        this.y += ball_dy;
        this.draw(graphics);
    };
}

var ball = new Ball(5);

function Paddle() {
    this.width = 75;
    this.height = 10;
    this.x = WIDTH/2-35;
    this.y = HEIGHT - 25 - this.height/2;
    this.draw = function(graphics) {
        graphics.beginFill(0x0095DD);
        graphics.drawRect(this.x, this.y, this.width, this.height);
        graphics.endFill();
    };
    this.move = function(graphics) {
        this.x += padd_dx;
        if (this.x+this.width>=WIDTH) {
            this.x = WIDTH-this.width;
        }
        else if (this.x<=0) {
            this.x = 0;
        }
        this.draw(graphics);
    };
    this.collides = function(ball) {
        if (ball.x+ball.radius>this.x && ball.x-ball.radius<this.x+this.width && ball.y+ball.radius>this.y && ball.y-ball.radius<this.y+this.height) {
            if (ball.x == this.x + this.width/2) {
                ball_dy = -3;
                ball_dx = 0;
            }
            else {
                var angle = 90;
                if (ball.x < this.x+(this.width/2)) {
                    angle = Math.abs(90 - (this.x+(this.width/2)-ball.x));
                    ball_dx = -3*Math.abs(Math.cos(angle));
                }
                else {
                    angle = Math.abs(90 - ball.x-(this.x+(this.width/2)));
                    ball_dx = 3*Math.abs(Math.cos(angle));
                }
                ball_dy = -Math.abs(3*Math.sin(angle));
            }
        }
    }
}

var paddle = new Paddle();

function Brick(x, y) {
    this.x = x;
    this.y = y;
    this.width = 25;
    this.height = 10;
    this.color = parseInt(Math.floor(Math.random()*16777215).toString(16), 16);
    this.draw = function(graphics) {
        graphics.beginFill(this.color);
        graphics.drawRect(this.x, this.y, this.width, this.height);
        graphics.endFill();
    };
    this.collide = function(ball) {
        if (ball.x+ball.radius > this.x && ball.x-ball.radius < this.x+this.width && ball.y+ball.radius > this.y && ball.y-ball.radius < this.y+this.height) {
            if (ball.x == this.x + this.width/2) {
                ball_dy = -3;
                ball_dx = 0;
            }
            else {
                var angle = 90;
                if (ball.x < this.x+(this.width/2)) {
                    angle = Math.abs(90 - (this.x+(this.width/2)-ball.x));
                }
                else {
                    angle = Math.abs(90 - ball.x-(this.x+(this.width/2)));
                }
                ball_dx = (ball_dx/Math.abs(ball_dx))*Math.abs(3*Math.cos(angle));
                ball_dy = (-ball_dy/Math.abs(ball_dy))*Math.abs(3*Math.sin(angle));
            }
            bricks.splice(bricks.indexOf(this), 1);
            if (bricks.length == 0) {
                newBricks();
            }
        }
    };
    this.contains = function(x, y) {
        if (x > this.x && x < this.x+this.width) {
            if (y > this.y && y < this.y+this.height) {
                return true;
            }
        }
        return false;
    }
}

function newBricks() {
    var x = 75;
    var y = 50;
    for (var i = 0; i < 42; i++) {
        bricks.push(new Brick(x, y));
        x += 45;
        if (x > WIDTH-75) {
            x = 75;
            y += 35;
        }
    }
}

function setup() {
    stage.addChild(graphics);

    newBricks();

    document.addEventListener("keydown", keyPress);
    document.addEventListener("keyup", keyRelease);

    stage.addChild(text);
    start_screen();
}

function keyPress(e) {
    if (e.keyCode == SPACEBAR) {
        space = true;
    }
    else if (e.keyCode == RIGHT_ARROW) {
        right = true;
    }
    else if (e.keyCode == LEFT_ARROW) {
        left = true;
    }
}

function keyRelease(e) {
    if (e.keyCode == RIGHT_ARROW) {
        right = false;
    }
    else if (e.keyCode == LEFT_ARROW) {
        left = false;
    }
}

function start_screen() {
    if (!space) {
        requestAnimationFrame(start_screen);
        renderer.render(stage);
    }
    else {
        stage.removeChild(text);
        space = false;
        cancelAnimationFrame(start_screen);
        draw();
    }
}

function lost_screen() {
    if (!space) {
        requestAnimationFrame(lost_screen);
        graphics.clear();
        renderer.render(stage);
    }
}

function draw() {
    requestAnimationFrame(draw);

    // Change the paddle direction appropriately
    if (right == left) { // Both off or both on means no movement
        padd_dx = 0;
    }
    else if (right) {
        padd_dx = 7;
    }
    else if (left) {
        padd_dx = -7;
    }

    graphics.clear();
    ball.move(graphics);
    paddle.move(graphics);
    paddle.collides(ball);
    for (var i = 0; i < bricks.length; i++) {
        bricks[i].draw(graphics);
        bricks[i].collide(ball);
    }

    renderer.render(stage);
}

setup();