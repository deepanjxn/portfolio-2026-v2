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
  /* Vimeo only: size the iframe to the video's native 16:9 and center it
     in the 16:10 editorial box so the player covers the whole frame (the
     box crops the overflow) instead of letterboxing the video. */
  cover?: boolean;
}

/* A paragraph is plain text, or a sequence of text runs where an
   individual run may be an inline link (accent blue, opens in a new
   tab). */
export type StudyTextRun = string | { text: string; href: string };

export type StudyBlock =
  | {
      type: "text";
      paragraphs: Array<string | StudyTextRun[]>;
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
         assets: /studies/livestroke/livestroke-1.webp (top),
                 /studies/livestroke/livestroke-2.webp (bottom) */
      {
        type: "media-cluster",
        layout: "stack",
        items: [
          {
            src: "/studies/livestroke/livestroke-1.webp",
            alt: "LiveStroke code example: the component wrapped around a button",
          },
          {
            src: "/studies/livestroke/livestroke-2.webp",
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
         asset: /studies/livestroke/livestroke-3.webp */
      {
        type: "media",
        media: {
          src: "/studies/livestroke/livestroke-3.webp",
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
         asset: /studies/livestroke/livestroke-components.webp */
      {
        type: "media",
        media: {
          src: "/studies/livestroke/livestroke-components.webp",
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
         following below it. Hosted on Vimeo; `cover` fills the 16:10
         frame with the native 16:9 player (cropped, centered). */
      {
        type: "media",
        media: {
          vimeo: "1227040848",
          alt: "filterpixel-intro",
          cover: true,
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

      /* First FilterPixel visual, directly after the opening copy and
         its link: the product walkthrough video. */
      {
        type: "media",
        media: {
          src: "/studies/filterpixel/filterpixel-11.webm",
          alt: "FilterPixel product walkthrough showing the connected import, cull, edit, and export workflow",
        },
      },

      /* Scene 2, the "real product" copy, followed by the FilterPixel
         early-feedback visual. */
      {
        type: "text",
        paragraphs: [
          "FilterPixel wasn't a concept or a greenfield project. It was an established product with a growing user base, a library of educational content, and photographers relying on it to get through real deadlines.",
          "That meant every design decision had to work within an existing product and workflow, not just look good in a prototype.",
        ],
      },
      {
        type: "media",
        media: {
          src: "/studies/filterpixel/filterpixel-15.webp",
          alt: "FilterPixel early feedback from photographers: six review cards about the fragmented culling and editing workflow",
        },
      },

      /* Scene 3, the problem copy, followed by the two-app workflow
         visual (FilterPixel Cull and FilterPixel Edit side by side). */
      {
        type: "text",
        paragraphs: [
          "The basic workflow was already there: import, cull, edit, export.",
          "The problem was that it was split across two separate applications. Every hand-off meant more switching, more waiting, and more mental overhead, especially when you're working through thousands of photos on a deadline.",
          "I wasn't trying to reinvent photo editing. I wanted to remove the friction between the parts that were already working.",
        ],
      },
      {
        type: "media",
        media: {
          src: "/studies/filterpixel/filterpixel-2.webp",
          alt: "FilterPixel Cull and FilterPixel Edit as two separate apps, with the caption about context switching between culling and editing",
        },
      },

      /* Scene 4, the user research copy, followed by the survey results
         and the interview questions stacked vertically (16px gap). */
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
        layout: "stack",
        items: [
          {
            src: "/studies/filterpixel/filterpixel-3.webp",
            alt: "FilterPixel survey results from 168 photographers: 82% use the app for culling and 18% for editing, with what they expect from culling software",
          },
          {
            src: "/studies/filterpixel/filterpixel-4.webp",
            alt: "FilterPixel interview questions covering culling workflows, speed versus accuracy, and what a premium experience means",
          },
        ],
      },

      /* Scene 5, the opportunity copy, followed by the empathy map and
         the research tracker stacked vertically (16px gap). */
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
        layout: "stack",
        items: [
          {
            src: "/studies/filterpixel/filterpixel-5.webp",
            alt: "Elena empathy map: what the photographer does, thinks, says, and feels across the workflow",
          },
          {
            src: "/studies/filterpixel/filterpixel-6.webp",
            alt: "FilterPixel research tracker spreadsheet with research areas, methods, status, and insights",
          },
        ],
      },

      /* Scene 6, the design process copy, followed by the product video
         (Vimeo, muted autoplay loop), the "one system" takeaway line as
         its own text block, and then the visual progression: wireframes,
         high fidelity, the final product, and the design system, stacked
         full-width with the 16px grouped gap. */
      {
        type: "text",
        paragraphs: [
          "Once the direction was clear, I started with low-fidelity wireframes to work through the navigation and core flows with stakeholders.",
          "After validating those, I moved into high fidelity and started building a design system around the product, shared components, typography, spacing, and interaction patterns that could work across both culling and editing.",
        ],
      },
      {
        type: "media",
        media: {
          vimeo: "1085247810",
          alt: "FilterPixel",
          cover: true,
        },
      },
      {
        type: "text",
        paragraphs: [
          "The goal was to make the product feel like one system rather than two experiences stitched together.",
        ],
      },
      {
        type: "media-cluster",
        layout: "stack",
        items: [
          {
            src: "/studies/filterpixel/filterpixel-7.webp",
            alt: "FilterPixel low-fidelity wireframes covering the home screen, onboarding, culling grid, and culling details",
          },
          {
            src: "/studies/filterpixel/filterpixel-8.webp",
            alt: "FilterPixel high-fidelity screens for export, culling, key faces, and AI profiles",
          },
          {
            src: "/studies/filterpixel/filterpixel-9.webp",
            alt: "FilterPixel final product screens for profile, adjustments, editing, and the AI profiles marketplace",
          },
          {
            src: "/studies/filterpixel/filterpixel-10.webp",
            alt: "FilterPixel design system with the reusable component library and color tokens",
          },
        ],
      },

      /* Scene 7, the results copy, followed by a second instance of the
         product walkthrough video, the "most useful feedback" line as
         its own text block, and then the customer testimonial footage
         as ONE vertical video cluster: the two Vimeo videos 16px apart
         (the grouped cluster gap, not the 120px section rhythm). Both
         are native 16:10, so the 16:10 media frame fills them edge to
         edge — no cover override needed. */
      {
        type: "text",
        paragraphs: [
          "The redesign brought importing, culling, editing, and exporting into one connected workflow, removing the context switching that started this project in the first place.",
          "AI-assisted presets helped reduce editing time, while usability testing helped improve the key flows.",
        ],
      },
      {
        type: "media",
        media: {
          src: "/studies/filterpixel/filterpixel-11.webm",
          alt: "FilterPixel product walkthrough showing the connected import, cull, edit, and export workflow",
        },
      },
      {
        type: "text",
        paragraphs: [
          "But the most useful feedback came from the people actually using the product. Photographers talked about getting through large weddings faster, turning days of work into hours, and spending far less time on the parts of the process that used to slow them down.",
        ],
      },
      {
        type: "media-cluster",
        layout: "stack",
        items: [
          {
            vimeo: "1226865892",
            alt: "cursorful-video-1789456572450",
          },
          {
            vimeo: "1226870792",
            alt: "cursorful-video-1789457879220",
          },
        ],
      },

      /* Scene 8, the closing copy with the Customer Reviews CTA, using
         the same action-link treatment as the opening "Experience
         FilterPixel" link, followed at the standard section rhythm by
         the two review visuals stacked vertically (16px apart): the
         Trustpilot summary and then the testimonial card. */
      {
        type: "text",
        paragraphs: [
          "The product has continued to grow since I worked on it, but the core idea remains the same: help photographers spend less time managing their workflow and more time on the work itself.",
          "Today, FilterPixel is trusted by 50,000+ photographers and studios worldwide.",
        ],
        link: {
          label: "Customer Reviews",
          href: "https://www.trustpilot.com/review/filterpixel.com",
        },
      },
      {
        type: "media-cluster",
        layout: "stack",
        items: [
          {
            src: "/studies/filterpixel/filterpixel-13.webp",
            alt: "FilterPixel rated Excellent on Trustpilot based on 175 reviews, with review highlights and verified customer reviews",
          },
          {
            src: "/studies/filterpixel/filterpixel-16.webp",
            alt: "Sourav Das, Sr. Product Manager at FilterPixel, on working with Deepanjan on the FilterPixel V4 UI/UX",
          },
        ],
      },
    ],
  },
  {
    slug: "paperclip",
    title: "Making selling as easy as taking a photo",
    description:
      "Designing Paperclip's AI-powered resale experience to remove the work between taking a photo and completing a sale.",
    blocks: [
      /* Opening Vimeo embed, above the opening copy. `cover` sizes the
         16:9 player to the full height of the 16:10 box and centers it,
         so the box crops the overflow — no letterboxing. */
      {
        type: "media",
        media: {
          vimeo: "1085649092",
          alt: "Paperclip IOS Listing",
          cover: true,
        },
      },

      /* Scene 1 — the opener. */
      {
        type: "text",
        paragraphs: [
          "For eight months, starting in September 2024, I led the product design for Paperclip, an AI-powered marketplace for buying and selling second-hand goods.",
          "The idea was simple: make selling something online feel as easy as taking a photo of it.",
        ],
        link: {
          label: "Download Paperclip (only available in UK)",
          href: "https://apps.apple.com/gb/app/ai-marketplace-paperclip/id990240447",
        },
      },
      /* Hero visual — the Paperclip dashboard. */
      {
        type: "media",
        media: {
          src: "/studies/paperclip/paperclip-1.webp",
          alt: "Paperclip dashboard",
        },
      },

      /* Scene 2 — selling shouldn't feel like work. */
      {
        type: "text",
        paragraphs: [
          "Selling something online still takes more effort than it should. You have to write the listing, figure out what it's worth, upload the right photos, answer questions, and eventually coordinate payment and delivery.",
          "I wanted Paperclip to take care of as much of that work as possible, without making the experience feel automated or impersonal.",
        ],
      },
      /* Visual — survey results. */
      {
        type: "media",
        media: {
          src: "/studies/paperclip/paperclip-1.1.webp",
          alt: "Survey results from 100 participants showing what people expected from Paperclip",
        },
      },

      /* Scene 3 — understanding the resale experience. Competitive
         analysis. */
      {
        type: "text",
        paragraphs: [
          "Before opening Figma, I spent time understanding how people actually buy and sell second-hand.",
          "I looked at platforms like Depop, Vinted, and Shpock across the full journey, then surveyed 100 regular resale users to understand where people were spending the most time and where automation could genuinely help.",
        ],
      },
      {
        type: "media-cluster",
        layout: "stack",
        items: [
          {
            src: "/studies/paperclip/paperclip-3.webp",
            alt: "Paperclip competitive analysis comparing Paperclip, Depop, Vinted, Shpock, and WhatNot, with key findings",
          },
        ],
      },

      /* Scene 4 — finding the patterns. Persona image and empathy map,
         the paragraph about the picture it gave the team, then the
         affinity maps. */
      {
        type: "text",
        paragraphs: [
          "Once the responses started coming in, I grouped them into recurring themes instead of treating every comment as a separate problem.",
        ],
      },
      {
        type: "media-cluster",
        layout: "stack",
        items: [
          {
            src: "/studies/paperclip/paperclip-2.webp",
            alt: "Paperclip research persona Charlotte: goals and needs, frustrations, behavior insights, and her own words",
          },
          {
            src: "/studies/paperclip/paperclip-6.webp",
            alt: "Paperclip empathy map for the persona: what she does, thinks, says, and feels about reselling",
          },
        ],
      },
      {
        type: "text",
        paragraphs: [
          "That gave me a clearer picture of what people actually needed, and a persona built from the research gave the team something concrete to design around. It became much easier to ask, “Would this actually make selling easier for them?”",
        ],
      },
      {
        type: "media-cluster",
        layout: "stack",
        items: [
          {
            src: "/studies/paperclip/paperclip-4.webp",
            alt: "Paperclip affinity map linking user quotes about simplicity, speed, and visual trust to derived insights and design opportunities",
          },
          {
            src: "/studies/paperclip/paperclip-5.webp",
            alt: "Paperclip affinity map linking user quotes about communication, fees, and platform feel to derived insights and design opportunities",
          },
        ],
      },

      /* Scene 5 — removing the unnecessary steps. User flow and early
         wireframes as ONE cluster. */
      {
        type: "text",
        paragraphs: [
          "Mapping the journey from taking a photo to completing a sale made one thing obvious: there were too many steps between the two.",
          "I started with low-fidelity wireframes to strip the flow back, test the structure, and figure out what could be automated before worrying about the visual design.",
        ],
      },
      {
        type: "media-cluster",
        layout: "stack",
        items: [
          {
            src: "/studies/paperclip/paperclip-7.webp",
            alt: "Low-fidelity Paperclip wireframes covering the listing flow, from capturing photos to publishing an item",
          },
          {
            src: "/studies/paperclip/paperclip-8.webp",
            alt: "Low-fidelity Paperclip wireframes covering item details, offers, and supporting app flows",
          },
        ],
      },

      /* Scene 6 — turning the flow into a product. Showcase video, then
         the design-system note, followed by the remaining visuals as
         ONE cluster. */
      {
        type: "text",
        paragraphs: [
          "Once the core flow felt right, I moved into high fidelity and started building the design system alongside it.",
        ],
      },
      {
        type: "media",
        media: {
          src: "/studies/paperclip/paperclip-showcase.webm",
          alt: "Paperclip Pro retail SaaS showcase: dashboard, inventory, and storefront screens",
        },
      },
      {
        type: "media",
        media: {
          src: "/studies/paperclip/paperclip-11.webp",
          alt: "Paperclip design system components: button states, product cards, category pickers, pickup points, and referral cards",
        },
      },
      {
        type: "text",
        paragraphs: [
          "Shared components, typography, spacing, and interaction patterns gave Paperclip a consistent foundation and made it easier to keep moving quickly as the product grew.",
        ],
      },
      {
        type: "media-cluster",
        layout: "stack",
        items: [
          {
            src: "/studies/paperclip/paperclip-9.webp",
            alt: "Paperclip high-fidelity screens covering onboarding, photo capture, listing details, pricing, and tracking",
          },
          {
            src: "/studies/paperclip/paperclip-10.webp",
            alt: "Paperclip high-fidelity screens covering shipping, pricing, AI try-on, product pages, and address entry",
          },
        ],
      },

      /* Scene 7 — the result. Opener paragraph, the Paperclip UI demo,
         the listing demo, then the outcome paragraph and the ratings
         & reviews visual. */
      {
        type: "text",
        paragraphs: [
          "The biggest change was how little work the seller had to do.",
        ],
      },
      /* Vimeo — Paperclip UI. */
      {
        type: "media",
        media: {
          vimeo: "1085654499",
          alt: "Paperclip UI",
          cover: true,
        },
      },
      {
        type: "text",
        paragraphs: [
          "AI-assisted listing reduced the time it took to create a listing by 85%, and every participant in usability testing completed the listing-to-shipping flow without getting stuck.",
        ],
      },
      {
        type: "media-cluster",
        layout: "stack",
        items: [
          {
            vimeo: "1228309328",
            alt: "listing-with-ai",
            cover: true,
          },
        ],
      },
      {
        type: "text",
        paragraphs: [
          "When the app launched, it reached a 4.9-star rating on the App Store, but the feedback I found most interesting was much simpler: people just felt like selling something wasn't such a chore anymore.",
        ],
      },
      /* Outcome feedback — ratings & reviews. */
      {
        type: "media",
        media: {
          src: "/studies/paperclip/paperclip-14.webp",
          alt: "Paperclip App Store ratings and reviews: 4.9 out of 5 from 12.4K ratings, with three customer reviews",
        },
      },

      /* Closing line, then the team credit with the inline link. */
      {
        type: "text",
        paragraphs: [
          "Selling something should be as easy as taking a photo of it.",
          [
            "I worked closely with ",
            {
              text: "Even Walser",
              href: "https://uk.linkedin.com/in/evenwalser",
            },
            ", Alex, Luke, and Petr throughout the product, and with Sophie on iOS to translate the designs into a cohesive Swift experience. Seeing the work move from early ideas and prototypes into a real product was one of the most rewarding parts of building Paperclip together.",
          ],
        ],
      },
      /* Final media element — closing Vimeo embed. */
      {
        type: "media",
        media: {
          vimeo: "1228310895",
          alt: "paperclip-final",
          cover: true,
        },
      },
    ],
  },
  {
    slug: "reevv-research",
    title: "Designing the system behind Reevv Research",
    description:
      "Building a visual language that could move seamlessly between Reevv's products, interfaces, presentations, and marketing.",
    blocks: [
      /* Scene 1 hero — the Reevv wordmark. */
      {
        type: "media",
        media: {
          src: "/studies/reevv/gallery-1.webp",
          alt: "Reevv wordmark and logo mark on a purple gradient background",
        },
      },

      /* Scene 1 — the opener. */
      {
        type: "text",
        paragraphs: [
          "In September 2024, I spent eight weeks building the visual identity and brand system for Reevv, an AI-native operating company. The work covered everything from the core identity to how it could stretch across the products Reevv was building.",
        ],
      },

      /* Scene 2 — the challenge. */
      {
        type: "text",
        paragraphs: [
          "Reevv wasn't building just one product. It was building an operating system for solo operators, a realty automation tool, a fact-checking product, and more. The challenge was creating one identity that could connect all of them without making everything look the same.",
        ],
      },
      /* reevv-identiy.webm — identity motion piece (local video: muted,
         autoplay, loop, plays inline via the shared StudyMedia
         implementation). */
      {
        type: "media",
        media: {
          src: "/studies/reevv/reevv-identiy.webm",
          alt: "Reevv identity animation",
        },
      },

      /* Scene 3 — getting the direction right. */
      {
        type: "text",
        paragraphs: [
          "Before opening Figma, I spent time with Joshua Jack and Christian Reyes, the co-founders, talking through what they wanted Reevv to feel like and where they wanted the company to go. That conversation gave me a much clearer direction before I started exploring the visual side.",
        ],
      },

      /* Scene 4 — finding the visual language. */
      {
        type: "text",
        paragraphs: [
          "I started by looking at how AI companies were presenting themselves and, more importantly, where Reevv could feel different. I explored a range of typography, symbols, layouts, and logo directions before narrowing things down.",
        ],
      },
      /* reevv-comp.webp — the reference landscape of AI company marks. */
      {
        type: "media",
        media: {
          src: "/studies/reevv/reevv-comp.webp",
          alt: "Grid of AI company logos reviewed as reference for Reevv's visual direction",
        },
      },
      {
        type: "text",
        paragraphs: [
          "The logo went through quite a few iterations. With each round, I stripped a little more away until it became something simple enough to recognize, but flexible enough to work across a product, a presentation, or a business card.",
        ],
      },
      /* Logo iterations as one 16px cluster: reevv-sketch-2 (top),
         reevv-sketch-1 (bottom). */
      {
        type: "media-cluster",
        layout: "stack",
        items: [
          {
            src: "/studies/reevv/reevv-sketch-2.webp",
            alt: "Notebook pages of early Reevv logo and letterform explorations",
          },
          {
            src: "/studies/reevv/reevv-sketch-1.webp",
            alt: "Reevv logo sketches: pencil mark explorations beside the geometric construction grid of the final R mark",
          },
        ],
      },
      {
        type: "text",
        paragraphs: [
          "After several rounds of exploration, we landed on this direction and refined it to feel more focused, distinctive, and aligned with Reevv's positioning.",
        ],
      },
      /* Mark and wordmark construction as one 16px cluster: gallery-3
         (top), gallery-4 (bottom). */
      {
        type: "media-cluster",
        layout: "stack",
        items: [
          {
            src: "/studies/reevv/gallery-3.webp",
            alt: "Reevv R mark beside its blue geometric construction grid",
          },
          {
            src: "/studies/reevv/gallery-4.webp",
            alt: "Reevv wordmark construction: hatched letterforms with alignment points on black",
          },
        ],
      },
      /* Scene 5 — typography & colour. */
      {
        type: "text",
        paragraphs: [
          "Typography became a big part of the identity. I wanted something that felt technical and precise, but still had enough character to work outside of the product.",
          "The colour palette stayed intentionally small too. Keeping it restrained made the system easier to recognize and gave each product enough room to have its own personality without drifting away from Reevv.",
        ],
      },
      /* Typography and colour specimens as one 16px cluster: gallery-8
         (top), gallery-10 (bottom). */
      {
        type: "media-cluster",
        layout: "stack",
        items: [
          {
            src: "/studies/reevv/gallery-8.png",
            alt: "Reevv typography specimen: Neue Montreal grotesque typeface in Light, Regular, and Medium styles",
          },
          {
            src: "/studies/reevv/gallery-10.png",
            alt: "Reevv colour palette: Reevv Black, Reevv Purple #7861FF, Reevv Off-White, and Reevv Gray with HEX, RGB, and HSL values",
          },
        ],
      },

      /* Scene 6 — turning it into a system. */
      {
        type: "text",
        paragraphs: [
          "Once the visual direction was established, I started turning it into a system — typography, spacing, colour, components, and the smaller rules that keep everything consistent.",
          "I then applied it across product interfaces, presentations, and marketing materials to make sure it worked beyond the brand itself.",
        ],
      },
      /* Applied system as one 16px cluster: gallery-6, gallery-5,
         gallery-7, gallery-12, gallery-11, gallery-9. */
      {
        type: "media-cluster",
        layout: "stack",
        items: [
          {
            src: "/studies/reevv/gallery-6.webp",
            alt: "Reevv business card mockup: black card with the Reevv wordmark and 'Connecting Experiences' on a purple background",
          },
          {
            src: "/studies/reevv/gallery-5.webp",
            alt: "Reevv social media post designs for 2024 and Web 3 protocols on a purple background",
          },
          {
            src: "/studies/reevv/gallery-7.webp",
            alt: "Reevv merchandise mockups: black t-shirt and tote bag with the Reevv wordmark",
          },
          {
            src: "/studies/reevv/gallery-12.webp",
            alt: "Reevv app icon: black rounded square with the white R mark and a purple notification badge",
          },
          {
            src: "/studies/reevv/gallery-11.webp",
            alt: "Reevv social profile mockup on X showing the brand mark, 'Connecting Experiences', and follower count",
          },
          {
            src: "/studies/reevv/gallery-9.webp",
            alt: "Reevv out-of-home poster series: purple and black panels with the Reevv wordmark and campaign lines",
          },
        ],
      },

      /* Scene 7 — bringing it all together. */
      {
        type: "text",
        paragraphs: [
          "The identity now extends across Reevv, giving everything the company builds a shared visual language while leaving room for it to evolve.",
          "Different products, but one recognisable system tying them together.",
        ],
      },
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
