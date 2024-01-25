// src/pages/main/Profile.js

import Component from "../../core/Component";
import RouterButton from "../../routers/RouterButton";
import GameButton from "../../routers/GameButton";

export default class Game extends Component {

    constructor(ObjectForDI) {
        super(ObjectForDI.$parent, ObjectForDI.setState, ObjectForDI.state);
    }

    template() {
        console.log("Game template");
        return `
        ${RouterButton()}
        ${GameButton()}
        `;
    }

    setEvent() {
        //
		//RouterButton
		//
		const mainpageButton = this.$parent.querySelector('button[class="Mainpage"]');
		if (mainpageButton) {
			mainpageButton.onclick = () => this.mainpage();
		}
		const gameButton = this.$parent.querySelector('button[class="Game"]');
		if (gameButton) {
			gameButton.onclick = () => this.game();
		}
		const chatButton = this.$parent.querySelector('button[class="Chat"]');
		if (chatButton) {
			chatButton.onclick = () => this.chat();
		}
		const rankButton = this.$parent.querySelector('button[class="Rank"]');
		if (rankButton) {
			rankButton.onclick = () => this.rank();
		}
		const profileButton = this.$parent.querySelector('button[class="Profile"]');
		if (profileButton) {
			profileButton.onclick = () => this.profile();
		}
		const logoutButton = this.$parent.querySelector('button[class="Logout"]');
		if (logoutButton) {
			logoutButton.onclick = () => this.logout();
		}
		//
		//
		//

        //
        //Game
        //
        this.gameContainer = this.$parent.querySelector('div[class="gameContainer"]');

        const offlineButton = this.$parent.querySelector('button[class="Offline"]');
        if (offlineButton) {
            offlineButton.onclick = () => this.offline();
        }
        const onlineButton = this.$parent.querySelector('button[class="Online"]');
        if (onlineButton) {
            onlineButton.onclick = () => this.online();
        }
        const tournamentButton = this.$parent.querySelector('button[class="Tournament"]');
        if (tournamentButton) {
            tournamentButton.onclick = () => this.tournament();
        }
        //
        //
        //
    }

    //
	// RouterButton
	//
	mainpage() {
		console.log("mainpage");
		this.setState({locate: '/src/pages/Main'});
	}
	game() {
		console.log("game");
		this.setState({locate: '/src/pages/Game'});
	}
	chat() {
		console.log("chat");
		this.setState({locate: '/src/pages/Chat'});
	}
	rank() {
		console.log("rank");
		this.setState({locate: '/src/pages/Rank'});
	}
	profile() {
		console.log("profile");
		this.setState({locate: '/src/pages/Profile'});
	}
	logout() {
		console.log("logout");
		this.$parent.auth = false;
		this.setState({locate: '/'});
	}
	//
	//
	//

    //
    //Game
    //
    offline() {
        console.log("offline");

        const canvas = document.createElement('canvas');
        canvas.id = 'pongCanvas';
        canvas.width = 1280;
        canvas.height = 720;
        this.gameContainer.appendChild(canvas);

        import('../../apps/offline_pong.js').then(({ default: offline_pong }) => {
            offline_pong(canvas.id);
        });
    }
    online() {
        console.log("online");
    }
    tournament() {
        console.log("tournament");
    }
}