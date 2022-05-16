import styled from "styled-components";
import colors from "../../../utils/Colors";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 5rem;
`;

export const Title1 = styled.div`
  font-family: Helvetica Now Display;
  font-style: normal;
  font-weight: 800;
  font-size: 56px;
  text-align: center;
  color: ${(p) => (p.isOk ? `${colors.themeColor2}` : `#eab105`)};
`;

export const SignupText = styled.div`
  font-family: Helvetica Now Display;
  font-weight: bold;
  font-size: 32px;
  text-align: center;
  width: 490px;
  color: ${(p) => (p.isOk ? `${colors.themeColor2}` : `#eab105`)};
`;

export const Paragraph = styled.div`
  font-family: Helvetica Now Display;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 35px;
  color: ${colors.SecondaryText};
`;

export const SignupButton = styled.button`
  font-family: Helvetica Now Display;
  margin: 10px 0px;
  height: 56px;
  width: 440px;
  border-radius: 49px;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px;

  background: ${(p) => (p.outline ? `#ffffff` : `${colors.themeColor}`)};
  color: ${(p) => (p.outline ? `${colors.themeColor}` : `#ffffff`)};
  border-radius: 49px;
  border: 1px solid ${(p) => (p.outline ? `${colors.themeColor}` : `#ffffff`)};
`;

export const Row = styled.div`
  display: flex;
  align-items: center;

  label {
    width: 382px;
    margin-left: 10px;
  }
`;
