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

	}

	
}

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