import Component from "../core/Component";

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
