import React, { useState, useMemo, useRef, useEffect } from "react";
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
} from ".././RandomCardShufflerBlock/RandomCardShufflerBlock.styled";

interface WordGapFillerBlockProps {
  onClose?: () => void;
  hideRatio?: number;
}

const descriptionTexterea = `Paste the text where you want to generate gaps.

For example:
Learning English is not only about studying grammar,
but also about practicing speaking, listening, reading, and writing skills.
`;

export const WordGapFillerBlock: React.FC<WordGapFillerBlockProps> = ({
  onClose,
  hideRatio = 0.3,
}) => {
  const [input, setInput] = useState<string>("");
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isChecked, setIsChecked] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const words = useMemo(() => {
    return input
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);
  }, [input]);

  const hiddenWords = useMemo(() => {
    const hidden = new Set<number>();
    words.forEach((_, idx) => {
      if (Math.random() < hideRatio) hidden.add(idx);
    });
    return hidden;
  }, [words, hideRatio]);

  useEffect(() => {
    if (!isPracticeOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClosePractice();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPracticeOpen]);

  const handleGenerate = () => {
    if (words.length === 0) return;
    setIsPracticeOpen(true);
    textareaRef.current?.blur();
  };

  const handleClosePractice = () => {
    setIsPracticeOpen(false);
    setIsChecked(false);
    setUserAnswers({});
  };

  const handleChange = (value: string, index: number) => {
    setUserAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const checkAnswers = () => setIsChecked(true);
  const reset = () => {
    setIsChecked(false);
    setUserAnswers({});
  };

  return (
    <Root style={{ minWidth: 400 }}>
      <Panel>
        <Controls>
          <CloseIcon onClick={onClose}>×</CloseIcon>
          <div style={{ flex: 1 }}>
            <Textarea
              ref={textareaRef}
              placeholder={descriptionTexterea}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Gap text input"
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Meta>{words.length} Words</Meta>
            </div>
          </div>
        </Controls>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <Button onClick={handleGenerate} disabled={words.length === 0}>
            Generate Gaps
          </Button>
          <Button
            onClick={() => setInput("")}
            subtle
            disabled={words.length === 0}
          >
            Clear
          </Button>
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
                <Meta>Fill in the missing words</Meta>
                <div>
                  <Secondary subtle onClick={reset} style={{ marginRight: 8 }}>
                    Reset
                  </Secondary>
                  <Button onClick={handleClosePractice}>Close</Button>
                </div>
              </div>

              <BigText
                style={{
                  lineHeight: 1.8,
                  textAlign: "left",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                {words.map((word, idx) =>
                  hiddenWords.has(idx) ? (
                    <input
                      key={idx}
                      type="text"
                      value={userAnswers[idx] || ""}
                      onChange={(e) => handleChange(e.target.value, idx)}
                      style={{
                        width: Math.max(50, word.length * 10),
                        margin: "0 4px",
                        padding: "4px 6px",
                        borderRadius: 6,
                        border: "1px solid #444",
                        background: "#111",
                        color: "#e7eef3",
                        textAlign: "center",
                      }}
                      disabled={isChecked}
                    />
                  ) : (
                    <span key={idx} style={{ marginRight: 6 }}>
                      {word}
                    </span>
                  )
                )}
              </BigText>

              <ControlsRow>
                <Button onClick={checkAnswers} disabled={isChecked}>
                  Check
                </Button>
              </ControlsRow>

              {isChecked && (
                <div style={{ marginTop: 16 }}>
                  <h4>Results:</h4>
                  <ul style={{ maxHeight: 200, overflowY: "auto" }}>
                    {words.map((word, idx) =>
                      hiddenWords.has(idx) ? (
                        <li key={idx}>
                          <strong>{word}</strong> —{" "}
                          {userAnswers[idx]?.trim().toLowerCase() ===
                          word.toLowerCase() ? (
                            <span style={{ color: "lightgreen" }}>Correct</span>
                          ) : (
                            <span style={{ color: "tomato" }}>
                              Wrong ({userAnswers[idx] || "—"})
                            </span>
                          )}
                        </li>
                      ) : null
                    )}
                  </ul>
                </div>
              )}
            </BigCard>
          </BigCardModal>,
          document.body
        )}
    </Root>
  );
};

export default WordGapFillerBlock;
