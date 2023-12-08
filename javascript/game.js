import Projectile from "./projectile.js";
import { Vector, clamp } from "./utils.js"
import Interface from "./main.js";

const DAMPEN_FACTOR = 0.25;
const GYRO_SENSITIVITY = 0.4;

let pressedKeys = {};

class Game {
    projectiles = []
    paused = true

    constructor(canvas) {
        this.ballMass = 100
        this.ballRadius = 25;
        this.canvas = canvas;
        this.context = canvas.getContext("2d", {"alpha": false});
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

        setInterval(() => this.drawGame())
    }

    start() {
        this.paused = false
        this.gameTick = setInterval(() => this.performGameTick())
        this.spawner = setInterval(() => this.spawnProjectile(), 300)
    }

    pause() {
        this.paused = true
        clearInterval(this.spawner)
        clearInterval(this.gameTick)
    }

    reset() {
        this.projectiles.forEach(projectile => {
            projectile.explosing = true
        })

        this.ballPosition = new Vector(this.canvas.width / 2, this.canvas.height / 2)
        this.ballRadius = 25;
        this.exploded = false
        this.exploding = false
    }

    declareLost() {
        this.exploding = true
        setTimeout(() => Interface.showUI(), 1500)
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

        let start = new Vector(x, this.canvas.height * (Math.random() - 0.25) * 2)
        let end = new Vector(cx, this.canvas.height * (Math.random() - 0.25) * 2)
        this.projectiles.push(new Projectile(start, end, Math.random() * 5 + 1))
    }

    performGameTick() {
        if (!this.gravitySensor.hasReading) {
            this.updateSpeedKeyboard();
        }

        if (this.exploding && !this.exploded) {
            this.ballRadius += 0.2
            if (this.ballRadius > 100) {
                this.exploded = true
                this.pause()
            }
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
            projectile.tick(this)
            if (projectile.isFinished()) {
                this.projectiles.splice(this.projectiles.indexOf(projectile), 1)
            }
        });
    }

    drawGame() {
        this.context.fillStyle = "#5182";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#CC2";
        this.context.strokeStyle = "#CC2";
        this.context.beginPath();
        this.context.arc(this.ballPosition.x, this.ballPosition.y, this.ballRadius, 0, Math.PI * 2);
        
        if (this.exploding) {
            this.context.stroke();
        } else {
            this.context.fill();
        }
        

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
        this.ballSpeed.x = clamp(this.ballSpeed.x - this.gravitySensor.x * GYRO_SENSITIVITY, -5, 5);
        this.ballSpeed.y = clamp(this.ballSpeed.y + this.gravitySensor.y * GYRO_SENSITIVITY, -5, 5);
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
