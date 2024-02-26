// src/pages/main/Profile.js

import Component from "../../core/Component.js";
import RouterButton from "../../routers/RouterButton.js";
import ProfileButton from "../../routers/ProfileButton.js";

export default class Profile extends Component {

    constructor(ObjectForDI) {
        super(ObjectForDI.$parent, ObjectForDI.setState, ObjectForDI.state);

        this.buttoncheck = {
            userinfo : false,
            deleteid : false,
            status : false
        }
    }

    template() {
        console.log("Profile template");
        return `
        ${RouterButton('/src/pages/main/Profile')}
        ${ProfileButton()}
        `;
    }

    setEvent() {
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
        const matchHistory = this.$parent.querySelector('button[class="MatchHistory"]');
        if (matchHistory) {
            matchHistory.onclick = () => this.matchHistory();
        }
    }

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
        console.log("userInfo", this.buttoncheck.userinfo);
        if (this.buttoncheck.userinfo) {
            this.buttoncheck.userinfo = false;
            const infoContainer = this.$parent.querySelector('#info');
            if (infoContainer) {
                infoContainer.innerHTML = '';
            }
        } else {
            const infoContainer = this.$parent.querySelector('#info');
            fetch('/account/me', {
                method: 'GET',
            })
            .then(async response => {
                const infos = {id, login, nickname, image} = await response.json();
                infoContainer.innerHTML = `
                <pre>
                    <h3>유저 정보</h3>
                    <div>id : ${infos.id}</div>
                    <div>name : ${infos.name}</div>
                    <div>auth : ${infos.auth}</div>
                    <div>token : ${this.$parent.token}</div>
                </pre>`;
                infoContainer.style.display = 'block';
            })
            // if (infoContainer) {
            //     const infos = this.info();
            //     infoContainer.innerHTML = `
            //     <pre>
            //         <h3>유저 정보</h3>
            //         <div>id : ${infos.id}</div>
            //         <div>name : ${infos.name}</div>
            //         <div>auth : ${infos.auth}</div>
            //         <div>token : ${this.$parent.token}</div>
            //     </pre>`;
            //     infoContainer.style.display = 'block';
            // }
            this.buttoncheck.userinfo = true;
        }
    }

    deleteid() {
        console.log("deleteid");
        // 서버에 id 삭제 요청
        alert("ID를 삭제합니다.");
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
        if (this.buttoncheck.status) {
            this.buttoncheck.status = false;
            const statusContainer = this.$parent.querySelector('#status');
            if (statusContainer) {
                statusContainer.innerHTML = '';
            }
        } else {
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
            .catch(error => {
                console.log("status 요청 실패", error);
            });
            this.buttoncheck.status = true;
        }
    }

    matchHistory() {
        if (this.buttoncheck.matchHistory) {
            this.buttoncheck.matchHistory = false;
            const matchHistoryContainer = this.$parent.querySelector('#matchHistory');
            if (matchHistoryContainer) {
                matchHistoryContainer.innerHTML = '';
            }
        } else {
            console.log("matchHistory");
            // 서버에 매치 히스토리 요청
            alert("매치 히스토리를 요청합니다.");
            const infos = this.info();
            fetch('/matchHistory', {
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
                    console.log("matchhistory 요청 성공");
                    alert("matchhistory 요청 성공");
                    // 서버에서 받은 정보를 출력
                    const matchHistoryContainer = this.$parent.querySelector('#matchHistory');
                    if (matchHistoryContainer) {
                        const matchHistory = response.json();
                        if (!matchHistory) {
                            console.log("matchhistory 에러");
                            alert("matchhistory 요청 실패");
                            matchHistory = {
                                match : []
                            };
                        }
                        matchHistoryContainer.innerHTML = `
                        <pre>
                            <h3>매치 히스토리</h3>
                            <div>${matchHistory.match}</div>
                        </pre>
                        `;
                    }
                } else {
                    console.log("matchhistory 요청 실패");
                    alert("matchhistory 요청 실패");
                    //이하 테스트용. 매치 히스토리 요청 정상 동작시 삭제
                    const matchHistoryContainer = this.$parent.querySelector('#matchHistory');
                    matchHistoryContainer.innerHTML = `
                        <pre>
                            <h3>매치 히스토리(테스트용)</h3>
                        </pre>
                        `;
                    matchHistoryContainer.style.display = 'block';
                    this.buttoncheck.matchHistory = true;
                }
            })
            .catch(error => {
                console.log("matchhistory 요청 실패..", error);
            });
        }
    }
}
