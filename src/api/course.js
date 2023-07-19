import { apiTarget } from "../helpers/api-target"


export function getCourses() {
    return fetch(`${apiTarget()}/courses`, {
        credentials: "include",
    }).then((response) => response.json())
}

export function addCourse(course) {
    return fetch(`${apiTarget()}/courses`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(course),
        credentials: "include",
    }).then((response) => response.json())
}

export function editCourse(freshCourse) {
    return fetch(`${apiTarget()}/courses/${freshCourse.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(freshCourse),
        credentials: "include",
    }).then((response) => response.json())
}

export function deleteCourse(courseToDelete) {
    return fetch(`${apiTarget()}/courses/${courseToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
    })
}

export function getCourse(courseId) {
    return fetch(`${apiTarget()}/courses/${courseId}`, {
        credentials: "include",
    }).then((response) => response.json())
}

export function addHole(courseId, hole) {
    return fetch(`${apiTarget()}/courses/${courseId}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(hole),
        credentials: "include",
    }).then((response) => response.json())
}

export function editHole(courseId, freshHole) {
    return fetch(`${apiTarget()}/courses/${courseId}/${freshHole.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(freshHole),
        credentials: "include",
    }).then((response) => response.json())
}

export function deleteHole(courseId, holeToDelete) {
    return fetch(`${apiTarget()}/courses/${courseId}/${holeToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
    })
}