import Mainpage from "./pages/Main.js";
import Signup from "./pages/Signup.js";
import Login from "./pages/Login.js"

class app {

	constructor() {
		this.state = { 'locate' : window.location.pathname };
		this.root = document.querySelector('.app');

		const ObjectForDI = {$parent:this.root, setState : this.setState.bind(this), state : this.state};

		this.Mainpage = new Mainpage(ObjectForDI);
		this.Signup = new Signup(ObjectForDI);
		this.Login = new Login(ObjectForDI);

		this.render();
		this.setDummyEvent();
	}

	setState(newState) {
		console.log("setState called");
		const { locate } = this.state;
		this.state = {...this.state, ...newState};
		console.log(this.state);
		console.log(locate);
		this.render();
		console.log("setState end");
	}

	render() {
		console.log("render start");
		this.root.innerHTML = '';

		let { locate } = this.state;
		console.log("render's locate", locate, this.state);
		if (locate === '/src/pages/Main.js') {
			this.Mainpage.renderSequnce(this.state);
			// this.historyRouterPush('/Mainpage');
		}
		else if (locate === '/src/pages/Signup.js') {
			this.Signup.renderSequnce(this.state);
			// this.historyRouterPush('/Signup');
		}
		else if (locate === '/') {
			this.Login.renderSequnce(this.state);
		// 	// this.historyRouterPush('/Mainpage');
		}

		this.historyRouterPush(locate);

		console.log("render end");
	}

	historyRouterPush(locate) {
		window.history.pushState({}, locate, window.location.origin + locate);
	}

	dummyClickEvent = ({target}) => {
        if(target.classList.contains('Mainpage')){
            this.setState({...this.state, locate : '/src/pages/Main.js'});
        }
        if(target.classList.contains('Signup')){
            this.setState({...this.state, locate: '/src/pages/Signup.js'});
        }
    }

    setDummyEvent(){
        this.root.addEventListener('click', this.dummyClickEvent);
    }
}

new app();