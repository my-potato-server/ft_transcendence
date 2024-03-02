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

        this.infos = this.$parent.userinfo;
        this.sigh = this.$parent.sigh;
        console.log("Profile", this.infos);
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
        // const deleteid = this.$parent.querySelector('button[class="DeleteID"]');
        // if (deleteid) {
        //     deleteid.onclick = () => this.deleteid();
        // }
        // const status = this.$parent.querySelector('button[class="Status"]');
        // if (status) {
        //     status.onclick = () => this.status();
        // }
        const matchHistory = this.$parent.querySelector('button[class="MatchHistory"]');
        if (matchHistory) {
            matchHistory.onclick = () => this.matchHistory();
        }
        const ProfilePhoto = this.$parent.querySelector('button[class="ProfilePhoto"]');
        if (ProfilePhoto) {
            ProfilePhoto.onclick = () => this.profilePhoto();
        }
        const Nickname = this.$parent.querySelector('button[class="Nickname"]');
        if (Nickname) {
            Nickname.onclick = () => this.nickname();
        }
        const Sigh = this.$parent.querySelector('button[class="Sigh"]');
        if (Sigh) {
            Sigh.onclick = () => this.Sighf();
        }
    }

    userInfo() {
        if (this.buttoncheck.userinfo) {
            this.buttoncheck.userinfo = false;
            const infoContainer = this.$parent.querySelector('#info');
            if (infoContainer) {
                infoContainer.innerHTML = '';
            }
        } else {
            const infoContainer = this.$parent.querySelector('#info');
            console.log("userInfo", this.$parent.userinfo);
            console.log("userInfo2", this.infos);
            const infos = {
                id : this.infos.id,
                login : this.infos.login,
                nickname : this.infos.nickname,
                since : this.infos.created_at
            }
            infoContainer.innerHTML = `
            <pre>
                <h3>유저 정보</h3>
                <div>id : ${infos.id}</div>
                <div>name : ${infos.login}</div>
                <div>nickname : ${infos.nickname}</div>
                <div>since : ${this.infos.created_at}</div>
            </pre>`;
            infoContainer.style.display = 'block';
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

    // status() {
    //     console.log("status");
    //     // 서버에 레벨, 게임 rank, 승률, 승리 패배 횟수 등 요청
    //     if (this.buttoncheck.status) {
    //         this.buttoncheck.status = false;
    //         const statusContainer = this.$parent.querySelector('#status');
    //         if (statusContainer) {
    //             statusContainer.innerHTML = '';
    //         }
    //     } else {
    //         const infos = this.info();
    //         fetch('/status', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 id : infos.id
    //             }),
    //         })
    //         .then(response => {
    //             if (response.ok) {
    //                 console.log("status 요청 성공");
    //                 alert("status 요청 성공");
    //                 // 서버에서 받은 정보를 출력
    //                 // level, rank, rate, win, lose 요청
    //                 const statusContainer = this.$parent.querySelector('#status');
    //                 if (statusContainer) {
    //                     const status = response.json();
    //                     if (!status) {
    //                         console.log("status 에러");
    //                         alert("status 요청 실패");
    //                         status = {
    //                             level : 0,
    //                             rank : 0,
    //                             rate : 0,
    //                             win : 0,
    //                             lose : 0
    //                         };
    //                     }
    //                     statusContainer.innerHTML = `
    //                     <pre>
    //                         <h3>유저 정보</h3>
    //                         <div>id : ${infos.id}</div>
    //                         <div>name : ${infos.name}</div>
    //                         <div>level : ${status.level}</div>
    //                         <div>rank : ${status.rank}</div>
    //                         <div>rate : ${status.rate}</div>
    //                         <div>win : ${status.win}</div>
    //                         <div>lose : ${status.lose}</div>
    //                     </pre>
    //                     `;
    //                 }
    //             } else {
    //                 console.log("status 요청 실패");
    //                 alert("status 요청 실패");
    //                 //이하 테스트용. 스테이터스 요청 정상 동작시 삭제
    //                 const statusContainer = this.$parent.querySelector('#status');
    //                 const status = {
    //                     level : 0,
    //                     rank : 0,
    //                     rate : 0,
    //                     win : 0,
    //                     lose : 0
    //                 };
    //                 statusContainer.innerHTML = `
    //                     <pre>
    //                         <h3>유저 정보(테스트용)</h3>
    //                         <div>id : ${infos.id}</div>
    //                         <div>name : ${infos.name}</div>
    //                         <div>level : ${status.level}</div>
    //                         <div>rank : ${status.rank}</div>
    //                         <div>rate : ${status.rate}%(${status.win}/${status.lose})</div>
    //                     </pre>
    //                     `;
    //             }
    //         })
    //         .catch(error => {
    //             console.log("status 요청 실패", error);
    //         });
    //         this.buttoncheck.status = true;
    //     }
    // }

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
            // alert("매치 히스토리를 요청합니다.");
            // const infos = this.infos;
            fetch('/match/history/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            })
            .then(response => {
                if (response.ok) {
                    response.json().then(matchHistory => {
                        console.log("매치 히스토리 요청 성공");
                        const matchHistoryContainer = this.$parent.querySelector('#matchHistory');
                        if (!matchHistory || matchHistory.length === 0) {
                            console.log("매치 히스토리 데이터 없음");
                            matchHistoryContainer.innerHTML = "<p>매치 히스토리가 없습니다.</p>";
                            return;
                        }
                        let htmlContent = '<h3>매치 히스토리</h3>';
                        matchHistory.forEach(match => {
                            const winnerNickname = match.win_user.nickname;
                            const loserNickname = match.lose_user ? match.lose_user.nickname : "부전승";
                            const winnerScore = match.winner_score;
                            const loserScore = match.loser_score;
                            const createdAt = new Date(match.created_at).toLocaleDateString();
                            htmlContent += `
                            <div style="border: 1px solid black; padding: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                                <div style="flex: 1; background-color: ${match.is_walkover ? 'white' : 'blue'}; color: white; padding: 10px;">
                                    <p>${winnerNickname}</p>
                                    <img src="${match.win_user.image}" alt="유저 사진" style="width: 50px; height: 50px;">
                                    <p>${winnerScore}</p>
                                </div>
                                <div style="flex: 1; text-align: right; background-color: ${match.is_walkover ? 'white' : 'red'}; color: white; padding: 10px;">
                                    <p>${loserNickname}</p>
                                    <img src="${match.lose_user ? match.lose_user.image : ''}" alt="유저 사진" style="width: 50px; height: 50px;">
                                    <p>${loserScore}</p>
                                </div>
                            </div>
                            <div style="border-bottom: 1px solid black; padding: 5px;">
                                <p>매치 생성일: ${createdAt}</p>
                            </div>
                            `;
                        });
                        matchHistoryContainer.innerHTML = htmlContent;
                        matchHistoryContainer.style.display = 'block';
                    });
                } else {
                    console.log("매치 히스토리 요청 실패");
                }
            })
            .catch(error => {
                console.log("매치 히스토리 요청 중 오류 발생", error);
            });
        }
    }

    // profilePhoto() {
    //     console.log("profilePhoto");
    //     // 서버에 프로필 사진 변경 요청
    // }

    nickname() {
        console.log("nickname");
        // 서버에 닉네임 변경 요청
        // alert("닉네임을 변경합니다.");
        console.log('token?', sessionStorage.getItem('token'));
        console.log('tokken?', this.$parent.token);
        const newNickname = prompt("새로운 닉네임을 입력하세요:");
        fetch('/account/edit-nickname', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                nickname : newNickname
            }),
        })
        .then(response => {
            if (response.ok) {
                console.log("닉네임 변경 성공");
                const tempuserinfo = JSON.parse(sessionStorage.getItem('userinfo'));
                // this.$parent.userinfo.nickname = newNickname;
                tempuserinfo.user.nickname = newNickname;
                console.log("tempuserinfo", tempuserinfo);
                sessionStorage.setItem('userinfo', JSON.stringify(tempuserinfo));
                this.$parent.userinfo = tempuserinfo;
                this.infos = tempuserinfo.user;
                console.log("this.$parent.userinfo", this.$parent.userinfo);
                this.updateNicknameUI(newNickname);
            } else {
                console.error("닉네임 변경 실패");
                // 실패한 경우에 대한 처리 추가
            }
        })
    }

    updateNicknameUI(newNickname) {
        const nicknameButton = document.querySelector('.Nickname');
        if (nicknameButton) {
            nicknameButton.textContent = newNickname; // 변경된 닉네임으로 텍스트 업데이트
        }
        console.log(this.buttoncheck.userinfo, "button true?");
        if (this.buttoncheck.userinfo === true) {
            const infoContainer = this.$parent.querySelector('#info');
            if (infoContainer) {
                infoContainer.querySelector('div:nth-child(4)').textContent = 'nickname : ' + newNickname; // 변경된 닉네임으로 텍스트 업데이트
            }
        }
    }

    profilePhoto() {
        console.log("profilePhoto");
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.click();

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('profileImage', file);

            fetch('/account/edit-image', {
                method: 'POST',
                headers: {
                    'authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    return fetch('/account/me', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': 'Bearer ' + sessionStorage.getItem('token'),
                        }});
                } else {
                    throw new Error('이미지 업로드 실패');
                }
            })
            .then(async response => {
                const tempuserinfo = await response.json();
                sessionStorage.setItem('userinfo', JSON.stringify(tempuserinfo));
                console.log('이미지 업로드 성공', response);
                const infos = JSON.parse(sessionStorage.getItem('userinfo'));
                const imageUrl = infos.user.image // 변경된 이미지 URL로 업데이트
                this.$parent.userinfo = tempuserinfo;
                this.infos = tempuserinfo.user;
                this.updateProfilePhotoUI(imageUrl); // UI 업데이트 함수 호출
            })
            .catch(error => {
                console.error('이미지 업로드 실패', error);
                // 실패한 경우에 대한 처리 추가
            });
        });
    }

    updateProfilePhotoUI(imageUrl) {
        const profilePhotoButton = document.querySelector('.ProfilePhoto');
        console.log("imageUrl", imageUrl);
        if (profilePhotoButton) {
            profilePhotoButton.querySelector('img').src = imageUrl; // 변경된 이미지 URL로 프로필 사진 업데이트
        }
        const navPhoto = document.querySelector('.navPhoto');
        if (navPhoto) {
            navPhoto.querySelector('img').src = imageUrl; // 변경된 이미지 URL로 프로필 사진 업데이트
        }
    }

    Sighf() {
        const newSigh = prompt("현재 심정은?");
        this.$parent.sigh = newSigh;
        this.sigh = newSigh;
        const SighButton = document.querySelector('.Sigh');
        if (SighButton) {
            SighButton.textContent = newSigh; // 변경된 심정으로 텍스트 업데이트
        }
        sessionStorage.setItem('sigh', newSigh);
    }
}

