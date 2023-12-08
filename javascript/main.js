import { Game } from "./game.js"

// For phones
let orientKey = 'orientation';
if ('mozOrientation' in screen) {
    orientKey = 'mozOrientation';
} else if ('msOrientation' in screen) {
    orientKey = 'msOrientation';
}

if (screen[orientKey].lock) {
    screen[orientKey].lock(screen[orientKey].type).catch(() => {
        console.log("Unable to lock rotation.")
    })
} else {
    screen.orientationLock(screen[orientKey]).catch(() => {
        console.log("Unable to lock rotation.")
    })
}

if ("keepAwake" in screen) {
    screen.keepAwake = true
} else if ("wakeLock" in navigator) {
    navigator.wakeLock.request('screen').catch(console.error)
}

const CANVAS_ID = "main-canvas";
let canvas = document.getElementById(CANVAS_ID);

function resizeCanvas() {
    if (canvas == null)
        return;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

if (canvas != null) {
    focus(canvas)
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    let game = new Game(canvas);
}