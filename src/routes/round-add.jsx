import {useSetPath} from '../hooks';
import {useOutletContext} from 'react-router-dom';
import {addRound as addRoundApi, addScore, getRound} from '../api/round';
import {getCourse as getCourseApi} from '../api/course';


export default function AddRoundForm() {
    const [rounds, setRounds] = useOutletContext();
    const setPath = useSetPath();

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const roundToAdd = Object.fromEntries(formData.entries());
        for (let prop in roundToAdd) {
            if (roundToAdd[prop] === "") {
                roundToAdd[prop] = null;
            }
        }
        addRound(setPath, rounds, setRounds, roundToAdd);
    }
    return (
        <form method="post" onSubmit={handleSubmit}>
            Date: <input name="date" required />
            <br />
            Default Layout: <input name="default_layout" />
            <br />
            Course ID: <input name="course_id" />
            <br />
            <button type="button" onClick={() => setPath("..")}>Cancel</button>
            <button type="submit">Add</button>
        </form>
    );
}


function addRound(setPath, rounds, setRounds, roundToAdd) {
    addRoundApi(roundToAdd).then(async (newRound) => {
        setRounds([...rounds, newRound]);

        const course = await getCourseApi(newRound.course_id);
        // const holes = course.holes;
        // for (let hole of holes) {
        //     addScore(newRound.id, {"hole_id": hole.id})
        // }

    });
    setPath("..");
}

