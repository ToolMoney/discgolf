import {Outlet, Link} from 'react-router-dom';

export default function App() {
    return (
        <>
            <div id="header">
                <div id="navigation">
                    <button>
                        <Link to={`rounds`}>Rounds</Link>
                    </button>
                    <button>
                        <Link to={`courses`}>Courses</Link>
                    </button>
                    <button>
                        <Link to={`bag`}>Bag</Link>
                    </button>
                    <button>
                        <Link to={`profile`}>Profile</Link>
                    </button>
                </div>
            </div>
            <div id="route-content">
                <Outlet />
            </div>
        </>
    );
}