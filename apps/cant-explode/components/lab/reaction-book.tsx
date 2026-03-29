"use client";

import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { BookOpen, X } from "lucide-react";
import { ELEMENTS, PICKABLE_ELEMENTS } from "@/lib/lab/elements";
import { REACTIONS, REACTION_GROUPS, NON_REACTIONS } from "@/lib/lab/reactions";
import type { ElementType, ReactionRule } from "@/lib/lab/types";

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function colorStr(element: string): string {
  const def = ELEMENTS[element as ElementType];
  if (!def) return "transparent";
  const [r, g, b] = def.baseColor;
  return `rgb(${String(r)}, ${String(g)}, ${String(b)})`;
}

function ColorDot({ element, size = 8 }: { element: string; size?: number }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        bgcolor: colorStr(element),
        border: "1px solid",
        borderColor: "divider",
        flexShrink: 0,
      }}
    />
  );
}

function ElementTag({ element }: { element: string }) {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
      <ColorDot element={element} />
      <Typography
        component="span"
        variant="caption"
        fontWeight={600}
        sx={{ fontSize: "0.7rem" }}
      >
        {capitalize(element)}
      </Typography>
    </Box>
  );
}

function ReactionRow({ rule }: { rule: ReactionRule }) {
  const products: string[] = [];
  if (rule.produceA) products.push(rule.produceA);
  if (rule.produceB) products.push(rule.produceB);

  return (
    <Box
      sx={{
        py: 1.25,
        px: 1.5,
        borderRadius: 1,
        bgcolor: "action.hover",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          flexWrap: "wrap",
        }}
      >
        <ElementTag element={rule.a} />
        <Typography
          component="span"
          variant="caption"
          color="text.disabled"
          sx={{ fontSize: "0.7rem", mx: 0.25 }}
        >
          +
        </Typography>
        <ElementTag element={rule.b} />
        <Typography
          component="span"
          variant="caption"
          color="text.disabled"
          sx={{ fontSize: "0.85rem", mx: 0.5 }}
        >
          {"\u2192"}
        </Typography>
        {products.length > 0 ? (
          products.map((p, i) => (
            <Box key={p} sx={{ display: "inline-flex", alignItems: "center" }}>
              {i > 0 && (
                <Typography
                  component="span"
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontSize: "0.7rem", mx: 0.25 }}
                >
                  +
                </Typography>
              )}
              <ElementTag element={p} />
            </Box>
          ))
        ) : (
          <Typography
            component="span"
            variant="caption"
            color="text.disabled"
            sx={{ fontSize: "0.7rem", fontStyle: "italic" }}
          >
            consumed
          </Typography>
        )}
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: "0.65rem", display: "block", mt: 0.5 }}
      >
        {rule.desc}
      </Typography>
    </Box>
  );
}

function matchesFilter(rule: ReactionRule, filter: ElementType): boolean {
  return (
    rule.a === filter ||
    rule.b === filter ||
    rule.produceA === filter ||
    rule.produceB === filter
  );
}

export function ReactionBookButton() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<ElementType | null>(null);

  // Collect all elements that appear in reactions for the filter chips
  const reactiveElements = useMemo(() => {
    const set = new Set<ElementType>();
    for (const r of REACTIONS) {
      set.add(r.a);
      set.add(r.b);
    }
    // Order them by PICKABLE_ELEMENTS order, then any remaining
    const ordered: ElementType[] = [];
    for (const el of PICKABLE_ELEMENTS) {
      if (set.has(el)) ordered.push(el);
    }
    return ordered;
  }, []);

  const filteredGroups = useMemo(() => {
    const groups: { name: string; reactions: ReactionRule[] }[] = [];
    for (const groupName of REACTION_GROUPS) {
      const reactions = REACTIONS.filter(
        (r) => r.group === groupName && (!filter || matchesFilter(r, filter)),
      );
      if (reactions.length > 0) {
        groups.push({ name: groupName, reactions });
      }
    }
    return groups;
  }, [filter]);

  const filteredNonReactions = useMemo(() => {
    if (!filter) return NON_REACTIONS;
    return NON_REACTIONS.filter((nr) => nr.a === filter || nr.b === filter);
  }, [filter]);

  const totalVisible = filteredGroups.reduce((s, g) => s + g.reactions.length, 0);

  return (
    <>
      <Tooltip title="Reaction book">
        <IconButton
          size="small"
          onClick={() => setOpen(true)}
          sx={{ color: "text.secondary" }}
          aria-label="Reaction book"
        >
          <BookOpen size={18} />
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: { width: { xs: "100%", sm: 420 }, p: 0, display: "flex", flexDirection: "column" },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 2,
            borderBottom: 1,
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Reaction Book
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {filter
                ? `${String(totalVisible)} of ${String(REACTIONS.length)} reactions`
                : `${String(REACTIONS.length)} reactions`}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X size={18} />
          </IconButton>
        </Box>

        {/* Element filter */}
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            gap: 0.5,
            flexWrap: "wrap",
            flexShrink: 0,
          }}
        >
          <Chip
            label="All"
            size="small"
            variant={filter === null ? "filled" : "outlined"}
            color={filter === null ? "primary" : "default"}
            onClick={() => setFilter(null)}
            sx={{ height: 24, fontSize: "0.65rem" }}
          />
          {reactiveElements.map((el) => {
            const [r, g, b] = ELEMENTS[el].baseColor;
            const isActive = filter === el;
            return (
              <Chip
                key={el}
                label={capitalize(el)}
                size="small"
                variant={isActive ? "filled" : "outlined"}
                onClick={() => setFilter(isActive ? null : el)}
                icon={<ColorDot element={el} size={7} />}
                sx={{
                  height: 24,
                  fontSize: "0.65rem",
                  ...(isActive && {
                    bgcolor: `rgb(${String(r)}, ${String(g)}, ${String(b)})`,
                    color: r + g + b > 400 ? "#000" : "#fff",
                    "&:hover": {
                      bgcolor: `rgb(${String(Math.max(0, r - 20))}, ${String(Math.max(0, g - 20))}, ${String(Math.max(0, b - 20))})`,
                    },
                  }),
                  "& .MuiChip-icon": { ml: 0.5 },
                }}
              />
            );
          })}
        </Box>

        {/* Scrollable content */}
        <Box sx={{ flex: 1, overflow: "auto", px: 2.5, py: 2 }}>
          {filteredGroups.map((group) => (
            <Box key={group.name} sx={{ mb: 2.5 }}>
              <Typography
                variant="caption"
                color="text.disabled"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  mb: 1,
                  display: "block",
                }}
              >
                {group.name}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                {group.reactions.map((rule, i) => (
                  <ReactionRow key={i} rule={rule} />
                ))}
              </Box>
            </Box>
          ))}

          {/* Non-reactions */}
          {filteredNonReactions.length > 0 && (
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="caption"
                color="text.disabled"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  mb: 1,
                  display: "block",
                }}
              >
                No reaction
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                {filteredNonReactions.map((nr, i) => (
                  <Box
                    key={i}
                    sx={{
                      py: 1.25,
                      px: 1.5,
                      borderRadius: 1,
                      bgcolor: "action.hover",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <ElementTag element={nr.a} />
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.disabled"
                        sx={{ fontSize: "0.7rem", mx: 0.25 }}
                      >
                        +
                      </Typography>
                      <ElementTag element={nr.b} />
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.disabled"
                        sx={{ fontSize: "0.85rem", mx: 0.5 }}
                      >
                        {"\u2192 \u2717"}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.65rem", display: "block", mt: 0.5 }}
                    >
                      {nr.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {totalVisible === 0 && filteredNonReactions.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No reactions found for {filter ? capitalize(filter) : "this element"}.
            </Typography>
          )}
        </Box>
      </Drawer>
    </>
  );
}
