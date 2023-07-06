export function getUser() {
    return fetch('http://127.0.0.1:5000/users', {
        credentials: "include",
    }).then((response) => response.json())
}

export function addUser(user) {
    return fetch('http://127.0.0.1:5000/users', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user),
        credentials: "include",
    }).then((response) => response.json())
}

export function editUser(freshUser) {
    return fetch(`http://127.0.0.1:5000/users/${freshUser.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(freshUser),
        credentials: "include",
    }).then((response) => response.json())
}

export function deleteUser(userToDelete) {
    return fetch(`http://127.0.0.1:5000/users/${userToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
    })
}

export function login(user) {
    return fetch('http://127.0.0.1:5000/users/login', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user),
        credentials: "include",
    }).then((response) => response.json())
}