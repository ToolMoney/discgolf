import { Link, Outlet, useParams } from "react-router-dom"
import { getRound, editScore, deleteScore, addScore } from "../api/round";
import { useEffect, useState } from "react";
import { getCourse as getCourseApi } from "../api/course";


export default function RoundPage() {
    let {id} = useParams();
    const [round, setRound] = useState(null);
    const [scores, setScores] = useState(null);
    const [course, setCourse] = useState(null);
    useEffect(() => {
        if (round) {
            getCourseApi(round.course_id).then(
                (fetchedCourse) => {
                    setCourse(fetchedCourse);
                }
            );
        }
    }, [round]);

    useEffect(() => {
        getRound(id).then(
            (fetchedRound) => {
                const holeScores = {};
                fetchedRound.scores.forEach((score) => {
                    holeScores[score.hole_id] = score
                })
                setRound(fetchedRound);
                setScores(holeScores);
            }
        );
    }, []);


    return (
        <>
            <div>
                <RoundInfo 
                    round={round} 
                    scores={scores}
                />
            </div>
            <div>
                <ListScores 
                    course={course}
                    scores={scores}
                    onScoresChange={setScores}
                    round={round}
                />
            </div>
        </>
    );
}


function RoundInfo({ round, scores }) {
    if (!round) {
        return <div key='loading'>Your Data is Loading...</div>
    }
    return (
        <>
            <div>ID: {round.id}</div>
            <div>course: {round.course_id}</div>
            <div>layout: {round.default_layout}</div>
            <div>date: {round.date}</div>
            <div>score: {Object.entries(scores).reduce((accumulator, [holeId, scoreObject]) => accumulator + scoreObject.score, 0)}</div>
        </>
    );
}


function ListScores({
    course,
    scores,
    onScoresChange,
    round
}) {

    function TableHeaders() {
        return (
            <div className="table-row score-row header">
                <div className="header-hole-number span-1">Hole</div>
                <div className="header-layout span-1">Layout</div>
                <div className="header-distance span-1">Distance</div>
                <div className="header-par span-1">Par</div>
                <div className="header-score span-1">Score</div>
            </div>
        );
    }

    if (!course) {
        return (
            <>
                <div className="score-table">
                    <TableHeaders />
                    <div key='loading'>Your Data is Loading...</div>
                </div>
            </>
        );
    }


    const holeNumberToHoles = {};
    course.holes.forEach((hole) => {
        if (holeNumberToHoles[hole.hole_number]) {
            holeNumberToHoles[hole.hole_number].push(hole);
        } else {
            holeNumberToHoles[hole.hole_number] = [hole];
        }
    })

    const scoresRows = [];
    // course.holes.forEach((hole) => {
    Object.entries(holeNumberToHoles).forEach(([holeNumber, holes]) => {

        let holeToUse;
        for (let hole of holes) {
            if (scores[hole.id]) {
                holeToUse = hole;
            }
        }
        if (!holeToUse) {
            for (let hole of holes) {
                if (hole.layout == round.default_layout) {
                    holeToUse = hole;
                    break
                }
            }
        }
        const hole = holeToUse;

        function onScoreChange(newScore) {
            const newScores = {...scores};
            newScores[newScore.hole_id] = newScore;
            onScoresChange(newScores)
        }

        function onScoreDelete() {
            const newScores = {...scores};
            delete newScores[hole.id];
            onScoresChange(newScores)
        }

        if (hole) {
            scoresRows.push(
                <ScoreRow key={hole.id} 
                    hole={hole}
                    holes={holes}
                    score={scores[hole.id]} 
                    onScoreChange={onScoreChange} 
                    onScoreDelete={onScoreDelete}
                    round={round}
                />
            );
        }
    });

    return (
        <>
            <div className="score-table">
                <TableHeaders />
                {scoresRows}
            </div>
        </>
    );
}


function ScoreRow({hole, holes, score, onScoreChange, onScoreDelete, round}) {
    const [layout, setLayout] = useState(round.default_layout);
    const [editing, setEditing] = useState(!(score && score.score));


    function LayoutSwitch({ layout, setLayout }) {
        const holeOptions = [];
        for (let hole of holes) {
            holeOptions.push(<option key={hole.id} value={hole.id}>{hole.layout}</option>);
        }
        return (
            <>
                <select value={layout} onChange={(event) => onLayoutChange(event.target.value, setLayout)}>
                    {holeOptions}
                </select>
            </>
        );
    }

    function onLayoutChange(holeId, setLayout) {
        holeId = parseInt(holeId);
        console.log(holeId);
        let newScorePromise;
        if (score) {
            newScorePromise = Promise.resolve(Object.assign(score, {hole_id: holeId}));
        } else {
            newScorePromise = addScore(round.id, {hole_id: holeId});
        }
        newScorePromise.then((newScore) => {
            onScoreChange(newScore);
            for (let hole of holes) {
                if (hole.id == holeId) {
                    setLayout(hole.layout);
                }
            }
        })
    }


    function getScoreDisplayValue(value) {
        if (!value && value !== 0) {
            return "-";
        }
        return value;
    }

    function handleOnClickEdit() {
        console.log('Editing score with id', round.id);
        setEditing(!editing);
    }

    function handleOnClickDelete() {
        deleteScore(round.id, score).then(() => onScoreDelete())
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

        const newScore = Object.assign({hole_id: hole.id, round_id: round.id}, score,  editedFields);
        console.log(newScore);
        score ? 
            editScore(round.id, newScore).then((freshScore) => {
                onScoreChange(freshScore);
                setEditing(false);
            }) :
            addScore(round.id, newScore).then((freshScore) => {
                onScoreChange(freshScore);
                setEditing(false);
            });
    }





    return (
        <form key={round.id} className="table-row score-row" onSubmit={(event) => handleSubmit(event)}>
            <div className="score-hole span-1">
                {
                    hole.hole_number
                }
            </div>
            <div className="score-layout span-1">
                {
                    editing ? 
                        // <input className="edit-field" name="layout" type="text" defaultValue={hole.layout}></input>
                        <LayoutSwitch 
                            layout={layout}
                            setLayout={setLayout}
                        />
                        : 
                        getScoreDisplayValue(hole.layout)
                }
            </div>
            <div className="score-distance span-1">
                {
                    `${getScoreDisplayValue(hole.distance)} ft`
                }
            </div>
            <div className="score-par span-1">
                {
                    getScoreDisplayValue(hole.par)
                }
            </div>
            <div className="score-score span-1">
                {
                    editing ? 
                        <input className="edit-field" name="score" type="number" defaultValue={(score && score.score)} required></input>
                        : (score && score.score)
                }
            </div>
            <div className="buttons">
                {
                    editing ?
                        <input type="submit" value="Save"></input>
                        : <button type="button" onClick={() => { handleOnClickEdit() }}>Edit</button>
                }
                <button type="button" onClick={() => { handleOnClickDelete() }}>Clear</button>
            </div>
        </form>
    );
}