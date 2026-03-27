"use client";

import { useEffect, useRef } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface CategorySection {
  label: string;
  categories: string[];
}

interface LearnMobileNavProps {
  sections: CategorySection[];
  categoryLabels: Record<string, string>;
}

export function LearnMobileNav({
  sections,
  categoryLabels,
}: LearnMobileNavProps) {
  const pathname = usePathname();
  const activeRef = useRef<HTMLAnchorElement>(null);
  const allCategories = sections.flatMap((s) => s.categories);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <Box
      component="nav"
      sx={{
        display: { xs: "block", md: "none" },
        mx: -2,
        px: 2,
        pb: 2,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Stack direction="row" spacing={0.75} sx={{ minWidth: "max-content" }}>
        {allCategories.map((category) => {
          const isActive = pathname === `/learn/${category}`;
          return (
            <NextLink
              key={category}
              ref={isActive ? activeRef : undefined}
              href={`/learn/${category}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: isActive ? "primary.main" : "action.hover",
                  color: isActive ? "primary.contrastText" : "text.secondary",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: isActive ? "primary.main" : "action.selected",
                  },
                }}
              >
                <Typography variant="caption" fontWeight={isActive ? 600 : 500}>
                  {categoryLabels[category]}
                </Typography>
              </Box>
            </NextLink>
          );
        })}
      </Stack>
    </Box>
  );
}
