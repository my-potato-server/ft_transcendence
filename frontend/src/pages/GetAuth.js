// src/pages/GetAuth.js

import Component from "../core/Component.js";

export default class GetAuth extends Component {

    constructor(ObjectForDI) {
        super(ObjectForDI.$parent, ObjectForDI.setState, ObjectForDI.state);
        const url = null;
        const lauth = false;
        const ltoken = null;
        const luserinfo = null;
    }

    template() {
        console.log("GetAuth template");
        return `
            <button style="background-image: url('https://ntcube.co.kr/img/loading-gears.gif');background-size: cover;background-repeat: no-repeat;width:100%;height:2000px"></button>
        `;
    }

    setEvent() {
        console.log('state : ', this.state);
        console.log('url : ', this.url);
        var regex = /[?&]code(=([^&#]*)|&|#|$)/;
        var results = regex.exec(this.url);
        if (!results || !results[2]) {
            var code = null;
        } else {
            var code = decodeURIComponent(results[2].replace(/\+/g, " "));
        }
        const redirect_uri = "https://localhost/src/pages/GetAuth";
        console.log("code", code);
        fetch('/api/account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code, redirect_uri })
        })
        .then(response => {
            if (response.ok) {
                console.log("로그인 성공");
                console.log("response", response);
                return response.json();
            }
            else {
                console.log("로그인 실패");
                alert("로그인 실패");
            }
        })
        .then(data => {
            const token = data.token;
            console.log("token", token);
            this.$parent.auth = true;
            this.$parent.token = token;
            // sessionStorage.setItem('auth', 'true');
            // sessionStorage.setItem('token', token);
            // this.setState({locate: '/src/pages/Main'});
            this.lauth = true;
            this.ltoken = token;
            return fetch('/account/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + token,
            }})
        })
        .then(async response => {
            console.log("response", response);
            const infos = await response.json();
            console.log(infos);
            this.luserinfo = JSON.stringify(infos);
            this.$parent.userinfo = JSON.stringify(infos);
            sessionStorage.setItem('userinfo', JSON.stringify(infos));
            // this.setState({ locate: '/src/pages/Main'});
            sessionStorage.setItem('auth', this.lauth);
            sessionStorage.setItem('token', this.ltoken);
            sessionStorage.setItem('userinfo', this.luserinfo);
            console.log("logins", this.logins);
            this.$parent.onlineSocket = new WebSocket('wss://localhost/ws/account/online/');
            this.$parent.onlineSocket.onopen = (event) => {
                const payload = JSON.stringify({ token: sessionStorage.getItem('token') });
                this.$parent.onlineSocket.send(payload);
            };
            this.setState({ locate: '/src/pages/Main'});
        });
    }
}