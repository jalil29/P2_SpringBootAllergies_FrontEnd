





export default function AllPotlukks(props) {

const potlucks = props.potluckList;
const getAllPotlucks = props.AllPotlukks;

const potluckRows = potlucks.map(p => <button type="button">{p.pid} {new Date(p.time).toDateString()}</button> )


    return (
        <>
            <div>
           {potluckRows}
            

            </div>
        </>
    );
}