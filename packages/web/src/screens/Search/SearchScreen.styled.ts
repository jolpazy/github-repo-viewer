import styled from "styled-components";
import { NavLink } from "../../components/NavLink/NavLink";
import { colors, fontSizes, space, radii } from "@repo-viewer/shared/dist";

export const Wrapper = styled.div`
  background-color: ${colors.reactGrey};
  color: ${colors.white};
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${space.xl}px;
  font-family: "Inter", system-ui, sans-serif;
  overflow: hidden;
`;

export const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: ${space.lg}px;
`;

export const FavoritesLink = styled(NavLink)`
  font-size: ${fontSizes.sm}px;
`;

export const Subtitle = styled.p`
  font-size: ${fontSizes.lg}px;
  opacity: 0.85;
  margin-bottom: ${space.xl}px;
  margin-top: 0;
  text-align: center;
  width: 100%;
`;

export const SearchContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background: ${colors.reactLightGrey};
  border-radius: ${radii.pill}px;
  display: flex;
  align-items: center;
  padding: ${space.sm}px ${space.lg}px;
  gap: ${space.md}px;
  margin: 0 auto ${space.lg}px auto;

  &:focus-within {
    opacity: 1;
    box-shadow: 0 0 0 2px ${colors.reactBlue};
  }
`;

export const SearchIcon = styled.span`
  font-size: ${fontSizes.lg}px;
  opacity: 0.6;
`;

export const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${colors.white};
  font-size: ${fontSizes.md}px;
`;

export const Result = styled.p`
  font-size: ${fontSizes.md}px;
  margin: ${space.xs}px 0;
  text-align: center;
`;

export const LoadMoreButton = styled.button`
  margin-top: ${space.lg}px;
  padding: ${space.sm}px ${space.lg}px;
  font-size: ${fontSizes.md}px;
  border-radius: ${radii.md}px;
  background: ${colors.reactBlue};
  color: ${colors.white};
  border: none;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: ${colors.reactLightGrey};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 350px);
  gap: ${space.xl}px;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
`;

export const ResultsWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  margin-top: ${space.lg}px;
  background: transparent;

  display: flex;
  justify-content: center;
  padding: 0 ${space.md}px;

  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-track {
    background: ${colors.reactGrey};
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${colors.reactLightGrey};
    opacity: 0.12;
    border-radius: 8px;
    border: 3px solid transparent;
    background-clip: padding-box;
  }
  &::-webkit-scrollbar-thumb:hover {
    opacity: 0.22;
  }

  scrollbar-width: thin;
  scrollbar-color: ${colors.reactLightGrey} ${colors.reactGrey};
`;

export const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
