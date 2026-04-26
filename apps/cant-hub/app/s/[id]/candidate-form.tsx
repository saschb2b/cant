"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { startSessionAction } from "./actions";

interface CandidateFormProps {
  assessmentId: string;
  timeEstimate: string;
}

export function CandidateForm({
  assessmentId,
  timeEstimate,
}: CandidateFormProps) {
  const handleSubmit = (formData: FormData) => {
    void startSessionAction(assessmentId, formData);
  };

  return (
    <Box
      component="form"
      action={handleSubmit}
      sx={{ width: "100%", maxWidth: 360 }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This assessment takes approximately {timeEstimate}. Enter your details
        to begin.
      </Typography>
      <TextField
        name="name"
        label="Full name"
        required
        fullWidth
        autoComplete="name"
        sx={{ mb: 2 }}
      />
      <TextField
        name="email"
        label="Email"
        type="email"
        required
        fullWidth
        autoComplete="email"
        sx={{ mb: 3 }}
      />
      <Button type="submit" variant="contained" size="large" fullWidth>
        Start assessment
      </Button>
    </Box>
  );
}
