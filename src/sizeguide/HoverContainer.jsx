import { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const HoverContainer = ({ measurement, onHover, Elem, elemProps, children }) => {
  const el = useRef();

  const mouseEnter = useCallback(() => onHover(measurement), [measurement, onHover]);
  const mouseLeave = useCallback(() => onHover(""), [onHover]);

  useEffect(() => {
    const target = el.current;
    target.addEventListener("mouseenter", mouseEnter);
    target.addEventListener("mouseleave", mouseLeave);

    return () => {
      target.removeEventListener("mouseenter", mouseEnter);
      target.removeEventListener("mouseleave", mouseLeave);
    };
  }, [mouseEnter, mouseLeave]);

  return (
    <Elem {...elemProps} ref={el}>
      {children}
    </Elem>
  );
};

HoverContainer.propTypes = {
  children: PropTypes.node,
  measurement: PropTypes.string.isRequired,
  onHover: PropTypes.func.isRequired,
  Elem: PropTypes.elementType.isRequired,
  elemProps: PropTypes.any,
};

export default HoverContainer;
