import React from 'react';
import {connect} from 'react-redux'
import RegisterForm from '../components/RegisterForm'
import Resources from '../components/Resources'

import * as actions from '../store/actions';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <main>
                <section className="row">
                    <RegisterForm setRegistered={this.props.setRegistered}/>
                    <Resources isLocked={!this.props.app.registered}/>
                </section>
            </main>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        app: state.app
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setRegistered: () => {
            dispatch(actions.app.setRegistered());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);