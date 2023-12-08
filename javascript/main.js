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
const BUTTON_ID = "start-button"
class Interface {

    static game

    static resizeCanvas(canvas) {
        if (canvas == null)
            return;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    static bindGameToCanvas(canvas) {
        focus(canvas);
        Interface.resizeCanvas(canvas);
        window.addEventListener("resize", () => {
            Interface.resizeCanvas(canvas);
        });

        Interface.game = new Game(canvas);
    }

    static hideUI() {
        let header = document.getElementById("title-header")
        let main = document.getElementById("main-content")
        header.className = "title-header title-hide"
        main.className = "button-main button-hide"
    }

    static showUI() {
        let header = document.getElementById("title-header")
        let main = document.getElementById("main-content")
        header.className = "title-header title-show"
        main.className = "button-main button-show"
    }
}

let canvas = document.getElementById(CANVAS_ID);
Interface.bindGameToCanvas(canvas);


let startButton = document.getElementById(BUTTON_ID);
startButton.addEventListener("click", () => {
    Interface.game.reset()
    Interface.game.start()
    Interface.hideUI()
})

export default Interface