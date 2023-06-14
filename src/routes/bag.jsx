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

    function getDiscDisplayValue(value) {
        if (!value && value !== 0) {
            return "-";
        }
        return value;
    }

    const discsRows = [];
    if (discs === null) {
        discsRows.push(
            <div key='loading'>Your Data is Loading...</div>
        )
    } else {
    
        discs.forEach((disc) => {
            if (!inBagOnly || disc.inBag) {

                // create switch for inBag
                let discInBag;
                if (disc.inBag) {
                    discInBag = "In Bag"
                } else {
                    discInBag = "Not In Bag"
                }

                discsRows.push(
                    <div key={disc.id} className="table-row">
                    {/* <> */}
                        <div className="span-1">
                            {disc.name}
                        </div>
                        <div className="span-1">
                            {getDiscDisplayValue(disc.speed)}
                        </div>
                        <div className="span-1">
                            {getDiscDisplayValue(disc.glide)}
                        </div>
                        <div className="span-1">
                            {getDiscDisplayValue(disc.turn)}
                        </div>
                        <div className="span-1">
                            {getDiscDisplayValue(disc.fade)}
                        </div>
                        <div className="span-1">
                            {discInBag}
                        </div>
                        <div>
                            <button>Edit</button>
                        </div>
                        <div>
                            {disc.id}
                        </div>
                    </div>
                    // </>
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
                <div className="disc-table">
                    <div className="table-row header">
                        <div className="disc-name span-1">Name</div>
                        <div className="disc-speed span-1">Speed</div>
                        <div className="disc-glide span-1">Glide</div>
                        <div className="disc-turn span-1">Turn</div>
                        <div className="disc-fade span-1">Fade</div>
                        <div className="disc-bag span-1">In Bag?</div>
                    </div>
                    {discsRows}
                </div>
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



