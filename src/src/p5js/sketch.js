var dots = [];
let numOfDots = 80;
let minDotSize = 1;
let maxDotSize = 5;
let maxVelocity = 0.5;
let minVelocity = 0.1;
let maxDotDistance = 150;
let fr = 20;

var canvas;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style("position: fixed; left: 0; top: 0; z-index: -1000");
    numOfDots = calculateNumOfDots();
    frameRate(fr);
    for (let i = 0; i < numOfDots; i++) {
        let xVelocity = random(-maxVelocity, maxVelocity);
        let yVelocity = random(-maxVelocity, maxVelocity);
        let averageVelocity = (Math.abs(xVelocity) + Math.abs(yVelocity)) / 2;
        let dotSize = map(
            averageVelocity,
            minVelocity,
            maxVelocity,
            maxDotSize,
            minDotSize
        );
        dots.push(
            new Dot(
                random(width),
                random(height),
                dotSize,
                xVelocity,
                yVelocity
            )
        );
    }

    for (let i = 0; i < dots.length; i++) {
        let exclusiveDots = [];
        for (let j = 0; j < dots.length; j++) {
            if (i != j) {
                exclusiveDots.push(dots[j]);
            }
        }

        if (
            dots[i].xPosition > width ||
            dots[i].xPosition < 0 ||
            dots[i].yPosition > height ||
            dots[i].yPosition < 0
        ) {
            dots[i] = createDot();
        }

        dots[i].update(exclusiveDots);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    numOfDots = calculateNumOfDots();
}

function calculateNumOfDots() {
    let area = width * height;
    return Math.round((37 / 568026) * area + 2129240 / 94671);
}

function draw() {
    clear();

    if (dots.length > numOfDots) {
        dots.pop();
    } else {
        dots.push(createDot());
    }

    for (let i = 0; i < dots.length; i++) {
        let exclusiveDots = [];
        for (let j = 0; j < dots.length; j++) {
            if (i != j) {
                exclusiveDots.push(dots[j]);
            }
        }

        if (
            dots[i].xPosition > width + maxDotDistance ||
            dots[i].xPosition < 0 - maxDotDistance ||
            dots[i].yPosition > height + maxDotDistance ||
            dots[i].yPosition < 0 - maxDotDistance
        ) {
            dots[i] = createDot();
        }

        dots[i].update(exclusiveDots);
    }
}

function createDot() {
    let randomNumer = random(0, 4);
    let xPosition;
    let yPosition;
    let xVelocity;
    let yVelocity;

    if (randomNumer < 1) {
        yPosition = 0 - maxDotDistance;
        xPosition = random(width);
        xVelocity = random(-maxVelocity, maxVelocity);
        yVelocity = random(minVelocity, maxVelocity);
    } else if (randomNumer < 2) {
        yPosition = random(height);
        xPosition = width + maxDotDistance;
        xVelocity = random(-maxVelocity, -minVelocity);
        yVelocity = random(-maxVelocity, maxVelocity);
    } else if (randomNumer < 3) {
        yPosition = height + maxDotDistance;
        xPosition = random(width);
        xVelocity = random(-maxVelocity, maxVelocity);
        yVelocity = random(-minVelocity, -maxVelocity);
    } else {
        yPosition = random(height);
        xPosition = 0 - maxDotDistance;
        xVelocity = random(minVelocity, maxVelocity);
        yVelocity = random(-maxVelocity, maxVelocity);
    }

    let averageVelocity = (Math.abs(xVelocity) + Math.abs(yVelocity)) / 2;
    let dotSize = map(
        averageVelocity,
        minVelocity,
        maxVelocity,
        maxDotSize,
        minDotSize
    );

    return new Dot(xPosition, yPosition, dotSize, xVelocity, yVelocity);
}

class Dot {
    constructor(xPosition, yPosition, radius, xVelocity, yVelocity) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.radius = radius;
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;
    }

    show() {
        stroke(200);
        strokeWeight(4);
        fill(200);
        ellipse(this.xPosition, this.yPosition, this.radius, this.radius);
    }

    move() {
        this.xPosition = this.xPosition + this.xVelocity;
        this.yPosition = this.yPosition + this.yVelocity;
    }

    update(dots) {
        this.move();
        dots.forEach((dot) => {
            if (this.isNearTo(dot)) {
                let distance = this.distanceTo(dot);
                let strokeColor = map(distance, 0, maxDotDistance, 255, 0);
                let opacity = map(distance, 0, maxDotDistance, 255, 0);
                stroke(strokeColor, 84, 255, opacity);
                strokeWeight(0.5);
                line(
                    dot.xPosition,
                    dot.yPosition,
                    this.xPosition,
                    this.yPosition
                );
            }
        });
        this.show();
    }

    isNearTo(dot) {
        return this.distanceTo(dot) < maxDotDistance;
    }

    distanceTo(dot) {
        return Math.sqrt(
            Math.pow(this.xPosition - dot.xPosition, 2) +
                Math.pow(this.yPosition - dot.yPosition, 2)
        );
    }
}
