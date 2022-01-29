import React from "react";
import "./selector.scoped.css";

const Selector = ({ label, value, options, onChange, ...rest }) => (
    <div className="wrapper">
        <h3 className="label">{label}</h3>
        <select
            value={value}
            onChange={onChange}
            {...rest}
        >
            {options
                .map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))
            }
        </select>
    </div>
)

export default Selector;