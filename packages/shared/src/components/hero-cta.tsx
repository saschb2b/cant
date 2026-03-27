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
          sx={{
            px: { xs: 3, md: 5 },
            py: { xs: 1, md: 1.5 },
            fontSize: { xs: "0.9rem", md: "1.05rem" },
          }}
        >
          Play
        </Button>
      </NextLink>
      {gimmick && (
        <NextLink href={gimmick.href} style={{ textDecoration: "none" }}>
          <Button
            variant="outlined"
            size="large"
            sx={{
              px: { xs: 2, md: 3 },
              py: { xs: 1, md: 1.5 },
              fontSize: { xs: "0.9rem", md: "1.05rem" },
            }}
          >
            {gimmick.label}
          </Button>
        </NextLink>
      )}
      <NextLink href="/learn" style={{ textDecoration: "none" }}>
        <Button
          variant="text"
          size="large"
          sx={{
            px: { xs: 2, md: 3 },
            py: { xs: 1, md: 1.5 },
            fontSize: { xs: "0.9rem", md: "1.05rem" },
          }}
        >
          Learn
        </Button>
      </NextLink>
    </Stack>
  );
}
