



export default function Results(props) {

   const potlucks = props.potluckList;

   
    const potluckRows = potlucks.map(p => <tr key={p.pid}>
            <td>{p.pid}</td>
            <td>{new Date(p.time).toDateString()}</td>
            <td>{p.creatorid}</td>
    </tr>)





   

    return (
        <>
            <table>
                <thead>
                    <tr><th>pID</th><th>Time</th><th>CreatorID</th></tr>
                </thead>

                <tbody>
                    {potluckRows}
                </tbody>
            </table>
            
        </>
    );
}