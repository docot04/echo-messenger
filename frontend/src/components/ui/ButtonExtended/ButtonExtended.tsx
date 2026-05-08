import React from "react";
import { Button } from "../Button/Button";

type Props = {
  icon?: string;
  title: string;
  arrow?: "left" | "right" | "none";
  bars?: boolean;
  subtitle?: string;
  context1?: string;
  context2?: string;
  contextHighlight?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  active?: "left" | "right" | "top" | "bottom" | "default" | "none";
  height?: string;
  width?: string;
};

export const ButtonExtended: React.FC<Props> = ({
  icon,
  title,
  subtitle,
  context1,
  context2,
  contextHighlight = false,
  arrow,
  bars,
  active,
  ...buttonProps
}) => {
  return (
    <Button
      {...buttonProps}
      bars={bars}
      arrow={arrow}
      active={active}
      className={`btn-extended ${buttonProps.className || ""}`}
    >
      <div className="content">
        {icon && (
          <div className="icon">
            <img src={icon} alt="" />
          </div>
        )}

        <div className="main">
          <div className="title" title={title}>
            {title}
          </div>
          {subtitle && (
            <div className="subtitle" title={subtitle}>
              {subtitle}
            </div>
          )}
        </div>

        {(context1 || context2) && (
          <div
            className={`context ${contextHighlight ? "context-highlight" : ""}`}
          >
            {context1 && <div className="context1">{context1}</div>}
            {context2 && <div className="context2">{context2}</div>}
          </div>
        )}
      </div>
    </Button>
  );
};
