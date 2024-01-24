// src/pages/Login.js

import Component from "../core/Component.js";

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
		const loginButton = this.$parent.querySelector('button[class="Log In"]');
		if (loginButton) {
			loginButton.onclick = () => this.login();
		}
		const SignupButton = this.$parent.querySelector('button[class="Signup"]');
		if (SignupButton) {
			SignupButton.onclick = () => this.signup();
		}
		const temploginButton = this.$parent.querySelector('button[class="templogin"]');
		if (temploginButton) {
			temploginButton.onclick = () => this.templogin();
		}
	}

	login() {
		console.log("login");
		const id = this.$parent.querySelector('input[name="id"]').value;
		const password = this.$parent.querySelector('input[name="password"]').value;
		console.log("id", id, "password", password);
		// HTTP POST 요청 보내기
		fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id, password })
		})
		.then(response => {
			if (response.ok) {
				console.log("로그인 성공");
				// 로그인 성공 시 필요한 처리 수행
			} else {
				console.log("로그인 실패");
				// 로그인 실패 시 필요한 처리 수행
			}
		})
		.catch(error => {
			console.error('로그인 중 오류 발생:', error);
		});
	}

	signup() {
		console.log("signup");
	}

	templogin() {
		console.log("templogin");
		// this.root.innerHTML = '';
		import('./Main.js').then(({ default: Mainpage }) => {
			this.setState({ locate: '/src/pages/Main' });
			// this.Mainpage.renderSequnce(this.state);
		});
	}

}

export function LoginButton() {
	console.log("Login");
	return `
		<div class="login">
			<div class="login__container">
				<h1>Login</h1>
				<input type="text" name="id" placeholder="ID" />
				<input type="password" name="password" placeholder="Password" />
				<button type="button" class="Log In">
					Log In
				</button>
				<button type="button" class="Signup">
					Signup
				</button>
				<button type="button" class="templogin">
					templogin
				</button>
			</div>
		</div>
	`
}