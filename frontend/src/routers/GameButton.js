// src/routers/GameButton.js

// export default function GameButton() {
// 	console.log("GameButton");
// 	return `
// 		<div class="GameButton">
// 			<button type="button" class="Offline">
// 				Offline
// 			</button>
// 			<button type="button" class="Online">
// 				Online
// 			</button>
// 			<button type="button" class"Tournament">
// 				Tournament
// 			</button>
// 		</div>
// 		<div class="gameContainer">
// 			<canvas id="pongCanvas"></canvas>
// 		</div>
// 	`;
// }

export default function GameButton() {
	console.log("GameButton");
	// Game Selection Buttons
	return `
	<div class="game-selection-buttons text-center mt-5" style="margin-left: 20px; margin-right: 20px;">
		<div class="row">
			<div class="col">
				<button id="offline" class="btn btn-primary btn-lg game-button" style="height: 300px; width: 100%;opacity:0.6;border-radius:50%;">Offline</button>
			</div>
			<div class="col">
				<button id="offline2" class="btn btn-primary btn-lg game-button" style="height: 300px; width: 100%;opacity:0.6;border-radius:50%;">Offline2</button>
			</div>
			<div class="col">
				<button id="offline3" class="btn btn-primary btn-lg game-button" style="height: 300px; width: 100%;opacity:0.6;border-radius:50%;">Offline3</button>
			</div>
			<div class="col">
				<button id="offline4" class="btn btn-primary btn-lg game-button" style="height: 300px; width: 100%;opacity:0.6;border-radius:50%;">Comming soon</button>
			</div>
			<div class="col">
				<button id="online" class="btn btn-primary btn-lg game-button" style="height: 300px; width: 100%;opacity:0.6;border-radius:50%;">Online</button>
			</div>
		</div>
	</div>
	<div class="game-canvas-container d-none justify-content-center align-items-center" style="height: 100vh; display: flex; flex-direction: column;">
		<div>
			<button id="back" class="btn btn-secondary mt-3">Back</button>
		</div>
	</div>
`;
}