import NextLink from "next/link";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { ArrowRight } from "lucide-react";

/** Optional app-specific tool shown as outlined secondary button. */
interface GimmickAction {
  href: string;
  label: string;
}

interface HeroCtaProps {
  /** Optional app-specific tool (e.g. "Viewer", "Inspector"). */
  gimmick?: GimmickAction;
}

/**
 * Renders the hero CTA button row in a fixed order:
 *   Play (contained) | Gimmick? (outlined) | Learn (text)
 */
export function HeroCta({ gimmick }: HeroCtaProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
    >
      <NextLink href="/play" style={{ textDecoration: "none" }}>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowRight size={18} />}
        >
          Play
        </Button>
      </NextLink>
      {gimmick && (
        <NextLink href={gimmick.href} style={{ textDecoration: "none" }}>
          <Button variant="outlined" size="large">
            {gimmick.label}
          </Button>
        </NextLink>
      )}
      <NextLink href="/learn" style={{ textDecoration: "none" }}>
        <Button variant="text" size="large">
          Learn
        </Button>
      </NextLink>
    </Stack>
  );
}
