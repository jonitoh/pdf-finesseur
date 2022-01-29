import React from "react";
import PropTypes from "prop-types";
import "./styles.scoped.css";

export const withItemsDragPreview = WrappedComponent => {
  const Wrapper = ({ items }) => {
    return (
      <div>
        {items.slice(0, 3).map((item, i) => (
          <div
            key={item.id}
            className="item item-dragged"
            style={{
              zIndex: items.length - i,
              transform: `rotateZ(${-i * 2.5}deg)`
            }}
          >
            <WrappedComponent item={item} />
          </div>
        ))}
      </div>
    );
  };
  return Wrapper;
}
