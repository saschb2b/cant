"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export interface JoinFormProps {
  sessionId: string;
  onJoined: (name: string, options: { spectator: boolean }) => void;
}

export function JoinForm({ sessionId, onJoined }: JoinFormProps) {
  const [name, setName] = useState("");
  const [spectator, setSpectator] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      onJoined(trimmed, { spectator });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join");
      setSubmitting(false);
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
      <Stack spacing={2} component="form" onSubmit={handleSubmit}>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Join session
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Session code: <strong>{sessionId}</strong>
          </Typography>
        </Box>
        <TextField
          autoFocus
          label="Your name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          slotProps={{ htmlInput: { maxLength: 40 } }}
          error={!!error}
          helperText={error ?? " "}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={spectator}
              onChange={(e) => {
                setSpectator(e.target.checked);
              }}
            />
          }
          label={
            <Box>
              <Typography variant="body2">Join as spectator</Typography>
              <Typography variant="caption" color="text.secondary">
                Watch the session without voting. Useful for observers and
                facilitators.
              </Typography>
            </Box>
          }
          sx={{ alignItems: "flex-start", m: 0 }}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting}
        >
          {submitting ? "Joining..." : spectator ? "Join as spectator" : "Join"}
        </Button>
      </Stack>
    </Paper>
  );
}
