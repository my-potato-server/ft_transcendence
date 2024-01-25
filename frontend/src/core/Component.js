// src/core/Component.js

export default class Component {

	constructor($parent, setState, state) {
		this.$parent = $parent;
		this.setState = setState;
		this.state = state;
	}

	template() { // 함수 안에 html을 넣어서 반환
		console.log("empty template");
		return '';
	}

	#render() {
		const template = this.template();
		this.$parent.insertAdjacentHTML('beforeend', template);
	}

	setEvent() {} // 이벤트 설정

	renderSequnce(state) {
		console.log("renderSequnce");
		this.state = state;
		this.#render();
		this.setEvent();
	}
}