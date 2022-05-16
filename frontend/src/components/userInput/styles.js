import styled, { css } from "styled-components";

export const InputWrapper = styled.div`
  display: flex;
  border-radius: 10px;
  border: 1px solid #b6b6b6;
  backdrop-filter: blur(16px);
  font-size: 20px;
  width: 100%;
  transition: border-color 0.3s;
  align-items: center;

  ${(props) =>
    props.isFocused &&
    (props.error
      ? css`
          border-color: #fc2020;
        `
      : css`
          border-color: #24a1fc;
        `)}
`;

export const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: inherit;

  font-family: "Helvetica Now Display";
  font-size: 16px;
  font-weight: 400;
  color: inherit;
`;

export const TitleWrapper = styled.div`
  justify-content: space-between;
  display: flex;
  align-items: center;

  label {
    margin-bottom: 0;
  }

  .error {
    color: #fc2020;
  }
`;
