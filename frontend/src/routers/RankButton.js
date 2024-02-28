// src/routers/RankButton.js

// export default function RankButton() {
//     console.log("RankButton");
//     return `
//         <div class="RankButton">
//             <button type="button" class="Ranking">
//                 Ranking
//             </button>
//             <button type="button" class="MyRank">
//                 My Rank
//             </button>
//             <button type="button" class="RankGame">
//                 Rank Game
//             </button>
//         </div>
//         <div id=ranking></div>
//         <div id=myrank></div>
//         <div id=rankgame></div>
//     `;
// }

// export default function RankButton() {
//     console.log("RankButton");
//     return `
//     <div class="game-selection-buttons text-center mt-5" style="margin-left: 20px; margin-right: 20px;">
// 		<div class="row">
// 			<div class="col">
// 				<button id="ranking" class="btn btn-primary btn-lg rank-button" style="height: 300px; width: 100%;">Ranking</button>
// 			</div>
// 			<div class="col">
// 				<button id="myrank" class="btn btn-primary btn-lg rank-button" style="height: 300px; width: 100%;">MyRank</button>
// 			</div>
// 		</div>
// 	</div>
//     `
// }

export default function RankButton() {
    console.log("RankButton");
    return `
        <div class="game-selection-buttons text-center mt-5" style="margin-left: 20px; margin-right: 20px;">
            <div class="row">
                <div class="col">
                    <button id="ranking" class="btn btn-primary btn-lg rank-button" style="height: 300px; width: 100%;">Ranking</button>
                </div>
                <div class="col">
                    <button id="myrank" class="btn btn-primary btn-lg rank-button" style="height: 300px; width: 100%;">MyRank</button>
                </div>
            </div>
        </div>
        <!-- 랭킹 정보를 표시할 컨테이너 추가 -->
        <div id="rankingContainer" class="mt-5"></div>
		<div id="myrankContainer" class="mt-5"></div>
    `;
}
