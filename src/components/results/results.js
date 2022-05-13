



export default function Results(props) {

    const potluck = props.currPotluck;
    console.log(potluck);
    const potluckItems = [];
    return (
        <>
            <table>
                <thead>
                    <tr><th>pID</th><th>Time</th><th>CreatorID</th></tr>
                </thead>

                <tbody>
                    <tr key={potluck.pid}>
                        <td>{potluck.pid}</td>
                        <td>{(new Date(potluck.time)).toDateString()}</td>
                        <td>{potluck.creatorid}</td>
                    </tr>
                </tbody>
            </table>
            <div className="itemDisplay">
                {
                    // potluckItems will be set up here.
                }
            </div>

        </>
    );
}