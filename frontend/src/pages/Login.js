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
		// const loginButton = this.$parent.querySelector('.Log_In');
		// if (loginButton) {
		// 	loginButton.onclick = () => this.login();
		// }
		// const SignupButton = this.$parent.querySelector('.Signup');
		// if (SignupButton) {
		// 	SignupButton.onclick = () => this.signup();
		// }
		const temploginButton = this.$parent.querySelector('.templogin');
		if (temploginButton) {
			temploginButton.onclick = () => this.templogin();
		}
		const temploginButton2 = this.$parent.querySelector('.templogin2');
		if (temploginButton2) {
			temploginButton2.onclick = () => this.templogin2();
		}
		const temploginButton3 = this.$parent.querySelector('.templogin3');
		if (temploginButton2) {
			temploginButton3.onclick = () => this.templogin3();
		}
		const temploginButton4 = this.$parent.querySelector('.templogin4');
		if (temploginButton2) {
			temploginButton4.onclick = () => this.templogin4();
		}
		const _42loginButton = this.$parent.querySelector('.ftLogin');
		if (_42loginButton) {
			_42loginButton.onclick = () => this._42login();
		}
		// const authButton = this.$parent.querySelector('.Get_Auth');
		// if (authButton) {
		// 	authButton.onclick = () => this.getAuth();
		// }
		// const delauthButton = this.$parent.querySelector('.Del_Auth');
		// if (delauthButton) {
		// 	delauthButton.onclick = () => this.delAuth();
		// }
	}

	_42login() {
		console.log("42login");
		fetch("/api/account/42-oauth-url", {
			method: 'GET',
		})
		.then(async response => {
			window.location.href = JSON.parse(await response.text());
		})
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
		sessionStorage.setItem('auth', true);
		fetch('/api/account/make-test-user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ login: 'temp' })
		})
		.then(response => {
			if (response.ok) {
				console.log("templogin 성공");
				return response.json();
			} else {
				console.log("templogin 실패");
				alert("templogin 실패");
			}
		})
		.then(data => {
			const token = data.token;
			console.log("token", token);
			this.$parent.auth = true;
            this.$parent.token = token;
            this.lauth = true;
            this.ltoken = token;
            return fetch('/account/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + token,
            }})
		})
		.then(async response => {
			console.log("response", response);
            const infos = await response.json();
            console.log(infos);
            this.luserinfo = JSON.stringify(infos);
            this.$parent.userinfo = JSON.stringify(infos);
            sessionStorage.setItem('userinfo', JSON.stringify(infos));
            // this.setState({ locate: '/src/pages/Main'});
            sessionStorage.setItem('auth', this.lauth);
            sessionStorage.setItem('token', this.ltoken);
            sessionStorage.setItem('userinfo', this.luserinfo);
            console.log("templogins", this.logins);

			this.$parent.onlineSocket = new WebSocket('wss://localhost/ws/account/online/');
            this.$parent.onlineSocket.onopen = (event) => {
                const payload = JSON.stringify({ token: sessionStorage.getItem('token') });
                this.$parent.onlineSocket.send(payload);
            };

            this.setState({ locate: '/src/pages/Main'});
		})
		// sessionStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNCwibG9naW4iOiJzdHJpbmciLCJuaWNrbmFtZSI6InN0cmluZyIsImV4cCI6MTcxMTkwMjQyOH0.WjVhrYweWouO6y5jvZuBnHwbziNliq2p3OH7sJIcvks');
		// sessionStorage.setItem('userinfo', JSON.stringify({user:{
		// 	id : 34,
		// 	login : 'string',
		// 	nickname : 'string',
		// 	image : '/media/default.png',
		// }}));
		// this.$parent.auth = true;
		// this.$parent.userinfo = JSON.stringify(sessionStorage.getItem('userinfo'));
		// this.$parent.token = sessionStorage.getItem('token');
		// this.setState({locate: '/src/pages/Main'});
	}
	templogin2() {
		console.log("templogin");
		sessionStorage.setItem('auth', true);
		fetch('/api/account/make-test-user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ login: 'temp2' })
		})
		.then(response => {
			if (response.ok) {
				console.log("templogin 성공");
				return response.json();
			} else {
				console.log("templogin 실패");
				alert("templogin 실패");
			}
		})
		.then(data => {
			const token = data.token;
			console.log("token", token);
			this.$parent.auth = true;
            this.$parent.token = token;
            this.lauth = true;
            this.ltoken = token;
            return fetch('/account/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + token,
            }})
		})
		.then(async response => {
			console.log("response", response);
            const infos = await response.json();
            console.log(infos);
            this.luserinfo = JSON.stringify(infos);
            this.$parent.userinfo = JSON.stringify(infos);
            sessionStorage.setItem('userinfo', JSON.stringify(infos));
            // this.setState({ locate: '/src/pages/Main'});
            sessionStorage.setItem('auth', this.lauth);
            sessionStorage.setItem('token', this.ltoken);
            sessionStorage.setItem('userinfo', this.luserinfo);
            console.log("templogins", this.logins);

			this.$parent.onlineSocket = new WebSocket('wss://localhost/ws/account/online/');
            this.$parent.onlineSocket.onopen = (event) => {
                const payload = JSON.stringify({ token: sessionStorage.getItem('token') });
                this.$parent.onlineSocket.send(payload);
            };

            this.setState({ locate: '/src/pages/Main'});
		})
		// sessionStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNCwibG9naW4iOiJzdHJpbmciLCJuaWNrbmFtZSI6InN0cmluZyIsImV4cCI6MTcxMTkwMjQyOH0.WjVhrYweWouO6y5jvZuBnHwbziNliq2p3OH7sJIcvks');
		// sessionStorage.setItem('userinfo', JSON.stringify({user:{
		// 	id : 34,
		// 	login : 'string',
		// 	nickname : 'string',
		// 	image : '/media/default.png',
		// }}));
		// this.$parent.auth = true;
		// this.$parent.userinfo = JSON.stringify(sessionStorage.getItem('userinfo'));
		// this.$parent.token = sessionStorage.getItem('token');
		// this.setState({locate: '/src/pages/Main'});
	}
	templogin3() {
		console.log("templogin");
		sessionStorage.setItem('auth', true);
		fetch('/api/account/make-test-user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ login: 'temp3' })
		})
		.then(response => {
			if (response.ok) {
				console.log("templogin 성공");
				return response.json();
			} else {
				console.log("templogin 실패");
				alert("templogin 실패");
			}
		})
		.then(data => {
			const token = data.token;
			console.log("token", token);
			this.$parent.auth = true;
            this.$parent.token = token;
            this.lauth = true;
            this.ltoken = token;
            return fetch('/account/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + token,
            }})
		})
		.then(async response => {
			console.log("response", response);
            const infos = await response.json();
            console.log(infos);
            this.luserinfo = JSON.stringify(infos);
            this.$parent.userinfo = JSON.stringify(infos);
            sessionStorage.setItem('userinfo', JSON.stringify(infos));
            // this.setState({ locate: '/src/pages/Main'});
            sessionStorage.setItem('auth', this.lauth);
            sessionStorage.setItem('token', this.ltoken);
            sessionStorage.setItem('userinfo', this.luserinfo);
            console.log("templogins", this.logins);

			this.$parent.onlineSocket = new WebSocket('wss://localhost/ws/account/online/');
            this.$parent.onlineSocket.onopen = (event) => {
                const payload = JSON.stringify({ token: sessionStorage.getItem('token') });
                this.$parent.onlineSocket.send(payload);
            };

            this.setState({ locate: '/src/pages/Main'});
		})
		// sessionStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNCwibG9naW4iOiJzdHJpbmciLCJuaWNrbmFtZSI6InN0cmluZyIsImV4cCI6MTcxMTkwMjQyOH0.WjVhrYweWouO6y5jvZuBnHwbziNliq2p3OH7sJIcvks');
		// sessionStorage.setItem('userinfo', JSON.stringify({user:{
		// 	id : 34,
		// 	login : 'string',
		// 	nickname : 'string',
		// 	image : '/media/default.png',
		// }}));
		// this.$parent.auth = true;
		// this.$parent.userinfo = JSON.stringify(sessionStorage.getItem('userinfo'));
		// this.$parent.token = sessionStorage.getItem('token');
		// this.setState({locate: '/src/pages/Main'});
	}
	templogin4() {
		console.log("templogin");
		sessionStorage.setItem('auth', true);
		fetch('/api/account/make-test-user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ login: 'temp4' })
		})
		.then(response => {
			if (response.ok) {
				console.log("templogin 성공");
				return response.json();
			} else {
				console.log("templogin 실패");
				alert("templogin 실패");
			}
		})
		.then(data => {
			const token = data.token;
			console.log("token", token);
			this.$parent.auth = true;
            this.$parent.token = token;
            this.lauth = true;
            this.ltoken = token;
            return fetch('/account/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + token,
            }})
		})
		.then(async response => {
			console.log("response", response);
            const infos = await response.json();
            console.log(infos);
            this.luserinfo = JSON.stringify(infos);
            this.$parent.userinfo = JSON.stringify(infos);
            sessionStorage.setItem('userinfo', JSON.stringify(infos));
            // this.setState({ locate: '/src/pages/Main'});
            sessionStorage.setItem('auth', this.lauth);
            sessionStorage.setItem('token', this.ltoken);
            sessionStorage.setItem('userinfo', this.luserinfo);
            console.log("templogins", this.logins);

			this.$parent.onlineSocket = new WebSocket('wss://localhost/ws/account/online/');
            this.$parent.onlineSocket.onopen = (event) => {
                const payload = JSON.stringify({ token: sessionStorage.getItem('token') });
                this.$parent.onlineSocket.send(payload);
            };

            this.setState({ locate: '/src/pages/Main'});
		})
		// sessionStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNCwibG9naW4iOiJzdHJpbmciLCJuaWNrbmFtZSI6InN0cmluZyIsImV4cCI6MTcxMTkwMjQyOH0.WjVhrYweWouO6y5jvZuBnHwbziNliq2p3OH7sJIcvks');
		// sessionStorage.setItem('userinfo', JSON.stringify({user:{
		// 	id : 34,
		// 	login : 'string',
		// 	nickname : 'string',
		// 	image : '/media/default.png',
		// }}));
		// this.$parent.auth = true;
		// this.$parent.userinfo = JSON.stringify(sessionStorage.getItem('userinfo'));
		// this.$parent.token = sessionStorage.getItem('token');
		// this.setState({locate: '/src/pages/Main'});
	}
	// getAuth() {
	// 	console.log("getAuth");
	// 	this.$parent.auth = true;
	// 	this.$parent.userinfo = {
	// 		id : 'test',
	// 		name : 'test',
	// 		auth : true
	// 	};
	// }

	// delAuth() {
	// 	console.log("delAuth");
	// 	this.$parent.auth = false;
	// 	this.$parent.userinfo = {
	// 		id : '',
	// 		name : '',
	// 		auth : false
	// 	};
	// }
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
							<button class="btn btn-lg btn-info btn-block mt-2 ftLogin" type="button" style="opacity: 1;">42 Login</button>
						</div>
					</div>
				</div>
			</div>
		</div>
    `;
}

// export function LoginButton() {
//     console.log("Login");
// 	injectLoginStyles();
//     return `
// 		<div class="container mt-5">
// 			<div class="row justify-content-center">
// 				<div class="col-md-6">
// 					<div class="card">
// 						<div class="card-body">
// 							<button class="btn btn-lg btn-info btn-block mt-2 ftLogin" type="button" style="opacity: 1;">42 Login</button>
// 							<button class="btn btn-lg btn-info btn-block mt-2 templogin" type="button">templogin</button>
// 							<button class="btn btn-lg btn-info btn-block mt-2 templogin2" type="button">templogin2</button>
// 							<button class="btn btn-lg btn-info btn-block mt-2 templogin3" type="button">templogin3</button>
// 							<button class="btn btn-lg btn-info btn-block mt-2 templogin4" type="button">templogin4</button>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
//     `;
// }

// db login exist ver
// export function LoginButton() {
//     console.log("Login");
// 	injectLoginStyles();
//     return `
// 		<div class="container mt-5">
// 			<div class="row justify-content-center">
// 				<div class="col-md-6">
// 					<div class="card">
// 						<div class="card-body">
// 							<input type="text" name="id" class="form-control mb-2" placeholder="ID" required autofocus />
// 							<input type="password" name="password" class="form-control mb-2" placeholder="Password" required />
// 							<button class="btn btn-lg btn-primary btn-block Log_In" type="button">Log In</button>
// 							<button class="btn btn-lg btn-secondary btn-block mt-2 Signup" type="button">Signup</button>
// 							<button class="btn btn-lg btn-info btn-block mt-2 ftLogin" type="button">42 Login</button>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
//     `;
// }

// temp login exist ver
// export function LoginButton() {
//     console.log("Login");
// 	injectLoginStyles();
//     return `
// 		<div class="container mt-5">
// 			<div class="row justify-content-center">
// 				<div class="col-md-6">
// 					<div class="card">
// 						<div class="card-body">
// 							<input type="text" name="id" class="form-control mb-2" placeholder="ID" required autofocus />
// 							<input type="password" name="password" class="form-control mb-2" placeholder="Password" required />
// 							<button class="btn btn-lg btn-primary btn-block Log_In" type="button">Log In</button>
// 							<button class="btn btn-lg btn-secondary btn-block mt-2 Signup" type="button">Signup</button>
// 							<button class="btn btn-lg btn-info btn-block mt-2 templogin" type="button">templogin</button>
// 							<button class="btn btn-lg btn-info btn-block mt-2 ftLogin" type="button">42 Login</button>
// 						</div>
// 					</div>
// 					<div class="mt-3 text-center">
// 						<button class="btn btn-sm btn-outline-primary Get_Auth" type="button">Get Auth</button>
// 						<button class="btn btn-sm btn-outline-danger Del_Auth" type="button">Del Auth</button>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
//     `;
// }
