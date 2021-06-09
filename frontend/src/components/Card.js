/* Card.js */

import PropTypes from 'prop-types';

/**
 * Card component
 * 
 * Bootstrap card class to wrap around other components
 */
function Card(props) {
    return (
        <div className="card">
            <div className="card-body">
                <h2 className="text-center">{props.title}</h2>
                {props.children}
            </div>
        </div>
    );
}

Card.propTypes = {
    title: PropTypes.string.isRequired
}

export default Card;