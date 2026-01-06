import IcWeight from "@/components/icons/weight";
import { ExerciseItem } from "@/types";
import { ColorConst } from "./theme";

const getExercises = ({
  isGridView,
}: {
  isGridView: boolean;
}): ExerciseItem[] => {
  return [
    {
      id: '1',
      title: "Abods flèches",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: false,
    },
    {
      id: '2',
      title: "Abmat sit up",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: true,
    },
    {
      id: '3',
      title: "Arch",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: true,
    },
    {
      id: '4',
      title: "Abaisseur unilatéral élastique",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: false,
    },
    {
      id: '5',
      title: "Arch extension",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: true,
    },
    {
      id: '6',
      title: "Abaisseur unilatéral élastique",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: false,
    },
    {
      id: '7',
      title: "Abmat sit up",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: true,
    },
    {
      id: '8',
      title: "Abaisseur unilatéral élastique",
      image: require("../assets/images/exercise-example-1.png"),
      icon: <IcWeight color={isGridView ? "white" : ColorConst.accent} />,
      isFavorite: true,
    },
  ];
};

export default getExercises;
