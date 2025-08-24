import React, { useState, useMemo } from "react";

interface WordGapFillerProps {
  initialText?: string;
  hideRatio?: number;
}

const defaultText = `Learning English is not only about studying grammar,
but also about practicing speaking, listening, reading, and writing skills.
The more you practice, the more confident you become.`;

export const WordGapFiller: React.FC<WordGapFillerProps> = ({
  initialText = defaultText,
  hideRatio = 0.3,
}) => {
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  const words = useMemo(() => {
    return initialText.split(/\s+/).map((w) => w.trim());
  }, [initialText]);

  const hiddenWords = useMemo(() => {
    const hidden = new Set<number>();
    words.forEach((_, idx) => {
      if (Math.random() < hideRatio) hidden.add(idx);
    });
    return hidden;
  }, [words, hideRatio]);

  const handleChange = (value: string, index: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const checkAnswers = () => {
    setIsChecked(true);
  };

  const reset = () => {
    setIsChecked(false);
    setUserAnswers([]);
  };

  return (
    <div style={{ padding: 16, color: "#e7eef3", background: "#1e1e1e", borderRadius: 12 }}>
      <h2 style={{ marginBottom: 12 }}>Word Gap Filler</h2>
      <p style={{ lineHeight: 1.8 }}>
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
      </p>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button
          onClick={checkAnswers}
          disabled={isChecked}
          style={{
            background: "#d32f2f",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Check
        </button>
        <button
          onClick={reset}
          style={{
            background: "#444",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      {isChecked && (
        <div style={{ marginTop: 16 }}>
          <h4>Results:</h4>
          <ul>
            {words.map((word, idx) =>
              hiddenWords.has(idx) ? (
                <li key={idx}>
                  <strong>{word}</strong> —{" "}
                  {userAnswers[idx] === word ? (
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
    </div>
  );
};

export default WordGapFiller;
