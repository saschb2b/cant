import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  Bookmark,
  Bug,
  ChevronRight,
  CircleDashed,
  FlaskConical,
  Hammer,
  Square,
  SquareDashed,
} from "lucide-react";
import type { ReactNode } from "react";
import type {
  AcceptanceCriterion,
  TicketCardData,
  TicketKind,
  TicketStatus,
} from "../lib/game/types";

const TYPE_META: Record<
  TicketKind,
  { label: string; color: string; icon: ReactNode }
> = {
  epic: { label: "Epic", color: "#8B5CF6", icon: <Bookmark size={13} /> },
  story: { label: "Story", color: "#10B981", icon: <Bookmark size={13} /> },
  task: { label: "Task", color: "#3B82F6", icon: <Hammer size={13} /> },
  subtask: {
    label: "Subtask",
    color: "#94A3B8",
    icon: <ChevronRight size={13} />,
  },
  bug: { label: "Bug", color: "#EF4444", icon: <Bug size={13} /> },
  spike: { label: "Spike", color: "#F59E0B", icon: <FlaskConical size={13} /> },
};

const STATUS_META: Record<TicketStatus, { label: string; color: string }> = {
  backlog: { label: "Backlog", color: "#94A3B8" },
  ready: { label: "Ready", color: "#3B82F6" },
  "in-progress": { label: "In progress", color: "#F59E0B" },
  review: { label: "In review", color: "#8B5CF6" },
  done: { label: "Done", color: "#10B981" },
};

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="caption"
      sx={{
        color: "text.secondary",
        fontSize: "0.7rem",
        fontWeight: 500,
        mb: 0.5,
        display: "block",
      }}
    >
      {children}
    </Typography>
  );
}

function TypeBadge({ kind }: { kind: TicketKind }) {
  const meta = TYPE_META[kind];
  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      sx={{ color: meta.color, flexShrink: 0 }}
    >
      <Box sx={{ display: "flex" }}>{meta.icon}</Box>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: "inherit",
          fontSize: "0.72rem",
        }}
      >
        {meta.label}
      </Typography>
    </Stack>
  );
}

function StatusBadge({ status }: { status: TicketStatus }) {
  const meta = STATUS_META[status];
  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      sx={{ flexShrink: 0 }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: meta.color,
        }}
      />
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", fontSize: "0.72rem" }}
      >
        {meta.label}
      </Typography>
    </Stack>
  );
}

function AcceptanceCriteriaList({ items }: { items: AcceptanceCriterion[] }) {
  return (
    <Stack spacing={0.6}>
      {items.map((ac, i) => {
        if (ac.kind === "gwt") {
          return (
            <Box
              key={i}
              sx={{
                fontSize: "0.82rem",
                lineHeight: 1.55,
                color: "text.primary",
                py: 0.25,
                pl: 1.25,
                borderLeft: 2,
                borderColor: "divider",
              }}
            >
              <Box>
                <Box component="span" sx={{ color: "text.secondary", mr: 0.5 }}>
                  Given
                </Box>
                {ac.given}
              </Box>
              <Box>
                <Box component="span" sx={{ color: "text.secondary", mr: 0.5 }}>
                  When
                </Box>
                {ac.when}
              </Box>
              <Box>
                <Box component="span" sx={{ color: "text.secondary", mr: 0.5 }}>
                  Then
                </Box>
                {ac.then}
              </Box>
            </Box>
          );
        }
        if (ac.kind === "implementation-note") {
          return (
            <Stack
              key={i}
              direction="row"
              spacing={0.75}
              alignItems="flex-start"
              sx={{
                fontSize: "0.82rem",
                color: "text.secondary",
                lineHeight: 1.5,
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  mt: 0.15,
                  px: 0.5,
                  borderRadius: 0.5,
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  color: "warning.main",
                  bgcolor: "rgba(217,119,6,0.08)",
                }}
              >
                impl
              </Box>
              <Box>{ac.text}</Box>
            </Stack>
          );
        }
        return (
          <Stack
            key={i}
            direction="row"
            spacing={0.75}
            alignItems="flex-start"
            sx={{ fontSize: "0.82rem", lineHeight: 1.55 }}
          >
            <Box sx={{ color: "text.secondary", mt: 0.15, flexShrink: 0 }}>
              <SquareDashed size={11} />
            </Box>
            <Box>{ac.text}</Box>
          </Stack>
        );
      })}
    </Stack>
  );
}

function ChildRow({
  child,
}: {
  child: { key?: string; type?: TicketKind; title: string };
}) {
  const meta = child.type ? TYPE_META[child.type] : undefined;
  return (
    <Stack
      direction="row"
      spacing={0.75}
      alignItems="center"
      sx={{
        py: 0.4,
        fontSize: "0.82rem",
      }}
    >
      {meta && (
        <Box sx={{ color: meta.color, display: "flex", flexShrink: 0 }}>
          {meta.icon}
        </Box>
      )}
      {child.key && (
        <Typography
          variant="caption"
          fontFamily="var(--font-geist-mono), monospace"
          sx={{ color: "text.secondary", fontSize: "0.72rem", flexShrink: 0 }}
        >
          {child.key}
        </Typography>
      )}
      <Box sx={{ minWidth: 0, flex: 1, lineHeight: 1.5 }}>{child.title}</Box>
    </Stack>
  );
}

export interface TicketCardProps {
  data: TicketCardData;
}

/**
 * Renders an agile work item (Epic, Story, Task, Subtask, Bug, Spike) as a
 * structured card. The chrome is intentionally minimal so that the *content*
 * is what reads as good or bad: a Connextra clause that is missing is
 * visually missing, an acceptance criterion in implementation language is
 * tagged "impl" rather than blending in.
 */
export function TicketCard({ data }: TicketCardProps) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          px: 1.75,
          py: 1.25,
          borderBottom: 1,
          borderColor: "divider",
          flexWrap: "wrap",
          rowGap: 0.5,
        }}
      >
        <TypeBadge kind={data.type} />
        {data.key && (
          <Typography
            variant="caption"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{
              color: "text.secondary",
              fontSize: "0.72rem",
              flexShrink: 0,
            }}
          >
            {data.key}
          </Typography>
        )}
        <Box sx={{ flex: 1 }} />
        {data.points !== undefined && (
          <Typography
            variant="caption"
            sx={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.72rem",
              color: "text.secondary",
              flexShrink: 0,
            }}
          >
            {String(data.points)} pts
          </Typography>
        )}
        {data.status && <StatusBadge status={data.status} />}
      </Stack>

      <Stack spacing={1.75} sx={{ p: 1.75, flex: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: "0.95rem",
            fontWeight: 600,
            lineHeight: 1.4,
            color: "text.primary",
          }}
        >
          {data.title}
        </Typography>

        {data.labels && data.labels.length > 0 && (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" rowGap={0.5}>
            {data.labels.map((l) => (
              <Box
                key={l}
                sx={{
                  px: 0.75,
                  py: 0.1,
                  borderRadius: 0.5,
                  border: 1,
                  borderColor: "divider",
                  fontSize: "0.65rem",
                  color: "text.secondary",
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
              >
                {l}
              </Box>
            ))}
          </Stack>
        )}

        {(data.asA ?? data.iWant ?? data.soThat) && (
          <Box>
            <SectionLabel>User story</SectionLabel>
            <Box
              sx={{
                fontSize: "0.85rem",
                lineHeight: 1.6,
                color: "text.primary",
                pl: 1.25,
                borderLeft: 2,
                borderColor: "divider",
              }}
            >
              {data.asA && (
                <Box>
                  <Box
                    component="span"
                    sx={{ color: "text.secondary", mr: 0.5 }}
                  >
                    As a
                  </Box>
                  {data.asA}
                </Box>
              )}
              {data.iWant && (
                <Box>
                  <Box
                    component="span"
                    sx={{ color: "text.secondary", mr: 0.5 }}
                  >
                    I want
                  </Box>
                  {data.iWant}
                </Box>
              )}
              {data.soThat && (
                <Box>
                  <Box
                    component="span"
                    sx={{ color: "text.secondary", mr: 0.5 }}
                  >
                    so that
                  </Box>
                  {data.soThat}
                </Box>
              )}
            </Box>
          </Box>
        )}

        {data.description && (
          <Box>
            <SectionLabel>Description</SectionLabel>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.55,
                fontSize: "0.85rem",
                color: "text.primary",
              }}
            >
              {data.description}
            </Typography>
          </Box>
        )}

        {data.context && (
          <Box>
            <SectionLabel>Context</SectionLabel>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.55,
                fontSize: "0.85rem",
              }}
            >
              {data.context}
            </Typography>
          </Box>
        )}

        {data.acceptanceCriteria && data.acceptanceCriteria.length > 0 && (
          <Box>
            <SectionLabel>Acceptance criteria</SectionLabel>
            <AcceptanceCriteriaList items={data.acceptanceCriteria} />
          </Box>
        )}

        {data.subtasks && data.subtasks.length > 0 && (
          <Box>
            <SectionLabel>Subtasks</SectionLabel>
            <Stack spacing={0.5}>
              {data.subtasks.map((s, i) => (
                <Stack
                  key={i}
                  direction="row"
                  spacing={0.75}
                  alignItems="flex-start"
                  sx={{ fontSize: "0.82rem", lineHeight: 1.55 }}
                >
                  <Box sx={{ color: "text.secondary", mt: 0.2, flexShrink: 0 }}>
                    <Square size={11} />
                  </Box>
                  <Box>{s}</Box>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {data.children && data.children.length > 0 && (
          <Box>
            <SectionLabel>Child issues</SectionLabel>
            <Stack
              spacing={0}
              sx={{
                pl: 1,
                borderLeft: 1,
                borderColor: "divider",
              }}
            >
              {data.children.map((c, i) => (
                <ChildRow key={i} child={c} />
              ))}
            </Stack>
          </Box>
        )}

        {data.outOfScope && (
          <Stack direction="row" spacing={0.75} alignItems="flex-start">
            <Box
              sx={{
                color: "text.disabled",
                mt: 0.2,
                flexShrink: 0,
              }}
            >
              <CircleDashed size={11} />
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.78rem",
                  lineHeight: 1.5,
                }}
              >
                <Box component="span" sx={{ color: "text.disabled", mr: 0.5 }}>
                  Out of scope:
                </Box>
                {data.outOfScope}
              </Typography>
            </Box>
          </Stack>
        )}

        {data.footer && (
          <Box
            sx={{
              mt: "auto",
              pt: 1,
              borderTop: 1,
              borderColor: "divider",
              fontSize: "0.72rem",
              color: "text.secondary",
              fontFamily: "var(--font-geist-mono), monospace",
            }}
          >
            {data.footer}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
