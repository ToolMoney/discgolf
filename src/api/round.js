export function getRounds() {
    return fetch('http://127.0.0.1:5000/rounds').then((response) => response.json())
}

export function addRound(round) {
    return fetch('http://127.0.0.1:5000/rounds', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(round),
    }).then((response) => response.json())
}

export function editRound(freshRound) {
    return fetch(`http://127.0.0.1:5000/rounds/${freshRound.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(freshRound),
    }).then((response) => response.json())
}

export function deleteRound(roundToDelete) {
    return fetch(`http://127.0.0.1:5000/rounds/${roundToDelete.id}`, {
        method: "DELETE",
    })
}



export function getRound(roundId) {
    return fetch(`http://127.0.0.1:5000/rounds/${roundId}`).then((response) => response.json())
}

export function addScore(roundId, score) {
    return fetch(`http://127.0.0.1:5000/rounds/${roundId}/scores`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(score),
    }).then((response) => response.json())
}

export function editScore(roundId, freshScore) {
    return fetch(`http://127.0.0.1:5000/rounds/${roundId}/scores/${freshScore.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(freshScore),
    }).then((response) => response.json())
}

export function deleteScore(roundId, scoreToDelete) {
    return fetch(`http://127.0.0.1:5000/rounds/${roundId}/scores/${scoreToDelete.id}`, {
        method: "DELETE",
    })
}