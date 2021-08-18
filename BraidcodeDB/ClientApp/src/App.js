import React, { Component } from 'react';
import { Router, Route} from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { ClientRecs } from './components/ClientRecs';
import './custom.css';
import { history } from './helpers/history';
import { authenticationService } from './services/authentication.service';
import { PrivateRoute } from './components/PrivateRoute';
import { LoginPage } from './LoginPage/LoginPage';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null
        };
    }

    static displayName = App.name;
  
    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
      
        
    }
    logout() {
        authenticationService.logout();
        history.push('/login');
    }
   
    render() {
        return (
            <Router history={history}>
                <Layout>
                    <PrivateRoute exact path='/' component={Home} />
                    <PrivateRoute path='/ClientRecs' component={ClientRecs} />
                    <Route path="/login" component={LoginPage} />
                </Layout>
            </Router>
        );
    }
}
