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
		const signupButton = this.$parent.querySelector('.Signup');
		if (signupButton) {
			signupButton.onclick = () => this.signup();
		}
		const loginButton = this.$parent.querySelector('.Login');
		if (loginButton) {
			loginButton.onclick = () => this.login();
		}
	}

	signup() {
		console.log("signup");
		const id = this.$parent.querySelector('input[name="id"]').value;
		const name = this.$parent.querySelector('input[name="name"]').value;
		const password = this.$parent.querySelector('input[name="password"]').value;
		console.log("id", id, "name", name, "password", password);
		// HTTP POST 요청 보내기
		fetch('/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id, name, password })
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

//before BootStrap
// export function RouterButton() {
// 	console.log("RouterButton");
// 	return `
// 		<div class="Signup">
// 			<div class="Signup__container">
// 				<h1>SIGN UP</h1>
// 				<input type="text" name="id" placeholder="ID" />
// 				<input type="text" name="name" placeholder="Name" />
// 				<input type="password" name="password" placeholder="Password" />
// 			</div>
// 		</div>
// 		<button type="button" class="Signup">
// 			Sign up
// 		</button>
// 		<button type="button" class="Login">
// 			Login Page
// 		</button>
// 	`
// };

export function RouterButton() {
    console.log("RouterButton");
    return `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h1 class="card-title text-center mb-4">SIGN UP</h1>
                            <div class="form-group mb-3">
                                <input type="text" name="id" class="form-control" placeholder="ID" />
                            </div>
                            <div class="form-group mb-3">
                                <input type="text" name="name" class="form-control" placeholder="Name" />
                            </div>
                            <div class="form-group mb-3">
                                <input type="password" name="password" class="form-control" placeholder="Password" />
                            </div>
                            <div class="d-grid gap-2">
                                <button type="button" class="btn btn-primary Signup">Sign up</button>
                                <button type="button" class="btn btn-secondary Login">Login Page</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};