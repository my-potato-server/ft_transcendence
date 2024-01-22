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
