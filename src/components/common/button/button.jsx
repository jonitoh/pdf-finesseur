import React from 'react';
import "./button.scoped.css";
import PropTypes from 'prop-types';

const Button = (props) => (< button {...props} />);

export default Button;

Button.propTypes = {
    props: PropTypes.object,
}