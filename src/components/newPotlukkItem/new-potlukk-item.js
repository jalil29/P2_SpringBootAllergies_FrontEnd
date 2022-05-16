import { useState } from "react";


export default function NewPotlukkItem(props) {
    const baseURL = "http://p2springallergies.eba-qpc77jse.us-east-2.elasticbeanstalk.com/";

    const [itemDescription, setItemDescription] = useState("");
    const [guestName, setGuestName] = useState("");

    const isOwner = props.isOwner;
    const currUser = props.currUser;
    const currPotluck = props.currPotluck;
    const refreshPotluckItems = props.refreshPotluckItems;

    function saveItemDescription(event) {
        setItemDescription(event.target.value);
    }

    function saveGuestName(event) {
        setGuestName(event.target.value);
    }

    async function onAddNewItem() {
        const newItem = { "status": "", "description": itemDescription, "pid": currPotluck.pid, "supplier": null };
        if (!currUser.userid && !guestName && !isOwner()) {
            alert('Need to be signed in or provide a guest name to add item.');
            return;
        } else if (isOwner()) {
            newItem.status = "ownerWanted";
        } else {
            newItem.supplier = guestName || currUser.username;
            newItem.status = "guestProvided";
        }

        const response = await fetch(`${baseURL}items`, {
            method: "POST",
            body: JSON.stringify(newItem),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.itemId) {
            refreshPotluckItems(currPotluck);
            setItemDescription("");
            setGuestName("");
        }
    }

    return (
        <>
            <tr>
                <td>{isOwner() ? "ownerWanted" : "guestProvided"}</td>
                <td><input type="text" placeholder="new item description" onInput={saveItemDescription} value={itemDescription} /></td>
                <td><input disabled={currUser.username} type="text" placeholder={currUser.username ? 'none' : "your name..."} onChange={saveGuestName} /></td>
                <td><span className="clickable" onClick={onAddNewItem}>Add Item</span></td>
            </tr>
        </>
    );
}