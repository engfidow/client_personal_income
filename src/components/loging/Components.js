import styled from 'styled-components';

export const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  width: 778px;
  max-width: 100%;
  min-height: 500px;
  margin: 90px auto;

  @media (max-width: 768px) {
    width: 95%;
    flex-direction: column;
    display: flex;
    min-height: auto;
    margin-top: 40px;
  }
`;

export const SignUpContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;

  ${props => props.signinIn !== true && `
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
  `}

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    display: ${props => props.signinIn !== true ? 'block' : 'none'};
    transform: none;
    opacity: 1;
    z-index: 5;
  }
`;

export const SignInContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;

  ${props => props.signinIn !== true && `transform: translateX(100%);`}

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    display: ${props => props.signinIn === true ? 'block' : 'none'};
    transform: none;
  }
`;

export const Form = styled.form`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Title = styled.h1`
  font-weight: bold;
  margin: 0;
  color: green;
`;

export const Input = styled.input`
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
`;

export const Button = styled.button`
  border-radius: 20px;
  background-color: #001297;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  &:active {
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
`;

export const GhostButton = styled(Button)`
  border: 1px solid #001297;
  background-color: transparent;
  color: #001297;
`;

export const Anchor = styled.a`
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
`;

export const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;

  ${props => props.signinIn !== true && `transform: translateX(-100%);`}

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    height: auto;
    transform: none !important;
    left: 0;
  }
`;

export const Overlay = styled.div`
  background: #D1F9BE;
  background-size: cover;
  background-position: center;
  color: #000;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  display: flex;

  ${props => props.signinIn !== true && `transform: translateX(50%);`}

  @media (max-width: 768px) {
    flex-direction: column;
    left: 0;
    width: 100%;
    transform: none !important;
  }
`;

export const OverlayPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 30px;
  text-align: center;
  width: 50%;
  height: 100%;
  transition: transform 0.6s ease-in-out;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    padding: 20px 15px;
    display: none;
  }
`;

export const LeftOverlayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);
  ${props => props.signinIn !== true && `transform: translateX(0);`}

  @media (max-width: 768px) {
    display: ${props => props.signinIn === true ? 'none' : 'flex'};
  }
`;

export const RightOverlayPanel = styled(OverlayPanel)`
  transform: translateX(0);
  ${props => props.signinIn !== true && `transform: translateX(20%);`}

  @media (max-width: 768px) {
    display: ${props => props.signinIn === false ? 'none' : 'flex'};
  }
`;

export const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
  color: #000;
`;
