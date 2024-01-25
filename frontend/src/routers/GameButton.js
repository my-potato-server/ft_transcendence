// src/routers/GameButton.js

export default function GameButton() {
    console.log("GameButton");
    return `
        <div class="GameButton">
            <button type="button" class="Offline">
                Offline
            </button>
            <button type="button" class="Online">
                Online
            </button>
            <button type="button" class"Tournament">
                Tournament
            </button>
        </div>
        <div class="gameContainer">
            <canvas id="pongCanvas"></canvas>
        </div>
    `;
}