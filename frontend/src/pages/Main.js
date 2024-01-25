// src/pages/Main.js

import Component from "../core/Component.js";
import RouterButton from "../routers/RouterButton.js";

export default class Mainpage extends Component {

	constructor(ObjectForDI) {
		super(ObjectForDI.$parent, ObjectForDI.setState, ObjectForDI.state);
	}

	template() {
		console.log("Mainpage template");
		return `
		${RouterButton()}
		${Heart()}
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
		//Mainpage
		//
		const heartButton = this.$parent.querySelector('button[onclick="printHeart()"]');
        if (heartButton) {
            heartButton.onclick = () => this.printHeart();
        }
	}

	printHeart() {
		const heart = `
  __  __
 /  \\/  \\
 \\     / 
  \\   /  
   \\ /   
    V
		`;
		const heartContainer = this.$parent.querySelector('#heart');
		if (heartContainer) {
			heartContainer.innerHTML = `<pre>${heart}</pre>`;
		}
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
		this.setState({locate: '/src/pages/main/Game'});
	}
	chat() {
		console.log("chat");
		this.setState({locate: '/src/pages/main/Chat'});
	}
	rank() {
		console.log("rank");
		this.setState({locate: '/src/pages/main/Rank'});
	}
	profile() {
		console.log("profile");
		this.setState({locate: '/src/pages/main/Profile'});
	}
	logout() {
		console.log("logout");
		this.$parent.auth = false;
		this.setState({locate: '/'});
	}
	//
	//
	//
}

export function Heart() {
	console.log("Heart");
	return `
	<div class="heart">
		<button onclick="printHeart()">하트 출력</button>
		<div id="heart"></div>
	</div>
	`
};

