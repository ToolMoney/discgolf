import { apiTarget } from "../helpers/api-target"


export function getUser() {
    return fetch(`${apiTarget()}/users`, {
        credentials: "include",
    }).then((response) => response.json())
}

export function addUser(user) {
    return fetch(`${apiTarget()}/users`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user),
        credentials: "include",
    }).then((response) => response.json())
}

export function editUser(freshUser) {
    return fetch(`${apiTarget()}/users/${freshUser.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(freshUser),
        credentials: "include",
    }).then((response) => response.json())
}

export function deleteUser(userToDelete) {
    return fetch(`${apiTarget()}/users/${userToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
    })
}

export function login(user) {
    return fetch(`${apiTarget()}/users/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user),
        credentials: "include",
    }).then((response) => response.json())
}

export function getSelf() {
    return fetch('http://127.0.0.1:5000/users/self', {
        credentials: "include",
    }).then((response) => response.json())
}