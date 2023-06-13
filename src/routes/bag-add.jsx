import {useEffect, useState} from 'react';
import {useSetPath} from '../hooks';


export default function AddDiscToBag() {
    const setPath = useSetPath();
    return (
        <>
            <input></input>
            <button onClick={() => addDisc(setPath)}>Add it up!</button>
        </>
    );
}

function addDisc(setPath) {

    // add real disc shit in here


    setPath("..");
}

