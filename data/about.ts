export type IntroTone = "primary" | "muted";

export interface IntroSegment {
  text: string;
  tone?: IntroTone;
}

export interface IntroParagraph {
  segments: IntroSegment[];
}

export type AboutColumnId = "tools" | "principles" | "experience";

export interface AboutListColumn {
  id: AboutColumnId;
  heading: string;
  items: string[];
}

export interface CursorMediaSource {
  poster?: string;
  videoSrc?: string;
}

export const introParagraphs: IntroParagraph[] = [
  {
    segments: [
      { text: "Over the past 5+ years, I've worked across", tone: "muted" },
      { text: " AI, FinTech, SaaS and consumer technology" },
      { text: ", collaborating with teams at", tone: "muted" },
      { text: " Perfios, Karza, TenTwenty, PaperClip, Reevv Research" },
      { text: " and", tone: "muted" },
      { text: " FilterPixel." },
    ],
  },
  {
    segments: [
      { text: "Recently, I've also been building", tone: "muted" },
      { text: " open-source products like LiveStrokes," },
      {
        text: " turning design ideas into tools that developers can use.",
        tone: "muted",
      },
    ],
  },
  {
    segments: [
      {
        text: "Outside of work, I'm usually building something with",
        tone: "muted",
      },
      { text: " design, AI and code," },
      {
        text: " or you'll find me in the gym, riding my motorcycle or planning my next adventure.",
        tone: "muted",
      },
    ],
  },
];

export const aboutColumns: AboutListColumn[] = [
  {
    id: "tools",
    heading: "[Tools]",
    items: [
      "Figma",
      "Claude",
      "OpenCode",
      "Framer",
      "Adobe Creative Suite",
    ],
  },
  {
    id: "principles",
    heading: "[Principles]",
    items: [
      "Creative Product Thinking",
      "Design Systems",
      "Experience Design (UX)",
      "Visual Design (UI)",
      "Human-Computer Interaction (HCI)",
      "Vibe Prototyping",
      "Interaction Design",
    ],
  },
  {
    id: "experience",
    heading: "[Experience]",
    items: [
      "Founding (Lead) Designer, Layer (Jun'26–Current)",
      "Senior Product Designer, TenTwenty (Jul'25–Jun'26)",
      "Associate Manager I, Product Design, Perfios (Apr'24–Jul'25)",
      "Product Designer, Perfios (Jan'23–Mar'24)",
      "Junior Product Designer, Karza (Jun'22–Dec'22)",
    ],
  },
];

export const cursorMediaSource: CursorMediaSource = {
  videoSrc: "/videos/deepanjan-sen-product-designer-about.webm",
};
