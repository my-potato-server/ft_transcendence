// src/App.js

import Mainpage from "./pages/Main.js";
import Signup from "./pages/Signup.js";
import Login from "./pages/Login.js"

class app {

	constructor() {
		this.state = { 'locate' : window.location.pathname };
		this.root = document.querySelector('.app');

		const ObjectForDI = {$parent:this.root, setState : this.setState.bind(this), state : this.state};

		this.Mainpage = new Mainpage(ObjectForDI);
		this.Signup = new Signup(ObjectForDI);
		this.Login = new Login(ObjectForDI);

		this.render();
		this.setDummyEvent();
	}

	setState(newState) {
		console.log("setState called");
		const { locate } = this.state;
		this.state = {...this.state, ...newState};
		console.log(this.state);
		console.log(locate);
		this.render();
		console.log("setState end");
	}

	render() {
		console.log("render start");
		this.root.innerHTML = '';

		let { locate } = this.state;
		console.log("render's locate", locate, this.state);
		if (locate === '/src/pages/Main.js') {
			this.Mainpage.renderSequnce(this.state);
			// this.historyRouterPush('/Mainpage');
		}
		else if (locate === '/src/pages/Signup.js') {
			this.Signup.renderSequnce(this.state);
			// this.historyRouterPush('/Signup');
		}
		else if (locate === '/') {
			this.Login.renderSequnce(this.state);
		// 	// this.historyRouterPush('/Mainpage');
		}

		this.historyRouterPush(locate);

		console.log("render end");
	}

	historyRouterPush(locate) {
		window.history.pushState({}, locate, window.location.origin + locate);
	}

	dummyClickEvent = ({target}) => {
        if(target.classList.contains('Mainpage')){
            this.setState({...this.state, locate : '/src/pages/Main.js'});
        }
        if(target.classList.contains('Signup')){
            this.setState({...this.state, locate: '/src/pages/Signup.js'});
        }
		if(target.classList.contains("Log In")){
			this.setState({...this.state, locate: '/src/pages/Login.js'});
		}
    }

    setDummyEvent(){
        this.root.addEventListener('click', this.dummyClickEvent);
    }
}

new app();

// src/core/Component.js

export default class Component {

	constructor($parent, setState, state) {
		this.$parent = $parent;
		this.setState = setState;
		this.state = state;
	}

	template() { // 함수 안에 html을 넣어서 반환
		console.log("empty template");
		return '';
	}

	#render() {
		const template = this.template();
		this.$parent.insertAdjacentHTML('beforeend', template);
	}

	setEvent() {} // 이벤트 설정

	renderSequnce(state) {
		console.log("renderSequnce");
		this.state = state;
		this.#render();
		this.setEvent();
	}
}

// src/router/RouterButton.js

export function RouterButton() {
	console.log("RouterButton");
	return `
		<button type="button" class="Mainpage">
			Mainpage
		</button>
		<button type="button" class="Signup">
			Signup
		</button>
		<button type="button" class="Login">
			Login
		</button>
	`
};

export function Heart() {
	console.log("Heart");
	return `
	<button onclick="printHeart()">하트 출력</button>
    <div id="heart"></div>
	`
};

export function LoginButton() {
	console.log("Login");
	return `
		<div class="login">
			<div class="login__container">
				<h1>Login</h1>
				<form action="/login" method="POST">
					<input type="text" name="id" placeholder="ID" />
					<input type="password" name="password" placeholder="Password" />
					<input type="submit" value="Log In" />
				</form>
				<a href="/Signup.js">Signup</a>
			</div>
		</div>
	`
}

// src/pages/Login.js

import Component from "../core/Component.js";
import { LoginButton } from "../router/RouterButton.js";

export default class Login extends Component {

	constructor(ObjectForDI) {
		super(ObjectForDI.$parent, ObjectForDI.setState, ObjectForDI.state);
	}

	template() {
		console.log("Login template");
		return `
		${LoginButton()}
		`;
	}

	setEvent() {
		const loginButton = this.$parent.querySelector('button[class="Login"]');
		if (loginButton) {
			loginButton.onclick = () => this.login();
		}
	}

	login() {
		console.log("login");
	}
}

// src/pages/Main.js

import Component from "../core/Component.js";
import { RouterButton } from "../router/RouterButton.js";
import { Heart } from "../router/RouterButton.js";

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
}

// src/pages/Signup.js

import Component from "../core/Component.js";
import { RouterButton } from "../router/RouterButton.js";

export default class Signup extends Component {

	constructor(ObjectForDI) {
		super(ObjectForDI.$parent, ObjectForDI.setState, ObjectForDI.state);
	}

	template() {
		console.log("Signup template");
		return `
		${RouterButton()}
		`;
	}
	setEvent() {

	}
}

// src/router/RouterButton.js

export function RouterButton() {
	console.log("RouterButton");
	return `
		<button type="button" class="Mainpage">
			Mainpage
		</button>
		<button type="button" class="Signup">
			Signup
		</button>
		<button type="button" class="Login">
			Login
		</button>
	`
};

export function Heart() {
	console.log("Heart");
	return `
	<button onclick="printHeart()">하트 출력</button>
    <div id="heart"></div>
	`
};

export function LoginButton() {
	console.log("Login");
	return `
		<div class="login">
			<div class="login__container">
				<h1>Login</h1>
				<form action="/login" method="POST">
					<input type="text" name="id" placeholder="ID" />
					<input type="password" name="password" placeholder="Password" />
					<input type="submit" value="Log In" />
				</form>
				<a href="/Signup.js">Signup</a>
			</div>
		</div>
	`
}