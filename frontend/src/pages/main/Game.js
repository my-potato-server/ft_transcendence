// src/pages/main/Game.js

import Component from "../../core/Component.js";
import RouterButton from "../../routers/RouterButton.js";
import GameButton from "../../routers/GameButton.js";

// export default class Game extends Component {

//     constructor(ObjectForDI) {
//         super(ObjectForDI.$parent, ObjectForDI.setState, ObjectForDI.state);
//     }

//     template() {
//         console.log("Game template");
//         return `
//         ${RouterButton('/src/pages/main/Game')}
//         ${GameButton()}
//         `;
//     }

//     setEvent() {
// 		this.gameContainer = this.$parent.querySelector('.game-canvas-container');
//         this.gameSelectionButtons = this.$parent.querySelector('.game-selection-buttons');

// 		this.$parent.querySelectorAll('.game-button').forEach(button => {
//             button.addEventListener('click', (event) => {
//                 this.handleGameModeSelection(event.target.id);
//             });
//         });

// 		const backButton = this.$parent.querySelector('#back');
//         if (backButton) {
//             backButton.addEventListener('click', () => {
//                 this.handleBackButton();
//             });
//         }
//     }

// 	handleGameModeSelection(mode) {
//         console.log(`${mode} game mode selected`);
//         this.showCanvas();

// 		this.currentGame = null;

// 		const canvas = this.$parent.querySelector('#gameCanvas');
// 		const ctx = canvas.getContext('2d');
// 		ctx.clearRect(0, 0, canvas.width, canvas.height);

//         // Load the appropriate game module based on the selection
//         switch (mode) {
//             case 'offline':
//                 import('../../apps/offline_pong.js').then(({ default: offline_pong }) => {
//                     this.currentGame = offline_pong(canvas.id);
//                 });
//                 break;
//             case 'online':
//                 import('../../apps/online2.js').then(({ default: online }) => {
//                     this.currentGame = online(canvas.id);
//                 });
//                 // 이곳에 matchserver 관련 js호출
//                 break;
// 			default:
// 				console.error(`Unknown game mode: ${mode}`);
//         }
//     }

// 	handleBackButton() {
// 		console.log("Returning to game selection");

// 		if (this.currentGame) {
// 			console.log("stop game");
// 			this.currentGame();
// 		}
// 		this.currentGame = null;
// 		this.hideCanvas(); // 캔버스를 숨기는 함수를 호출합니다.
// 	}

// 	showCanvas() {
// 		const navbarHeight = document.querySelector('.navbar').offsetHeight;
// 		this.gameContainer.style.marginTop = `${navbarHeight}px`;
// 		this.gameSelectionButtons.classList.add('d-none');
// 		this.gameContainer.classList.remove('d-none');
// 	}

// 	hideCanvas() {
// 		this.gameSelectionButtons.classList.remove('d-none');
// 		this.gameContainer.classList.add('d-none');
// 	}

// }

export default class Game extends Component {

    constructor(ObjectForDI) {
        super(ObjectForDI.$parent, ObjectForDI.setState, ObjectForDI.state);
        // 캔버스 요소 초기화
        this.canvas = null;
    }

    template() {
        console.log("Game template");
        return `
        ${RouterButton('/src/pages/main/Game')}
        ${GameButton()}
        `;
    }

    setEvent() {
        this.gameContainer = this.$parent.querySelector('.game-canvas-container');
        this.gameSelectionButtons = this.$parent.querySelector('.game-selection-buttons');

        this.$parent.querySelectorAll('.game-button').forEach(button => {
            button.addEventListener('click', (event) => {
                this.handleGameModeSelection(event.target.id);
            });
        });

        const backButton = this.$parent.querySelector('#back');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.handleBackButton();
            });
        }
    }

    handleGameModeSelection(mode) {
        console.log(`${mode} game mode selected`);
        this.showCanvas();

        this.currentGame = null;

        // 캔버스 요소가 이미 있으면 재사용, 없으면 새로 생성
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'gameCanvas';
            this.canvas.width = 1280;
            this.canvas.height = 720;
            this.canvas.style.border = '2px solid White';
            this.gameContainer.appendChild(this.canvas);
        }

        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Load the appropriate game module based on the selection
        switch (mode) {
            case 'offline':
                import('../../apps/offline_pong.js').then(({ default: offline_pong }) => {
                    this.currentGame = offline_pong(this.canvas.id);
                });
                break;
            case 'online':
                import('../../apps/online2.js').then(({ default: online }) => {
                    this.currentGame = online(this.canvas.id);
                });
                break;
            default:
                console.error(`Unknown game mode: ${mode}`);
        }
    }

    handleBackButton() {
        console.log("Returning to game selection");

        if (this.currentGame) {
            console.log("stop game");
            this.currentGame();
        }
        this.currentGame = null;
        this.hideCanvas(); // 캔버스를 숨기는 함수를 호출합니다.
    }

    showCanvas() {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        this.gameContainer.style.marginTop = `${navbarHeight}px`;
        this.gameSelectionButtons.classList.add('d-none');
        this.gameContainer.classList.remove('d-none');
    }

    hideCanvas() {
        if (this.canvas) {
            this.gameContainer.removeChild(this.canvas); // 캔버스 요소 제거
            this.canvas = null; // 캔버스 참조 제거
        }
        this.gameSelectionButtons.classList.remove('d-none');
        this.gameContainer.classList.add('d-none');
    }

}
