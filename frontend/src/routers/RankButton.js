// src/routers/RankButton.js

export default function RankButton() {
    console.log("RankButton");
    return `
        <div class="RankButton">
            <button type="button" class="Ranking">
                Ranking
            </button>
            <button type="button" class="MyRank">
                My Rank
            </button>
            <button type="button" class="RankGame">
                Rank Game
            </button>
        </div>
        <div id=ranking></div>
        <div id=myrank></div>
        <div id=rankgame></div>
    `;
}