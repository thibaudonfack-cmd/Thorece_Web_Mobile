// Configuration des personnages
const CHARACTERS = [
  {
    id: 1,
    name: "Myriam",
    role: "La Pilote",
    avatarConfig: {
      sex: "woman",
      faceColor: "#F9C9B6",
      earSize: "small",
      eyeStyle: "circle",
      noseStyle: "short",
      mouthStyle: "smile",
      shirtStyle: "polo",
      glassesStyle: "round",
      hairColor: "#000",
      hairStyle: "womanLong",
      hatStyle: "none",
      hatColor: "#000",
      eyeBrowStyle: "up",
      shirtColor: "#F5D061",
      bgColor: "linear-gradient(45deg, #5a67d8 0%, #9333ea 100%)"
    }
  },
  {
    id: 2,
    name: "Jean",
    role: "L'escrimeur",
    avatarConfig: {
      sex: "man",
      faceColor: "#A16854",
      earSize: "small",
      eyeStyle: "circle",
      noseStyle: "short",
      mouthStyle: "smile",
      shirtStyle: "polo",
      glassesStyle: "round",
      hairColor: "#000",
      hairStyle: "normal",
      hatStyle: "none",
      eyeBrowStyle: "up",
      shirtColor: "#F5D061",
      bgColor: "linear-gradient(45deg, #7c3aed 0%, #ec4899 100%)"
    }
  },
  {
    id: 3,
    name: "Huges",
    role: "Le sorcier",
    avatarConfig: {
      sex: "man",
      faceColor: "#A16854",
      earSize: "small",
      eyeStyle: "circle",
      noseStyle: "short",
      mouthStyle: "laugh",
      shirtStyle: "polo",
      glassesStyle: "none",
      hairColor: "#000",
      hairStyle: "thick",
      hatStyle: "beanie",
      hatColor: "#5a67d8",
      eyeBrowStyle: "up",
      shirtColor: "#c0b6f2",
      bgColor: "linear-gradient(45deg, #f97316 0%, #facc15 100%)"
    }
  }
];

export const childService = {
    getCharacters: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return CHARACTERS;
    }
};
