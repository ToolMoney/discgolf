import { Link, Outlet, useParams } from "react-router-dom"
import { getCourse, editHole, deleteHole } from "../api/course";
import { useEffect, useState } from "react";


export default function CoursePage() {
    let {id} = useParams();
    const [course, setCourse] = useState(null);
    const [holes, setHoles] = useState(null);
    const [layout, setLayout] = useState("");
    useEffect(() => {
        getCourse(id).then(
            (fetchedCourse) => {
                setCourse(fetchedCourse);
                setHoles(fetchedCourse.holes);
            }
        );
    }, []);


    return (
        <>
            <div>
                <AddHoleButton />
            </div>
            <div id="route-content">
                <Outlet context={[course, holes, setHoles]} />
            </div>
            <div>
                <CourseInfo course={course}/>
            </div>
            <div>
                <LayoutSwitch layout={layout} onLayoutChange={setLayout} />
            </div>
            <div>
                <ListHoles 
                    layout={layout}
                    holes={holes}
                    onHolesChange={setHoles}
                    course={course}
                />
            </div>
        </>
    );
}

function AddHoleButton() {
    const [addFormOpen, setAddFormOpen] = useState(false);
    let linkTo = addFormOpen ? "." : "add-hole"

    return (
        <button type="button" onClick={() => { setAddFormOpen(!addFormOpen) }}>
            <Link to={linkTo}>Add Hole to Course</Link>
        </button>
    );
}

function CourseInfo({ course }) {
    if (!course) {
        return <div key='loading'>Your Data is Loading...</div>
    }
    return (
        <>
            <div>{course.name}</div>
            <div>{course.location}</div>
            <div>{course.fee}</div>
            <div>ID: {course.id}</div>
        </>
    );
}

function LayoutSwitch({ layout, onLayoutChange }) {
    return (
        <>
            <span>Layout</span>
            <select value={layout} onChange={(event) => onLayoutChange(event.target.value)}>
                <option value="">All</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
            </select>
        </>
    );
}


function ListHoles({
    layout, 
    holes,
    onHolesChange,
    course
}) {

    function TableHeaders() {
        return (
            <div className="table-row hole-row header">
                <div className="header-hole-number span-1">Hole</div>
                <div className="header-par span-1">Par</div>
                <div className="header-layout span-1">Layout</div>
                <div className="header-distance span-1">Distance</div>
            </div>
        );
    }

    if (!holes) {
        return (
            <>
                <div className="hole-table">
                    <TableHeaders />
                    <div key='loading'>Your Data is Loading...</div>
                </div>
            </>
        );
    }

    const holesRows = [];
    holes.forEach((hole) => {

        function onHoleChange(newHole) {
            let index = holes.indexOf(hole);
            onHolesChange([
                ...holes.slice(0, index),
                newHole,
                ...holes.slice(index + 1)
            ])
        }

        function onHoleDelete() {
            let index = holes.indexOf(hole);
            onHolesChange([
                ...holes.slice(0, index),
                ...holes.slice(index + 1)
            ])
        }

        if (!layout || hole.layout == layout) {
            holesRows.push(
                <HoleRow key={hole.id} 
                    hole={hole} 
                    onHoleChange={onHoleChange} 
                    onHoleDelete={onHoleDelete}
                    course={course}
                />
            );
        }
    });

    return (
        <>
            <div className="hole-table">
                <TableHeaders />
                {holesRows}
            </div>
        </>
    );
}


function HoleRow({hole, onHoleChange, onHoleDelete, course}) {
    const [editing, setEditing] = useState(false);

    function getHoleDisplayValue(value) {
        if (!value && value !== 0) {
            return "-";
        }
        return value;
    }

    function handleOnClickEdit() {
        console.log('Editing hole with id', course.id);
        setEditing(!editing);
    }

    function handleOnClickDelete() {
        if (window.confirm(`Would you like to delete hole ${hole.hole_number}?`)) {
            deleteHole(course.id, hole).then(() => onHoleDelete())
        }
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

        const newHole = Object.assign({}, hole, editedFields);
        console.log(newHole);
        editHole(course.id, newHole).then((freshHole) => {
            onHoleChange(freshHole);
            setEditing(false);
        });
    }

    return (
        <form key={course.id} className="table-row hole-row" onSubmit={(event) => handleSubmit(event)}>
            <div className="hole-number span-1">
                {
                    editing ? 
                        <input className="edit-field" name="hole_number" type="number" defaultValue={hole.hole_number} required></input>
                        : hole.hole_number
                }
            </div>
            <div className="hole-par span-1">
                {
                    editing ? 
                        <input className="edit-field" name="par" type="number" defaultValue={hole.par}></input>
                        : getHoleDisplayValue(hole.par)
                }
            </div>
            <div className="hole-layout span-1">
                {
                    editing ? 
                        <input className="edit-field" name="layout" type="text" defaultValue={hole.layout}></input>
                        : getHoleDisplayValue(hole.layout)
                }
            </div>
            <div className="hole-distance span-1">
                {
                    editing ? 
                        <input className="edit-field" name="distance" type="number" defaultValue={hole.distance}></input>
                        : `${getHoleDisplayValue(hole.distance)} ft`
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