import { cloneElement } from "react";
import "./PauseMenu.css";

export default function PauseMenu({
  layout,
  heightPerButtonPercenatage,
  children,
}) {
  console.log("children", children);
  const mappedChildren = children.map((child) => {
    // child.props = { ...child.props, heightPercentage: 100 / children.length };
    return cloneElement(child, {
      ...child.props,
      heightPercentage: 100 / children.length,
    });
  });
  const { height, width, top, left } = layout;
  return (
    // <div className="pause-menu-container" style={{ height, width, top, left }}>
    <div className="pause-menu-container">
      <div
        className="pause-menu-button-container"
        style={{
          height: children.length * heightPerButtonPercenatage + "%",
          width: "30%",
        }}
      >
        {mappedChildren}
      </div>
    </div>
  );
}
