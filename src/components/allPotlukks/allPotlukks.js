import { useEffect } from "react";


import './allPotlukks.css';



export default function AllPotlukks(props) {

    const potlucks = props.potluckList;
    const selectPotluck = props.onSelectPotluck;

    function setCurrentPotluck(potluck) {
        console.log("Potluck:");
        console.log(potluck);
        selectPotluck(potluck);
    }

    const potluckRows = potlucks.map(p => <button onClick={() => setCurrentPotluck(p)} type="button" key={p.pid} className="potluckSelectors">{p.pid} {new Date(p.time).toDateString()}</button>);

    return (
        <>
            <div className="potluckChoices">
                {potluckRows}
            </div>
        </>
    );
}