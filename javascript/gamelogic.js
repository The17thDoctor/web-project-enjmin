class Vector {
    x = 0
    y = 0

    /**
     * 
     * @param {int} x 
     * @param {int} y 
     */
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class Game {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        this.canvas = canvas
        this.context = canvas.getContext("2d")

        this.ballPosition = new Vector(canvas.width / 2, canvas.height / 2)
        this.ballSpeed = new Vector()

        console.log()

        if ('GravitySensor' in window) {
            this.gravitySensor = new GravitySensor()
            this.gravitySensor.addEventListener("reading", () => {
                this.updateSpeedGravity()
            })
            this.gravitySensor.start()
        }
    }

    updateSpeedGravity() {
        this.ballSpeed.x = this.gravitySensor.x
        this.ballSpeed.y = this.gravitySensor.y
    }

    updateSpeedKeyboard() {

    }

    performGameTick() {
        
    }

    drawGame() {
        this.performGameTick()
        this.context.fillStyle = "#FFF"
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.context.fillStyle = "#000"
        this.context.beginPath()
        this.context.arc(this.ballPosition.x, this.ballPosition.y, 50, 0, Math.PI * 2)
        this.context.fill()
    }
}

export { Game }