import {useState, useEffect, useId} from 'react';
import {getCourses, editCourse, deleteCourse} from '../api/course.js';
import {Outlet, Link} from 'react-router-dom';
import {useSetPath} from '../hooks';
import {addHole as addHoleApi} from '../api/course';
import {addRound as addRoundApi} from '../api/round';

export default function PageCourses() {
    const [favoritesOnly, setFavoritesOnly] = useState(false);
    const [courses, setCourses] = useState(null);
    useEffect(() => {
        getCourses().then((fetchedCourses) => setCourses([...fetchedCourses]));
    }, []);
    return (
        <>
            <div className="row justify-content-center">
                <div className="col-auto">
                    <div className="row justify-content-between">
                        <div className="col-auto">
                            <AddCourseButton />
                            <div id="route-content">
                                <Outlet context={[courses, setCourses]} />
                            </div>
                        </div>
                        <div className="col-auto align-self-end">
                            <FavoritesSwitch favoritesOnly={favoritesOnly} onFavoritesChange={setFavoritesOnly} />
                        </div>
                    </div>

                    <div>
                        <ListCourses 
                            favoritesOnly={favoritesOnly}
                            courses={courses}
                            onCoursesChange={setCourses}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}



function AddCourseButton() {
    const [addFormOpen, setAddFormOpen] = useState(false);
    let linkTo = addFormOpen ? "." : "add-course"

    return (
        <Link to={linkTo}>
            <button type="button" className="btn btn-secondary" onClick={() => { setAddFormOpen(!addFormOpen) }}>
                Add Course to Catalog
            </button>
        </Link>
    );
}


function FavoritesSwitch({ favoritesOnly, onFavoritesChange }) {
    return (
        <>
            <div className="form-check">
                <label htmlFor="favorites-switch">Favorites</label>
                <input
                    id="favorites-switch"
                    type="checkbox"
                    className="form-check-input"
                    checked={favoritesOnly}
                    onChange={(event) => onFavoritesChange(event.target.checked)} 
                />
            </div>

        </>
    );
}


function ListCourses({
    favoritesOnly, 
    courses,
    onCoursesChange
}) {

    function TableHeaders() {
        return (
            <tr>
                <th scope="col">Name</th>
                <th scope="col">Holes</th>
                <th scope="col">Location</th>
                <th scope="col">Fee</th>
                <th scope="col">Favorite?</th>
                <th scope="col">Start Round</th>
            </tr>
        );
    }

    if (!courses) {
        return (
            <>
                <table>
                    <thead><TableHeaders /></thead>
                    <tbody><tr key='loading'><td>Your Data is Loading...</td></tr></tbody>
                </table>
            </>
        );
    }

    const coursesRows = [];
    courses.forEach((course) => {

        function onCourseChange(newCourse) {
            let index = courses.indexOf(course);
            onCoursesChange([
                ...courses.slice(0, index),
                newCourse,
                ...courses.slice(index + 1)
            ])
        }

        function onCourseDelete() {
            let index = courses.indexOf(course);
            onCoursesChange([
                ...courses.slice(0, index),
                ...courses.slice(index + 1)
            ])
        }

        if (!favoritesOnly || course.favorite) {
            coursesRows.push(
                <CourseRow key={course.id} course={course} onCourseChange={onCourseChange} onCourseDelete={onCourseDelete} />
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
                    {coursesRows}
                </tbody>
            </table>
        </>
    );
}



function CourseRow({course, onCourseChange, onCourseDelete}) {
    const [editing, setEditing] = useState(false);
    const setPath = useSetPath();
    const courseRowId = useId();

    function getCourseDisplayValue(value) {
        if (!value && value !== 0) {
            return "-";
        }
        return value;
    }

    function getHoleCount() {
        return getUniqueHoles().size;
    }

    function getUniqueHoles() {
        const uniqueHoles = new Set();
        for (let hole of course.holes) {
            uniqueHoles.add(hole.hole_number);
        }
        return uniqueHoles;
    }

    function handleOnClickNewRound() {
        if (course.holes) {
            const date = (new Date()).toISOString();
            const newRound = {
                date: date,
                default_layout: course.holes[0].layout,
                course_id: course.id,
            }
            addRoundApi(newRound).then((newRound) => {
                setPath(`/rounds/${newRound.id}`);
            });
        }
    }


    function handleOnClickEdit() {
        console.log('Editing course with id', course.id);
        setEditing(!editing);
    }

    function handleOnClickDelete() {
        if (window.confirm(`Would you like to delete ${course.name}?`)) {
            deleteCourse(course).then(() => onCourseDelete())
        }
    }


    function addHoles(addUpTo) {
        const uniqueHoles = getUniqueHoles();
        for (let i = 1; i <= addUpTo; i++) {
            if (!uniqueHoles.has(i)) {
                let holeToAdd = {"hole_number": i};
                addHoleApi(course.id, holeToAdd).then((newHole) => {
                    let updatedCourse = Object.assign({}, course);
                    updatedCourse.holes = [...course.holes, newHole];
                    onCourseChange(updatedCourse);
                })
            }
        }
    }

    function handleSubmit(event) {
        const name = document.getElementById(`name-${courseRowId}`).value;
        const holes = document.getElementById(`holes-${courseRowId}`).value;
        const location = document.getElementById(`location-${courseRowId}`).value;
        const fee = document.getElementById(`fee-${courseRowId}`).value;
        const editedFields = {
            name: name,
            holes: holes,
            location: location,
            fee: fee,
        }
    
        addHoles(editedFields.holes);

        for (let prop in editedFields) {
            if (editedFields[prop] === "") {
                editedFields[prop] = null;
            }
        }

        const newCourse = Object.assign({}, course, editedFields);
        delete newCourse.holes;
        delete newCourse.rounds;
        console.log(newCourse);
        editCourse(newCourse).then((freshCourse) => {
            onCourseChange(freshCourse);
            setEditing(false);
        });
    }


    function handleCheckbox(event) {
        const isFavorites = event.target.checked

        const newCourse = Object.assign({}, course, {favorite: isFavorites})
        editCourse(newCourse).then((freshCourse) => {
            onCourseChange(freshCourse);
        });
    }

    return (
        <tr key={course.id}>
            <th>
                {
                    editing ? 
                        <input className="form-control" id={`name-${courseRowId}`} name="name" type="text" defaultValue={course.name} required></input>
                        : <Link to={`./${course.id}`}>{course.name}</Link>
                }
            </th>
            <td>
                {
                    editing ? 
                        <input className="form-control" id={`holes-${courseRowId}`} name="holes" type="number" defaultValue={getHoleCount()}></input>
                        : getCourseDisplayValue(getHoleCount())
                }
            </td>
            <td>
                {
                    editing ? 
                        <input className="form-control" id={`location-${courseRowId}`} name="location" type="text" defaultValue={course.location}></input>
                        : getCourseDisplayValue(course.location)
                }
            </td>
            <td>
                {
                    editing ? 
                        <div class="input-group">
                            <div class="input-group-text">$</div>
                            <input className="form-control" id={`fee-${courseRowId}`} name="fee" type="number" defaultValue={course.fee}></input>
                        </div>
                        : `$${getCourseDisplayValue(course.fee)}`
                }
            </td>
            <td>
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={course.favorite} onChange={(event) => { handleCheckbox(event)}}></input>
                </div>
            </td>
            <td>
                {
                    <button type="button" className="btn btn-secondary" onClick={() => { handleOnClickNewRound() }} disabled={editing}>New&nbsp;Round</button>
                }
            </td>
            <td>
                <div className="btn-group" role="group" aria-label="Course action button group">
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