// src/apps/profilestyle.js

export default function injectProfileStyles() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
    }

    .profile-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #fff;
        border-radius: 8px;
        margin: 20px auto;
        padding: 20px;
        max-width: 600px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .user-details {
        display: flex;
        width: 70%;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
    }

    .user-info img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .buttons {
        display: flex;
        justify-content: space-around;
        width: 100%;
    }

    button {
        padding: 10px;
        cursor: pointer;
    }

    .ProfilePhoto {
        width: 120px;
        height: 120px;
        background-color: #fff;
        border: 1px solid #000;
        border-radius: 50%;
        padding: 0;
    }

    .ProfilePhoto img {
        width: 100%; /* 이미지를 부모 요소에 맞게 확장 */
        height: 100%; /* 이미지의 세로 비율 유지 */
        border-radius: 50%; /* 이미지를 원형으로 자르기 */
        overflow: hidden; /* 이미지를 래핑하는 부모 요소에 overflow: hidden; 적용 */
        margin: 0px; /* 이미지를 부모 요소에 맞게 확장하기 위해 마진을 음수로 설정 */
    }

    .Nickname {
        background-color: #fff;
        border: 1px solid #000;
        font-size: 1.2em;
        font-weight: bold;
    }

    .Sigh {
        color: #777;
        background-color: #fff;
        border: 1px solid #000;
        font-size: 0.8em;
        font-weight: tilt;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .dropdown-content {
        display: none;
        text-align: left;
        padding: 50px;
        width: 100%;
    }

    button.active + .dropdown-content {
        display: block;
    }
    `;
    document.head.appendChild(style);
}

// export default function injectProfileStyles() {
//     const style = document.createElement('style');
//     style.type = 'text/css';
//     style.innerHTML = `
//     body {
//         font-family: 'Arial', sans-serif;
//         background-color: #f4f4f4;
//         margin: 0;
//         padding: 0;
//     }

//     .profile-container {
//         text-align: center;
//         background-color: #fff;
//         border-radius: 8px;
//         margin: 20px auto;
//         padding: 20px;
//         max-width: 400px;
//         box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//     }

//     .user-info {
//         margin-bottom: 20px;
//     }

//     .user-info img {
//         width: 80px;
//         height: 80px;
//         border-radius: 50%;
//     }

//     .user-info .name {
//         font-size: 1.2em;
//         font-weight: bold;
//     }

//     .user-info .level {
//         color: #777;
//     }

//     .user-info .joined {
//         color: #aaa;
//         font-size: 0.9em;
//     }

//     .buttons {
//         display: flex;
//         flex-direction: column;
//     }

//     button {
//         padding: 10px;
//         margin: 5px 0;
//         cursor: pointer;
//     }

//     .dropdown-content {
//         display: none;
//         text-align: left;
//         padding: 10px;
//     }

//     button.active + .dropdown-content {
//         display: block;
//     }
//     `;
//     document.head.appendChild(style);
// }