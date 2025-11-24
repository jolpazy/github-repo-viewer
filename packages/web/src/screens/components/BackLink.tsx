import { colors, fontSizes, space } from "@repo-viewer/shared";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const BackLink = styled(Link)`
  align-self: flex-start;
  margin-bottom: ${space.lg}px;
  color: ${colors.reactBlue};
  text-decoration: none;
  font-size: ${fontSizes.sm}px;
  font-weight: 600;
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -2px;
    left: 0;
    background-color: ${colors.reactBlue};
    transition: width 0.3s ease-in-out;
  }

  &:hover::after {
    width: 100%;
  }
`;
