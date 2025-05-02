import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${props => props.fullPage ? '100vh' : '100%'};
  width: 100%;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #0f3460;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 10px;
`;

const LoadingText = styled.p`
  color: #0f3460;
  font-weight: 500;
`;

const Loader = ({ fullPage = false, text = 'Cargando...' }) => {
  return (
    <LoaderContainer fullPage={fullPage}>
      <SpinnerWrapper>
        <Spinner />
        {text && <LoadingText>{text}</LoadingText>}
      </SpinnerWrapper>
    </LoaderContainer>
  );
};

export default Loader;