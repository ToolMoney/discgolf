

export function getDiscs() {
    return Promise.resolve(discs);
}

export function addDisc(disc) {
    let rand = Math.floor(Math.random() * 10000000);
    disc.id = rand;
    discs.push(disc);
    return Promise.resolve(disc);
}

export function editDisc(freshDisc) {
    for (let disc of discs) {
        if (freshDisc.id === disc.id) {
            Object.assign(disc, freshDisc);
        }
    }
    return Promise.resolve(freshDisc);
}

const discs = [
    {id: 1, name: "Flamethrower", speed: 11.5, glide: 6, turn: -2, fade: 2, inBag: true}, 
    {id: 2, name: "Destroyer", speed: 12, glide: 5, turn: -1, fade: 3, inBag: true}, 
    {id: 3, name: "Sword", speed: 12, glide: 5, turn: -0.5, fade: 2, inBag: false}, 
    {id: 4, name: "Hatchet", speed: 9, glide: 6, turn: -2, fade: 1, inBag: false}, 
    {id: 5, name: "Harp", speed: 4, glide: 3, turn: 0, fade: 3, inBag: true}, 
    {id: 6, name: "Sensei", speed: 3, glide: 3, turn: 0, fade: 1, inBag: true}
]