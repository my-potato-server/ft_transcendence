// src/pages/Main.js

import Component from "../core/Component.js";

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
		const logoutButton = this.$parent.querySelector('button[class="Logout"]');
		if (logoutButton) {
			logoutButton.onclick = () => this.logout();
		}
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

	logout() {
		console.log("logout");
		import('./Logout.js').then(({ default: Login }) => {
		});
		this.$parent.auth = false;
		this.setState({locate: '/'});
	}
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

export function RouterButton() {
	console.log("RouterButton");
	return `
		<div class="RouterButton">
			<button type="button" class="Mainpage">
				Mainpage
			</button>
			<button type="button" class="Game">
				Game
			</button>
			<button type="button" class="Chat">
				Chat
			</button>
			<button type="button" class="Rank">
				Rank
			</button>
			<button type="button" class="Profile">
				Profile
			</button>
			<button type="button" class="Logout">
				Logout
			</button>
		</div>
	`
};