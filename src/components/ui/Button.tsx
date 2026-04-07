import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", className = "", ...rest }, ref) => {
    const cls = variant === "primary" ? "btn-primary" : "btn-ghost";
    return <button ref={ref} className={`${cls} ${className}`} {...rest} />;
  }
);

Button.displayName = "Button";
export default Button;
