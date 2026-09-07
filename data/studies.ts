import { projects } from "./projects";

/* Study detail content, keyed by the same slug the homepage project
   cards link to. Adding a new study later only requires appending an
   entry here — the /studies/[slug] page renders any registered study.

   A study is an editorial sequence of alternating copy and visuals
   ("scenes"): each text block carries its own paragraphs, followed by
   the media block(s) that illustrate that copy. Major editorial rhythm
   (120px desktop / 80px mobile) separates blocks; paragraphs inside one
   text block are closer (32px).

   All LiveStroke assets live under /public/studies/LiveStroke/ and are
   referenced as "/studies/LiveStroke/<file>". While an entry carries no
   src the block renders as a blank gray placeholder panel with the
   exact dimensions the real asset will occupy, so dropping a file into
   that folder and adding its src later changes nothing else on the
   page. Videos are .mp4/.webm and play muted inline on load; anything
   else renders as an image. A media entry may instead carry a `vimeo`
   video id, which renders the hosted Vimeo embed (muted autoplay,
   looping, no controls). */

export interface StudyMedia {
  src?: string;
  vimeo?: string;
  alt?: string;
}

export type StudyBlock =
  | {
      type: "text";
      paragraphs: string[];
      /* Optional inline action link rendered on its own line below the
         paragraphs (opens in a new tab). */
      link?: { label: string; href: string };
    }
  | { type: "media"; media?: StudyMedia }
  | {
      type: "media-cluster";
      /* Default (no layout): items wrap side-by-side when width allows,
         with the 16px grouped gap on both axes. "stack": items span the
         full editorial width, one under the next, still 16px apart. */
      layout?: "stack";
      items: StudyMedia[];
    };

export interface Study {
  slug: string;
  title: string;
  description?: string;
  blocks: StudyBlock[];
}

export const studies: Study[] = [
  {
    slug: "livestroke",
    title: "Making a gradient border feel simple",
    description:
      "Building a lightweight React component that makes animated gradient borders easy to use, customize, and ship.",
    blocks: [
      /* Section 1 visual (1/2) — hero animation, hosted on Vimeo. */
      {
        type: "media",
        media: {
          vimeo: "1224207606",
          alt: "Animated LiveStroke gradient border around a button",
        },
      },

      /* Section 1 — opener copy, directly below the hero animation. */
      {
        type: "text",
        paragraphs: [
          "I wanted something that felt polished enough for a modern interface without pulling in a heavy animation library. The result is a simple component you wrap around existing content, while LiveStroke handles the border animation.",
        ],
        link: {
          label: "Open LiveStroke Playground",
          href: "https://stroke.d-s.me/",
        },
      },

      /* Second visual — the LiveStroke Playground in action, hosted on
         Vimeo (same muted autoplay, looping, controls-off embed). */
      {
        type: "media",
        media: {
          vimeo: "1224216496",
          alt: "The LiveStroke Playground running presets and custom gradients",
        },
      },

      /* Existing text — sits between the second video and the third
         visual. */
      {
        type: "text",
        paragraphs: [
          "The tricky part wasn't making a gradient move. It was making the effect flexible enough to actually use: stroke size, speed, opacity, shadows, border radius, custom colors, TypeScript, SSR, and arbitrary children.",
          "I kept the public API intentionally small, while putting most of the complexity underneath it.",
        ],
      },

      /* Third visual — the two images stacked vertically (Image 1 on
         top, Image 2 below, 16px grouped gap between them): code
         example on top, rendered result underneath.
         assets: /studies/livestroke/livestroke-1.png (top),
                 /studies/livestroke/livestroke-2.png (bottom) */
      {
        type: "media-cluster",
        layout: "stack",
        items: [
          {
            src: "/studies/livestroke/livestroke-1.png",
            alt: "LiveStroke code example: the component wrapped around a button",
          },
          {
            src: "/studies/livestroke/livestroke-2.png",
            alt: "LiveStroke rendered gradient border result",
          },
        ],
      },

      /* Section 3 — presets and custom gradients. */
      {
        type: "text",
        paragraphs: [
          "I wanted people to be able to experiment with the effect, so the Playground supports both presets and custom gradients.",
          "Custom colors are simply passed as an array of hex values, which keeps the package simple while giving the Playground plenty of room to play.",
        ],
      },

      /* Visual for the "hardest bug" copy below.
         asset: /studies/livestroke/livestroke-3.png */
      {
        type: "media",
        media: {
          src: "/studies/livestroke/livestroke-3.png",
          alt: "LiveStroke Playground controls",
        },
      },

      /* Section 4 — the hardest bug. */
      {
        type: "text",
        paragraphs: [
          "One of the hardest bugs came from the Playground itself. Some controls would randomly stop responding, sliders wouldn't drag and buttons wouldn't click.",
          "The problem wasn't the controls. I was keeping two screens mounted during the transition, and the invisible screen could end up sitting above the active one and stealing the interaction.",
        ],
      },
      /* Bug-fix visual, directly below the copy above — hosted on Vimeo
         (same muted autoplay, looping, controls-off embed). */
      {
        type: "media",
        media: {
          vimeo: "1224238051",
          alt: "LiveStroke Playground controls working after the bug fix",
        },
      },

      /* Section 5 — the fix. */
      {
        type: "text",
        paragraphs: [
          "Unmounting the inactive screen fixed the interaction, but also broke the transition.",
          "So instead, I kept both screens mounted during the animation and disabled pointer-events and visibility on the outgoing screen once the transition finished. The animation stayed smooth, without leaving an invisible layer over the UI.",
        ],
      },
      /* Visual for the "fix" copy above.
         asset: /studies/livestroke/livestroke-components.png */
      {
        type: "media",
        media: {
          src: "/studies/livestroke/livestroke-components.png",
          alt: "LiveStroke interaction working after the fix",
        },
      },

      /* Section 6 — the final stretch. */
      {
        type: "text",
        paragraphs: [
          "The final stretch was mostly small things that made the whole experience feel finished: accepting hex values pasted without #, fixing an overflowing segmented-control pill, and cleaning up the generated JSX for larger gradients.",
        ],
      },
      /* Visual for the "final stretch" copy above — one video card,
         hosted on Vimeo (muted autoplay, looping, controls off).
         titled "livestroke-mobile". */
      {
        type: "media",
        media: {
          vimeo: "1224245988",
          alt: "LiveStroke running on mobile",
        },
      },

      /* Section 7 — shipping. The download count stays part of the copy
         below; no statistic block. */
      {
        type: "text",
        paragraphs: [
          "LiveStroke eventually went from a Playground experiment to a real npm package, with ESM and CJS builds, TypeScript declarations, React as a peer dependency, and a proper cleanup before shipping.",
          "LiveStroke v0.3.0 now includes custom gradients, the reusable segmented control, and a Playground that generates the code you'd actually use.",
          "As of September 2026, it has crossed 500+ npm downloads.",
        ],
      },
    ],
  },
  {
    slug: "filterpixel",
    title: "Making AI photo editing feel effortless",
    description:
      "Redesigning FilterPixel around the real workflow of event photographers, bringing culling, editing, and exporting together without adding more complexity.",
    blocks: [
      /* Opening hero video, the first visual on the page directly
         after the title and subtext block, with the opener copy
         following below it. */
      {
        type: "media",
        media: {
          src: "/studies/filterpixel/filterpixel-intro.webm",
          alt: "FilterPixel intro, the AI photo culling and editing interface",
        },
      },
      {
        type: "text",
        paragraphs: [
          "For about three months, starting in December 2024, I led the end-to-end product design for FilterPixel, an AI-powered photo culling and editing platform built for event and wedding photographers.",
          "The product was already live and being used by real photographers. My job was to make an existing workflow feel faster, simpler, and more connected.",
        ],
        link: {
          label: "Experience FilterPixel",
          href: "https://filterpixel.com/",
        },
      },

      /* Blank placeholder for the next FilterPixel visual, added
         after the opening copy and its link. */
      { type: "media", media: {} },

      /* Scene 2, the "real product" copy, followed by a small,
         visually secondary cluster of placeholders: Trustpilot
         rating, YouTube thumbnails, press and partner logos. */
      {
        type: "text",
        paragraphs: [
          "FilterPixel wasn't a concept or a greenfield project. It was an established product with a growing user base, a library of educational content, and photographers relying on it to get through real deadlines.",
          "That meant every design decision had to work within an existing product and workflow, not just look good in a prototype.",
        ],
      },
      {
        type: "media-cluster",
        items: [{}, {}, {}],
      },

      /* Scene 3, the problem copy, followed by the before/after
         workflow diagram placeholder: two separate app windows, a
         friction point, then one unified experience (gallery-4 can be
         used later). */
      {
        type: "text",
        paragraphs: [
          "The basic workflow was already there: import, cull, edit, export.",
          "The problem was that it was split across two separate applications. Every hand-off meant more switching, more waiting, and more mental overhead, especially when you're working through thousands of photos on a deadline.",
          "I wasn't trying to reinvent photo editing. I wanted to remove the friction between the parts that were already working.",
        ],
      },
      { type: "media", media: {} },

      /* Scene 4, the user research copy, followed by a two-panel
         cluster (gallery-2, gallery-3). */
      {
        type: "text",
        paragraphs: [
          "FilterPixel already had thousands of active users, so I didn't want to guess at what was slowing them down.",
          "I surveyed 168 photographers to find the recurring problems, then spoke with 10 photographers at different experience levels to understand what was behind those patterns.",
          "The interviews surfaced a lot of smaller frustrations that the survey data alone couldn't explain, and those insights shaped most of what came next.",
        ],
      },
      {
        type: "media-cluster",
        items: [{}, {}],
      },

      /* Scene 5, the opportunity copy, followed by a side-by-side
         cluster: the Elena persona and empathy map next to the
         competitive comparison. */
      {
        type: "text",
        paragraphs: [
          "I turned that research into a persona, Elena, to give the team someone concrete to design for. I mapped out what she was thinking, feeling, and struggling with throughout the workflow.",
          "I also looked at Lightroom, Capture One, Luminar, and Darktable. The takeaway wasn't that FilterPixel needed to compete with them feature for feature.",
          "Its opportunity was different: let AI take care of more of the repetitive work, while keeping the photographer in control.",
        ],
      },
      {
        type: "media-cluster",
        items: [{}, {}],
      },

      /* Scene 6, the design process copy, followed by the visual
         progression placeholder: wireframes, high fidelity,
         components, final product (gallery-6, gallery-7, gallery-8,
         gallery-10, gallery-9; animated.webm can later serve the
         motion). */
      {
        type: "text",
        paragraphs: [
          "Once the direction was clear, I started with low-fidelity wireframes to work through the navigation and core flows with stakeholders.",
          "After validating those, I moved into high fidelity and started building a design system around the product, shared components, typography, spacing, and interaction patterns that could work across both culling and editing.",
          "The goal was to make the product feel like one system rather than two experiences stitched together.",
        ],
      },
      {
        type: "media-cluster",
        items: [{}, {}, {}, {}, {}],
      },

      /* Scene 7, the results copy, followed by a three-panel cluster
         (gallery-11, gallery-12, gallery-13) and then one separate
         empty video placeholder for customer testimonial footage. */
      {
        type: "text",
        paragraphs: [
          "The redesign brought importing, culling, editing, and exporting into one connected workflow, removing the context switching that started this project in the first place.",
          "AI-assisted presets helped reduce editing time, while usability testing helped improve the key flows.",
          "But the most useful feedback came from the people actually using the product. Photographers talked about getting through large weddings faster, turning days of work into hours, and spending far less time on the parts of the process that used to slow them down.",
        ],
      },
      {
        type: "media-cluster",
        items: [{}, {}, {}],
      },
      { type: "media", media: {} },

      /* Scene 8, the closing copy, followed by one final quiet visual
         placeholder (outro.webp or a simple stat card for 50,000+
         photographers, added later). */
      {
        type: "text",
        paragraphs: [
          "The product has continued to grow since I worked on it, but the core idea remains the same: help photographers spend less time managing their workflow and more time on the work itself.",
          "Today, FilterPixel is trusted by 50,000+ photographers and studios worldwide.",
        ],
      },
      { type: "media", media: {} },
    ],
  },
];

/* Skeleton used while a homepage study has no authored entry yet: the
   card's own title and slug, with blank media sections only. */
const PLACEHOLDER_BLOCKS: StudyBlock[] = [
  { type: "media" },
  { type: "media-cluster", items: [{}, {}] },
  { type: "media" },
];

export function getStudyForSlug(slug: string): Study | undefined {
  const authored = studies.find((study) => study.slug === slug);
  if (authored) return authored;

  const project = projects.find(
    (item) => item.slug === slug && item.category === "studies",
  );
  if (!project) return undefined;

  return {
    slug: project.slug,
    title: project.title,
    blocks: PLACEHOLDER_BLOCKS,
  };
}
