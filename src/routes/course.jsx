import {useParams} from "react-router-dom"


export default function CoursePage() {
    let {id} = useParams();
    return (
        <>
            hello course {id}  
        </>
    )
}