import ExerciseCards from "../../components/ExerciseListContainer";
import { Container } from "./Home.styled";

const Home: React.FC = () => {
  return (
    <Container>
      <ExerciseCards />
    </Container>
  );
};

export default Home;
