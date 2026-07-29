/**
 * Matches the mockup's pattern: recent articles show relative time
 * ("Il y'a une semaine"), older ones show an absolute date ("14 Août 2026").
 * Threshold set at 30 days — adjust if the real content calls for a
 * different cutoff.
 */
export function formatArticleDate(publishedDate: string): string {
  const date = new Date(publishedDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "Aujourd'hui";
  if (diffDays === 1) return "Il y'a un jour";
  if (diffDays < 7) return `Il y'a ${diffDays} jours`;
  if (diffDays < 14) return "Il y'a une semaine";
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Il y'a ${weeks} semaines`;
  }

  // Absolute date fallback, e.g. "14 Août 2026"
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}