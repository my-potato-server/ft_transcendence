// src/apps/styles/friendliststyle.js

export default function injectFriendStyles() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .friend-list-container {
            position: fixed;
            top: 0;
            margin-top: 58px;
            right: -100%;
            width: 250px;
            height: 100%;
            background-color: white;
            box-shadow: -2px 0 5px rgba(0,0,0,0.5);
            transition: right 0.5s;
            overflow-y: auto;
            z-index: 1000;
        }
        .friend-list-container.visible {
            right: 0;
        }
    `;
    document.head.appendChild(style);
}