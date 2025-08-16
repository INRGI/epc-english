import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

export const popIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

export const Root = styled.div`
  color: #e9eef2;
  font-family: Inter, Roboto, system-ui, -apple-system, "Segoe UI",
    "Helvetica Neue", Arial;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
`;

export const Panel = styled.div`
  padding: 0;
  margin: 0;
`;

export const Controls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

export const Textarea = styled.textarea`
  width: calc(100% - 24px);
  min-height: 120px;
  resize: vertical;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.015),
    rgba(255, 255, 255, 0.01)
  );
  border: 1px solid rgba(255, 255, 255, 0.04);
  color: #e8eef3;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.45;
  outline: none;
  transition: box-shadow 180ms ease, transform 200ms ease;

  &:focus {
    box-shadow: 0 6px 22px rgba(12, 18, 28, 0.6);
    transform: translateY(-2px);
  }
`;

export const Button = styled.button<{ subtle?: boolean }>`
  background: ${({ subtle }) =>
    subtle ? "transparent" : "linear-gradient(180deg,#1f2024,#151617)"};
  border: ${({ subtle }) =>
    subtle
      ? "1px solid rgba(255,255,255,0.04)"
      : "1px solid rgba(255,255,255,0.06)"};
  color: #e7eef3;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: transform 140ms ease, box-shadow 140ms ease, opacity 120ms ease;

  &:active {
    transform: translateY(1px) scale(0.998);
  }
  &:hover {
    box-shadow: 0 8px 30px rgba(3, 8, 20, 0.6);
  }
`;

export const Meta = styled.div`
  color: #9aa0a6;
  font-size: 13px;
`;

export const BigCardModal = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  color: #e9eef2;
  background: rgba(2, 6, 10, 0.6);
  z-index: 999;
`;

export const BigCard = styled.div`
  width: min(760px);
  max-width: 1000px;
  background: #141518;
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 20px 80px rgba(1, 3, 9, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.03);
  text-align: center;
`;

export const BigText = styled.div`
  font-size: 36px;
  font-weight: 700;
  line-height: 1.05;
  animation: ${popIn} 320ms cubic-bezier(0.2, 0.9, 0.2, 1);
`;

export const ControlsRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  flex-wrap: wrap;
`;

export const Secondary = styled(Button)`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.04);
`;

export const CloseIcon = styled.button`
  position: absolute;
  top: 0px;
  right: 0px;
  background: transparent;
  border: none;
  color: #FF3737;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    color: #C62828;
  }
`;

