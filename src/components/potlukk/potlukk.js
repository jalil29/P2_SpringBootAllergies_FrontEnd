import Banner from '../banner/banner';
import SearchArea from '../searchArea/searchArea';
import AllPotlukks from '../allPotlukks/allPotlukks';
import Results from '../results/results';
import './potlukk.css';
import { useEffect, useState } from "react";




export default function Potlukk() {

    const [potlucks, setPotlucks] = useState([]);
    const [currPotluck, setCurrentPotluck] = useState({});

    async function getAllPotlucks() {
        const response = await fetch("http://www.localhost:5000/potlucks");
        const body = await response.json();
        setPotlucks(body);
        setCurrentPotluck(body[0]);
    }

    useEffect(() => {
        // Refreshes the potlucks list every 10 minutes
        // could change the timespan, or remove altogether
        // removing all together could mean we might want a refresh
        // everytime the user selects things
        //setTimeout(getAllPotlucks, 600000);
        getAllPotlucks();

    }, []);



    return (
        <>
            <div className="container">
                <div className="header">
                    <div className="banner">
                        <Banner />
                    </div>
                </div>
                <div className="searchArea">
                    <SearchArea />
                </div>
                <div className="allPotlukks">
                    <AllPotlukks onSelectPotluck={setCurrentPotluck} potluckList={potlucks} />
                </div>
                <div className="results">
                    <Results currPotluck={currPotluck} />
                </div>
            </div>
        </>
    );
}