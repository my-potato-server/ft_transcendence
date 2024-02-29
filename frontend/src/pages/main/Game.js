// src/pages/main/Game.js

import Component from "../../core/Component.js";
import RouterButton from "../../routers/RouterButton.js";
import GameButton from "../../routers/GameButton.js";

export default class Game extends Component {

    constructor(ObjectForDI) {
        super(ObjectForDI.$parent, ObjectForDI.setState, ObjectForDI.state);
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

		const canvas = this.$parent.querySelector('#gameCanvas');
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Load the appropriate game module based on the selection
        switch (mode) {
            case 'offline':
                import('../../apps/offline_pong.js').then(({ default: offline_pong }) => {
                    this.currentGame = offline_pong(canvas.id);
                });
                break;
            case 'online':
                import('../../apps/online_pong.js').then(({ default: online_pong }) => {
                    this.currentGame = online_pong(canvas.id);
                });
                // 이곳에 matchserver 관련 js호출
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
		this.gameSelectionButtons.classList.remove('d-none');
		this.gameContainer.classList.add('d-none');
	}

}