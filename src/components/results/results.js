import { useEffect, useState } from "react";
import './results.css';


const baseURL = "http://p2springallergies.eba-qpc77jse.us-east-2.elasticbeanstalk.com/";

export default function Results(props) {
    const [guestName, setGuestName] = useState("");
    const [newPotluckDate, setNewPotluckDate] = useState({});

    const currUser = props.currUser || [];
    const potluck = props.currPotluck || [];
    const potluckItems = props.potluckItems || [];
    const setCurrPotluck = props.onSetPotluck;

    function saveGuestName(event) {
        setGuestName(event.target.value);
    }

    function guestClaimItem(item) {
        if (!guestName) {
            return;
        }

        item.status = "guestProvided";
        item.supplier = guestName;
        // update the item with the supplier name
        onClaimItem(item);
    }

    function ownerClaimItem(item) {
        if (!currUser.username) {
            return;
        }
        item.status = "guestProvided";
        item.supplier = currUser.username;
        onClaimItem(item);
    }

    async function onClaimItem(item) {
        const response = await fetch(`${baseURL}item`, {
            method: "POST",
            body: JSON.stringify(item),
            header: {
                'Content-Type': 'application/json'
            }
        });
    }

    function itemClaimField(item) {
        if (item.supplier) {
            return "";
        }

        if (currUser && potluck && currUser.userid === potluck.creatorid) {

            return <><span className="clickable" onClick={() => { ownerClaimItem(item); }}>Claim</span> </>;
        }

        return <><input type="text" onInput={saveGuestName} /><span className="clickable" onClick={() => { guestClaimItem(item); }}>Claim</span></>;
    }

    async function createPotluck() {
        if (!newPotluckDate) {
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

        console.log(response);
        console.log(await response.body());
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
                            <th>Claim Item</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            potluckItems.map(i =>
                                <tr key={i.itemId}>
                                    <td>{i.status}</td>
                                    <td>{i.description}</td>
                                    <td>{i.supplier ? i.supplier : "None"}</td>
                                    <td>{itemClaimField(i)}</td>
                                </tr>
                            )
                        }
                        <tr>
                            <td>{currUser.userid ? "ownerWanted" : "guestProvided"}</td>
                            <td><input type="text" placeholder="new item description" /></td>
                            <td>{currUser.userid ? currUser.username : <><input type="text" placeholder="your name" /></>}</td>
                            <td><span className="clickable">Add Item</span></td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    }


    console.log(new Date().toISOString().split("T")[0]);
    return (
        <>
            <span>
                {currUser.username && <>
                    <input name="potluckDate" type='date' onInput={savePotluckTime} min={new Date().toISOString().split("T")[0]} />
                    <label className="clickable" htmlFor="potluckDate" onClick={createPotluck}>Create Potluck</label>
                </>}
                {currUser.userid && currUser.userid === potluck.creatorid && <><span className="clickable" onClick={deletePotluck}>Delete Potluck</span></>}
            </span>
            {
                potluck.pid ? displayPotluckTable() : <div>No potlucks to display!</div>
            }
        </>
    );
}