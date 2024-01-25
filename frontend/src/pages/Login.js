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
		const authButton = this.$parent.querySelector('button[class="Get_Auth"]');
		if (authButton) {
			authButton.onclick = () => this.getAuth();
		}
		const delauthButton = this.$parent.querySelector('button[class="Del_Auth"]');
		if (delauthButton) {
			delauthButton.onclick = () => this.delAuth();
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
				alert("로그인 성공");
				this.$parent.auth = true;
				this.setState({locate: '/src/pages/Main'});
				// db에서 유저 id, 이름, 권한 설정 및 기타 내역 저장
			} else {
				console.log("로그인 실패");
				alert("로그인 실패");
				// 로그인 실패 시 필요한 처리 수행
			}
		})
		.catch(error => {
			console.error('로그인 중 오류 발생:', error);
		});
	}

	signup() {
		console.log("signup");
		this.setState({locate: '/src/pages/Signup'});
	}

	templogin() {
		console.log("templogin");
		if (this.$parent.auth === false) {
			console.log("no auth");
			alert("로그인이 필요합니다.");
			return;
		}
		else {
			alert("로그인 되었습니다.");
			console.log(this.$parent.userinfo);
			this.setState({locate: '/src/pages/Main'});
		}
	}

	getAuth() {
		console.log("getAuth");
		this.$parent.auth = true;
		this.$parent.userinfo = {
			id : 'test',
			name : 'test',
			auth : true
		};
	}

	delAuth() {
		console.log("delAuth");
		this.$parent.auth = false;
		this.$parent.userinfo = {
			id : '',
			name : '',
			auth : false
		};
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
		<div class="auth">
			<button type="button" class="Get_Auth">
				Get Auth
			</button>
			<button type="button" class="Del_Auth">
				Del Auth
			</button>
		</div>
	`
}