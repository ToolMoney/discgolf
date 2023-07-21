import { useState, useEffect } from 'react';
import { getRounds, editRound, deleteRound } from '../api/round.js';
import { Outlet, Link } from 'react-router-dom';
import { useSetPath } from '../hooks.jsx';
import { getDateDisplayValue } from '../helpers/formatting.jsx';
import { addRound as addRoundApi } from '../api/round';
import { getCourse as getCourseApi } from '../api/course.js';


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
            <div id="route-content">
                <Outlet />
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
            <div>Total Rounds</div>
            <button>Last Played</button>
        </>
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
    const [course, setCourse] = useState(null);
    const setPath = useSetPath();
    useEffect(() => {
        getCourseApi(round.course_id).then(
            (fetchedCourse) => {
                setCourse(fetchedCourse);
            }
        );
    }, []);



    function getRoundDisplayValue(value) {
        if (!value && value !== 0) {
            return "-";
        }
        return value;
    }

    function handleOnClickDelete() {
        if (window.confirm(`Would you like to delete ${round.id} from ${round.date}?`)) {
            deleteRound(round).then(() => onRoundDelete())
        }
    }

    function handleOnClickNewRound() {
        const date = (new Date()).toISOString();
        const newRound = {
            date: date,
            default_layout: round.default_layout,
            course_id: round.course_id,
        }
        addRoundApi(newRound).then((newRound) => {
            setPath(`/rounds/${newRound.id}`);
        });
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

        const newRound = Object.assign(round, editedFields);
        console.log(newRound);
        editRound(newRound).then((freshRound) => {
            onRoundChange(freshRound);
            setEditing(false);
        })
    }


    return (
        <form key={round.id} className="table-row round-row" onSubmit={(event) => handleSubmit(event)}>
            <div className="round-date span-1">
                <Link to={`./${round.id}`}>{getDateDisplayValue(round.date)}</Link>
            </div>
            <div className="round-course span-1">
                {course && getRoundDisplayValue(course.name)}
            </div>
            <div className="round-default-layout span-1">
                {getRoundDisplayValue(round.default_layout)}
            </div>
            <div className="round-holes span-1">
                {getRoundDisplayValue(round.scores.length)}
            </div>
            <div className="round-score span-1">
                    {getRoundDisplayValue(round.scores.reduce(
                        (accumulator, scoreModel) => accumulator + scoreModel.score, 0
                    ))}
            </div>
            <div className="round-start span-1">
                    <button type="button" onClick={() => { handleOnClickNewRound() }}>New Round</button>
            </div>
            <div className="span-1">
                    <button type="button" onClick={() => { handleOnClickDelete() }}>Delete</button>
            </div>
        </form>
    );
}