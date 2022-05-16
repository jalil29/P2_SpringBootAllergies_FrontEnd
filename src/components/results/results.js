import { useEffect, useState } from "react";

const baseURL = "http://p2springallergies.eba-qpc77jse.us-east-2.elasticbeanstalk.com/";

export default function Results(props) {
    const [guestName, setGuestName] = useState("");
    const [newPotluckDate, setNewPotluckDate] = useState({});
    const [newItemDescription, setNewItemDescription] = useState("");

    const potluckItems = props.potluckItems || [];
    const currUser = props.currUser || [];
    const potluck = props.currPotluck || [];
    const setCurrPotluck = props.onSetPotluck;
    const refreshPotluckItems = props.onItemsUpdate;

    function isOwner() {
        return currUser.userid === potluck.creatorid;
    }

    function saveGuestName(event) {
        setGuestName(event.target.value);
    }

    function guestClaimItem(item) {
        if (!guestName) {
            return;
        }

        const newItem = { ...item };
        newItem.status = "guestProvided";
        newItem.supplier = guestName;
        // update the item with the supplier name
        onClaimItem(newItem);
    }

    function ownerClaimItem(item) {
        if (!currUser.username) {
            return;
        }
        const newItem = { ...item };
        newItem.status = "guestProvided";
        newItem.supplier = currUser.username;
        onClaimItem(newItem);
    }

    async function onClaimItem(item) {
        const response = await fetch(`${baseURL}item`, {
            method: "POST",
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const returned = await response.json();
        if (returned.itemId && returned.supplier) {
            refreshPotluckItems(potluck);
        }
    }

    function itemClaimField(item) {
        if (item.supplier) {
            return "";
        }

        if (currUser && potluck && currUser.userid === potluck.creatorid) {

            return <><span className="clickable" onClick={() => { ownerClaimItem(item); }}>Claim</span> </>;
        }

        return <><input type="text" onInput={saveGuestName} value={guestName} placeholder="your name..." /><span className="clickable" onClick={() => { guestClaimItem(item); }}>Claim</span></>;
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

    function saveNewItemDescription(event) {
        setNewItemDescription(event.target.value);
    }

    async function onAddNewItem() {
        const newItem = { "status": "", "description": newItemDescription, "pid": potluck.pid, "supplier": null };
        console.log("Test");
        if (!currUser.userid && !guestName && !isOwner()) {
            return;
        } else if (isOwner()) {
            newItem.status = "ownerWanted";
        } else {
            newItem.supplier = guestName || currUser.username;
            newItem.status = "guestProvided";
        }

        const response = await fetch("http://localhost:5000/items", {
            method: "POST",
            body: JSON.stringify(newItem),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.itemId) {
            refreshPotluckItems(potluck);
            setNewItemDescription("");
            setGuestName("");
        }
    }

    async function onDeleteItem(item) {
        console.log(item);
        const response = await fetch(`http://localhost:5000/items/${item.itemId}`, {
            method: "DELETE"
        });
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
                            potluckItems.map(i =>
                                <tr key={i.itemId}>
                                    <td>{i.status}</td>
                                    <td>{i.description}</td>
                                    <td>{i.supplier ? i.supplier : "None"}</td>
                                    <td>
                                        {itemClaimField(i)}
                                        {
                                            isOwner() && <><span className="clickable" onClick={() => onDeleteItem(i)}>Delete</span></>
                                        }
                                    </td>
                                </tr>
                            )
                        }
                        <tr>
                            <td>{isOwner() ? "ownerWanted" : "guestProvided"}</td>
                            <td><input type="text" placeholder="new item description" onInput={saveNewItemDescription} value={newItemDescription} /></td>
                            <td><input disabled={currUser.username} type="text" placeholder={currUser.username ? 'none' : "your name..."} onChange={saveGuestName} value={guestName} /></td>
                            <td><span className="clickable" onClick={onAddNewItem}>Add Item</span></td>
                        </tr>
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