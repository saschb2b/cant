"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { ReviewStatus } from "@/lib/candidate-sessions";
import { updateReviewStatusAction, exportCsvAction } from "./actions";

interface CandidateRow {
  id: string;
  assessmentId: string;
  candidateName: string;
  candidateEmail: string;
  status: string;
  score: number | null;
  totalQuestions: number | null;
  startedAt: string;
  finishedAt: string | null;
  reviewStatus: ReviewStatus;
}

type SortField = "score" | "name" | "date";
type SortDir = "asc" | "desc";

const REVIEW_OPTIONS: ReviewStatus[] = ["pending", "proceed", "rejected"];

const REVIEW_CHIP_COLOR: Record<ReviewStatus, "default" | "success" | "error"> =
  {
    pending: "default",
    proceed: "success",
    rejected: "error",
  };

const FILTER_OPTIONS: { label: string; value: ReviewStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Proceed", value: "proceed" },
  { label: "Rejected", value: "rejected" },
];

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60)
    return `${String(diffMin)} minute${diffMin !== 1 ? "s" : ""} ago`;
  if (diffHr < 24)
    return `${String(diffHr)} hour${diffHr !== 1 ? "s" : ""} ago`;
  if (diffDay < 30)
    return `${String(diffDay)} day${diffDay !== 1 ? "s" : ""} ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeTaken(startedAt: string, finishedAt: string | null): string {
  if (!finishedAt) return "In progress";
  const ms = new Date(finishedAt).getTime() - new Date(startedAt).getTime();
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min === 0) return `${String(sec)}s`;
  return `${String(min)}m ${String(sec)}s`;
}

function scoreColor(
  score: number,
  total: number,
): "success" | "warning" | "error" {
  if (total === 0) return "warning";
  const pct = (score / total) * 100;
  if (pct >= 70) return "success";
  if (pct >= 40) return "warning";
  return "error";
}

export function CandidateTable({
  sessions,
  assessmentId,
}: {
  sessions: CandidateRow[];
  assessmentId: string;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ReviewStatus | "all">("all");
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    let rows = sessions;

    if (filter !== "all") {
      rows = rows.filter((r) => r.reviewStatus === filter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.candidateName.toLowerCase().includes(q) ||
          r.candidateEmail.toLowerCase().includes(q),
      );
    }

    const sorted = [...rows].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "score") {
        const aScore = a.score ?? -1;
        const bScore = b.score ?? -1;
        return (aScore - bScore) * dir;
      }
      if (sortField === "name") {
        return a.candidateName.localeCompare(b.candidateName) * dir;
      }
      // date
      return (
        (new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()) *
        dir
      );
    });

    return sorted;
  }, [sessions, search, filter, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const handleReviewChange = (sessionId: string, value: ReviewStatus) => {
    startTransition(async () => {
      await updateReviewStatusAction(sessionId, value);
    });
  };

  const handleExportCsv = () => {
    startTransition(async () => {
      const csv = await exportCsvAction(assessmentId);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `candidates-${assessmentId}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  if (sessions.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No candidates yet
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Share the assessment link with candidates to start collecting results.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ sm: "center" }}
        justifyContent="space-between"
      >
        <TextField
          size="small"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 240 }}
        />
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          {FILTER_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              size="small"
              variant={filter === opt.value ? "filled" : "outlined"}
              color={filter === opt.value ? "primary" : "default"}
              onClick={() => setFilter(opt.value)}
              sx={{ cursor: "pointer" }}
            />
          ))}
          <Button
            size="small"
            variant="outlined"
            disabled={isPending}
            onClick={handleExportCsv}
            sx={{ ml: 1 }}
          >
            Export CSV
          </Button>
        </Stack>
      </Stack>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === "name"}
                  direction={sortField === "name" ? sortDir : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "score"}
                  direction={sortField === "score" ? sortDir : "desc"}
                  onClick={() => handleSort("score")}
                >
                  Score
                </TableSortLabel>
              </TableCell>
              <TableCell>Time taken</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "date"}
                  direction={sortField === "date" ? sortDir : "desc"}
                  onClick={() => handleSort("date")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Review</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => {
              const score = row.score ?? 0;
              const total = row.totalQuestions ?? 0;
              const pct = total > 0 ? Math.round((score / total) * 100) : 0;

              return (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Link
                      href={`/dashboard/assessments/${assessmentId}/results/${row.id}`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {row.candidateName}
                      </Typography>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {row.candidateEmail}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${String(score)}/${String(total)} (${String(pct)}%)`}
                      size="small"
                      color={scoreColor(score, total)}
                      sx={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      {formatTimeTaken(row.startedAt, row.finishedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatRelativeTime(row.startedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={row.reviewStatus}
                      disabled={isPending}
                      onChange={(e) =>
                        handleReviewChange(
                          row.id,
                          e.target.value as ReviewStatus,
                        )
                      }
                      sx={{
                        minWidth: 110,
                        "& .MuiSelect-select": { py: 0.5 },
                      }}
                      renderValue={(val) => (
                        <Chip
                          label={val}
                          size="small"
                          color={REVIEW_CHIP_COLOR[val]}
                          sx={{ textTransform: "capitalize" }}
                        />
                      )}
                    >
                      {REVIEW_OPTIONS.map((opt) => (
                        <MenuItem
                          key={opt}
                          value={opt}
                          sx={{ textTransform: "capitalize" }}
                        >
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No candidates match your filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ textAlign: "right" }}
      >
        {filtered.length} of {sessions.length} candidate
        {sessions.length !== 1 ? "s" : ""}
      </Typography>
    </Stack>
  );
}
