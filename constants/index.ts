export const ACHIEVMENTS = [
  {
    title: "Starstruck",
    description: "@Solarin-Johnson created a repository that has many stars",
    date: "16 Feb 2025",
    image: require("../assets/pack/starstruck.webp"),
    completed: true,
    color: "#873700",
  },
  {
    title: "Pull Shark",
    description: "@Solarin-Johnson opened a pull request that has been merged",
    date: "20 Sep 2023",
    image: require("../assets/pack/pull-shark.webp"),
    completed: true,
    color: "#001353",
  },
  {
    title: "Galaxy Brain",
    description: "@Solarin-Johnson answered discussions",
    date: "05 Oct 2024",
    image: require("../assets/pack/galaxy-brain.webp"),
    completed: true,
    color: "#240C7B",
  },
  {
    title: "Pair Extraordinaire",
    description: "@Solarin-Johnson coauthored commits on merged pull request",
    date: "12 May 2024",
    image: require("../assets/pack/pair-extraordinaire.webp"),
    completed: true,
    color: "#065100",
  },
  {
    title: "YOLO",
    description: "You want it? You merge it.",
    date: "01 Jan 2024",
    image: require("../assets/pack/yolo.webp"),
    completed: true,
    color: "#2C3389",
  },
  {
    title: "Quickdraw",
    description: "Gitty up!",
    date: "01 Dec 2023",
    image: require("../assets/pack/quickdraw.webp"),
    completed: true,
    color: "#902900",
  },
  {
    title: "Public Sponsor",
    description: "Sponsored an open source contributor through GitHub Sponsors",
    image: require("../assets/pack/public-sponsor.webp"),
    completed: false,
    color: "#8C225E",
  },
  {
    title: "Arctic Code Vault Contributor",
    description:
      "Contributed code to repositories in the 2020 GitHub Archive Program",
    image: require("../assets/pack/arctic-code-vault-contributor.webp"),
    completed: false,
    color: "#001171",
  },
];

export const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
};
