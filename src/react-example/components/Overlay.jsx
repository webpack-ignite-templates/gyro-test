import React from 'react';
import PropTypes from 'prop-types';

class Overlay extends React.Component {
    constructor(props) {
        super(props);
    }

    //componentWillReceiveProps(newProps) {}

    render() {
        const {active} = this.props;
        return (
            active ?
                <div className="overlay">{this.props.children}</div>
                : null
        );

    }
}

export default Overlay;

Overlay.propTypes = {
    active: PropTypes.bool,
    children: PropTypes.any
};


