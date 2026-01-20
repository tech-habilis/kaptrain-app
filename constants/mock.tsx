import IcWeight from "@/components/icons/weight";
import {
  ExerciseItem,
  ProgramSectionProps,
  SportOption,
  TChoice,
} from "@/types";
import { ColorConst } from "./theme";
import IcFire from "@/components/icons/fire";
import IcClockRound from "@/components/icons/clock-round";
import IcCycling from "@/components/icons/cycling";
import IcRowing from "@/components/icons/rowing";
import IcBasketball from "@/components/icons/basketball";
import IcCrossfit from "@/components/icons/crossfit";
import IcBodybuilding from "@/components/icons/bodybuilding";
import IcYoga from "@/components/icons/yoga";

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
      id: "5",
      title: "Arch extension",
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

export const mockWeeklyTracking = [
  {
    text: "Lun",
    doing: false,
  },
  {
    text: "Mar",
    doing: true,
  },
  {
    text: "Mer",
    doing: true,
  },
  {
    text: "Jeu",
    doing: true,
  },
  {
    text: "Ven",
    doing: true,
  },
  {
    text: "Sam",
    doing: false,
  },
  {
    text: "Dim",
    doing: false,
  },
];

export const mockSports: TChoice[] = [
  { id: "id-Cyclisme", text: "Cyclisme" },
  { id: "id-Musculation", text: "Musculation" },
  { id: "id-Aviron", text: "Aviron" },
  { id: "id-Course-à-pied", text: "Course à pied" },
  { id: "id-Crossfit", text: "Crossfit" },
];

export const ALL_SPORTS: SportOption[] = [
  {
    id: "athletics",
    name: "Athlétisme",
    icon: <IcCycling size={24} />,
  },
  { id: "rowing", name: "Aviron", icon: <IcRowing size={24} /> },
  { id: "basketball", name: "Basketball", icon: <IcBasketball size={24} /> },
  { id: "crossfit", name: "Crossfit", icon: <IcCrossfit size={24} /> },
  { id: "cycling", name: "Cyclisme", icon: <IcCycling size={24} /> },
  {
    id: "bodybuilding",
    name: "Musculation",
    icon: <IcBodybuilding size={24} />,
  },
  { id: "yoga", name: "Yoga", icon: <IcYoga size={24} /> },
];

export const zoneReference = [
  {
    id: "id-Z1",
    zone: "Z1",
    percentage: "30-50%",
    targetPace: "9:00 – 6:00",
    color: ColorConst.success,
  },
  {
    id: "id-Z2",
    zone: "Z2",
    percentage: "51-70%",
    targetPace: "5:53 – 4:17",
    color: "#CEA700",
  },
  {
    id: "id-Z3",
    zone: "Z3",
    percentage: "71-91%",
    targetPace: "4:13 – 3:45",
    color: "#DB8000",
  },
  {
    id: "id-Z4",
    zone: "Z4",
    percentage: "85-105%",
    targetPace: "3:42 – 3:18",
    color: "#E65B08",
  },
  {
    id: "id-Z5",
    zone: "Z5",
    percentage: "91-105%",
    targetPace: "3:18 – 3:00",
    color: "#E35D56",
  },
  {
    id: "id-Z6",
    zone: "Z6",
    percentage: "150%",
    targetPace: "2:30",
    color: "#E04D60",
  },
  {
    id: "id-Z7",
    zone: "Z7",
    percentage: "250%",
    targetPace: "1:30",
    color: "#BA0003",
  },
];

export const zoneReferenceWithHeader = [
  {
    zone: "Zones",
    percentage: "Pourcentage VMA",
    targetPace: "Allure cible (km/h)",
    color: ColorConst.secondary,
  },
  ...zoneReference,
];

export const intensityOptions: TChoice[] = [
  { id: "id-Aucun", text: "Aucun" },
  { id: "id-FORCE", text: "FORCE (%RM)" },
  { id: "id-Cardiaque", text: "Cardiaque (%FC Max)" },
  { id: "id-pma", text: "Puissance (%PMA)" },
  { id: "id-ftp", text: "Puissance (%FTP)" },
  { id: "id-vma", text: "Vitesse (%VMA)" },
  { id: "id-Vitesse", text: "Vitesse (Vitesse brute)" },
  { id: "id-physique", text: "Ressenti (RPE physique)" },
  { id: "id-cognitif", text: "Ressenti (RPE cognitif)" },
];

export const sportChoices: TChoice[] = [
  {
    id: "id-sports.athletics",
    text: "sports.athletics",
    leftIcon: <IcCycling />,
  },
  {
    id: "id-sports.rowing",
    text: "sports.rowing",
    leftIcon: <IcRowing />,
  },
  {
    id: "id-sports.basketball",
    text: "sports.basketball",
    leftIcon: <IcBasketball />,
  },
  {
    id: "id-sports.crossfit",
    text: "sports.crossfit",
    leftIcon: <IcCrossfit />,
  },
  {
    id: "id-sports.cycling",
    text: "sports.cycling",
    leftIcon: <IcCycling />,
  },
  {
    id: "id-sports.bodybuilding",
    text: "sports.bodybuilding",
    leftIcon: <IcBodybuilding />,
  },
  {
    id: "id-sports.yoga",
    text: "sports.yoga",
    leftIcon: <IcYoga />,
  },
];
