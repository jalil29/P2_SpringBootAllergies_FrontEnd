import { useState } from "react";

import './banner.css';

export default function Banner(props = {}) {
    const baseURL = "http://p2springallergies.eba-qpc77jse.us-east-2.elasticbeanstalk.com/";

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
            alert('Need to give a username and password to login');
            return;
        }

        const loginUser = JSON.stringify({ username, password });
        const response = await fetch(`${baseURL}login`, {
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
            alert('Need to give a username and password to sign up');
            return;
        }
        const newUser = JSON.stringify({ username, password });
        const response = await fetch(`${baseURL}users`, {
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
            return <div className="login"><div className="welcome">Welcome, {user.username}!</div><div className="clickable" onClick={onSignOut}>Sign out</div></div>;
        }

        return <>
            <div className="login">

                <label htmlFor="username">Username</label>
                <input type="text" name="username"  minLength={8} maxLength={50} pattern="^[a-zA-Z0-9_-]*$" onInput={onUsernameChange} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password"  minLength={8}  maxLength={50} pattern="^[a-zA-Z0-9_-]*$" onInput={onPasswordChange} />


                <div className="clickable" onClick={attemptLogin}>Login</div>
                <div className="label"> or </div>
                <div className="clickable" onClick={attemptSignUp}>Sign up</div>
            </div>
        </>;
    }

    return (
        <>
            <div className="image">

                <h1>Spring Allergies Potlukk</h1>
            <div className="image">
                {displayLogin()}

            </div>
            </div>
        </>
    );
}
