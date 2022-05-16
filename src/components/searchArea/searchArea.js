export default function SearchArea(props = {}) {
    return (
        <>
            <div className="searchItems">
                <label htmlFor="creatorid">By Creator</label>
                <input type="text" name="creatorid" />
                <label htmlFor="potluckid">By Potluck</label>
                <input type="text" name="potluckid" />
            </div>
        </>
    );
}