import {useSetPath} from '../hooks';
import {useOutletContext} from 'react-router-dom';
import {addHole as addHoleApi} from '../api/course';


export default function AddHoleForm() {
    const [course, holes, setHoles] = useOutletContext();
    const setPath = useSetPath();

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const holeToAdd = Object.fromEntries(formData.entries());
        for (let prop in holeToAdd) {
            if (holeToAdd[prop] === "") {
                holeToAdd[prop] = null;
            }
        }
        addHole(setPath, holes, setHoles, holeToAdd, course);
    }
    return (
        <form method="post" onSubmit={handleSubmit}>
            Hole Number: <input name="hole_number" required />
            <br />
            Par: <input name="par" />
            <br />
            Layout: <input name="layout" />
            <br />
            Distance: <input name="distance" />
            <br />

            <button type="button" onClick={() => setPath("..")}>Cancel</button>
            <button type="submit">Add</button>
        </form>
    );
}


export function addHole(setPath, holes, setHoles, holeToAdd, course) {

    function sortHoles(holes, newHole) {
        let insertToIndex = 0;
        for (let i = 0; i < holes.length; i++) {
            if (holes[i].hole_number == newHole.hole_number) {
                if (holes[i].layout > newHole.layout) {
                    insertToIndex = i;
                    break;
                }
            }
            if (holes[i].hole_number > newHole.hole_number) {
                insertToIndex = i;
                break;
            }
        }
        return insertToIndex ? 
            ([
                ...holes.slice(0, insertToIndex),
                newHole,
                ...holes.slice(insertToIndex)
            ])
            : ([...holes, newHole]) 
    }

    addHoleApi(course.id, holeToAdd).then((newHole) => {
        let sortedHoles = sortHoles(holes, newHole);
        setHoles(sortedHoles);
        // setHoles([...holes, newHole]);
    });
    setPath("..");
}

