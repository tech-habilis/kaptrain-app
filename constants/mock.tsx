import IcWeight from "@/components/icons/weight";
import { Exercise, ExerciseItem, ProgramSectionProps } from "@/types";
import { ColorConst } from "./theme";
import IcFire from "@/components/icons/fire";
import IcClockRound from "@/components/icons/clock-round";

const getExercises = ({
  isGridView,
}: {
  isGridView: boolean;
}): ExerciseItem[] => {
  return [
    {
      id: "1",
      title: "Abods flèches",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: false,
    },
    {
      id: "2",
      title: "Abmat sit up",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: true,
    },
    {
      id: "3",
      title: "Arch",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: true,
    },
    {
      id: "4",
      title: "Abaisseur unilatéral élastique",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: false,
    },
    {
      id: "5",
      title: "Arch extension",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: true,
    },
    {
      id: "6",
      title: "Abaisseur unilatéral élastique",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: false,
    },
    {
      id: "7",
      title: "Abmat sit up",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: true,
    },
    {
      id: "8",
      title: "Abaisseur unilatéral élastique",
      image: require("../assets/images/exercise-example-1.png"),
      icon: <IcWeight color={isGridView ? "white" : ColorConst.accent} />,
      isFavorite: true,
    },
  ];
};

export default getExercises;

export const programs: ProgramSectionProps[] = [
  {
    title: "Mes achats",
    programs: [
      {
        id: "1",
        title: "Bootcamp Énergie",
        price: "29,99 €",
        isBought: true,
        image: require("../assets/images/today-session.png"),
        chips: [
          {
            icon: <IcFire />,
            text: "Débutant",
          },
          {
            icon: <IcClockRound />,
            text: "4 semaines",
          },
        ],
        createdBy: "Enguerrand Aucher",
      },
      {
        id: "2",
        title: "Abdos à la maison",
        price: "29,99 €",
        isBought: true,
        image: require("../assets/images/today-session.png"),
        chips: [
          {
            icon: <IcFire />,
            text: "Débutant",
          },
          {
            icon: <IcClockRound />,
            text: "4 semaines",
          },
        ],
        createdBy: "Enguerrand Aucher",
      },
      {
        id: "11",
        title: "Bootcamp Énergie",
        price: "29,99 €",
        isBought: true,
        image: require("../assets/images/today-session.png"),
        chips: [
          {
            icon: <IcFire />,
            text: "Débutant",
          },
          {
            icon: <IcClockRound />,
            text: "4 semaines",
          },
        ],
        createdBy: "Enguerrand Aucher",
      },
      {
        id: "12",
        createdBy: "Enguerrand Aucher",
        title: "Abdos à la maison",
        price: "29,99 €",
        isBought: true,
        image: require("../assets/images/today-session.png"),
        chips: [
          {
            icon: <IcFire />,
            text: "Débutant",
          },
          {
            icon: <IcClockRound />,
            text: "4 semaines",
          },
        ],
      },
    ],
  },
  {
    title: "Programmes",
    description:
      "Suis un programme d’entrainement prêt à l’emploi sur une période précise.",
    programs: [
      {
        id: "3",
        createdBy: "Enguerrand Aucher",
        title: "Bootcamp Énergie",
        price: "29,99 €",
        isBought: false,
        image: require("../assets/images/today-session.png"),
        chips: [
          {
            icon: <IcFire />,
            text: "Débutant",
          },
          {
            icon: <IcClockRound />,
            text: "4 semaines",
          },
        ],
      },
      {
        id: "4",
        createdBy: "Enguerrand Aucher",
        title: "Abdos à la maison",
        price: "29,99 €",
        isBought: true,
        image: require("../assets/images/today-session.png"),
        chips: [
          {
            icon: <IcFire />,
            text: "Débutant",
          },
          {
            icon: <IcClockRound />,
            text: "4 semaines",
          },
        ],
      },
    ],
  },
  {
    title: "Programmations",
    description: "Progresse grâce à des séances continues, sans date de fin.",
    programs: [
      {
        id: "5",
        createdBy: "Enguerrand Aucher",
        title: "Bootcamp Énergie",
        price: "29,99 €",
        isBought: true,
        image: require("../assets/images/today-session.png"),
        chips: [
          {
            icon: <IcFire />,
            text: "Débutant",
          },
          {
            icon: <IcClockRound />,
            text: "4 semaines",
          },
        ],
      },
      {
        id: "6",
        createdBy: "Enguerrand Aucher",
        title: "Abdos à la maison",
        price: "29,99 €",
        isBought: true,
        image: require("../assets/images/today-session.png"),
        chips: [
          {
            icon: <IcFire />,
            text: "Débutant",
          },
          {
            icon: <IcClockRound />,
            text: "4 semaines",
          },
        ],
      },
    ],
  },
];

export const mockExercises: Exercise[] = [
  {
    id: "1",
    title: "Abmat sit up",
    image: "https://via.placeholder.com/200",
  },
  {
    id: "2",
    title: "Abmat sit up",
    image: "https://via.placeholder.com/200",
  },
  {
    id: "3",
    title: "Abmat sit up",
    image: "https://via.placeholder.com/200",
  },
];
