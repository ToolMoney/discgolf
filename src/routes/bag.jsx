import {useState, useEffect} from 'react';
import {getDiscs, addDisc, editDisc, deleteDisc} from '../api/disc.js';
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
                <InBagSwitch inBagOnly={inBagOnly} onInBagOnlyChange={setInBagOnly} />
            </div>
            <div>
                <ListDiscs 
                    inBagOnly={inBagOnly}
                    discs={discs}
                    onDiscsChange={setDiscs}
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



function ListDiscs({
    inBagOnly, 
    discs,
    onDiscsChange
}) {

    function TableHeaders() {
        return (
            <div className="table-row bag-row header">
                <div className="header-name span-1">Name</div>
                <div className="header-speed span-1">Speed</div>
                <div className="header-glide span-1">Glide</div>
                <div className="header-turn span-1">Turn</div>
                <div className="header-fade span-1">Fade</div>
                <div className="header-bag span-1">In Bag?</div>
            </div>
        );
    }

    if (!discs) {
        return (
            <>
                <div className="disc-table">
                    <TableHeaders />
                    <div key='loading'>Your Data is Loading...</div>
                </div>
            </>
        );
    }

    const discsRows = [];
    discs.forEach((disc) => {

        function onDiscChange(newDisc) {
            let index = discs.indexOf(disc);
            onDiscsChange([
                ...discs.slice(0, index),
                newDisc,
                ...discs.slice(index + 1)
            ])
        }

        function onDiscDelete() {
            let index = discs.indexOf(disc);
            onDiscsChange([
                ...discs.slice(0, index),
                ...discs.slice(index + 1)
            ])
        }

        if (!inBagOnly || disc.inBag) {
            discsRows.push(
                <DiscRow key={disc.id} disc={disc} onDiscChange={onDiscChange} onDiscDelete={onDiscDelete} />
            );
        }
    });

    return (
        <>
            <div className="disc-table">
                <TableHeaders />
                {discsRows}
            </div>
        </>
    );
}



function DiscRow({disc, onDiscChange, onDiscDelete}) {
    const [editing, setEditing] = useState(false);


    function getDiscDisplayValue(value) {
        if (!value && value !== 0) {
            return "-";
        }
        return value;
    }

    function handleOnClickEdit() {
        console.log('Editing disc with id', disc.id);
        setEditing(!editing);
    }

    function handleOnClickDelete() {
        if (window.confirm(`Would you like to delete ${disc.name}?`)) {
            deleteDisc(disc).then(() => onDiscDelete())
        }
    }


    function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const editedFields = Object.fromEntries(formData.entries());

        for (let prop in editedFields) {
            if (editedFields[prop] === "") {
                editedFields[prop] = null;
            }
        }

        const newDisc = Object.assign({}, disc, editedFields);
        console.log(newDisc);
        editDisc(newDisc).then((freshDisc) => {
            onDiscChange(freshDisc);
            setEditing(false);
        })
    }


    function handleCheckbox(event) {
        const isInBag = event.target.checked

        const newDisc = Object.assign({}, disc, {inBag: isInBag})
        editDisc(newDisc).then((freshDisc) => {
            onDiscChange(freshDisc);
        })
    }

    return (
        <form key={disc.id} className="table-row bag-row" onSubmit={(event) => handleSubmit(event)}>
            <div className="disc-name span-1">
                {
                    editing ? 
                        <input className="edit-field" name="name" type="text" defaultValue={disc.name} required></input>
                        : disc.name
                }
            </div>
            <div className="disc-speed span-1">
                {
                    editing ? 
                        <input className="edit-field" name="speed" type="number" defaultValue={disc.speed}></input>
                        : getDiscDisplayValue(disc.speed)
                }
            </div>
            <div className="disc-glide span-1">
                {
                    editing ? 
                        <input className="edit-field" name="glide" type="number" defaultValue={disc.glide}></input>
                        : getDiscDisplayValue(disc.glide)
                }
            </div>
            <div className="disc-turn span-1">
                {
                    editing ? 
                        <input className="edit-field" name="turn" type="number" defaultValue={disc.turn}></input>
                        : getDiscDisplayValue(disc.turn)
                }
            </div>
            <div className="disc-fade span-1">
                {
                    editing ? 
                        <input className="edit-field" name="fade" type="number" defaultValue={disc.fade}></input>
                        : getDiscDisplayValue(disc.fade)
                }
            </div>
            <div className="disc-bag span-1">
                <input type="checkbox" checked={disc.inBag} onChange={(event) => { handleCheckbox(event)}}></input>
            </div>
            <div className="buttons">
                {
                    editing ?
                        <input type="submit" value="Save"></input>
                        : <button type="button" onClick={() => { handleOnClickEdit() }}>Edit</button>
                }
                <button type="button" onClick={() => { handleOnClickDelete() }}>Delete</button>
            </div>
        </form>
    );
}