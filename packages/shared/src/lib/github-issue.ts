interface ChallengeRef {
  id: string;
  title: string;
  category: string;
  categoryLabel?: string;
}

export function buildChallengeIssueUrl(
  githubUrl: string,
  challenge: ChallengeRef,
): string {
  const issueTitle = `Challenge \`${challenge.id}\`: `;
  const body = [
    `**Challenge:** ${challenge.title}`,
    `**ID:** \`${challenge.id}\``,
    `**Category:** ${challenge.categoryLabel ?? challenge.category}`,
    "",
    "<!-- What is wrong, or what could be improved? -->",
  ].join("\n");
  const params = new URLSearchParams({ title: issueTitle, body });
  return `${githubUrl.replace(/\/+$/, "")}/issues/new?${params.toString()}`;
}
