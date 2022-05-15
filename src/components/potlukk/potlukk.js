import Banner from '../banner/banner';
import SearchArea from '../searchArea/searchArea';
import AllPotlukks from '../allPotlukks/allPotlukks';
import Results from '../results/results';
import './potlukk.css';
import { useEffect, useState } from "react";

export default function Potlukk() {

    const [potlucks, setPotlucks] = useState([]);
    const [currPotluck, setCurrentPotluck] = useState({});
    const [potluckItems, setPotluckItems] = useState([]);
    const [currUser, setCurrUser] = useState({});

    async function getAllPotlucks() {
        const response = await fetch("http://www.localhost:5000/potlucks");
        const body = await response.json();
        setPotlucks(body);
        setCurrentPotluck(body[0]);
        getAllPotluckItems(body[0]);
    }

    async function getAllPotluckItems(potluck) {
        const response = await fetch(`http://www.localhost:5000/items/${potluck.pid}`);
        const itemsList = await response.json();
        setPotluckItems(itemsList);
    }

    function onCreatePotluck(potluck) {
        setPotlucks([...potlucks, potluck]);
        setCurrentPotluck(potluck);
    }

    function onChangeUser(newUser) {
        console.log(`new user ${newUser || {}}`);
        setCurrUser(newUser);
        sessionStorage.setItem("user", JSON.stringify(newUser || "{}"));
    }

    useEffect(() => {
        getAllPotlucks();
    }, []);

    return (
        <>
            <div className="container">
                <div className="header">
                    <div className="banner">
                        <Banner currUser={currUser} onChangeUser={onChangeUser} />
                    </div>
                </div>
                <div className="searchArea">
                    <SearchArea currUser={currUser} currPotluck={currPotluck} />
                </div>
                <div className="allPotlukks">
                    <AllPotlukks onSelectPotluck={setCurrentPotluck} potluckList={potlucks} />
                </div>
                <div className="results">
                    <Results currPotluck={currPotluck} currUser={currUser} potluckItems={potluckItems} onSetPotluck={onCreatePotluck} />
                </div>
            </div>
        </>
    );
}