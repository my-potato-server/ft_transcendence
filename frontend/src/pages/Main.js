// src/pages/Main.js

import Component from "../core/Component.js";
import RouterButton from "../routers/RouterButton.js";

export default class Mainpage extends Component {

	constructor(ObjectForDI) {
		super(ObjectForDI.$parent, ObjectForDI.setState, ObjectForDI.state);
		const auth = sessionStorage.getItem('auth') === 'true'; // 문자열 "true"를 boolean으로 변환
		const token = sessionStorage.getItem('token');
		const userinfo = sessionStorage.getItem('userinfo');
		this.$parent.auth = auth;
		this.$parent.token = token;
		this.$parent.userinfo = JSON.parse(userinfo).user;
		console.log("Mainpage", this.$parent.auth, this.$parent.token, this.$parent.userinfo);
	}

	template() {
		console.log("Mainpage template");
		return `
		${RouterButton('/src/pages/Main')}
		${this.booyeah()}
		`;
	}

	setEvent() {
		//
		//Mainpage
		//
		const booyeahbtn = this.$parent.querySelector('#booyeah');
        if (booyeahbtn) {
			booyeahbtn.onclick = () => this.hooyeah();
        }
		//
		//
		//
	}

	booyeah() {
		return `
			<div class="d-flex justify-content-center mt-5">
				<button id="booyeah" class="btn btn-primary btn-lg" style="width: 400px; height: 400px;">?</button>
			</div>
		`;
	}


	async hooyeah() {
		let i = 0;
		const Yahoo = (await import('../apps/yahoo.js')).default;
		const booyeahbtn = this.$parent.querySelector('#booyeah');
		const buttonwidth = booyeahbtn.offsetWidth;
		const buttonheight = booyeahbtn.offsetHeight;
		const textSize = Math.min(buttonwidth, buttonheight) / 100;
		while (true) {
			for (i = 0; i < 10; i++) {
				if (window.location.pathname !== '/src/pages/Main') {
					break;
				}
				const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
				const randomColor2 = `#${Math.floor(Math.random()*16734200).toString(16)}`;
				booyeahbtn.style.fontSize = `${textSize}px`;
				booyeahbtn.innerHTML = `<pre style="color: ${randomColor2};">${Yahoo(i)}</pre>`;
				booyeahbtn.style.backgroundColor = randomColor;
				booyeahbtn.style.color = randomColor2;
				await new Promise(resolve => setTimeout(resolve, 100));
			}
			if (window.location.pathname !== '/src/pages/Main') {
				break;
			}
		}
	}
}
