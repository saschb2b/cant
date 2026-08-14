import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FormattedText } from "./formatted-text";
import { SourceLink } from "./source-link";

interface ExplanationChallenge {
  id: string;
  category: string;
  title: string;
  explanationCorrect: string;
  explanationWrong?: string;
  sourceUrl: string;
  sourceLabel: string;
}

interface LearnExplanationProps {
  challenge: ExplanationChallenge;
  /** Display label for the challenge's category, shown on the source link. */
  categoryLabel: string;
  /** Repo URL, used by the source link's "Suggest a fix" action. */
  githubUrl?: string;
  /** Heading above the `explanationWrong` text. */
  wrongLabel?: string;
  /** Heading above the `explanationCorrect` text. */
  correctLabel?: string;
}

function ExplanationRow({
  label,
  color,
  text,
  isLast,
}: {
  label: string;
  color: string;
  text: string;
  isLast?: boolean;
}) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="flex-start"
      sx={{ mb: isLast ? 0 : 1.5 }}
    >
      <Box
        sx={{
          width: 3,
          minHeight: 20,
          bgcolor: color,
          borderRadius: 100,
          mt: 0.5,
          flexShrink: 0,
        }}
      />
      <Box>
        <Typography
          variant="caption"
          fontWeight={600}
          color={color}
          fontFamily="var(--font-geist-mono), monospace"
        >
          {label}
        </Typography>
        <Box
          sx={{
            typography: "body2",
            lineHeight: 1.75,
            color: "text.primary",
            mt: 0.25,
          }}
        >
          <FormattedText text={text} />
        </Box>
      </Box>
    </Stack>
  );
}

/**
 * The explanation body of a learn challenge: an "avoid" and a "prefer" note,
 * each with a colored accent bar, followed by the source link.
 *
 * Pass this as the `renderExplanation` slot of `LearnCategoryPage`. The
 * "avoid" half is skipped when a challenge has no `explanationWrong`.
 */
export function LearnExplanation({
  challenge,
  categoryLabel,
  githubUrl,
  wrongLabel = "Why avoid",
  correctLabel = "Why prefer",
}: LearnExplanationProps) {
  return (
    <>
      {challenge.explanationWrong && (
        <ExplanationRow
          label={wrongLabel}
          color="error.main"
          text={challenge.explanationWrong}
        />
      )}
      <ExplanationRow
        label={correctLabel}
        color="success.main"
        text={challenge.explanationCorrect}
        isLast
      />
      <SourceLink
        href={challenge.sourceUrl}
        label={challenge.sourceLabel}
        challengeId={challenge.id}
        category={challenge.category}
        challengeTitle={challenge.title}
        categoryLabel={categoryLabel}
        githubUrl={githubUrl}
      />
    </>
  );
}
