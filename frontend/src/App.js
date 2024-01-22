import Mainpage from "./pages/Main.js";
import Signup from "./pages/Signup.js";

class app {

	constructor() {
		this.state = { 'locate' : window.location.pathname };
		this.root = document.querySelector('.app');

		const ObjectForDI = {$parent:this.root, setState : this.setState.bind(this), state : this.state};

		this.Mainpage = new Mainpage(ObjectForDI);
		this.Signup = new Signup(ObjectForDI);

		this.render();
		this.setDummyEvent();
	}

	setState(newState) {
		const { locate } = this.state;
		this.state = {...this.state, ...newState};
		this.render();
	}

	render() {
		this.root.innerHTML = '';

		let { locate } = this.state;

		console.log(locate);

		if (locate === '/Mainpage') {
			this.Mainpage.renderSequnce(this.state);
			// this.historyRouterPush('/Mainpage');
		}
		else if (locate === '/Signup') {
			this.Signup.renderSequnce(this.state);
			// this.historyRouterPush('/Signup');
		}

		this.historyRouterPush(locate);
	}

	historyRouterPush(locate) {
		window.history.pushState({}, locate, window.location.origin + locate);
	}

	dummyClickEvent = ({target}) => {
        if(target.classList.contains('Mainpage')){
            this.setState({...this.state, locate : '/src/pages/Main'});
        }
        if(target.classList.contains('Signup')){
            this.setState({...this.state, locate: '/src/pages/Signup'});
        }
    }

    setDummyEvent(){
        this.root.addEventListener('click', this.dummyClickEvent);
    }
}

new app();