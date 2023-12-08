const DAMPEN_FACTOR = 0.25;

class Vector {
    constructor(x = 0, y = 0) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }

    length() {
        return Math.sqrt(this.x**2 + this.y**2)
    }

    normalize() {
        let l = this.length()
        this.x /= l
        this.y /= l
        return this
    }

    static normalized(vector) {
        return new Vector(vector.x, vector.y).normalize()
    }

    add(vector) {
        this.x += vector.x
        this.y += vector.y
        return this
    }

    static add(v1, v2) {
        return new Vector(v1.x, v1.y).add(v2)
    }

    sub(vector) {
        this.x -= vector.x
        this.y -= vector.y
        return this
    }

    static sub(v1, v2) {
        return new Vector(v1.x, v1.y).sub(v2)
    }

    mul(number) {
        this.x *= number
        this.y *= number
        return this
    }

    static mul(vector, number) {
        return new Vector(vector.x, vector.y).mul(number)
    }
}

function clamp(x, min, max) {
    return Math.max(Math.min(x, max), min);
}

let pressedKeys = {};

class Projectile {
    static radius = 5

    constructor(start, end, speed) {
        this.position = start
        this.direction = new Vector(end.x - start.x, end.y - start.y)

        this.length = this.direction.length()
        this.travelledLength = 0  

        this.direction.normalize()
        this.speed = speed
    }

    tick() {
        this.position.add(Vector.mul(this.direction, this.speed))
        this.travelledLength += this.speed
    }

    isFinished() {
        return this.travelledLength >= this.length
    }

    draw(context) {
        context.fillStyle = "#FFFFFFFF"
        context.beginPath()
        context.arc(this.position.x, this.position.y, Projectile.radius, 0, Math.PI * 2)
        context.fill()
    }
}

class Game {
    projectiles = []

    constructor(canvas) {
        this.ballRadius = 25;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.ballPosition = new Vector(canvas.width / 2, canvas.height / 2);
        this.ballSpeed = new Vector();
        
        this.context.imageSmoothingEnabled = true
        this.context.imageSmoothingQuality = "high"

        if ('GravitySensor' in window) {
            this.gravitySensor = new GravitySensor();
            this.gravitySensor.addEventListener("reading", () => {
                this.updateSpeedGravity();
            });
            this.gravitySensor.start();

            if (!this.gravitySensor.hasReading) {
                window.addEventListener("keydown", (event) => {
                    pressedKeys[event.key] = true;
                });
                window.addEventListener("keyup", (event) => {
                    pressedKeys[event.key] = false;
                });
            }
        }

        this.spawner = setInterval(() => this.spawnProjectile(), 400)
    }

    spawnProjectile() {
        let x, cx
        if (Math.random() >= 0.5) {
            x = -10
            cx = this.canvas.width + 10
        } else {
            x = this.canvas.width + 10
            cx = -10
        }

        let start = new Vector(x, this.canvas.height * Math.random())
        let end = new Vector(cx, this.canvas.height * Math.random())
        this.projectiles.push(new Projectile(start, end, 2))
    }

    performGameTick() {
        if (!this.gravitySensor.hasReading) {
            this.updateSpeedKeyboard();
        }

        this.ballSpeed.mul(0.98)
        this.ballPosition.add(this.ballSpeed)

        let crossing = this.isBallCrossing();
        if (crossing.x)
            this.ballSpeed.x *= -DAMPEN_FACTOR;

        if (crossing.y)
            this.ballSpeed.y *= -DAMPEN_FACTOR;

        this.ballPosition.x = clamp(this.ballPosition.x, this.ballRadius, this.canvas.width - this.ballRadius);
        this.ballPosition.y = clamp(this.ballPosition.y, this.ballRadius, this.canvas.height - this.ballRadius);

        this.projectiles.forEach(projectile => {
            projectile.tick()
            if (projectile.isFinished()) {
                this.projectiles.splice(this.projectiles.indexOf(projectile), 1)
            }
        });
    }

    drawGame() {
        this.performGameTick();
        this.context.fillStyle = "#5182";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#CC2";
        this.context.beginPath();
        this.context.arc(this.ballPosition.x, this.ballPosition.y, this.ballRadius, 0, Math.PI * 2);
        this.context.fill();

        this.projectiles.forEach(projectile => {
            projectile.draw(this.context)
        });
    }

    isBallCrossing() {
        let crossingX = this.ballPosition.x < this.ballRadius || this.ballPosition.x > this.canvas.width - this.ballRadius;
        let crossingY = this.ballPosition.y < this.ballRadius || this.ballPosition.y > this.canvas.height - this.ballRadius;
        return { "x": crossingX, "y": crossingY };
    }

    updateSpeedGravity() {
        this.ballSpeed.x = clamp(this.ballSpeed.x - this.gravitySensor.x * 0.2, -5, 5);
        this.ballSpeed.y = clamp(this.ballSpeed.y + this.gravitySensor.y * 0.2, -5, 5);
    }

    updateSpeedKeyboard() {
        if (pressedKeys["z"] || pressedKeys["ArrowUp"]) {
            this.ballSpeed.y -= 0.05;
        }
        else if (pressedKeys["s"] || pressedKeys["ArrowDown"]) {
            this.ballSpeed.y += 0.05;
        }
        if (pressedKeys["q"] || pressedKeys["ArrowLeft"]) {
            this.ballSpeed.x -= 0.05;
        }
        else if (pressedKeys["d"] || pressedKeys["ArrowRight"]) {
            this.ballSpeed.x += 0.05;
        }
        this.ballSpeed.x = clamp(this.ballSpeed.x, -5, 5);
        this.ballSpeed.y = clamp(this.ballSpeed.y, -5, 5);
    }
}
export { Game };
