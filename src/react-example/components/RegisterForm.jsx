import React from 'react';
import PropTypes from 'prop-types';

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counter:0
        };

        this.incrementCounter = this.incrementCounter.bind(this);
    }

    incrementCounter() {
        const currentState = {...this.state};
        currentState.counter++;
        this.setState(currentState);
        window.setTimeout(()=>{this.incrementCounter()}, 1000);
    }

    componentDidMount() {
        this.incrementCounter();
    }

    render() {
        const {setRegistered} = this.props;
        const {counter} = this.state;
        return (
            <div className="form column small-12 medium-6">
                {counter}
                <div className="row">
                    <div className="column small-8 medium-10 medium-offset-1">
                        <div className="row">
                            <div className="column small-12 medium-10 text-center">
                                <form>
                                    <button type="button" onClick={setRegistered} className="button">Get Resources</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

export default RegisterForm;


RegisterForm.propTypes = {
    setRegistered: PropTypes.func
};
