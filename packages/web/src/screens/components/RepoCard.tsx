import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  RootState,
  AppDispatch,
  addFavorite,
  removeFavorite,
} from "@repo-viewer/shared";

import { space, fontSizes, radii, colors } from "@repo-viewer/shared";

type RepoCardProps = {
  id: number;
  name: string;
  description?: string;
  stars: number;
  url: string;
};

const Card = styled.div`
  background: ${colors.reactLightGrey};
  padding: ${space.lg}px ${space.xl}px ${space.xl}px;
  border-radius: ${radii.md}px;
  margin: ${space.sm}px 0;
  text-align: center;
  transition: 0.2s ease;
  cursor: pointer;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Heart = styled.span`
  font-size: ${fontSizes.md}px;
  cursor: pointer;
  user-select: none;
  transition: 0.15s ease;

  &:hover {
    transform: scale(1.15);
  }
`;

const Name = styled.h3`
  margin: 0 0 ${space.xs}px;
  font-size: ${fontSizes.lg}px;
  font-weight: 700;
  color: ${colors.reactBlue};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: 0.2s ease;
  cursor: pointer;

  &:hover {
    color: ${colors.reactBlue};
    text-decoration: underline;
  }
`;

const Description = styled.p`
  font-size: ${fontSizes.sm}px;
  opacity: 0.85;
  margin-bottom: ${space.sm}px;
  color: ${colors.white};
`;

const Stars = styled.p`
  font-size: ${fontSizes.sm}px;
  opacity: 0.7;
  color: ${colors.white};
`;

const RepoCard = ({ id, name, description, stars }: RepoCardProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const favorites = useSelector((state: RootState) => state.app.favorites);
  const isFavorite = favorites.includes(id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isFavorite) dispatch(removeFavorite(id));
    else dispatch(addFavorite(id));
  };

  return (
    <Card onClick={() => navigate(`/repo/${id}`)}>
      <TopRow>
        <Heart onClick={toggleFavorite}>{isFavorite ? "❤️" : "🤍"}</Heart>
      </TopRow>
      <Name>{name}</Name>
      {description && <Description>{description}</Description>}
      <Stars>⭐ {stars} stars</Stars>
    </Card>
  );
};

export default RepoCard;
