import { useState, useEffect, useId } from 'react';
import { getDiscs, editDisc, deleteDisc } from '../api/disc.js';
import { Outlet, Link } from 'react-router-dom';


export default function PageBag() {
    const [inBagOnly, setInBagOnly] = useState(false);
    const [discs, setDiscs] = useState(null);
    useEffect(() => {
        getDiscs().then((fetchedDiscs) => setDiscs([...fetchedDiscs]));
    }, []);
    return (
        <>
            <div className="row justify-content-center">
                <div className="col-auto">
                    <div>
                        {/* <DiscsOrThrows /> */}
                    </div>
                    
                    <div className="row justify-content-between">
                        <div className="col-auto">
                            <AddDiscButton />
                            <div id="route-content">
                                <Outlet context={[discs, setDiscs]} />
                            </div>
                        </div>
                        <div className="col-auto align-self-end">
                            <InBagSwitch inBagOnly={inBagOnly} onInBagOnlyChange={setInBagOnly} />
                        </div>
                    </div>
                    
                    <div>
                        <ListDiscs 
                            inBagOnly={inBagOnly}
                            discs={discs}
                            onDiscsChange={setDiscs}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}


// function DiscsOrThrows() {
//     return (
//         <>
//             <button>Discs</button>
//             <button>Recorded Throws</button>
//         </>
//     );
// }


function AddDiscButton() {
    const [addFormOpen, setAddFormOpen] = useState(false);
    let linkTo = addFormOpen ? "." : "add-disc"

    return (
        <Link to={linkTo}>
            <button type="button" className="btn btn-secondary" onClick={() => { setAddFormOpen(!addFormOpen) }}>
                Add Disc to Bag
            </button>
        </Link>
    );
}


function InBagSwitch({ inBagOnly, onInBagOnlyChange }) {
    return (
        <>
            <div className="form-check">
                <label htmlFor="in-bag-switch">Show in bag only</label>
                <input 
                    id="in-bag-switch"
                    type="checkbox"
                    className="form-check-input"
                    checked={inBagOnly} 
                    onChange={(event) => onInBagOnlyChange(event.target.checked)} 
                />
            </div>
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
            <tr>
                <th scope="col">Name</th>
                <th scope="col">Speed</th>
                <th scope="col">Glide</th>
                <th scope="col">Turn</th>
                <th scope="col">Fade</th>
                <th scope="col">In Bag?</th>
            </tr>
        );
    }

    if (!discs) {
        return (
            <>
                <table>
                    <thead><TableHeaders /></thead>
                    <tbody><tr key='loading'><td>Your Data is Loading...</td></tr></tbody>
                </table>
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
            <table className="table table-striped">
                <thead>
                    <TableHeaders />
                </thead>
                <tbody className="table-group-divider">
                    {discsRows}
                </tbody>
            </table>
        </>
    );
}



function DiscRow({disc, onDiscChange, onDiscDelete}) {
    const [editing, setEditing] = useState(false);
    const discRowId = useId();

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


    function handleSubmit() {
        const name = document.getElementById(`name-${discRowId}`).value;
        const speed = document.getElementById(`speed-${discRowId}`).value;
        const glide = document.getElementById(`glide-${discRowId}`).value;
        const turn = document.getElementById(`turn-${discRowId}`).value;
        const fade = document.getElementById(`fade-${discRowId}`).value;
        const editedFields = {
            name: name,
            speed: speed,
            glide: glide,
            turn: turn,
            fade: fade,
        }

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
        <tr key={disc.id}>
            <th>
                {
                    editing ? 
                        <input className="form-control" id={`name-${discRowId}`} name="name" type="text" defaultValue={disc.name} required></input>
                        : disc.name
                }
            </th>
            <td>
                {
                    editing ? 
                        <input className="form-control" id={`speed-${discRowId}`} name="speed" type="number" defaultValue={disc.speed}></input>
                        : getDiscDisplayValue(disc.speed)
                }
            </td>
            <td>
                {
                    editing ? 
                        <input className="form-control" id={`glide-${discRowId}`} name="glide" type="number" defaultValue={disc.glide}></input>
                        : getDiscDisplayValue(disc.glide)
                }
            </td>
            <td>
                {
                    editing ? 
                        <input className="form-control" id={`turn-${discRowId}`} name="turn" type="number" defaultValue={disc.turn}></input>
                        : getDiscDisplayValue(disc.turn)
                }
            </td>
            <td>
                {
                    editing ? 
                        <input className="form-control" id={`fade-${discRowId}`} name="fade" type="number" defaultValue={disc.fade}></input>
                        : getDiscDisplayValue(disc.fade)
                }
            </td>
            <td>
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={disc.inBag} onChange={(event) => { handleCheckbox(event)}}></input>
                </div>
            </td>
            <td>
                <div className="btn-group" role="group" aria-label="Disc action button group">
                    {
                        editing ?
                            <button type="button" className="btn btn-success" onClick={() => { handleSubmit() }}>Save</button>
                            : <button type="button" className="btn btn-secondary" onClick={() => { handleOnClickEdit() }}>Edit</button>
                    }
                    <button type="button" className="btn btn-danger" onClick={() => { handleOnClickDelete() }}>Delete</button>
                </div>
            </td>
        </tr>
    );
}