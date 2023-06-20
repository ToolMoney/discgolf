import {useEffect, useState} from 'react';
import {useSetPath} from '../hooks';
import {useOutletContext} from 'react-router-dom';
import {addCourse as addCourseApi} from '../api/course';


export default function AddCourseForm() {
    const [courses, setCourses] = useOutletContext();
    const setPath = useSetPath();

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const courseToAdd = Object.fromEntries(formData.entries());
        courseToAdd.favorite = false;
        for (let prop in courseToAdd) {
            if (courseToAdd[prop] === "") {
                courseToAdd[prop] = null;
            }
        }
        addCourse(setPath, courses, setCourses, courseToAdd);
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


function addCourse(setPath, discs, setDiscs, discToAdd) {
    addCourseApi(discToAdd).then((newDisc) => {
        setDiscs([...discs, newDisc]);
    });
    setPath("..");
}

