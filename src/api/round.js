import { apiTarget } from "../helpers/api-target"


export function getRounds() {
    return fetch(`${apiTarget()}/rounds`, {
        credentials: "include",
    }).then((response) => response.json())
}

export function addRound(round) {
    return fetch(`${apiTarget()}/rounds`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(round),
        credentials: "include",
    }).then((response) => response.json())
}

export function editRound(freshRound) {
    return fetch(`${apiTarget()}/rounds/${freshRound.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(freshRound),
        credentials: "include",
    }).then((response) => response.json())
}

export function deleteRound(roundToDelete) {
    return fetch(`${apiTarget()}/rounds/${roundToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
    })
}



export function getRound(roundId) {
    return fetch(`${apiTarget()}/rounds/${roundId}`, {
        credentials: "include",
    }).then((response) => response.json())
}

export function addScore(roundId, score) {
    return fetch(`${apiTarget()}/rounds/${roundId}/scores`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(score),
        credentials: "include",
    }).then((response) => response.json())
}

export function editScore(roundId, freshScore) {
    return fetch(`${apiTarget()}/rounds/${roundId}/scores/${freshScore.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(freshScore),
        credentials: "include",
    }).then((response) => response.json())
}

export function deleteScore(roundId, scoreToDelete) {
    return fetch(`${apiTarget()}/rounds/${roundId}/scores/${scoreToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
    })
}