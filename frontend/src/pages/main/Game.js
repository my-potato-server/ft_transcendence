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
        this.gameContainer = null;
        this.i = 1;
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

    }

    // handleGameModeSelection(mode) {
    //     console.log(`${mode} game mode selected`);
    //     this.showCanvas();

    //     this.currentGame = null;

    //     // 캔버스 요소가 이미 있으면 재사용, 없으면 새로 생성
    //     // if (!this.canvas) {
    //     //     console.log('create new canvas');
    //     //     this.canvas = document.createElement('canvas');
    //     //     this.canvas.id = 'gameCanvas';
    //     //     this.canvas.width = 1280;
    //     //     this.canvas.height = 720;
    //     //     this.canvas.style.border = '2px solid White';
    //     //     // this.gameContainer.appendChild(this.canvas);
    //     // }
    //     console.log('web canvas check', this.canvas);


    //     // Load the appropriate game module based on the selection
    //     switch (mode) {
    //         case 'offline':
    //             import('../../apps/offline_pong.js').then(({ default: offline_pong }) => {
    //                 this.currentGame = offline_pong(this.canvas.id);
    //             });
    //             break;
    //         case 'online':
    //             import('../../apps/online2.js').then(({ default: online }) => {
    //                 if (!this.currentGame)
    //                     this.currentGame = online(this.canvas.id);
    //             });
    //             break;
    //         default:
    //             console.error(`Unknown game mode: ${mode}`);
    //     }
    // }
    handleGameModeSelection(mode) {
        console.log(`${mode} game mode selected`);
    
        // 현재 게임이 실행 중이라면 정리
        if (this.currentGame) {
            console.log("stop current game");
            // 여기에 게임 정리 관련 로직을 추가합니다. 예: this.currentGame.stop();
            this.currentGame = null; // 현재 게임 인스턴스를 null로 설정
        }
    
        // 현재 캔버스가 존재하면 제거
        this.hideCanvas();
    
        // 새 캔버스 표시
        this.showCanvas();
    
        // 새 게임 모듈 로드
        switch (mode) {
            case 'offline':
                import('../../apps/offline_pong.js').then(({ default: offline_pong }) => {
                    this.currentGame = offline_pong(this.canvas.id);
                });
                break;
            case 'online':
                import('../../apps/online2.js').then(({ default: online }) => {
                    if (!this.currentGame) // 이 조건은 이제 필요하지 않을 수 있습니다.
                        this.currentGame = online(this.canvas.id);
                });
                break;
            case 'offline2':
                import('../../apps/offline_pong2.js').then(({ default: offline_pong2 }) => {
                    this.currentGame = offline_pong2(this.canvas.id);
                });
                break;
            case 'offline3':
                import('../../apps/offline_pong3.js').then(({ default: offline_pong3 }) => {
                    this.currentGame = offline_pong3(this.canvas.id);
                });
                break;
            case 'offline4':
                import('../../apps/offline_pong4.js').then(({ default: offline_pong4 }) => {
                    this.currentGame = offline_pong4(this.canvas.id);
                });
                break;
            default:
                console.error(`Unknown game mode: ${mode}`);
        }
    }
    
    // handleBackButton() {
    //     console.log("Returning to game selection");

    //     if (this.currentGame) {
    //         console.log("stop game");
    //         this.currentGame();
    //     }
    //     // this.currentGame = null;
    //     this.hideCanvas(); // 캔버스를 숨기는 함수를 호출합니다.
    // }

    // handleBackButton() {
    //     console.log("Returning to game selection");
    
    //     if (this.currentGame) {
    //         console.log("stop game");
    //         this.currentGame(); // 현재 게임 종료 로직, 만약 필요하다면
    //     }
    //     this.hideCanvas(); // 캔버스를 숨기는 함수를 호출합니다.
    // }
    handleBackButton() {
        console.log("Returning to game selection");
    
        if (this.currentGame && this.currentGame.close) {
            console.log("stop game and closing websocket");
            this.currentGame.close(); // 웹소켓 연결 종료
        }
        if (this.currentGame && this.currentGame.stop) {
            console.log("stop game");
            this.currentGame.stop(); // 현재 게임 종료 로직
        }
        this.hideCanvas(); // 캔버스를 숨기는 함수를 호출합니다.
    }
    // showCanvas() {
    //     this.i++;
    //     const navbarHeight = document.querySelector('.navbar').offsetHeight;
    //     this.gameContainer.style.marginTop = `${navbarHeight}px`;
    //     this.gameSelectionButtons.classList.add('d-none');
    //     this.gameContainer.classList.remove('d-none');
    //     console.log('create new canvas');
    //     this.canvas = document.createElement('canvas');
    //     this.canvas.id = 'gameCanvas' + this.i;
    //     this.canvas.width = 1280;
    //     this.canvas.height = 720;
    //     this.canvas.style.border = '2px solid White';
    //     const ctx = this.canvas.getContext('2d');
    //     ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //     console.log('ctx', ctx);
    // }

    // showCanvas() {
    //     this.i++;
    //     const navbarHeight = document.querySelector('.navbar').offsetHeight;
    //     this.gameContainer.style.marginTop = `${navbarHeight}px`;
    //     this.gameSelectionButtons.classList.add('d-none');
    //     this.gameContainer.classList.remove('d-none');

    //     console.log('create new canvas');
    //     this.canvas = document.createElement('canvas');
    //     this.canvas.id = 'gameCanvas' + this.i; // 동적으로 ID 생성
    //     this.canvas.width = 1280;
    //     this.canvas.height = 720;
    //     this.canvas.style.border = '2px solid White';

    //     this.gameContainer.appendChild(this.canvas); // 이 부분이 중요합니다: 캔버스를 게임 컨테이너에 실제로 추가합니다.

    //     const ctx = this.canvas.getContext('2d');
    //     ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //     console.log('ctx', ctx);
    // }
    showCanvas() {
        this.i++;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        this.gameContainer.style.marginTop = `${navbarHeight}px`;
        this.gameSelectionButtons.classList.add('d-none');
        this.gameContainer.classList.remove('d-none');
    
        // gameContainer 내의 모든 내용을 새 캔버스로 대체
        const canvasId = 'gameCanvas' + this.i; // 동적으로 ID 생성
        this.gameContainer.innerHTML = `
            <button id="back" class="btn btn-secondary mt-3">Back</button>
            <canvas id="${canvasId}" width="1280" height="720" style="border: 2px solid White;"></canvas>
            `;
        this.canvas = document.getElementById(canvasId);
    
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        console.log('New canvas created with id:', canvasId);
        const backButton = this.$parent.querySelector('#back');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.gameContainer.innerHTML = ''; // 캔버스 요소 제거
                this.handleBackButton();
            });
        }
    }
    // hideCanvas() {
    //     if (this.canvas) {
    //         // this.gameContainer.removeChild(this.canvas); // 캔버스 요소 제거
    //         document.removeElement(this.canvas);
    //         this.canvas = null; // 캔버스 참조 제거
    //     }
    //     this.gameSelectionButtons.classList.remove('d-none');
    //     this.gameContainer.classList.add('d-none');
    // }
    hideCanvas() {
        if (this.canvas && this.gameContainer.contains(this.canvas)) {
            this.gameContainer.removeChild(this.canvas); // 현재 캔버스 요소 제거
            this.canvas = null; // 캔버스 참조 제거
        }
        this.gameSelectionButtons.classList.remove('d-none');
        this.gameContainer.classList.add('d-none');
    }
}
