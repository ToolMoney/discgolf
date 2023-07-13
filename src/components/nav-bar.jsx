import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
    const path = useLocation().pathname;
    return (
        <nav id="navigation" className="navbar navbar-expand">
            <div className="container-fluid navbar-nav nav-pills">
                <ul className="nav">
                    <li className="nav-item">
                        <Link to={`rounds`} className={`nav-link ${path.includes('/rounds') ? 'active' : ''}`}>Rounds</Link>
                    </li>
                    <li className="nav-item">
                        <Link to={`courses`} className={`nav-link ${path.includes('/courses') ? 'active' : ''}`}>Courses</Link>
                    </li>
                    <li className="nav-item">
                        <Link to={`bag`} className={`nav-link ${path.includes('/bag') ? 'active' : ''}`}>Bag</Link>
                    </li>
                </ul>
                <div className="nav-item">
                    <Link to={`profile`} className={`nav-link ${path.includes('/profile') ? 'active' : ''}`}>Profile</Link>
                </div>
            </div>
        </nav>
    )
}
