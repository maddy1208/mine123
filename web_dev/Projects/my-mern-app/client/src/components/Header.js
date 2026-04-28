import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <h1>My MERN App</h1>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/new-feature">New Feature</Link></li>
                    <li><Link to="/new-dashboard">New Dashboard</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;