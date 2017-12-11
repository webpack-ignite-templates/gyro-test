import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames'

import Overlay from '../components/Overlay'

class ResourceBox extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(pdf) {
        window.open(`assets/pdf/${pdf}`, '_blank');
    }

    //componentWillReceiveProps(newProps) {}

    render() {
        const {resourceName, isLocked, resources} = this.props;
        const pdf = resources[resourceName];
        const classNames = classnames('row', 'image', resourceName);
        return (
            <aside className="resource columns small-6 flex-container flex-dir-column" onClick={() => this.handleClick(pdf)}>
                <div className={classNames}>
                    <Overlay active={!isLocked}>
                        <span>Link to PDF</span>
                    </Overlay>
                </div>
                <div className="row align-top flex-child-grow">
                    <div className="column small-12 text-center">
                        {this.props.children}
                    </div>
                </div>
            </aside>
        );

    }
}

export default ResourceBox;

ResourceBox.propTypes = {
    resourceName: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLocked: PropTypes.bool,
    resources: PropTypes.object.isRequired
};

