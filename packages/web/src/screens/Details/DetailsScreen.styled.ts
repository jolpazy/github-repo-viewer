import styled from "styled-components";
import { colors, fontSizes, space, radii } from "@repo-viewer/shared/dist";

export const Wrapper = styled.div`
  background-color: ${colors.reactLightGrey};
  color: ${colors.white};
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: ${space.xl}px;
`;

export const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${space.lg}px;
`;

export const HeartButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: ${fontSizes.lg}px;
  padding: 0;
  color: ${colors.reactBlue};

  &:hover {
    opacity: 0.8;
  }
`;

export const Avatar = styled.img`
  width: 96px;
  height: 96px;
  border-radius: ${radii.pill}px;
  object-fit: cover;
  margin-bottom: ${space.md}px;
`;

export const View = styled.div`
  padding: ${space.xl}px;
  border-radius: ${radii.md}px;
  max-width: 640px;
  width: 100%;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: ${fontSizes.xl}px;
  margin-bottom: ${space.sm}px;
  color: ${colors.reactBlue};
`;

export const Owner = styled.p`
  font-size: ${fontSizes.sm}px;
  opacity: 0.8;
  margin-bottom: ${space.md}px;
`;

export const Description = styled.p`
  font-size: ${fontSizes.md}px;
`;

export const Meta = styled.p`
  font-size: ${fontSizes.sm}px;
  opacity: 0.8;
  margin-bottom: ${space.sm}px;
`;

export const GithubLink = styled.a`
  color: ${colors.reactBlue};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const Message = styled.p`
  font-size: ${fontSizes.md}px;
  opacity: 0.85;
`;
