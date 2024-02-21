// src/pages/Login.js

import Component from "../core/Component.js";
import injectLoginStyles from "../styles/loginstyle.js";

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
		const loginButton = this.$parent.querySelector('.Log_In');
		if (loginButton) {
			loginButton.onclick = () => this.login();
		}
		const SignupButton = this.$parent.querySelector('.Signup');
		if (SignupButton) {
			SignupButton.onclick = () => this.signup();
		}
		const temploginButton = this.$parent.querySelector('.templogin');
		if (temploginButton) {
			temploginButton.onclick = () => this.templogin();
		}
		const _42loginButton = this.$parent.querySelector('.42Login');
		if (_42loginButton) {
			_42loginButton.onclick = () => this._42login();
		}
		const authButton = this.$parent.querySelector('.Get_Auth');
		if (authButton) {
			authButton.onclick = () => this.getAuth();
		}
		const delauthButton = this.$parent.querySelector('.Del_Auth');
		if (delauthButton) {
			delauthButton.onclick = () => this.delAuth();
		}
	}

	_42login() {
		console.log("42login");
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
				// alert("로그인 성공");
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
			// alert("로그인 되었습니다.");
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
	injectLoginStyles();
    return `
		<div class="container mt-5">
			<div class="row justify-content-center">
				<div class="col-md-6">
					<div class="card">
						<div class="card-body">
							<input type="text" name="id" class="form-control mb-2" placeholder="ID" required autofocus />
							<input type="password" name="password" class="form-control mb-2" placeholder="Password" required />
							<button class="btn btn-lg btn-primary btn-block Log_In" type="button">Log In</button>
							<button class="btn btn-lg btn-secondary btn-block mt-2 Signup" type="button">Signup</button>
							<button class="btn btn-lg btn-info btn-block mt-2 templogin" type="button">templogin</button>
							<button class="btn btn-lg btn-info btn-block mt-2 42login" type="button">42 Login</button>
						</div>
					</div>
					<div class="mt-3 text-center">
						<button class="btn btn-sm btn-outline-primary Get_Auth" type="button">Get Auth</button>
						<button class="btn btn-sm btn-outline-danger Del_Auth" type="button">Del Auth</button>
					</div>
				</div>
			</div>
		</div>
    `;
}
