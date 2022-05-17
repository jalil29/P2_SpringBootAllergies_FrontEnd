import './searchArea.css';
import { useState } from "react";

export default function SearchArea(props = {}) {
    const baseurl = "http://p2springallergies.eba-qpc77jse.us-east-2.elasticbeanstalk.com/";

    const setPotluck = props.setPotluck;
    const [creatorid, setCreatorID] = useState("");
    const [pid, setPID] = useState("");

    function savedPId(event) {
        setPID(event.target.value);
    }

    function savedCreatorId(event) {
        setCreatorID(event.target.value);
    }

    async function getPotlukksByCreator() {
        console.log(creatorid);
        const response = await fetch(`${baseurl}potlucks?creatorid=${creatorid}`);
        const body = await response.json();
        console.log(body);
        setPotluck(body);
    }


    async function getPotlukksByPID() {
        console.log(pid);
        const response = await fetch(`${baseurl}potlucks?pid=${pid}`);
        const body = await response.json();
        console.log(body);
        setPotluck(body);
    }

    return (
        <><div className="searchArea">
            <div className="searchItems">
                <input type="text" onInput={savedPId} />
                <button onClick={getPotlukksByPID}> Search By Potluck ID </button>
                <p></p>
                <input type="text" onInput={savedCreatorId} />
                <button onClick={getPotlukksByCreator}> Search By Creator </button>
                <p></p>

            </div>
            </div>
        </>
    );
}