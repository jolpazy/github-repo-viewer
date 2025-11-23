import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Card = styled.div`
  background: #2a2a33;
  padding: 1.2rem 1.6rem;
  border-radius: 12px;
  width: 350px;
  margin: 0.5rem 0;
  text-align: center;
  transition: 0.2s ease;
  cursor: pointer;

  &:hover {
    background: #34343f;
    transform: translateY(-2px);
  }
`;

const Name = styled.h3`
  margin: 0 0 0.6rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: #61dafb;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  transition: 0.2s ease;
  cursor: pointer;

  &:hover {
    color: #7ee3ff;
    text-decoration: underline;
  }
`;

const Description = styled.p`
  font-size: 0.95rem;
  opacity: 0.85;
  margin-bottom: 0.6rem;
  color: white;
`;

const Stars = styled.p`
  font-size: 0.85rem;
  opacity: 0.7;
  color: white;
`;

type RepoCardProps = {
  id: number;
  name: string;
  description?: string;
  stars: number;
  url: string;
};

const RepoCard = ({ id, name, description, stars }: RepoCardProps) => {
  const navigate = useNavigate();
  return (
    <Card onClick={() => navigate(`/repo/${id}`)}>
      <Name>{name}</Name>
      {description && <Description>{description}</Description>}
      <Stars>⭐ {stars} stars</Stars>
    </Card>
  );
};

export default RepoCard;
