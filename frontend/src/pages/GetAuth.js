// src/pages/GetAuth.js

import Component from "../core/Component.js";

export default class GetAuth extends Component {

    constructor(ObjectForDI) {
        super(ObjectForDI.$parent, ObjectForDI.setState, ObjectForDI.state);
        const url = null;
    }

    template() {
        console.log("GetAuth template");
        return `
            <title>GetAuth</title>
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
            sessionStorage.setItem('auth', 'true');
            sessionStorage.setItem('token', token);
            // this.setState({locate: '/src/pages/Main'});
            return fetch('/account/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + sessionStorage.getItem('token'),
            }})
        })
        .then(async response => {
            console.log("response", response);
            const infos = await response.json();
            console.log(infos);
            this.$parent.userinfo = JSON.stringify(infos);
            sessionStorage.setItem('userinfo', JSON.stringify(infos));
            this.setState({ locate: '/src/pages/Main'});
        });
        // this.setState({ locate: '/src/pages/Main'});
    }
}