import { useEffect } from "react";


import './allPotlukks.css';



export default function AllPotlukks(props) {

    const potlucks = props.potluckList;
    const selectPotluck = props.onSelectPotluck;

    function setCurrentPotluck(potluck) {
        selectPotluck(potluck);
    }

    const potluckRows = potlucks.map(p => <span onClick={() => setCurrentPotluck(p)} key={p.pid} className="potluckSelectors clickable">{p.pid} {new Date(p.time).toDateString()}</span>);

    return (
        <>
            <div className="potluckChoices">
                {potluckRows}
            </div>
        </>
    );
}