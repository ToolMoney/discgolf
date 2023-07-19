import { apiTarget } from "../helpers/api-target"


export function getDiscs() {
    return fetch(`${apiTarget()}/discs`, {
        credentials: "include",
    }).then((response) => response.json())
}

export function addDisc(disc) {
    return fetch(`${apiTarget()}/discs`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(disc),
        credentials: "include",
    }).then((response) => response.json())
}

export function editDisc(freshDisc) {
    return fetch(`${apiTarget()}/discs/${freshDisc.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(freshDisc),
        credentials: "include",
    }).then((response) => response.json())
}

export function deleteDisc(discToDelete) {
    return fetch(`${apiTarget()}/${discToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
    })
}



// const discs = [
//     {id: 1, name: "Flamethrower", speed: 11.5, glide: 6, turn: -2, fade: 2, inBag: true}, 
//     {id: 2, name: "Destroyer", speed: 12, glide: 5, turn: -1, fade: 3, inBag: true}, 
//     {id: 3, name: "Sword", speed: 12, glide: 5, turn: -0.5, fade: 2, inBag: false}, 
//     {id: 4, name: "Hatchet", speed: 9, glide: 6, turn: -2, fade: 1, inBag: false}, 
//     {id: 5, name: "Harp", speed: 4, glide: 3, turn: 0, fade: 3, inBag: true}, 
//     {id: 6, name: "Sensei", speed: 3, glide: 3, turn: 0, fade: 1, inBag: true}
// ]