import sharp from "sharp";

// ---------- Lexical rich text helpers ----------

export const text = (value: string) => ({
  type: "text",
  text: value,
  format: 0,
  detail: 0,
  mode: "normal",
  style: "",
  version: 1,
});

export const block = { format: "" as const, indent: 0, version: 1, direction: "ltr" as const };

export const p = (value: string) => ({
  ...block,
  type: "paragraph",
  textFormat: 0,
  textStyle: "",
  children: [text(value)],
});

export const h2 = (value: string) => ({ ...block, type: "heading", tag: "h2", children: [text(value)] });

export const ul = (items: string[]) => ({
  ...block,
  type: "list",
  listType: "bullet",
  tag: "ul",
  start: 1,
  children: items.map((item, i) => ({ ...block, type: "listitem", value: i + 1, children: [text(item)] })),
});

export type Node = ReturnType<typeof p> | ReturnType<typeof h2> | ReturnType<typeof ul>;

export const richText = (...children: (string | Node)[]) => ({
  root: {
    ...block,
    type: "root",
    children: children.map((c) => (typeof c === "string" ? p(c) : c)),
  },
});

// ---------- Placeholder images ----------

const palettes = [
  ["#3a3f44", "#8a6d3b"],
  ["#2f4858", "#86bbd8"],
  ["#4a4e69", "#c9ada7"],
  ["#283618", "#bc6c25"],
  ["#1d3557", "#a8dadc"],
  ["#5e503f", "#c6ac8f"],
];

let paletteIndex = 0;

export async function placeholderImage(label: string, width = 1600, height = 1000) {
  const [from, to] = palettes[paletteIndex++ % palettes.length];
  const safe = label.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
      font-family="Arial, sans-serif" font-size="${Math.round(width / 28)}" fill="#ffffff" fill-opacity="0.85">${safe}</text>
  </svg>`;
  return sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toBuffer();
}

