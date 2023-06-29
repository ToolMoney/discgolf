import {useState, useEffect} from 'react';
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
            <div>
                <AddCourseButton />
            </div>
            <div id="route-content">
                <Outlet context={[courses, setCourses]} />
            </div>
            <div>
                <FavoritesSwitch favoritesOnly={favoritesOnly} onFavoritesChange={setFavoritesOnly} />
            </div>
            <div>
                <ListCourses 
                    favoritesOnly={favoritesOnly}
                    courses={courses}
                    onCoursesChange={setCourses}
                />
            </div>
        </>
    );
}



function AddCourseButton() {
    const [addFormOpen, setAddFormOpen] = useState(false);
    let linkTo = addFormOpen ? "." : "add-course"

    return (
        <button type="button" onClick={() => { setAddFormOpen(!addFormOpen) }}>
            <Link to={linkTo}>Add Course to Catalog</Link>
        </button>
    );
}


function FavoritesSwitch({ favoritesOnly, onFavoritesChange }) {
    return (
        <>
            <span>Favorites</span>
            <input 
                type="checkbox" 
                checked={favoritesOnly} 
                onChange={(event) => onFavoritesChange(event.target.checked)} 
            />
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
            <div className="table-row course-row header">
                <div className="header-name span-1">Name</div>
                <div className="header-holes span-1">Holes</div>
                <div className="header-location span-1">Location</div>
                <div className="header-fee span-1">Fee</div>
                <div className="header-favorite span-1">Favorite?</div>
                <div className="header-new-round span-1">Start Round</div>
            </div>
        );
    }

    if (!courses) {
        return (
            <>
                <div className="course-table">
                    <TableHeaders />
                    <div key='loading'>Your Data is Loading...</div>
                </div>
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
            <div className="course-table">
                <TableHeaders />
                {coursesRows}
            </div>
        </>
    );
}



function CourseRow({course, onCourseChange, onCourseDelete}) {
    const [editing, setEditing] = useState(false);
    const setPath = useSetPath();


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
            const fullDate = (new Date()).toISOString();
            const date = fullDate.split('').slice(0, 16).join('');
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
        event.preventDefault();

        const formData = new FormData(event.target);
        const editedFields = Object.fromEntries(formData.entries());
    
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
        <form key={course.id} className="table-row course-row" onSubmit={(event) => handleSubmit(event)}>
            <div className="course-name span-1">
                {
                    editing ? 
                        <input className="edit-field" name="name" type="text" defaultValue={course.name} required></input>
                        : <Link to={`./${course.id}`}>{course.name}</Link>
                }
            </div>
            <div className="course-holes span-1">
                {
                    editing ? 
                        <input className="edit-field" name="holes" type="number" defaultValue={getHoleCount()}></input>
                        : getCourseDisplayValue(getHoleCount())
                }
            </div>
            <div className="course-location span-1">
                {
                    editing ? 
                        <input className="edit-field" name="location" type="text" defaultValue={course.location}></input>
                        : getCourseDisplayValue(course.location)
                }
            </div>
            <div className="course-fee span-1">
                {
                    editing ? 
                        <>
                            $ &nbsp;
                            <input className="edit-field fee-field" name="fee" type="number" defaultValue={course.fee}></input>
                        </>
                        : `$ ${getCourseDisplayValue(course.fee)}`
                }
            </div>
            <div className="course-favorite span-1">
                <input type="checkbox" checked={course.favorite} onChange={(event) => { handleCheckbox(event)}}></input>
            </div>
            <div className="course-start span-1">
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