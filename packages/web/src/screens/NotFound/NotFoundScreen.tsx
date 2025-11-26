import styled from "styled-components";
import {
  colors,
  fontSizes,
  space,
  radii,
  labels,
} from "@repo-viewer/shared/dist";
import { NavLink } from "../../components/NavLink/NavLink";

const Wrapper = styled.div`
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

const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: ${space.lg}px;
`;

const View = styled.div`
  padding: ${space.xl}px;
  border-radius: ${radii.md}px;
  max-width: 640px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Code = styled.h1`
  font-size: 120px;
  margin: 0;
  font-weight: 700;
  color: ${colors.reactBlue};
  line-height: 1;
`;

const Title = styled.h2`
  font-size: ${fontSizes.lg}px;
  margin: ${space.lg}px 0 ${space.md}px;
  font-weight: 600;
  opacity: 0.9;
`;

const Description = styled.p`
  font-size: ${fontSizes.md}px;
  opacity: 0.75;
  margin-bottom: ${space.xl}px;
`;

const NotFoundScreen = () => (
  <Wrapper>
    <HeaderRow>
      <NavLink to="/">{labels.back}</NavLink>
    </HeaderRow>

    <View>
      <Code>404</Code>
      <Title>{labels.notFound}</Title>
      <Description>{labels.notFoundDesc}</Description>
    </View>
  </Wrapper>
);

export default NotFoundScreen;
