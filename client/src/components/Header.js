import React from 'react';
import styled from 'styled-components';

const StyledHeader = styled.header`
  background-color: #1a1a2e;
  color: #fff;
  padding: 1rem;
  text-align: center;
  width: 100%;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    height: 40px;
    margin-right: 10px;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
`;

const Subtitle = styled.p`
  margin: 5px 0 0;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const Header = ({ subtitle }) => {
  return (
    <StyledHeader>
      <Logo>
        <img src="/logo.png" alt="La Barberia Logo" />
        <Title>BARBERIA</Title>
      </Logo>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </StyledHeader>
  );
};

export default Header;