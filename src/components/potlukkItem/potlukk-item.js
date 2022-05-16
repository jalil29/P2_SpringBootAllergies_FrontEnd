const baseURL = "http://p2springallergies.eba-qpc77jse.us-east-2.elasticbeanstalk.com/";

export default function PotlukkItem(props) {
    const item = props.item;
    const isOwner = props.isOwner;
    const refreshPotluckItems = props.onRefreshItems;


    async function onDeleteItem(item) {
        console.log(item);
        const response = await fetch(`${baseURL}items/${item.itemId}`, {
            method: "DELETE"
        });
        const status = await response.status;
        if (status === 200) {
            refreshPotluckItems(potluck);
        }
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
            refreshPotluckItems(potluck);
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
                        isOwner() && <><span className="clickable" onClick={() => onDeleteItem(i)}>Delete</span></>
                    }
                </td>
            </tr>
        </>
    );
}