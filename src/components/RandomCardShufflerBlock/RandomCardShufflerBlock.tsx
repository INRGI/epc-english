import React, { useMemo, useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

// ------------------------- Helpers -------------------------
const shuffleArray = <T,>(arr: T[]) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const uid = (() => {
  let i = 0;
  return () => ++i;
})();

// ------------------------- Animations -------------------------
const float = keyframes`
  from { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
  to { transform: translateY(0px); }
`;

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

// ------------------------- Styled -------------------------
const Root = styled.div`
  --bg: #0f1113;
  --card: #141518;
  --muted: #9aa0a6;
  color: #e9eef2;
  font-family: Inter, Roboto, system-ui, -apple-system, "Segoe UI", "Helvetica Neue", Arial;
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
`;

const Panel = styled.div`
  background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
  border: 1px solid rgba(255,255,255,0.03);
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0 6px 30px rgba(2,6,23,0.6);
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  resize: vertical;
  background: linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.04);
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

const Button = styled.button<{ subtle?: boolean }>`
  background: ${({ subtle }) => (subtle ? "transparent" : "linear-gradient(180deg,#1f2024,#151617)")};
  border: ${({ subtle }) => (subtle ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(255,255,255,0.06)")};
  color: #e7eef3;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: transform 140ms ease, box-shadow 140ms ease, opacity 120ms ease;

  &:active { transform: translateY(1px) scale(0.998); }
  &:hover { box-shadow: 0 8px 30px rgba(3,8,20,0.6); }
`;

const Meta = styled.div`
  color: var(--muted);
  font-size: 13px;
`;

const Grid = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 14px;
`;

const Card = styled.div<{ orderIndex: number }>`
  background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.008));
  border-radius: 12px;
  padding: 14px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,255,255,0.03);
  box-shadow: 0 8px 40px rgba(3,8,20,0.5);
  transform-origin: center center;
  animation: ${popIn} 420ms cubic-bezier(.2,.9,.2,1) both;
  animation-delay: ${({ orderIndex }) => orderIndex * 40}ms;
  will-change: transform, opacity;
  cursor: pointer;
  user-select: none;

  &:hover { animation: ${float} 1500ms infinite ease-in-out; }
`;

const CardText = styled.div<{ isFlipped?: boolean }>`
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  padding: 6px 10px;
  color: #eaf0f6;
`;

const BigCardModal = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(2,6,10,0.6);
  z-index: 60;
`;

const BigCard = styled.div`
  width: min(760px, calc(100% - 48px));
  background: var(--card);
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 20px 80px rgba(1,3,9,0.8);
  border: 1px solid rgba(255,255,255,0.03);
  text-align: center;
`;

const BigText = styled.div`
  font-size: 36px;
  font-weight: 700;
  line-height: 1.05;
`;

// ------------------------- Component -------------------------
export const RandomCardShufflerBlock: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [cards, setCards] = useState<{ id: number; text: string }[]>([]);
  const [lastSeed, setLastSeed] = useState<number | null>(null);
  const [modal, setModal] = useState<{ id: number; text: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // derived
  const lines = useMemo(() => {
    return input
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
  }, [input]);

  useEffect(() => {
    // keyboard: Ctrl+Enter submits
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleCreate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [input]);

  const handleCreate = () => {
    if (lines.length === 0) return;
    const seed = Date.now();
    setLastSeed(seed);
    const created = lines.map((t) => ({ id: uid(), text: t }));
    setCards(shuffleArray(created));
    // blur textarea to emphasise transition
    textareaRef.current?.blur();
  };

  const handleShuffle = () => setCards((c) => shuffleArray(c));
  const handleClear = () => {
    setInput("");
    setCards([]);
    setLastSeed(null);
  };

  const handleOpen = (card: { id: number; text: string }) => setModal(card);
  const handleCloseModal = () => setModal(null);

  return (
    <Root>
      <Panel>
        <Controls>
          <div style={{ flex: 1 }}>
            <Textarea
              ref={textareaRef}
              placeholder={`Вставте слова або фрази — кожна з нової строки.\n
Приклад:\nhello\nhow are you?\nbook`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Words input"
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <Meta>{lines.length} рядків</Meta>
              <Meta>Підтримується: Ctrl/Cmd + Enter для створення</Meta>
            </div>
          </div>
        </Controls>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <Button onClick={handleCreate} disabled={lines.length === 0}>
            Create cards
          </Button>
          <Button onClick={handleShuffle} subtle disabled={cards.length === 0}>
            Shuffle
          </Button>
          <Button onClick={handleClear} subtle>
            Clear
          </Button>
          <div style={{ flex: 1 }} />
          <Meta style={{ alignSelf: "center" }}>
            {cards.length > 0 ? `Seed: ${lastSeed}` : "No cards yet"}
          </Meta>
        </div>

        <Grid>
          {cards.map((c, i) => (
            <Card
              key={c.id}
              orderIndex={i}
              onClick={() => handleOpen(c)}
              role="button"
              title="Клік — відкрити"
            >
              <CardText>{c.text}</CardText>
            </Card>
          ))}
        </Grid>
      </Panel>

      {modal && (
        <BigCardModal onClick={handleCloseModal}>
          <BigCard onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <Meta>Картка</Meta>
              <div>
                <Button subtle onClick={() => setCards((s) => shuffleArray(s))} style={{ marginRight: 8 }}>
                  Shuffle
                </Button>
                <Button onClick={handleCloseModal}>Close</Button>
              </div>
            </div>
            <BigText>{modal.text}</BigText>
          </BigCard>
        </BigCardModal>
      )}
    </Root>
  );
};

export default RandomCardShufflerBlock;
