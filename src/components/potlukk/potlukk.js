import Banner from '../banner/banner';
import SearchArea from '../searchArea/searchArea';
import AllPotlukks from '../allPotlukks/allPotlukks';
import Results from '../results/results';
import './potlukk.css';
import { useEffect, useState } from "react";




export default function Potlukk() {

    const[potlucks, setPotlucks] = useState([]);

    async function getAllPotlucks(){
        const response = await fetch("http://www.localhost:5000/potlucks")
        const body = await response.json();
        setPotlucks(body);
    }

    useEffect(()=>{
        getAllPotlucks();
    },[])



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
                    <AllPotlukks potluckList={potlucks}/>
                </div>
                <div className="results">
                    <Results potluckList={potlucks}/>
                </div>
            </div>
        </>
    );
}