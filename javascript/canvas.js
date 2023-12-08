import { Game } from "./gamelogic.js"

const CANVAS_ID = "main-canvas";
let canvas = document.getElementById(CANVAS_ID);

function resizeCanvas() {
    if (canvas == null)
        return;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

if (canvas != null) {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    let game = new Game(canvas);
    setInterval(() => game.drawGame(), 10);
}