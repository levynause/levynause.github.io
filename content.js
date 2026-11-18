/* ==========================================================
   EDIT THIS FILE ONLY. Everything on the site comes from here.
   Keep the quotes and commas. File paths are case-sensitive:
   "audio/Mix.MP3" and "audio/mix.mp3" are different files.
   ========================================================== */
const SITE = {
  name: "Levy Nause",                 // boot screen, About window, desktop watermark
  tagline: "Audio Engineer",
  host: "studio",                    // terminal prompt reads guest@studio:~$
  logo: "logo.svg",                  // your wide logo: boot screen, desktop corner, browser tab
  iconLogo: "logo-square.svg",             // OPTIONAL square logo for the About icon, e.g. "logo-square.svg" (saved next to index.html). Leave "" to use the logo above
  wallpaper: "",                     // OPTIONAL desktop wallpaper image (JPG, PNG or SVG), e.g. "wallpaper.jpg". Leave "" for the red-to-black gradient
  logoPos: "corner",                 // where your logo lies over the gradient: "corner" (beside About) or "center" (big, behind the windows)
  email: "LEVY_NAUSE@YAHOO.COM",
  links: [
    { label: "Instagram", url: "https://instagram.com/levynause" },
    
  ],

  // Hide apps you are not ready to show. Names: music, sound, pods, photo, pcb, bio, contact
  // Example: hide: ["pcb", "pods"],
  hide: [],

  // Lines typed on the boot screen before your logo flashes. Edit freely.
  boot: [
    "BIOS-32 v2.04  (C) 1994",
    "Memory test: 65536K OK",
    "Linux version 2.0.36 (root@studio)",
    "Initializing sound card (24-bit / 48 kHz) ... [ OK ]",
    "Mounting /mnt/audio ................... [ OK ]",
    "Mounting /mnt/photos .................. [ OK ]",
    "Starting X server ..................... [ OK ]"
  ],

  // MUSIC: one { } block per track. Any extra keys you add (label, genre...) print as text.
  // Local file: put the MP3 in audio/ and set file.
  // Album art: put a square JPG (about 600px) in covers/ and set cover. Works for sound design too; embeds ignore it.
  // Streaming: delete file and add embed: "URL" (copy the src="..." URL from the
  // Bandcamp / SoundCloud / Spotify / YouTube "Embed" code). Optional h: height in px.
  music: [
    { title: "Loafed Up Timmy - Activate!!! Full EP", role: "Recording Engineer + Mixing Engineer + Mastering Engineer + Studio Producer", embed: "https://open.spotify.com/embed/album/7Fs4NXTa3Ami0i10cxvt2I?utm_source=generator&si=ee088dd59890484d", h: 352 },
    { title: "There's the Sun, Where have You Been - Loafed Up Timmy", role: "Recording Engineer + Mixing Engineer + Mastering Engineer + Studio Producer", year: "2026", file: "audio/There's the Sun, Where have You Been - Loafed Up Timmy.mp3", cover: "covers/Loafedupcoverart.jpg" },
    { title: "The Cypress Jazz Quartet", role: "Assistant Recording Engineer + Mixing Engineer + Producer", year: "2026", file: "audio/LN_C4.mp3",  },
    { title: "Piano Improvisational Piece - Evan Foor", role: "Assistant Recording Engineer + Mixing Engineer + Producer", year: "2026", file: "audio/EFPiano.mp3",  },
    { title: "Chainsaw Through Your Skull - Hammerflesh", role: "Writer - Bass", year: "2025", file: "audio/Chainsaw Through Your Skull.mp3", cover: "covers/hammerflesh.jpg"  },
    { title: "Mozart - Oboe Concerto in C major Movement I", role: "Assistant Engineer", year: "2026", file: "audio/192kbsLN COMPConcerto Recording MVMT 1.mp3",  },
  ],

  // SOUND DESIGN: use file (MP3), video (MP4 in the video/ folder), or embed (YouTube/Vimeo).
  sound: [
    { title: "Spawn meets the Violator", about: "Full audio redesign of the classic Spawn the Animated Series, Includes all original foley, sound design, mixing and Voice acting", type: "foley / film", year: "2025", disclaimer: "Unofficial fan-made sound design redesign of Spawn: The Animated Series. Original series footage and intellectual property belong to their respective rights holders. All original sound design created for this project is by me. No affiliation or endorsement is implied.", embed: "https://www.youtube.com/embed/9sdySqM2mMk?si=qvAtFXkhNgVnH2oU", h: 315 }
  ],

  // PODCASTS: one { } block per show (these are placeholders, replace everything).
  // link is a clickable listen link; cover is the show art (covers/ folder).
  // Either list episode clips: episodes: [{ title, file }] with MP3s in audio/ (same player as music),
  // or use one embed for the whole show: embed: "Spotify/Apple/YouTube embed URL", h: 232
  podcasts: [
    {
      title: "Between Pickups", role: "Producer + Editor", years: "2025-Current",
      about: "Production, processing, editing and after affects for every episode of the Between Pickups Podcast. Professionally edited and polished video and audio content as well as social media promotional material.",
      link: "https://betweenpickups.com",
      episodes: [
        { title: "Between Pickups Podcast", embed: "https://open.spotify.com/embed/show/033z5SdOBC52JqVPNabLnr?utm_source=generator&theme=0&si=878bac491e734b4e", h: 232 }
      ]
    }
  ],

  // PCB + CIRCUIT DESIGN: one block per board (placeholder, replace everything).
  // images: board photos, 3D renders or schematic screenshots (put them in pcb/); they open full-size on click.
  // schematic, gerbers, bom, repo and link print as clickable links; any other key prints as text.
  pcb: [
    {
      title: "Electret Wideband Measurement Microphone ", type: "analog audio / 2-layer PCB", tools: "KiCad", year: "2025",
      about: "This microphone was designed to run on studio phantom power with the Panasonic WM-61A electret capsule. The capsule enables it to measure at frequencies up to 70kHz for sound design purposes with an extremley flat frequency response. The internal circutry cleanly shunts phantom voltage to act as a line level injector, with clean RF protected outputs. ",
      images: ["pcb/Mic render.JPG", "pcb/Mic traces.JPG", "pcb/Mic schematic.JPG"],
    },
    {
      title: "API 500 Mic Pre (In Progress)", type: "analog audio / 2-layer PCB", tools: "KiCad", year: "2026",
      about: " Studio mic preamp built on the API 500 standard utilizing a LL1587 Microphone transformer on the front end with a high-headroom descrete transistor gain stage. It features 48V Phantom power, an input pad, and a dedicated high-impedance JFET buffer designed specifically for acoustic piezo pickups. ",
      images: ["pcb/API pre.JPG"],
    },

    {
      title: "Eurorack Power Supply", type: "analog audio / 2-layer PCB", tools: "KiCad", year: "2025",
      about: " A simple clean 15V input power supply designed for eurorack modular synths with Two 12V Rails. Focuses on bulk filtering through 4700µF bulk electrolytic capacitors and voltage regulation through each rail, using LM317 and LM337 respectivley.",
      images: ["pcb/eurorack power.JPG", "pcb/eurorack schematic.JPG"],
    }
  ],

  // GALLERY (concert photos): put JPGs in photos/ (export RAW files such as .rw2 to JPG first; browsers cannot show RAW). caption shows in the full-size viewer.
  photos: [
    { src: "photos/IMG_2388.jpg", caption: "Fire Station Studios, SSL Duality Delta, 2024" },
    { src: "photos/P1055533.JPG", caption: "Come and Take it Live, Hammerflesh Performance, 2024" },
    { src: "photos/IMG_2381.jpg", caption: "Fire Station Studios, Studio A" },
    { src: "photos/IMG_1800.JPG", caption: "San Marcos, TX, Hammerflesh Performance, 2025" },
    { src: "photos/IMG_1742.JPG", caption: "Inside The Hollow, Come and Take It Live, 2025" },
  ],

  // ABOUT: portrait is optional (delete the line to hide it).
  bio: {
    photo: "photos/portrait.jpg",
    facts: { based: "Austin, TX", focus: "Audio Engineering, Production, PCB Design, Violinist, Computer Technician, Live Photography" },
    text: [
      "Levy Nause is an audio engineer and musician who started his passion for music and audio at the age of 10, when he first began playing violin and continues to this day. The breadth of his technical passions and proficiencies extend from high-level understanding and demonstration of audio and music to substantial hands on experience in the fields of electronics and computer hardware. He interweaves his musical performance background with his passion for technology to aproach sound with an engineering and problem solving perspective.",
    
    ]
  }
};