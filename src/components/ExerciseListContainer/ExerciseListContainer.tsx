import React from "react";
import {
  Card,
  Description,
  Title,
  Wrapper,
} from "./ExerciseListContainer.styled";
type GameCard = {
    title: string;
    description: string;
    path: string;
  };
  
  const exercises: GameCard[] = [
    {
      title: "Фрази — картки",
      description: "Повтори фрази у вигляді флеш-карток",
      path: "/game/phrases",
    },
    {
      title: "Граматика",
      description: "Обери правильний варіант відповіді",
      path: "/game/grammar",
    },
    {
      title: "Склади речення",
      description: "Перетягни слова, щоб створити речення",
      path: "/game/sentences",
    }
  ];
  
  export const ExerciseCards: React.FC = () => {
    return (
      <Wrapper>
        {exercises.map((exercise, index) => (
          <Card to={exercise.path} key={exercise.path} index={index}>
            <Title>
              
              {exercise.title}
            </Title>
            <Description>{exercise.description}</Description>
          </Card>
        ))}
      </Wrapper>
    );
  };
  
  export default ExerciseCards;