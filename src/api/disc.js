import { json } from "react-router-dom";


export function getDiscs() {
    return fetch('http://127.0.0.1:5000/discs').then((response) => response.json())
}

export function addDisc(disc) {
    let rand = Math.floor(Math.random() * 10000000);
    disc.id = rand;
    // discs.push(disc);
    return fetch('http://127.0.0.1:5000/discs', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(disc),
    }).then((response) => response.json())
}

export function editDisc(freshDisc) {
    for (let disc of discs) {
        if (freshDisc.id === disc.id) {
            Object.assign(disc, freshDisc);
            break;
        }
    }
    return Promise.resolve(freshDisc);
}

export function deleteDisc(discToDelete) {
    for (let disc of discs) {
        if (discToDelete.id === disc.id) {
            let index = discs.indexOf(disc);
            discs.splice(index, 1);
            break;
        }
    }
    return Promise.resolve();
}



const discs = [
    {id: 1, name: "Flamethrower", speed: 11.5, glide: 6, turn: -2, fade: 2, inBag: true}, 
    {id: 2, name: "Destroyer", speed: 12, glide: 5, turn: -1, fade: 3, inBag: true}, 
    {id: 3, name: "Sword", speed: 12, glide: 5, turn: -0.5, fade: 2, inBag: false}, 
    {id: 4, name: "Hatchet", speed: 9, glide: 6, turn: -2, fade: 1, inBag: false}, 
    {id: 5, name: "Harp", speed: 4, glide: 3, turn: 0, fade: 3, inBag: true}, 
    {id: 6, name: "Sensei", speed: 3, glide: 3, turn: 0, fade: 1, inBag: true}
]