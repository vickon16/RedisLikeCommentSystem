import React from "react";

const IconButton = ({
  Icon,
  onClick,
  isActive,
  disabled,
  color,
  children,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-2 py-1 px-2.5 border-none rounded font-semibold cursor-pointer hover:text-secondaryText disabled:text-secondaryText/40 disabled:cursor-not-allowed
      ${color || "text-lightSecondaryText"} ${isActive ? "relative text-secondaryText" : ""} `}
    >
      <span>
        <Icon />
      </span>
      {children}
    </button>
  );
};

export default IconButton;
