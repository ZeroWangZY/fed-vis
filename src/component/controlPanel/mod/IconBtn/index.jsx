import React from "react";
import classNames from "classnames";
import Icon from "@ant-design/icons";

import "./index.less";
export default function IconBtn({
  title,
  component,
  onClick,
  style,
  active,
  noBorder,
}) {
  const img = (
    <Icon
      className={classNames("icon-btn", {
        "icon-btn-active": active,
        "icon-btn-border": noBorder,
      })}
      component={component}
      fill={active ? "#1890ff" : "#aaa"}
      style={{
        fontSize: "35px",
        color: active ? "#1890ff" : "#aaa",
      }}
    />
  );
  if (!onClick) return img;
  const handleClick = (e) => {
    e.preventDefault();
    onClick();
  };
  return (
    <a
      href="#"
      style={style}
      className="icon-btn-btn"
      title={title}
      onClick={handleClick}
    >
      {img}
    </a>
  );
}
