import { Link, Outlet, useParams } from "react-router-dom"
import { getRound, editScore, deleteScore, addScore, editRound } from "../api/round";
import { useEffect, useState } from "react";
import { getCourse as getCourseApi } from "../api/course";
import { getDateDisplayValue, getDateLocalValue, getValueOrDash } from "../helpers/formatting";
import { getObjectFromForm } from "../helpers/forms";


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
                    setRound={setRound}
                    scores={scores}
                    course={course}
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


function RoundInfo({ round, setRound, scores, course }) {

    function handleSubmit(event) {
        event.preventDefault();
        const formFields = getObjectFromForm(event.target);
        const editedRound = Object.assign(round, formFields);
        const fullDate = (new Date(editedRound.date)).toISOString();
        editedRound.date = fullDate;
        delete editedRound.scores;
        editRound(editedRound).then((updatedRound) => setRound(updatedRound));
    }

    function LayoutContainer() {
    const [editing, setEditing] = useState(false);
        return (
            <>
                {
                    editing ? 
                    <form className="round-layout-form" onSubmit={(event) => handleSubmit(event)}>
                        <div>
                            {/* make type drop down selection */}
                            <input id="layout" type="text" name="default_layout" defaultValue={round.default_layout}></input>
                            <button type="submit">Save Changes</button>
                        </div>
                    </form>
                    :
                    <button onClick={() => { setEditing(true) }}>
                        layout: {round.default_layout}
                    </button>
                }
            </>
        )
    }

    function DateContainer() {
        const [editing, setEditing] = useState(false);
        const date = new Date(round.date).toISOString();
        const inputDateString = getDateLocalValue(new Date(round.date))
        return (
            <>
                {
                    editing ? 
                    <form className="round-date-form" onSubmit={(event) => handleSubmit(event)}>
                        <div>
                            <input 
                                id="datetime" 
                                type="datetime-local" 
                                name="date" 
                                defaultValue={inputDateString}
                                required
                            />
                            <button type="submit">Save Changes</button>
                        </div>
                    </form>
                    :
                    <button onClick={() => { setEditing(true) }}>
                        {getDateDisplayValue(date)}
                    </button>
                }
            </>
        )

    }

    if (!round) {
        return <div key='loading'>Your Data is Loading...</div>
    }
    return (
        <>
            <div>{course && course.name}</div>
            <div>score: 
                {Object.entries(scores).reduce(
                    (accumulator, [holeId, scoreObject]) => accumulator + scoreObject.score, 0
                )}
            </div>
            <LayoutContainer />
            <DateContainer />
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
            delete newScores[hole.id];
            newScores[newScore.hole_id] = newScore;
            onScoresChange(newScores)
        }

        function onScoreDelete(deletedScore) {
            const newScores = {...scores};
            delete newScores[deletedScore.hole_id];
            onScoresChange(newScores)
        }

        if (hole) {
            scoresRows.push(
                <ScoreRow key={hole.id}
                    startingHole={hole}
                    holes={holes}
                    score={scores[hole.id]}
                    onScoreChange={onScoreChange}
                    onScoreDelete={onScoreDelete}
                    round={round}
                />);
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

function HoleLayoutSwitch({ holes, defaultLayout, onLayoutChange }) {
    const holeOptions = [];
    for (let hole of holes) {
        holeOptions.push(<option key={hole.id} value={hole.id}>{hole.layout}</option>);
    }

    let holeWithDefaultLayout;
    for (let hole of holes) {
        if (hole.layout === defaultLayout) {
            holeWithDefaultLayout = hole;
            break;
        }
    }

    return (
        <>
            <select name="hole_id" defaultValue={holeWithDefaultLayout.id} onChange={(event) => onLayoutChange(parseInt(event.target.value))}>
                {holeOptions}
            </select>
        </>
    );
}

function ScoreRow({startingHole, holes, score, onScoreChange, onScoreDelete, round}) {
    const [editing, setEditing] = useState(score && !score.score);
    const [hole, setHole] = useState(startingHole);

    function onLayoutChange(holeIdOfHoleWithNewLayout) {
        for (let availableHole of holes) {
            if (availableHole.id === holeIdOfHoleWithNewLayout) {
                setHole(availableHole);
                break;
            }
        }
    }

    function handleOnClickEdit() {
        setEditing(!editing);
    }

    function handleOnClickDelete() {
        deleteScore(round.id, score).then(() => onScoreDelete(score))
    }

    function handleSubmit(event) {
        event.preventDefault();

        const formFields = getObjectFromForm(event.target);

        if (score) {
            const editedScore = Object.assign(score, formFields);
            editScore(round.id, editedScore).then((freshScore) => {
                onScoreChange(freshScore);
                setEditing(false);
            });
        }
        else {
            addScore(round.id, formFields).then((freshScore) => {
                onScoreChange(freshScore);
                setEditing(false);
            });
        }
    }

    return (
        <form className="table-row score-row" onSubmit={(event) => handleSubmit(event)}>
            <div className="score-hole span-1">
                {
                    hole.hole_number
                }
            </div>
            <div className="score-layout span-1">
                {
                    editing ?
                    <HoleLayoutSwitch
                        holes={holes}
                        defaultLayout={startingHole.layout}
                        onLayoutChange={onLayoutChange}
                    />
                        :
                        getValueOrDash(hole.layout)
                }
            </div>
            <div className="score-distance span-1">
                {
                    `${getValueOrDash(hole.distance)} ft`
                }
            </div>
            <div className="score-par span-1">
                {
                    getValueOrDash(hole.par)
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
                {score && <button type="button" onClick={() => { handleOnClickDelete() }}>Clear</button>}
            </div>
        </form>
    );
}
