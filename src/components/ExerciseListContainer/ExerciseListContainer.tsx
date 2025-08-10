import React, { useState } from "react";
import {
  Card,
  Description,
  Title,
  Wrapper,
} from "./ExerciseListContainer.styled";
import RandomCardShufflerBlock from "../RandomCardShufflerBlock";
type GameCard = {
  title: string;
  description: string;
  gameComponent: JSX.Element;
};

const exercises: GameCard[] = [
  {
    title: "Random Cards",
    description: "Randomize words from a list",
    gameComponent: <RandomCardShufflerBlock />,
  },
  {
    title: "Will open in the future",
    description: "Will open in the future",
    gameComponent: <RandomCardShufflerBlock />,
  },
];

export const ExerciseCards: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  return (
    <Wrapper isHasActiveCard={activeCard !== null}>
      {exercises.map((exercise, index) => (
        <Card
          onClick={() => setActiveCard(index)}
          index={index}
          isActive={activeCard === index}
        >
          {activeCard === index ? (
            exercise.gameComponent
          ) : (
            <>
              <Title>{exercise.title}</Title>
              <Description>{exercise.description}</Description>
            </>
          )}
        </Card>
      ))}
    </Wrapper>
  );
};

export default ExerciseCards;
