import {useState, useEffect} from 'react';
import {getDiscs, addDisc} from '../api/disc.js';
import {Outlet, Link} from 'react-router-dom';


export default function PageBag() {
    const [inBagOnly, setInBagOnly] = useState(false);
    const [discs, setDiscs] = useState(null);
    useEffect(() => {
        getDiscs().then((fetchedDiscs) => setDiscs([...fetchedDiscs]));
    }, []);
    return (
        <>
            <div>
                <DiscsOrThrows />
            </div>
            <div>
                <AddDiscButton />
            </div>
            <div id="route-content">
                <Outlet context={[discs, setDiscs]} />
            </div>
            <div>
                <ListDiscs 
                    inBagOnly={inBagOnly}
                    discs={discs}
                    onInBagOnlyChange={setInBagOnly}
                />
            </div>
        </>
    );
}

function DiscsOrThrows() {
    return (
        <>
            <button>Discs</button>
            <button>Recorded Throws</button>
        </>
    );
}

function AddDiscButton() {
    return (
        <button>
            <Link to={`add-disc`}>Add Disc to Bag</Link>
        </button>
    );
}



function ListDiscs({
    inBagOnly, 
    discs,
    onInBagOnlyChange
}) {
    const discsRows = [];
    if (discs === null) {
        discsRows.push(
            <tr key='loading'><td>Your Data is Loading...</td></tr>
        )
    } else {
    
        discs.forEach((disc) => {
            if (!inBagOnly || disc.inBag) {
                let discInBag;
                if (disc.inBag) {
                    discInBag = "In Bag"
                } else {
                    discInBag = "Not In Bag"
                }

                discsRows.push(
                    <tr key={disc.id}>
                        <td>{disc.name}</td>
                        <td>{disc.speed || disc.speed === 0 ? disc.speed : "-"}</td>
                        <td>{disc.glide || disc.glide === 0 ? disc.glide : "-"}</td>
                        <td>{disc.turn || disc.turn === 0 ? disc.turn : "-"}</td>
                        <td>{disc.fade || disc.fade === 0 ? disc.fade : "-"}</td>
                        <td>{discInBag}</td>
                        <td>{disc.id}</td>
                    </tr>
                );
            }
        });
    }
    
    return (
        <>
            <div>
                <InBagSwitch inBagOnly={inBagOnly} onInBagOnlyChange={onInBagOnlyChange} />
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Speed</th>
                            <th>Glide</th>
                            <th>Turn</th>
                            <th>Fade</th>
                            <th>In Bag?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {discsRows}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function InBagSwitch({ inBagOnly, onInBagOnlyChange }) {
    return (
        <>
            <span>In Bag</span>
            <input 
                type="checkbox" 
                checked={inBagOnly} 
                onChange={(event) => onInBagOnlyChange(event.target.checked)} 
            />
        </>
    );
}



