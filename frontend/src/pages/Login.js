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