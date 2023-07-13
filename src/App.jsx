import { Outlet } from 'react-router-dom';
import NavBar from './components/nav-bar';

export default function App() {
    
    return (
        <>
            <NavBar />
            <br/>
            <div id="route-content" className="container">
                <Outlet />
            </div>
        </>
    );
}