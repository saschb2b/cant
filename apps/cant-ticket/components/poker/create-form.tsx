"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export function CreateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState<"create" | "join" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.SyntheticEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter your name");
      return;
    }
    setError(null);
    setSubmitting("create");
    try {
      const res = await fetch("/api/poker/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });
      if (!res.ok) throw new Error("Could not create session");
      const data = (await res.json()) as {
        sessionId: string;
        participantId: string;
      };
      sessionStorage.setItem(
        `cant-ticket:poker:${data.sessionId}:participantId`,
        data.participantId,
      );
      sessionStorage.setItem(
        `cant-ticket:poker:${data.sessionId}:name`,
        trimmedName,
      );
      router.push(`/rooms/poker/${data.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create session");
      setSubmitting(null);
    }
  }

  function handleJoin(e: React.SyntheticEvent) {
    e.preventDefault();
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) {
      setError("Please enter a session code");
      return;
    }
    setError(null);
    setSubmitting("join");
    router.push(`/rooms/poker/${trimmedCode}`);
  }

  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
      <Stack spacing={3}>
        <Box
          component="form"
          onSubmit={(e: React.SyntheticEvent) => {
            void handleCreate(e);
          }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Start a session
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pick a name. You will get a shareable link.
              </Typography>
            </Box>
            <TextField
              label="Your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              slotProps={{ htmlInput: { maxLength: 40 } }}
              fullWidth
              autoFocus
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting !== null}
            >
              {submitting === "create" ? "Creating..." : "Create session"}
            </Button>
          </Stack>
        </Box>

        <Divider>or</Divider>

        <Box component="form" onSubmit={handleJoin}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Join with a code
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Got a session code from a colleague? Drop it in.
              </Typography>
            </Box>
            <TextField
              label="Session code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
              }}
              slotProps={{
                htmlInput: {
                  maxLength: 8,
                  style: { letterSpacing: "0.2em" },
                },
              }}
              fullWidth
            />
            <Button
              type="submit"
              variant="outlined"
              size="large"
              disabled={submitting !== null}
            >
              {submitting === "join" ? "Joining..." : "Go to session"}
            </Button>
          </Stack>
        </Box>

        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
