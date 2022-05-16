import { useState } from "react";
import NewPotlukkItem from "../newPotlukkItem/new-potlukk-item";
import PotlukkItem from "../potlukkItem/potlukk-item";

export default function Results(props) {
    const baseURL = "http://p2springallergies.eba-qpc77jse.us-east-2.elasticbeanstalk.com/";

    const [newPotluckDate, setNewPotluckDate] = useState({});

    const potluckItems = props.potluckItems || [];
    const currUser = props.currUser || [];
    const potluck = props.currPotluck || [];
    const setCurrPotluck = props.onSetPotluck;
    const refreshPotluckItems = props.onItemsUpdate;

    function isOwner() {
        return currUser.userid === potluck.creatorid;
    }

    async function createPotluck() {
        if (!newPotluckDate) {
            alert('Need to provide a date to create a potluck');
            return;
        }

        const newPotluck = { "time": newPotluckDate.getTime(), "creatorid": currUser.userid };
        const response = await fetch(`${baseURL}potlucks`, {
            method: "POST",
            body: JSON.stringify(newPotluck),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        console.log(result);
        if (result && result.pid) {
            setCurrPotluck(result);
            console.log(result);
        }
    }

    function savePotluckTime(event) {
        setNewPotluckDate(new Date(event.target.value));
    }

    async function deletePotluck() {
        const response = await fetch(`${baseURL}potlucks/${potluck.pid}`, {
            method: "DELETE"
        });

        const status = await response.status();
        if (status === 204) {
            console.log(status);
        }
    }

    function displayPotluckTable() {
        return (
            <>
                <table>
                    <thead>
                        <tr><th>pID</th><th>Time</th><th>CreatorID</th></tr>
                    </thead>

                    <tbody>
                        <tr key={potluck.pid}>
                            <td>{potluck.pid}</td>
                            <td>{(new Date(potluck.time)).toDateString()}</td>
                            <td>{potluck.creatorid}</td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <thead>
                        <tr>
                            <th>Item Status</th>
                            <th>Item Description</th>
                            <th>Supplier</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            potluckItems.map(i => <PotlukkItem key={i.itemId} currPotluck={potluck} item={i} isOwner={isOwner} onRefreshItems={refreshPotluckItems} />)
                        }
                        <NewPotlukkItem isOwner={isOwner} currUser={currUser} currPotluck={potluck} refreshPotluckItems={refreshPotluckItems} />
                    </tbody>
                </table>
            </>
        );
    }

    return (
        <>
            <span>
                {isOwner() && <>
                    <input name="potluckDate" type='date' onInput={savePotluckTime} min={new Date().toISOString().split("T")[0]} />
                    <label className="clickable" htmlFor="potluckDate" onClick={createPotluck}>Create Potluck</label>
                </>}
                {isOwner() && <><span className="clickable" onClick={deletePotluck}>Delete Potluck</span></>}
            </span>
            {
                potluck.pid ? displayPotluckTable() : <div>No potlucks to display!</div>
            }
        </>
    );
}