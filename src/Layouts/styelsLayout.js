import styled from "styled-components";

export const Container = styled.div`
   
`;


export const Icon = styled.div`
   
   @media (max-width: 1180px) {
    display: block;
    position: relative;
    cursor: pointer;
    z-index: 999;
    height: 32px;
    width: 40px;

    span {
      background-color: ${(props) => (props.active ? "transparent" : "white")};
      border-radius: 3px;
      position: absolute;
      width: 40px;
      height: 3px;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      transition: background-color 0.3s ease-in-out;
    }

    span::before,
    span::after {
      content: "";
      background-color: white;
      border-radius: 3px;
      position: absolute;
      width: 40px;
      height: 3px;
      transition: transform 0.3s ease-in-out, margin-top 0.3s ease-in-out;
    }

    span::before {
      top: ${(props) => (props.active ? "0" : "-12px")};
      transform: ${(props) => (props.active ? "rotate(45deg)" : "none")};
    }

    span::after {
      top: ${(props) => (props.active ? "0" : "12px")};
      transform: ${(props) => (props.active ? "rotate(-45deg)" : "none")};
    }
  }
`;