"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { createAssessmentAction } from "./actions";

export default function NewAssessmentPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    void createAssessmentAction(formData).then((result) => {
      if (result.id) {
        router.push(`/dashboard/assessments/${result.id}`);
      } else {
        setPending(false);
      }
    });
  }

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <Box>
        <Typography
          variant="h4"
          fontWeight={800}
          lineHeight={1.15}
          letterSpacing="-0.02em"
        >
          New assessment
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Set up the basics, then pick topics from the series
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Stack spacing={3}>
          <TextField
            name="title"
            label="Assessment title"
            placeholder="e.g. Frontend Senior Screening"
            required
            fullWidth
            autoFocus
          />
          <TextField
            name="description"
            label="Description"
            placeholder="Optional description for your reference"
            fullWidth
            multiline
            rows={3}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              component={NextLink}
              href="/dashboard"
              color="inherit"
              sx={{ color: "text.secondary" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={pending}
              sx={{ px: 4, py: 1, fontSize: "0.9rem" }}
            >
              {pending ? "Creating..." : "Create assessment"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
