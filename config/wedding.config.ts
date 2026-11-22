/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Karl & Hannah — wedding configuration
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every page reads from this file. Change a detail here and it updates
 *  everywhere (hero, countdown, venues, program, RSVP, admin, share preview…).
 *
 *  Photos live in /public. A path like "/images/church.jpg" means the file
 *  /public/images/church.jpg. If a photo is missing, the site shows an
 *  embossed-paper placeholder instead, so nothing ever looks broken.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const wedding = {
  couple: {
    partnerOne: "Karl",
    partnerTwo: "Hannah",
    monogram: "K&H",
  },

  /** Wedding day as YYYY-MM-DD, interpreted in `timezone`. */
  date: "2027-01-05",
  timezone: "Asia/Manila",
  /** Short place name used on the invitation card and the share preview. */
  city: "Lapu-Lapu City, Cebu",

  /** Last day to RSVP (YYYY-MM-DD). */
  rsvpDeadline: "2026-12-10",

  /**
   * The day your story began (YYYY-MM-DD). Used for the "Ten Years of Us"
   * section — the site computes how many years you'll have been together on
   * the wedding day. ✏️ Change this to your real anniversary.
   */
  relationshipStart: "2017-01-05",

  hero: {
    openingLine: "Together with their families",
    invitationLine: "joyfully invite you to celebrate their marriage",
    tagline: "ten years in the making",
  },

  ceremony: {
    label: "The Ceremony",
    name: "Sto. Niño de Cebu – Mactan Parish",
    address:
      "M.L. Quezon National Highway, Mactan, Lapu-Lapu City, Cebu 6015, Philippines",
    time: "3:00 PM",
    photo: "/images/venue/church.jpg",
  },

  reception: {
    label: "The Reception",
    name: "Chateau by the Sea",
    address:
      "Brgy. Buot, Punta Engaño Road, Mactan, Lapu-Lapu City, Cebu 6015, Philippines",
    /** Guests arrive by this time for pica-pica before the program begins. */
    time: "4:30 PM",
    photo: "/images/venue/chateu.jpg",
  },

  venueNote:
    "Kindly arrive 30 minutes before the ceremony so we can begin on time. After the ceremony, please head to Chateau by the Sea by 4:30 PM to enjoy some pica-pica before the program begins. Parking is available at the reception.",

  /** Order of the day. Icons: rings · camera · glass · dinner · dance · sparkle */
  program: [
    { time: "3:00 PM", title: "Wedding Ceremony", detail: "Sto. Niño de Cebu – Mactan Parish", icon: "rings" },
    { time: "4:30 PM", title: "Pica-pica & Cocktails", detail: "Light bites and drinks at Chateau by the Sea", icon: "glass" },
    { time: "6:30 PM", title: "Dinner & Toasts", detail: "Good food and kind words", icon: "dinner" },
    { time: "8:00 PM", title: "First Dance", detail: "Then the dance floor is yours", icon: "dance" },
    { time: "10:00 PM", title: "Send-off", detail: "One last cheer for the newlyweds", icon: "sparkle" },
  ],

  /**
   * The entourage, shown after the Order of the Day. Parents and grandmothers
   * show first; "View the full entourage" opens the rest. Any part left empty
   * ([] or "") is hidden.
   */
  entourage: {
    parents: {
      groom: ["Atty. Felix Alvin B. Melecio", "Mrs. Hedy C. Melecio"],
      bride: ["Mr. Alvin O. Capoy", "Mrs. Maita B. Capoy"],
    },
    grandmothers: {
      groom: { name: "Regina B. Melecio", assistedBy: "Frances Abeguelle M. Cane" },
      bride: { name: "Lelita C. Batucan", assistedBy: "Catherine B. Batucan" },
    },
    /** One pair per line: [gentleman, lady] */
    principalSponsors: [
      ["Cong. Junard “Ahong” Q. Chan", "Mayor Ma. Cynthia “Cindi” K. Chan"],
      ["Eng’r. Jose Orlando D. Carungay", "Ms. Grace Mary C. Carungay"],
      ["Eng’r. Ronald G. Chan", "Ms. Grace S. Chan"],
      ["Dr. Pherdes E. Galbo", "Ms. Michelle Catherine C. Galbo"],
      ["PGen. Jason L. Capoy", "Atty. Rachel G. Alburo"],
      ["Ret. Gen. Arnel U. Peralta", "Ms. Elizabeth B. Peralta"],
      ["Atty. Jessie L. Capoy", "Ms. Katrina G. Capoy"],
      ["Mr. Eric O. Capoy", "Ms. Genie L. Capoy"],
      ["Dr. Oscar C. Tagalog", "Ms. Zisa Belen I. Borata"],
      ["Mr. Dante T. Diaz", "Ms. Gracela U. Diaz"],
      ["Eng’r. Bronson N. Peña", "Ms. Darlene Dale P. Peña"],
      ["Eng’r. Ronnie M. Pacifico", "Eng’r. Susan L. Pacifico"],
      ["Eng’r. Darwin G. Tapia", "Ms. Estrella T. Delfin"],
      ["Mr. Albert Cahigas", "Ms. Amiephil C. Cahigas"],
      ["Mr. Ronald C. Florentino", "Ms. Rubelita B. Florentino"],
      ["Mr. Russell D. Almaden", "Ms. Roquesa B. Almaden"],
      ["Eng’r. Ferdinand E. Nicanor", "Eng’r. Carmenita Rosario A. Nicanor"],
      ["Eng’r. Ceferino F. Peralta", "Ms. Luella A. Peralta"],
      ["Mr. Clive E. Cane", "Ms. Ester M. Cane"],
      ["Mr. Edgar A. Etang", "Ms. Mercy M. Etang"],
    ] as [string, string][],
    bestMan: ["Krist Andre C. Melecio"],
    maidOfHonor: ["Raven Kaye B. Florentino"],
    secondarySponsors: {
      candle: ["Romeo John P. Reyes", "Michelle Mae C. Mendezona"],
      veil: ["Aaron Dave B. Almaden", "Coney Marie B. Batucan"],
      cord: ["Jifford C. Cahigas", "Elaine O. Capoy"],
    },
    groomsmen: [
      "Francis Nico M. Cane",
      "Johncel T. Jubay",
      "Kenn Neween M. Etang",
      "John Bernard S. Santalisis",
      "Ivan Clark M. Gomez",
      "James Dominic J. Ybanez",
      "Joseph Earl V. Subelario",
    ],
    bridesmaids: [
      "Bernadith A. Batucan",
      "Angelika Joy C. Cahigas",
      "Rijean E. Angtud",
      "Katrine S. Ybanez",
      "Lokelani Devon R. Rozano",
      "Kristel Anne R. Tuastumban",
      "Evelyn B. Tero",
    ],
    bearers: {
      ring: ["Rowan Gabriel B. Florentino"],
      coin: ["Klyde Elydom M. Etang"],
      bible: ["Keian Kevin M. Etang"],
    },
    flowerGirls: ["Danielle Catherine A. Batucan", "Franceis Reg M. Cane", "Kaisha Mae L. Capoy"],
    littleBrides: ["Erika Shane L. Capoy", "Soohee"],
    offertory: {
      bread: ["Erwin N. Cortes", "Eva V. Cortes"],
      fruits: ["Brian M. Soroño", "Nerissa A. Soroño"],
      wine: ["Sean Patrick T. Tan", "Kamelle Reigh E. Tan"],
    },
  },

  dressCode: {
    title: "Semi-Formal",
    description:
      "We kindly request our guests to wear semi-formal attire in accordance with our wedding colors. We encourage attire that complements our wedding colors.",
    note: "Kindly save white and ivory for the bride.",
    /**
     * Outfit ideas, drawn as illustrations, with what to wear in words under
     * each group. Pick looks from:
     * blueGown · blueSuit · butterOneShoulder · creamBarong ·
     * blueHighLow · blueShirt · butterTiered · butterShirt
     */
    lineups: [
      {
        label: "Principal Sponsors",
        looks: ["blueGown", "blueSuit", "butterOneShoulder", "creamBarong"],
        attire: [
          { label: "Ladies", text: "Long gown or midi dress" },
          { label: "Gentlemen", text: "Blue or cream barong, or a suit" },
        ],
      },
      {
        label: "Guests",
        looks: ["blueHighLow", "blueShirt", "butterTiered", "butterShirt"],
        attire: [
          { label: "Ladies", text: "Midi dress" },
          { label: "Gentlemen", text: "Long sleeves" },
        ],
      },
    ],
    /**
     * Wedding colors, shown as one row of circles (a small gap between
     * families). Names are read out to screen readers.
     */
    palette: [
      {
        label: "Shades of yellow",
        colors: [
          { hex: "#F1E1A6", name: "Butter" },
          { hex: "#E5CF9A", name: "Champagne" },
          { hex: "#D6AD5C", name: "Honey" },
        ],
      },
      {
        label: "Blue to navy",
        colors: [
          { hex: "#A3B8CC", name: "Dusty Blue" },
          { hex: "#5E7896", name: "Slate Blue" },
          { hex: "#1F2E4F", name: "Navy" },
        ],
      },
    ],
  },

  /** A short note about gifts, shown after the dress code. Set message to "" to hide it. */
  gifts: {
    title: "Note on Gifts",
    message:
      "We are grateful for your love and support. Your presence means everything to us. If you wish to give a gift, a monetary offering would be warmly appreciated.",
    /**
     * QR codes for sending a gift, tucked behind a quiet "View gift details"
     * link under the message. Images live in /public/images/gifts/ (clean
     * redraws of the bank QRs: no names or numbers). Empty list = no link.
     */
    details: {
      accountName: "KHwedding",
      qrCodes: [
        { label: "GCash", image: "/images/gifts/gcash.png" },
        { label: "BPI", image: "/images/gifts/bpi.png" },
        { label: "Security Bank", image: "/images/gifts/securitybank.png" },
      ],
    },
  },

  story: {
    title: "Our Story",
    photo: "/images/couple.jpg",
    /**
     * Where to focus inside the photo (percent from left / from top) and how
     * far to zoom in, so the oval frames the two of you. Zoom 1 = whole photo.
     */
    photoFocus: { x: 47, y: 45, zoom: 1.2 },
    /** ✏️ Write your own — one or two short paragraphs. */
    paragraphs: [
      "It started with a simple hello. Somehow that hello became ten years of long talks, little adventures, inside jokes and quiet Sunday mornings — of growing up side by side and choosing each other in every season.",
      "On our tenth year together, we're making it forever. We would be so happy to have you there.",
    ],
  },

  /**
   * "Ten Years of Us" — your story, told in chapters.
   * ✏️ Rename chapters, change the years, or rewrite the text freely.
   *
   * Photos: each chapter has its own folder in /public/images/story/
   * (the `folder` below). Just drop photos into it:
   *   /public/images/story/younger-years/01.png, 02.png, 03.png, …
   * They appear automatically in file-name order (01 gets the big spot),
   * so number them oldest first. Guests tap to see them all.
   * A chapter with no photos yet shows an embossed plate.
   * Leave out `folder` for a words-only chapter (like "Ten years & forever").
   * The years shown on the site come from `when`, not from the photos.
   */
  journey: {
    title: "Ten Years of Us",
    chapters: [
      {
        folder: "younger-years",
        title: "Our younger years",
        when: "2017 to 2018",
        text: "Where it all began: one conversation that never really ended, and a lot of growing up side by side.",
      },
      {
        folder: "getting-to-work",
        title: "Growing up & getting to work",
        when: "2019 to 2022",
        text: "New jobs, long days and big dreams. We learned to build a life together, one small win at a time.",
      },
      {
        folder: "exploring-the-world",
        title: "Exploring the world",
        when: "2023 to 2025",
        text: "Passports, window seats and new places, and the happy discovery that home is wherever we are together.",
      },
      {
        folder: "proposal-trip",
        title: "The proposal trip",
        when: "2026",
        text: "One trip, one question and one very happy yes.",
      },
      {
        // No `folder`: this chapter is words only, since it hasn't happened yet.
        title: "Ten years & forever",
        when: "2027",
        text: "On our tenth year together, we say I do.",
      },
    ],
  },

  /**
   * Prenup gallery. Drop .jpg / .png / .webp files into /public/images/prenup
   * and they appear automatically, sorted by file name (01.jpg, 02.jpg, …).
   * The layout shows 6: 01 is the big arched photo, 02–06 are the prints around it.
   * Empty spots show a "coming soon" print. Add more than 6 and a "View all" button appears.
   */
  gallery: {
    title: "Our Prenup",
    folder: "/images/prenup",
    /** A short line shown with the photos. Set to "" to hide it. */
    caption: "Ten years, and still choosing each other.",
    /** Show "coming soon" frames while the folder is empty. Set false to hide the section until photos are added. */
    showWhenEmpty: true,
  },

  /**
   * Prenup teaser video, shown under the prenup photos.
   * Hidden for now: the video premieres at the wedding. To share it later
   * (e.g. after the wedding), upload it to YouTube as "Unlisted" (or to Vimeo)
   * and paste the link in `link`, or put a small .mp4 at /public/videos/prenup-teaser.mp4.
   * It appears as soon as either is set. If both are set, the link is used.
   */
  teaser: {
    title: "Our prenup teaser",
    /** e.g. "https://youtu.be/AbCdEfGhIjK" or "https://vimeo.com/123456789" */
    link: "",
    file: "/videos/prenup-teaser.mp4",
    /** Cover image before it plays. Leave "" to use prenup photo 02. */
    poster: "",
    /** true for a tall 9:16 (phone / reel style) video. */
    vertical: false,
    /** Show a "coming soon" frame until the video is added. */
    showWhenMissing: false,
  },

  /**
   * Optional background music. Put an .mp3 at /public/audio/our-song.mp3.
   * If the file doesn't exist, the music button is hidden automatically.
   */
  music: {
    src: "/audio/our-song.mp3",
  },

  site: {
    /** Keep the invitation out of search engines (link previews on Messenger/Viber still work). */
    allowSearchIndexing: false,
  },
} as const;

export type WeddingConfig = typeof wedding;
/** Icons available for the order of the day (see components/art/ProgramIcons.tsx). */
export type ProgramIcon = "rings" | "camera" | "glass" | "dinner" | "dance" | "sparkle";
