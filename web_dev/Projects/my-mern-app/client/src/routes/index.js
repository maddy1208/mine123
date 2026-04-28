import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from '../pages/existing/HomePage';
import ProfilePage from '../pages/existing/ProfilePage';
import NewFeaturePage from '../pages/added/NewFeaturePage';
import NewDashboard from '../pages/added/NewDashboard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Routes = () => {
    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/profile" component={ProfilePage} />
                <Route path="/new-feature" component={NewFeaturePage} />
                <Route path="/dashboard" component={NewDashboard} />
            </Switch>
            <Footer />
        </Router>
    );
};

export default Routes;