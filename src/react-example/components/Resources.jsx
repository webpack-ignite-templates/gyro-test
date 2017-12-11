import React from 'react';
import PropTypes from 'prop-types';

import ResourceBox from '../components/ResourceBox'
import Overlay from '../components/Overlay'

class Resources extends React.Component {
    constructor(props) {
        super(props);

        this.resources = {
            injury: 'example.pdf',
            safety: 'example.pdf',
            insurance: 'example.pdf',
            data: 'example.pdf'
        }

    }

    render() {
        const {isLocked} = this.props;
        return (
            <div className="resources column small-12 medium-6">
                <Overlay active={isLocked}>
                </Overlay>
                <div className="row">
                    <ResourceBox resourceName="injury" isLocked={isLocked} resources={this.resources}>
                        <h3>Capabilities</h3>
                        <p>See what we can do!</p>
                    </ResourceBox>
                    <ResourceBox resourceName="safety" isLocked={isLocked} resources={this.resources}>
                        <h3>Thinking</h3>
                        <p>Great thinking leads to great results for your business!</p>
                    </ResourceBox>
                    <ResourceBox resourceName="insurance" isLocked={isLocked} resources={this.resources}>
                        <h3>News</h3>
                        <p>What have we been up to!</p>
                    </ResourceBox>
                    <ResourceBox resourceName="data" isLocked={isLocked} resources={this.resources}>
                        <h3>Process</h3>
                        <p>ignite something.</p>
                    </ResourceBox>
                </div>
            </div>
        );

    }
}

export default Resources;


Resources.propTypes = {
    isLocked: PropTypes.bool
};



