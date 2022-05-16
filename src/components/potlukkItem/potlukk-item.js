import { useState } from "react";


export default function PotlukkItem(props) {
    const baseURL = "http://p2springallergies.eba-qpc77jse.us-east-2.elasticbeanstalk.com/";

    const [guestName, setGuestName] = useState("");
    const item = props.item;
    const isOwner = props.isOwner;
    const refreshPotluckItems = props.onRefreshItems;
    const currPotluck = props.currPotluck;
    console.log(currPotluck);
    const currUser = props.currUser || {};


    async function onDeleteItem(item) {
        console.log(item);
        const response = await fetch(`${baseURL}items/${item.itemId}`, {
            method: "DELETE"
        });
        const status = await response.status;
        if (status === 200) {
            refreshPotluckItems(currPotluck);
        }
    }

    function saveGuestName(event) {
        setGuestName(event.target.value);
    }

    function itemClaimField(item) {
        if (item.supplier) {
            return "";
        }

        if (isOwner()) {

            return <><span className="clickable" onClick={() => { ownerClaimItem(item); }}>Claim</span> </>;
        }

        return <><input type="text" onInput={saveGuestName} value={guestName} placeholder="your name..." /><span className="clickable" onClick={() => { guestClaimItem(item); }}>Claim</span></>;
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
        console.log(currUser);
        if (!currUser.username) {
            return;
        }
        const newItem = { ...item };
        newItem.status = "guestProvided";
        newItem.supplier = currUser.username;
        onClaimItem(newItem);
    }

    async function onClaimItem(item) {
        const response = await fetch(`${baseURL}items`, {
            method: "POST",
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const returned = await response.json();
        if (returned.itemId && returned.supplier) {
            refreshPotluckItems(currPotluck);
        }
    }

    return (
        <>
            <tr key={item.itemId}>
                <td>{item.status}</td>
                <td>{item.description}</td>
                <td>{item.supplier ? item.supplier : "None"}</td>
                <td>
                    {itemClaimField(item)}
                    {
                        isOwner() && <><span className="clickable" onClick={() => onDeleteItem(item)}>Delete</span></>
                    }
                </td>
            </tr>
        </>
    );
}