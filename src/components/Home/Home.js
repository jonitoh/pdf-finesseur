
import React from 'react';
import PropTypes from 'prop-types';
import './Home.css';

const Home = ({placeholder}) => (
        <div className="app__placeholder">
            {placeholder}
        </div>
)

export default Home;

Home.propTypes = {
    placeholder: PropTypes.string.isRequired
}