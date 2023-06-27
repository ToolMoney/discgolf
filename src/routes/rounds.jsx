import {useState, useEffect} from 'react';
import {getRounds, editRound, deleteRound} from '../api/round.js';
import {Outlet, Link} from 'react-router-dom';


export default function PageRounds() {
    const [rounds, setRounds] = useState(null);
    useEffect(() => {
        getRounds().then((fetchedRounds) => setRounds([...fetchedRounds]));
    }, []);
    return (
        <>
            <div>
                <RoundData />
            </div>
            <div>
                <AddRoundButton />
            </div>
            <div id="route-content">
                <Outlet context={[rounds, setRounds]} />
            </div>
            
            <div>
                <ListRounds 
                    rounds={rounds}
                    onRoundsChange={setRounds}
                />
            </div>
        </>
    );
}


function RoundData() {
    return (
        <>
            <button>Total Rounds</button>
            <button>Last Played</button>
        </>
    );
}

function AddRoundButton() {
    const [addFormOpen, setAddFormOpen] = useState(false);
    let linkTo = addFormOpen ? "." : "add-round"

    return (
        <button type="button" onClick={() => { setAddFormOpen(!addFormOpen) }}>
            <Link to={linkTo}>Begin New Round</Link>
        </button>
    );
}

function ListRounds({
    rounds,
    onRoundsChange
}) {

    function TableHeaders() {
        return (
            <div className="table-row round-row header">
                <div className="header-date span-1">Date</div>
                <div className="header-course span-1">Course</div>
                <div className="header-default-layout span-1">Default Layout</div>
                <div className="header-holes span-1">Holes</div>
                <div className="header-score span-1">Score</div>
                <div className="header-new-round span-1">Play Again?</div>
            </div>
        );
    }

    if (!rounds) {
        return (
            <>
                <div className="round-table">
                    <TableHeaders />
                    <div key='loading'>Your Data is Loading...</div>
                </div>
            </>
        );
    }

    const roundsRows = [];
    rounds.forEach((round) => {

        function onRoundChange(newRound) {
            let index = rounds.indexOf(round);
            onRoundsChange([
                ...rounds.slice(0, index),
                newRound,
                ...rounds.slice(index + 1)
            ])
        }

        function onRoundDelete() {
            let index = rounds.indexOf(round);
            onRoundsChange([
                ...rounds.slice(0, index),
                ...rounds.slice(index + 1)
            ])
        }

        roundsRows.push(
            <RoundRow key={round.id} round={round} onRoundChange={onRoundChange} onRoundDelete={onRoundDelete} />
        );
    });

    return (
        <>
            <div className="round-table">
                <TableHeaders />
                {roundsRows}
            </div>
        </>
    );
}



function RoundRow({round, onRoundChange, onRoundDelete}) {
    const [editing, setEditing] = useState(false);

    function getRoundDisplayValue(value) {
        if (!value && value !== 0) {
            return "-";
        }
        return value;
    }

    function handleOnClickEdit() {
        console.log('Editing round with id', round.id);
        setEditing(!editing);
    }

    function handleOnClickDelete() {
        if (window.confirm(`Would you like to delete ${round.id} from ${round.date}?`)) {
            deleteRound(round).then(() => onRoundDelete())
        }
    }


    function handleOnClickNewRound() {
        setPath(`../rounds/${course.id}/new`);
        // TODO add page for new round on rounds page
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

        const newRound = Object.assign({}, round, editedFields);
        console.log(newRound);
        editRound(newRound).then((freshRound) => {
            onRoundChange(freshRound);
            setEditing(false);
        })
    }


    return (
        <form key={round.id} className="table-row round-row" onSubmit={(event) => handleSubmit(event)}>
            <div className="round-date span-1">
                {
                    editing ? 
                        <input className="edit-field" name="date" type="text" defaultValue={round.date} required></input>
                        : round.date
                }
            </div>
            <div className="round-course span-1">
                {
                    editing ? 
                        <input className="edit-field" name="course_id" type="number" defaultValue={round.course_id}></input>
                        : getRoundDisplayValue(round.course_id)
                }
            </div>
            <div className="round-default-layout span-1">
                {
                    editing ? 
                        <input className="edit-field" name="default-layout" type="number" defaultValue={round.default_layout}></input>
                        : getRoundDisplayValue(round.default_layout)
                }
            </div>
            <div className="round-holes span-1">
                {
                    editing ? 
                        <input className="edit-field" name="holes" type="number" defaultValue={round.scores.length}></input>
                        : getRoundDisplayValue(round.scores.length)
                }
            </div>
            <div className="round-score span-1">
                {
                    editing ? 
                        <input className="edit-field" name="score" type="number" defaultValue={round.scores.reduce((accumulator, scoreModel) => accumulator + scoreModel.score, 0)}></input>
                        : getRoundDisplayValue(round.scores.reduce((accumulator, scoreModel) => accumulator + scoreModel.score, 0))
                }
            </div>
            <div className="round-start span-1">
                {
                    <button type="button" onClick={() => { handleOnClickNewRound() }} disabled={editing}>New Round</button>
                }
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