import Component from "../core/Component.js";
import { RouterButton } from "../router/RouterButton.js";
import { Heart } from "../router/RouterButton.js";

export default class Mainpage extends Component {

	constructor(ObjectForDI) {
		super(ObjectForDI.$parent, ObjectForDI.setState, ObjectForDI.state);
	}

	template() {
		console.log("Mainpage template");
		return `
		${RouterButton()}
		${Heart()}
		`;
	}

	setEvent() {

	}
}
