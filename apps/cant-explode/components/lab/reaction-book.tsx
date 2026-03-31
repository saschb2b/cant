"use client";

import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { BookOpen, X, Search } from "lucide-react";
import { ELEMENTS } from "@/lib/lab/elements";
import { REACTIONS, REACTION_GROUPS, NON_REACTIONS } from "@/lib/lab/reactions";
import type { ElementType, ReactionRule } from "@/lib/lab/types";

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function colorStr(element: string): string {
  if (!(element in ELEMENTS)) return "transparent";
  const def = ELEMENTS[element as ElementType];
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
            <Box
              key={`${p}-${String(i)}`}
              sx={{ display: "inline-flex", alignItems: "center" }}
            >
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

export function ReactionBookButton() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase().trim();
    const groups: { name: string; reactions: ReactionRule[] }[] = [];
    for (const groupName of REACTION_GROUPS) {
      const reactions = REACTIONS.filter((r) => {
        if (!q) return true;
        return (
          r.a.includes(q) ||
          r.b.includes(q) ||
          (r.produceA?.includes(q) ?? false) ||
          (r.produceB?.includes(q) ?? false) ||
          r.desc.toLowerCase().includes(q) ||
          r.group.toLowerCase().includes(q)
        );
      });
      if (reactions.length > 0) {
        groups.push({ name: groupName, reactions });
      }
    }
    return groups;
  }, [search]);

  const filteredNonReactions = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return NON_REACTIONS;
    return NON_REACTIONS.filter(
      (nr) =>
        nr.a.includes(q) ||
        nr.b.includes(q) ||
        nr.desc.toLowerCase().includes(q),
    );
  }, [search]);

  const totalVisible = filteredGroups.reduce(
    (s, g) => s + g.reactions.length,
    0,
  );

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
            sx: {
              width: { xs: "100%", sm: 420 },
              p: 0,
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        {/* Header with search */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Reaction Book
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {search
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "action.hover",
              borderRadius: 1,
              px: 1.5,
              py: 0.75,
            }}
          >
            <Search size={16} style={{ opacity: 0.5, flexShrink: 0 }} />
            <InputBase
              placeholder="Filter by element or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              sx={{ fontSize: "0.85rem" }}
              inputProps={{ "aria-label": "Filter reactions" }}
            />
            {search && (
              <IconButton
                size="small"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                sx={{ p: 0.25 }}
              >
                <X size={14} />
              </IconButton>
            )}
          </Box>
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
                {group.reactions.map((rule) => (
                  <ReactionRow
                    key={`${rule.a}-${rule.b}-${rule.produceA ?? "x"}-${rule.produceB ?? "x"}`}
                    rule={rule}
                  />
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
                {filteredNonReactions.map((nr) => (
                  <Box
                    key={`${nr.a}-${nr.b}`}
                    sx={{
                      py: 1.25,
                      px: 1.5,
                      borderRadius: 1,
                      bgcolor: "action.hover",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
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
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              No reactions found for &quot;{search}&quot;.
            </Typography>
          )}
        </Box>
      </Drawer>
    </>
  );
}
