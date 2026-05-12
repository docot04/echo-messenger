import { type ButtonExtendedProps } from "@/services";
import { Button } from "../Button/Button";

export const ButtonExtended = ({
  icon,
  title,
  subtitle,
  context1,
  context2,
  contextHighlight = false,
  arrow,
  bars,
  active,
  onClick,
  ...buttonProps
}: ButtonExtendedProps) => {
  return (
    <Button
      {...buttonProps}
      bars={bars}
      arrow={arrow}
      active={active}
      className={`btn-extended ${buttonProps.className || ""}`}
    >
      <div className="btn-extended-content">
        {icon && (
          <div className="btn-extended-icon">
            <img src={icon} alt="" />
          </div>
        )}

        <div className="btn-extended-main">
          <div className="btn-extended-title" title={title}>
            {title}
          </div>
          {subtitle && (
            <div className="btn-extended-subtitle" title={subtitle}>
              {subtitle}
            </div>
          )}
        </div>

        {(context1 || context2) && (
          <div
            className={`btn-extended-context ${contextHighlight ? "btn-extended-context-highlight" : ""}`}
          >
            {context1 && (
              <div className="btn-extended-context1">{context1}</div>
            )}
            {context2 && (
              <div className="btn-extended-context2">{context2}</div>
            )}
          </div>
        )}
      </div>
    </Button>
  );
};
