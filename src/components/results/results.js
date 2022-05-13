import { useEffect, useState } from "react";


export default function Results(props) {
    const [guestName, setGuestName] = useState("");

    const currUser = props.currUser || [];
    const potluck = props.currPotluck || [];
    const potluckItems = props.potluckItems || [];

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
        const response = await fetch("http://localhost:5000/item", {
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

            return <><button onClick={() => { ownerClaimItem(item); }}>Claim</button> </>;
        }

        return <><input type="text" onInput={saveGuestName} /><button onClick={() => { guestClaimItem(item); }}>Claim</button></>;
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
                    </tbody>
                </table>
            </>
        );
    }

    return (
        <>
            <span>
                {currUser.username && <><button>Create Potluck</button></>}
                {currUser.userid && currUser.userid === potluck.creatorid && <><button>Delete Potluck</button></>}
                {potluck.pid && <><button>Add Item</button></>}
            </span>
            {
                potluck.pid ? displayPotluckTable() : <div>No potlucks to display!</div>
            }
        </>
    );
}