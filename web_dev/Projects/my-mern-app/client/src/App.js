import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/existing/HomePage';
import ProfilePage from './pages/existing/ProfilePage';
import NewFeaturePage from './pages/added/NewFeaturePage';
import NewDashboard from './pages/added/NewDashboard';

function App() {
    return (
        <Router>
            <div>
                <Header />
                <Switch>
                    <Route path="/" exact component={HomePage} />
                    <Route path="/profile" component={ProfilePage} />
                    <Route path="/new-feature" component={NewFeaturePage} />
                    <Route path="/dashboard" component={NewDashboard} />
                </Switch>
                <Footer />
            </div>
        </Router>
    );
}

export default App;