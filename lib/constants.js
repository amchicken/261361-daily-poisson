export const CATEGORY = () => [
  "Math",
  "Science",
  "Language",
  "Economy",
  "Social",
  "General",
];

export const LEVEL = () => ["Easy", "Medium", "Hard"];
export const POINTS = (level) => {
  switch (level) {
    case "Easy":
      return 10;
    case "Medium":
      return 50;
    case "Hard":
      return 350;
    default:
      return 10;
  }
};

CATEGORY();
