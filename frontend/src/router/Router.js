import Mainpage from "../pages/Main";
import Signup from "../pages/Signup";

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
			this.Mainpage.renderSequnce();
		}
		else if (locate === '/Signup') {
			this.Signup.renderSequnce();
		}
		else {
			this.Mainpage.renderSequnce();
		}

		this.historyRouterPush(locate);
	}

	historyRouterPush(locate) {
		window.history.pushState({}, locate, window.location.origin + locate);
	}

	dummyClickEvent = ({target}) => {
        if(target.classList.contains('A')){
            this.setState({...this.state, locate : '/A'});
        }
        if(target.classList.contains('B')){
            this.setState({...this.state, locate: '/B'});
        }
        if(target.classList.contains('C')){
            this.setState({...this.state, locate: '/C'});
        }
    }

    setDummyEvent(){
        this.root.addEventListener('click', this.dummyClickEvent);
    }
}

new app();