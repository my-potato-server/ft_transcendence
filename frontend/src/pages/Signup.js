// src/pages/Signup.js

import Component from "../core/Component.js";

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
		const signupButton = this.$parent.querySelector('button[class="Signup"]');
		if (signupButton) {
			signupButton.onclick = () => this.signup();
		}
		const loginButton = this.$parent.querySelector('button[class="Login"]');
		if (loginButton) {
			loginButton.onclick = () => this.login();
		}
	}

	signup() {
		console.log("signup");
		const id = this.$parent.querySelector('input[name="id"]').value;
		const password = this.$parent.querySelector('input[name="password"]').value;
		console.log("id", id, "password", password);
		// HTTP POST 요청 보내기
		fetch('/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id, password })
		})
		.then(response => {
			if (response.ok) {
				console.log("회원가입 성공");
				alert("회원가입 성공");
				this.setState({ locate: '/' });
			} else {
				console.log("회원가입 실패");
				alert("회원가입 실패");
			}
		})
		.catch(error => {
			console.log("회원가입 실패");
		});
	}


	login() {
		this.setState({ locate: '/' });
	}
}

export function RouterButton() {
	console.log("RouterButton");
	return `
		<div class="Signup">
			<div class="Signup__container">
				<h1>SIGN UP</h1>
				<input type="text" name="id" placeholder="ID" />
				<input type="password" name="password" placeholder="Password" />
			</div>
		</div>
		<button type="button" class="Signup">
			Sign up
		</button>
		<button type="button" class="Login">
			Login Page
		</button>
	`
};