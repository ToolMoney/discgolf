import {useSetPath} from '../hooks';
import {useOutletContext} from 'react-router-dom';
import {addDisc as addDiscApi} from '../api/disc';


export default function AddDiscForm() {
    const [discs, setDiscs] = useOutletContext();
    const setPath = useSetPath();

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const discToAdd = Object.fromEntries(formData.entries());
        discToAdd.inBag = true;
        for (let prop in discToAdd) {
            if (discToAdd[prop] === "") {
                discToAdd[prop] = null;
            }
        }
        addDisc(setPath, discs, setDiscs, discToAdd);
    }
    return (
        <form method="post" className="" onSubmit={handleSubmit}>

            <div className="row g-2 align-items-center">
                <div className="col-1">
                    <label htmlFor="inputDiscName" className="form-label">Name: </label>
                </div>
                <div className="col-auto">
                    <input name="name" id="inputDiscName" className="form-control" required />
                </div>
            </div>

            <div className="row g-2 align-items-center">
                <div className="col-1">
                    <label htmlFor="inputDiscSpeed" className="form-label">Speed: </label>
                </div>
                <div className="col-auto">
                    <input name="speed" id="inputDiscSpeed" className="form-control" type="number" />
                </div>
            </div>

            <div className="row g-2 align-items-center">
                <div className="col-1">
                    <label htmlFor="inputDiscGlide" className="form-label">Glide: </label>
                </div>
                <div className="col-auto">
                    <input name="glide" id="inputDiscGlide" className="form-control" type="number" />
                </div>
            </div>

            <div className="row g-2 align-items-center">
                <div className="col-1">
                    <label htmlFor="inputDiscTurn" className="form-label">Turn: </label>
                </div>
                <div className="col-auto">
                    <input name="turn" id="inputDiscTurn" className="form-control" type="number" />
                </div>
            </div>

            <div className="row g-2 align-items-center">
                <div className="col-1">
                    <label htmlFor="inputDiscFade" className="form-label">Fade: </label>
                </div>
                <div className="col-auto">
                    <input name="fade" id="inputDiscFade" className="form-control" type="number" />
                </div>
            </div>
            
            <button type="button" className="btn btn-secondary"onClick={() => setPath("..")}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add</button>
        </form>
    );
}


function addDisc(setPath, discs, setDiscs, discToAdd) {
    addDiscApi(discToAdd).then((newDisc) => {
        setDiscs([...discs, newDisc]);
    });
    setPath("..");
}

