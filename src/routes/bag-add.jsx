import {useEffect, useState} from 'react';
import {useSetPath} from '../hooks';
import {useOutletContext} from 'react-router-dom';
import {addDisc as addDiscApi} from '../api/disc';


export default function AddDiscForm() {
    const [discs, setDiscs] = useOutletContext();
    const setPath = useSetPath();

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const discToAdd = Object.fromEntries(formData.entries());
        discToAdd.inBag = true;
        for (let prop in discToAdd) {
            if (discToAdd[prop] === "") {
                discToAdd[prop] = null;
            }
        }
        addDisc(setPath, discs, setDiscs, discToAdd);
    }
    return (
        <form method="post" onSubmit={handleSubmit}>
            Name: <input name="name" required />
            <br />
            Speed: <input name="speed" />
            <br />
            Glide: <input name="glide" />
            <br />
            Turn: <input name="turn" />
            <br />
            Fade: <input name="fade" />
            <br />
            <button type="button" onClick={() => setPath("..")}>Cancel</button>
            <button type="submit">Add</button>
        </form>
    );
}



function addDisc(setPath, discs, setDiscs, discToAdd) {
    addDiscApi(discToAdd).then((newDisc) => {
        setDiscs([...discs, newDisc]);
    });
    // add real disc shit in here

    setPath("..");
    // loading disc
}

