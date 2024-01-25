// src/pages/main/Profile.js

import Component from "../../core/Component";
import RouterButton from "../../routers/RouterButton";
import ProfileButton from "../../routers/ProfileButton";

export default class Profile extends Component {

    constructor(ObjectForDI) {
        super(ObjectForDI.$parent, ObjectForDI.setState, ObjectForDI.state);
    }

    template() {
        console.log("Profile template");
        return `
        ${RouterButton()}
        ${ProfileButton()}
        `;
    }

    setEvent() {
        //
		//RouterButton
		//
		const mainpageButton = this.$parent.querySelector('button[class="Mainpage"]');
		if (mainpageButton) {
			mainpageButton.onclick = () => this.mainpage();
		}
		const gameButton = this.$parent.querySelector('button[class="Game"]');
		if (gameButton) {
			gameButton.onclick = () => this.game();
		}
		const chatButton = this.$parent.querySelector('button[class="Chat"]');
		if (chatButton) {
			chatButton.onclick = () => this.chat();
		}
		const rankButton = this.$parent.querySelector('button[class="Rank"]');
		if (rankButton) {
			rankButton.onclick = () => this.rank();
		}
		const profileButton = this.$parent.querySelector('button[class="Profile"]');
		if (profileButton) {
			profileButton.onclick = () => this.profile();
		}
		const logoutButton = this.$parent.querySelector('button[class="Logout"]');
		if (logoutButton) {
			logoutButton.onclick = () => this.logout();
		}
		//
		//
		//

        //
        //Profile
        //
        const userInfo = this.$parent.querySelector('button[class="UserInfo"]');
        if (userInfo) {
            userInfo.onclick = () => this.userInfo();
        }
        const deleteid = this.$parent.querySelector('button[class="DeleteID"]');
        if (deleteid) {
            deleteid.onclick = () => this.deleteid();
        }
        const status = this.$parent.querySelector('button[class="Status"]');
        if (status) {
            status.onclick = () => this.status();
        }
        //
        //
        //
    }


    //
	// RouterButton
	//
	mainpage() {
		console.log("mainpage");
		this.setState({locate: '/src/pages/Main'});
	}
	game() {
		console.log("game");
		this.setState({locate: '/src/pages/Game'});
	}
	chat() {
		console.log("chat");
		this.setState({locate: '/src/pages/Chat'});
	}
	rank() {
		console.log("rank");
		this.setState({locate: '/src/pages/Rank'});
	}
	profile() {
		console.log("profile");
		this.setState({locate: '/src/pages/Profile'});
	}
	logout() {
		console.log("logout");
		this.$parent.auth = false;
		this.setState({locate: '/'});
	}
	//
	//
	//

    //
    //Profile
    //
    info() {
        return {
            id : this.$parent.userinfo.id,
            name : this.$parent.userinfo.name,
            auth : this.$parent.userinfo.auth
        };
    }
    userInfo() {
        console.log("userInfo");
        const infoContainer = this.$parent.querySelector('#info');
        if (infoContainer) {
            const infos = this.info();
            infoContainer.innerHTML = `
            <pre>
                <h3>유저 정보</h3>
                <div>id : ${infos.id}</div>
                <div>name : ${infos.name}</div>
                <div>auth : ${infos.auth}</div>
            </pre>`;
        }
    }
    deleteid() {
        console.log("deleteid");
        // 서버에 id 삭제 요청
        const infos = this.info();
        fetch('/deleteid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id : infos.id
            }),
        })
        .then(response => {
            if (response.ok) {
                console.log("id 삭제 성공");
                alert("id 삭제 성공");
                this.$parent.auth = false;
                this.$parent.userinfo = {
                    id : '',
                    name : '',
                    auth : false
                };
                this.setState({ locate: '/' });
            } else {
                console.log("id 삭제 실패");
                alert("id 삭제 실패");
                //아래는 삭제기능 정상 작동시 삭제
                alert("임시로 로그인 페이지로 이동합니다.");
                this.$parent.auth = false;
                this.$parent.userinfo = {
                    id : '',
                    name : '',
                    auth : false
                };
                this.setState({ locate: '/' });
            }
        })
        .catch(error => {
            console.log("id 삭제 실패", error);
        });
        // 성공 시 로그아웃
    }
    status() {
        console.log("status");
        // 서버에 레벨, 게임 rank, 승률, 승리 패배 횟수 등 요청
        const infos = this.info();
        fetch('/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id : infos.id
            }),
        })
        .then(response => {
            if (response.ok) {
                console.log("status 요청 성공");
                alert("status 요청 성공");
                // 서버에서 받은 정보를 출력
                // level, rank, rate, win, lose 요청
                const statusContainer = this.$parent.querySelector('#status');
                if (statusContainer) {
                    const status = response.json();
                    if (!status) {
                        console.log("status 에러");
                        alert("status 요청 실패");
                        status = {
                            level : 0,
                            rank : 0,
                            rate : 0,
                            win : 0,
                            lose : 0
                        };
                    }
                    statusContainer.innerHTML = `
                    <pre>
                        <h3>유저 정보</h3>
                        <div>id : ${infos.id}</div>
                        <div>name : ${infos.name}</div>
                        <div>level : ${status.level}</div>
                        <div>rank : ${status.rank}</div>
                        <div>rate : ${status.rate}</div>
                        <div>win : ${status.win}</div>
                        <div>lose : ${status.lose}</div>
                    </pre>
                    `;
                }
            } else {
                console.log("status 요청 실패");
                alert("status 요청 실패");
                //이하 테스트용. 스테이터스 요청 정상 동작시 삭제
                const statusContainer = this.$parent.querySelector('#status');
                const status = {
                    level : 0,
                    rank : 0,
                    rate : 0,
                    win : 0,
                    lose : 0
                };
                statusContainer.innerHTML = `
                    <pre>
                        <h3>유저 정보(테스트용)</h3>
                        <div>id : ${infos.id}</div>
                        <div>name : ${infos.name}</div>
                        <div>level : ${status.level}</div>
                        <div>rank : ${status.rank}</div>
                        <div>rate : ${status.rate}%(${status.win}/${status.lose})</div>
                    </pre>
                    `;
            }
        })
    }
}