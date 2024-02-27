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
        background-color: #fff;
        border: 1px solid #000;
        border-radius: 50%;
    }

    .Nickname {
        background-color: #fff;
        border: 1px solid #000;
        font-size: 1.2em;
        font-weight: bold;
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