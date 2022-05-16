import { useEffect, useState } from "react";

import './banner.css';


export default function Banner(props = {}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const user = props.currUser;
    const onChangeUser = props.onChangeUser;

    function onUsernameChange(event) {
        setUsername(event.target.value);
    }

    function onPasswordChange(event) {
        setPassword(event.target.value);
    }

    async function attemptLogin() {
        if (!username || !password) {

            return;
        }

        const loginUser = JSON.stringify({ username, password });
        const response = await fetch("http://localhost:5000/login", {
            body: loginUser,
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const result = await response.json();
        if (result.username) {
            onChangeUser(result);
            setUsername("");
            setPassword("");
        }
    }

    async function attemptSignUp() {
        if (!username || !password) {
            return;
        }
        const newUser = JSON.stringify({ username, password });
        const response = await fetch('http://localhost:5000/users', {
            body: newUser,
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.username) {
            onChangeUser(result);
            setUsername("");
            setPassword("");
        }
    }

    function onSignOut() {
        console.log("Sign out!");
        onChangeUser();
    }

    function displayLogin() {
        if (user && user.username) {
            return <div className="login">Welcome, {user.username}!<div className="clickable" onClick={onSignOut}>Sign out</div></div>;
        }

        return <>
            <div className="login">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" onInput={onUsernameChange} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" onInput={onPasswordChange} />

                <div className="clickable" onClick={attemptLogin}>Login</div> or
                <div className="clickable" onClick={attemptSignUp}>Sign up</div>
            </div>
        </>;
    }

    return (
        <>
            <div className="image">
                banner
            </div>
            <div>
                {displayLogin()}
            </div>
        </>
    );
}