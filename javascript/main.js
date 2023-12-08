import { Game } from "./game.js"

// For phones
navigator.wakeLock.request("screen")
window.screen.orientation.lock("portrait-primary")

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
    game.start()
}