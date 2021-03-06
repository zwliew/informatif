import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components/macro";

const activeClassName = "AppNavLink--selected";

const StyledAppNavLink = styled(NavLink)`
  color: var(--text-color);
  font-size: 1.5rem;
  padding: 0 8px;
  text-decoration: none;
  transition: color 80ms ease-out;

  :hover {
    color: var(--primary-color);
  }

  &.${activeClassName} {
    color: var(--primary-color);
  }
`;

export default function AppNavLink({
  children,
  title,
  to,
}: {
  children: {};
  title: string;
  to: string;
}) {
  return (
    <StyledAppNavLink
      exact
      to={to}
      activeClassName={activeClassName}
      title={title}
    >
      {children}
    </StyledAppNavLink>
  );
}
