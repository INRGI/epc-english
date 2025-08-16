import React, { useMemo, useState, useEffect, useRef } from "react";

import { createPortal } from "react-dom";
import {
  BigCard,
  BigCardModal,
  BigText,
  Button,
  CloseIcon,
  Controls,
  ControlsRow,
  Meta,
  Panel,
  Root,
  Secondary,
  Textarea,
} from "./RandomCardShufflerBlock.styled";

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

const descriptionTexterea = `Paste the list of cards you want to practice, one per line.

For example:
Card 1
Card 2
`;

export const RandomCardShufflerBlock: React.FC<{ onClose?: () => void }> = ({
  onClose,
}) => {
  const [input, setInput] = useState<string>("");
  const [cards, setCards] = useState<{ id: number; text: string }[]>([]);
  const [lastSeed, setLastSeed] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [queue, setQueue] = useState<{ id: number; text: string }[]>([]);
  const [playIndex, setPlayIndex] = useState(0);

  const lines = useMemo(() => {
    return input

      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
  }, [input]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleCreate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [input]);

  useEffect(() => {
    if (!isPracticeOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClosePractice();
      } else if (e.key === "ArrowRight" || e.key === " ") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPracticeOpen, queue]);

  const handleCreate = () => {
    if (lines.length === 0) return;
    const seed = Date.now();
    setLastSeed(seed);
    const created = lines.map((t) => ({ id: uid(), text: t }));
    const shuffledCards = shuffleArray(created);
    setCards(shuffledCards);

    handleOpenPracticeWithCards(shuffledCards);
    textareaRef.current?.blur();
  };

  const handleShuffle = () => setCards((c) => shuffleArray(c));
  const handleClear = () => {
    setInput("");
    setCards([]);
    setLastSeed(null);
  };

  const handleOpenPractice = (startId?: number) => {
    handleOpenPracticeWithCards(cards, startId);
  };

  const handleOpenPracticeWithCards = (
    cardsToUse: { id: number; text: string }[],
    startId?: number
  ) => {
    if (cardsToUse.length === 0) return;
    let order = shuffleArray(cardsToUse);
    if (typeof startId !== "undefined") {
      const idx = order.findIndex((x) => x.id === startId);
      if (idx > 0) {
        const [found] = order.splice(idx, 1);
        order.unshift(found);
      }
    }
    setQueue(order);
    setPlayIndex(0);
    setIsPracticeOpen(true);
  };

  const handleClosePractice = () => {
    setIsPracticeOpen(false);
  };

  const handleNext = () => {
    if (queue.length === 0) return;
    setPlayIndex((p) => (p + 1) % queue.length);
  };
  const handlePrev = () => {
    if (queue.length === 0) return;
    setPlayIndex((p) => (p - 1 + queue.length) % queue.length);
  };

  const handleShuffleQueue = () => {
    setQueue((q) => shuffleArray(q));
    setPlayIndex(0);
  };

  return (
    <Root>
      <Panel>
        <Controls>
          <CloseIcon onClick={onClose}>×</CloseIcon>
          <div style={{ flex: 1 }}>
            <Textarea
              ref={textareaRef}
              placeholder={descriptionTexterea}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Words input"
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Meta>{lines.length} Cards</Meta>
            </div>
          </div>
        </Controls>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <Button onClick={handleCreate} disabled={lines.length === 0}>
            Create cards
          </Button>
          <Button
            onClick={() => handleOpenPractice()}
            subtle
            disabled={cards.length === 0}
          >
            Practice
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
      </Panel>

      {isPracticeOpen &&
        createPortal(
          <BigCardModal onClick={handleClosePractice}>
            <BigCard onClick={(e) => e.stopPropagation()}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                  color: "#e7eef3",
                }}
              >
                <Meta>
                  {queue.length > 0
                    ? `${playIndex + 1} / ${queue.length}`
                    : "—"}
                </Meta>
                <div>
                  <Secondary
                    subtle
                    onClick={handleShuffleQueue}
                    style={{ marginRight: 8 }}
                  >
                    Shuffle
                  </Secondary>
                  <Button onClick={handleClosePractice}>Close</Button>
                </div>
              </div>

              {queue.length > 0 ? (
                <BigText key={`${queue[playIndex].id}-${playIndex}`}>
                  {queue[playIndex].text}
                </BigText>
              ) : (
                <BigText>Немає карток — створіть їх спочатку</BigText>
              )}

              <ControlsRow>
                <Secondary
                  subtle
                  onClick={handlePrev}
                  disabled={queue.length === 0}
                >
                  Prev
                </Secondary>
                <Button onClick={handleNext} disabled={queue.length === 0}>
                  Next
                </Button>
              </ControlsRow>
            </BigCard>
          </BigCardModal>,
          document.body
        )}
    </Root>
  );
};

export default RandomCardShufflerBlock;
