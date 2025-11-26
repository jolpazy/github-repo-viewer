import styled from "styled-components";
import { colors, fontSizes, space } from "@repo-viewer/shared/dist";

export const Wrapper = styled.div`
  background-color: ${colors.reactGrey};
  color: ${colors.white};
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${space.xl}px;
`;

export const Title = styled.h1`
  font-size: ${fontSizes.xl}px;
  margin-bottom: ${space.xl}px;
  margin-top: 0;
`;

export const Empty = styled.p`
  font-size: ${fontSizes.md}px;
  opacity: 0.85;
  margin-top: ${space.xl}px;
`;

export const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 350px);
  gap: ${space.xl}px;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
`;
