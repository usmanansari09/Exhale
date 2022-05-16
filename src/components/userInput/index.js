import React, { useState } from 'react';

import { InputWrapper, Input, TitleWrapper } from './styles';

const UserInput = ({ ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <TitleWrapper>
        <label>{props.label}</label>
        {props.error && <span className="error">{props.error}</span>}
      </TitleWrapper>
      <InputWrapper isFocused={isFocused} error={props.error}>
        <Input onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} {...props} />
        {props.icon}
      </InputWrapper>
    </>
  );
};

export default UserInput;
