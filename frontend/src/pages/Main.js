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
		const heartButton = this.$parent.querySelector('button[onclick="printHeart()"]');
        if (heartButton) {
            heartButton.onclick = () => this.printHeart();
        }
	}

	printHeart() {
		const heart = `
  __  __
 /  \\/  \\
 \\     / 
  \\   /  
   \\ /   
    V
		`;
		const heartContainer = this.$parent.querySelector('#heart');
		if (heartContainer) {
			heartContainer.innerHTML = `<pre>${heart}</pre>`;
		}
	}
}
