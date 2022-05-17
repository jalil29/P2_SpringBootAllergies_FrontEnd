import Banner from '../banner/banner';
import SearchArea from '../searchArea/searchArea';
import AllPotlukks from '../allPotlukks/allPotlukks';
import Results from '../results/results';
import './potlukk.css';
import { useEffect, useState } from "react";


export default function Potlukk() {
    const baseURL = "http://p2springallergies.eba-qpc77jse.us-east-2.elasticbeanstalk.com/";

    const [potlucks, setPotlucks] = useState([]);
    const [currPotluck, setCurrentPotluck] = useState({});
    const [potluckItems, setPotluckItems] = useState([]);
    const [currUser, setCurrUser] = useState({});

    async function getAllPotlucks() {
        console.log(`${baseURL}potlucks`);
        const response = await fetch(`${baseURL}potlucks`);
        const body = await response.json();
        setPotlucks(body);
        setCurrentPotluck(body[0]);
        getAllPItems(body[0]);
    }

    function savePotlucks(potlucks) {
        setPotlucks(potlucks);
    }

    async function getAllPItems(potluck) {
        const response = await fetch(`${baseURL}items/${potluck.pid}`);
        const itemsList = await response.json();
        setPotluckItems(itemsList);
    }

    function onCreatePotluck(potluck) {
        setPotlucks([...potlucks, potluck]);
        setCurrentPotluck(potluck);
        console.log(potluck);
    }

    function onSelectPotluck(potluck) {
        setCurrentPotluck(potluck);
        getAllPItems(potluck);
    }

    function onChangeUser(newUser) {
        console.log(`new user ${newUser || {}}`);
        setCurrUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser || "{}"));
    }

    useEffect(() => {
        getAllPotlucks();
        console.log('finding current user');
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser && currentUser.username) {
            setCurrUser(currentUser);
        } else {
            setCurrUser({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <SearchArea currUser={currUser} currPotluck={currPotluck} setPotluck={savePotlucks} />
                </div>
                <div className="allPotlukks">
                    <AllPotlukks onSelectPotluck={onSelectPotluck} potluckList={potlucks} />
                </div>
                <div className="results">
                    <Results currPotluck={currPotluck} currUser={currUser} potluckItems={potluckItems} onPotlucksRefresh={getAllPotlucks} onSetPotluck={onCreatePotluck} onItemsUpdate={getAllPItems} />
                </div>
            </div>
        </>
    );
}