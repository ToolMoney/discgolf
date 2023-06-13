import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

export function useSetPath() {
    const [path, setPath] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (path) {
            navigate(path);
        }
    }, [path]);
    return setPath;
}