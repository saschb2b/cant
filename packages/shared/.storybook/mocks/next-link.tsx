import type { AnchorHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: ReactNode;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function MockLink(
  { href, children, style, ...rest },
  ref,
) {
  return (
    <a ref={ref} href={href} style={style} {...rest}>
      {children}
    </a>
  );
});

export default Link;
