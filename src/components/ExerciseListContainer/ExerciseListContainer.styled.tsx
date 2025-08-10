import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  } to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Wrapper = styled.div<{ isHasActiveCard: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  min-height: calc(100% - 40px);
  position: relative;
  overflow: hidden;

  max-width: calc(100%);
  margin: 0;

  @media (max-width: 1024px) {
    max-width: calc((220px * 2) + 20px + 4rem);
  }

  @media (max-width: 600px) {
    max-width: 100%;
    padding: 1rem;
  }
`;

export const Card = styled.div<{ index: number; isActive: boolean }>`
  background-color: #1a1a1a;
  color: #ffffff;
  border: 1px solid #333;
  border-radius: 16px;
  padding: 1.5rem;
  text-decoration: none;

  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  width: ${({ isActive }) => (isActive ? "100%" : "220px")};
  height: ${({ isActive }) => (isActive ? "100%" : "220px")};

  transition: transform 0.2s ease-in-out, box-shadow 0.2s;
  animation: ${fadeInUp} 0.6s ease-out both;
  animation-delay: ${({ index }) => index * 0.1}s;

  &:hover {
    background-color: #222;
    transform: translateY(-6px);
    box-shadow: 0 8px 24px rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 1024px) {
    width: 220px;
  }

  @media (max-width: 600px) {
    width: 100%;
  }

  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;

  ${({ isActive }) => {
    if (isActive) {
      return `
        transform: scale(1.5);
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      `;
    } else {
      return `
        opacity: 0;
        transform: scale(0.5);
      `;
    }
  }}
`;

export const Title = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Description = styled.p`
  font-size: 0.9rem;
  color: #ccc;
  margin: 0;
  line-height: 1.4;
`;
