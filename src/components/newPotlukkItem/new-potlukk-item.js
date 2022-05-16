import { useState } from "react";

const baseURL = "http://p2springallergies.eba-qpc77jse.us-east-2.elasticbeanstalk.com/";

export default function NewPotlukkItem(props) {
    const [itemDescription, setItemDescription] = useState("");
    const [guestName, setGuestName] = useState("");

    const isOwner = props.isOwner;

    function saveItemDescription(event) {
        setItemDescription(event.target.value);
    }

    function saveGuestName(event) {
        saveGuestName(event.target.value);
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

        const response = await fetch(`${baseURL}items`, {
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

    return (
        <>
            <tr>
                <td>{isOwner() ? "ownerWanted" : "guestProvided"}</td>
                <td><input type="text" placeholder="new item description" onInput={saveItemDescription} value={itemDescription} /></td>
                <td><input disabled={currUser.username} type="text" placeholder={currUser.username ? 'none' : "your name..."} onChange={saveGuestName} value={guestName} /></td>
                <td><span className="clickable" onClick={onAddNewItem}>Add Item</span></td>
            </tr>
        </>
    );
}