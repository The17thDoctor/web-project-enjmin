import { Game } from "./gamelogic.js"

const CANVAS_ID = "main-canvas"

let canvas = document.getElementById(CANVAS_ID)

function resizeCanvas() {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
}

resizeCanvas()
window.addEventListener("resize", resizeCanvas)

let game = new Game(canvas)
// Can't directly put game.drawGame as argument, else this = window...
setInterval(() => game.drawGame(), 17)