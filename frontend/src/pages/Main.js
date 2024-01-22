import Component from "../core/Component.js";
import RouterButton from "../router/RouterButton.js";
import Heart from "../router/RouterButton.js";

export default class Mainpage extends Component {

	template() {
		return `Main Page
		${RouterButton()}
		${Heart()}
		`;
	}
	setEvent() {

	}
}
