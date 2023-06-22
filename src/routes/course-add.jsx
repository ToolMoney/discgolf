import {useSetPath} from '../hooks';
import {useOutletContext} from 'react-router-dom';
import {addCourse as addCourseApi, addHole as addHoleApi} from '../api/course';


export default function AddCourseForm() {
    const [courses, setCourses] = useOutletContext();
    const setPath = useSetPath();


    


    function handleSubmit(event) {

        function addHoles(course, addUpTo) {
            let promises = new Array();
            for (let i = 1; i <= addUpTo; i++) {
                let holeToAdd = {"hole_number": i};
                promises.push(
                    addHoleApi(course.id, holeToAdd).then((newHole) => {
                        course.holes = [...course.holes, newHole];
                    })
                )
            }

            return Promise.all(promises);
            
        }


        event.preventDefault();
        const formData = new FormData(event.target);
        const courseToAdd = Object.fromEntries(formData.entries());
        const holeCount = courseToAdd.holes;

        // addHoles(courseToAdd, courseToAdd.holes);

        delete courseToAdd.holes;
        courseToAdd.favorite = false;
        for (let prop in courseToAdd) {
            if (courseToAdd[prop] === "") {
                courseToAdd[prop] = null;
            }
        }
        // addCourse(setPath, courses, setCourses, courseToAdd);

        addCourseApi(courseToAdd)
            .then((newCourse) => {
                addHoles(newCourse, holeCount)
                    .then(() => setCourses([...courses, newCourse]))
            });
        setPath("..");

    }
    return (
        <form method="post" onSubmit={handleSubmit}>
            Name: <input name="name" required />
            <br />
            Holes: <input name="holes" />
            <br />
            Location: <input name="location" />
            <br />
            Fee: <input name="fee" />
            <br />

            <button type="button" onClick={() => setPath("..")}>Cancel</button>
            <button type="submit">Add</button>
        </form>
    );
}


// function addCourse(setPath, courses, setCourses, courseToAdd) {
//     addCourseApi(courseToAdd).then((newCourse) => {
//         setCourses([...courses, newCourse]);
//     });
//     setPath("..");
// }

