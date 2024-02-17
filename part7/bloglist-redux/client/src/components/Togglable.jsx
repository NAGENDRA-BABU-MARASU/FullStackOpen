import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Button } from "semantic-ui-react";
import PropTypes from "prop-types";
const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);
  const hideWhenVisible = {
    display: visible ? "none" : "",
  };
  const showWhenVisible = {
    display: visible ? "" : "none",
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button primary onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button
          secondary
          size="small"
          style={{ margin: "5px 0" }}
          onClick={toggleVisibility}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
});
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};
Togglable.displayName = "Togglable";
export default Togglable;
