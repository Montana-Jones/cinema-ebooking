import React from "react";

type ButtonProps = {
  text: string;
  type?: "button" | "submit";
  className?: string;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  text,
  type = "button",
  className,
  onClick,
}) => {
  return (
    <button type={type} className={className} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
