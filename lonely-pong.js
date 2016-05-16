/**
 * Created by jack on 5/16/16.
 */

const RIGHT_ARROW = 39;
const LEFT_ARROW = 37;
const SPACEBAR = 32;

var gameport = document.getElementByID("gameport");
var renderer = PIXI.autoDetectRenderer();
gameport.appendChild(renderer.view);
var stage = new PIXI.Container();
var ballImg = PIXI.Texture.fromImage(); //TODO: get ball image
var ball = new PIXI.Sprite(ballImg);
var paddleImg = PIXI.Texture.fromImage(); //TODO: get paddle image
var paddle = new PIXI.Sprite(paddleImg);
var right = false;
var left = false;
var space = false;
var ball_dx = 2;
var ball_dy = -2;
var padd_dx = 7;

function setup() {
    // Setup the ball's initial position
    ball.anchor.x = 0.5;
    ball.anchor.y = 0.5;
    ball.position.x = stage.width/2;
    ball.position.y = stage.height/2;
    stage.addChild(ball);

    // Setup the paddle's initial position
    paddle.anchor.x = 0.5;
    paddle.anchor.y = 0.5;
    paddle.position.x = stage.width/2;
    paddle.position.y = stage.height-paddle.height;
    stage.addChild(paddle);

    document.addEventListener("keydown", keyPress);
    document.addEventListener("keyup", keyRelease);
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
    if (e.keyCode == SPACEBAR) {
        space = false;
    }
    else if (e.keyCode == RIGHT_ARROW) {
        right = false;
    }
    else if (e.keyCode == LEFT_ARROW) {
        left = false;
    }
}

function bound(x, y, xRad, yRad) {
    var outX = x;
    var outY = y;
    if (x-rad < 0) {
        outX = 0+xRad;
    }
    else if (x+rad > stage.width) {
        outX = stage.width-xRad;
    }

    if (y-yRad < 0) {
        outY = 0+yRad;
    }
    else if (y+yRad > stage.height) {
        outY = stage.height-yRad;
    }

    return [outX, outY];
}

function draw() {
    requestAnimationFrame(draw);
    //TODO: move sprites
    renderer.render(stage);
}

setup();
draw();