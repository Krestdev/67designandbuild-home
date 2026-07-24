import type { RichText } from "@/hooks/type";

type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
};

function walk(node: LexicalNode): string {
  if (!node) return "";
  if (node.type === "text") return node.text ?? "";
  if (Array.isArray(node.children)) {
    return node.children.map(walk).join(" ");
  }
  return "";
}

export function getPlainTextFromRichText(richText: RichText): string {
  return walk(richText.root as LexicalNode)
    .replace(/\s+/g, " ")
    .trim();
}