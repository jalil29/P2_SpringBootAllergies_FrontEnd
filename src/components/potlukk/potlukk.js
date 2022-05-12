import Banner from '../banner/banner';
import SearchArea from '../searchArea/searchArea';
import AllPotlukks from '../allPotlukks/allPotlukks';
import Results from '../results/results';
import './potlukk.css';


export default function Potlukk() {
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
                    <AllPotlukks />
                </div>
                <div className="results">
                    <Results />
                </div>
            </div>
        </>
    );
}