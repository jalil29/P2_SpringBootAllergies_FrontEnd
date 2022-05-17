import { useState } from "react";
import NewPotlukkItem from "../newPotlukkItem/new-potlukk-item";
import PotlukkItem from "../potlukkItem/potlukk-item";

export default function Results(props) {
    const baseURL = "http://p2springallergies.eba-qpc77jse.us-east-2.elasticbeanstalk.com/";

    const [newPotluckDate, setNewPotluckDate] = useState({});
    const [dateValue, setDateValue] = useState("");

    const potluckItems = props.potluckItems || [];
    const currentUser = props.currUser || [];
    const potluck = props.currPotluck || [];
    const setCurrPotluck = props.onSetPotluck;
    const refreshPotluckItems = props.onItemsUpdate;
    const refreshPotluckList = props.onPotlucksRefresh;

    function isOwner() {
        return currentUser.userid === potluck.creatorid;
    }

    async function createPotluck() {
        console.log(newPotluckDate.getTime);
        if (!newPotluckDate || !newPotluckDate.getTime) {
            alert('Need to provide a date to create a potluck');
            return;
        }

        const newPotluck = { "time": newPotluckDate.getTime(), "creatorid": currentUser.userid };
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
            setNewPotluckDate("");
            refreshPotluckItems(result);
            setDateValue("");
        }
    }

    function savePotluckTime(event) {
        console.log(event.target.value);
        setDateValue(event.target.value);
        setNewPotluckDate(new Date(event.target.value));
    }

    async function deletePotluck() {
        const response = await fetch(`${baseURL}potlucks/${potluck.pid}`, {
            method: "DELETE"
        });

        const status = await response.status;
        if (status === 204) {
            console.log(status);
            refreshPotluckList();
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
                            <td>{(new Date(potluck.time)).toISOString().split("T")[0]}</td>
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
                            potluckItems.map(i => <PotlukkItem key={i.itemId} currUser={currentUser} currPotluck={potluck} item={i} isOwner={isOwner} onRefreshItems={refreshPotluckItems} />)
                        }
                        <NewPotlukkItem isOwner={isOwner} currUser={currentUser} currPotluck={potluck} refreshPotluckItems={refreshPotluckItems} />
                    </tbody>
                </table>
            </>
        );
    }

    return (
        <>
            <span>
                {currentUser.userid && <>
                    <input name="potluckDate" type="date" onInput={savePotluckTime} min={new Date().toISOString().split("T")[0]} value={dateValue} />
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
