import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

/* ---------- Full-screen modal vs inline confirmation ---------- */

export function ModalFullScreenConfirm() {
  return (
    <Paper
      sx={{ p: 0, overflow: "hidden", position: "relative", minHeight: 170 }}
    >
      {/* Dimmed background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.5)",
          zIndex: 1,
        }}
      />
      {/* Background content (dimmed) */}
      <Box sx={{ p: 1.5 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
          Team Members
        </Typography>
        <Stack spacing={0.5}>
          {["Alex Kim", "Jordan Lee"].map((name) => (
            <Box
              key={name}
              sx={{
                height: 24,
                bgcolor: "action.hover",
                borderRadius: 1,
              }}
            />
          ))}
        </Stack>
      </Box>
      {/* Modal overlay */}
      <Paper
        elevation={8}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "85%",
          p: 2,
          zIndex: 2,
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>
          Remove member?
        </Typography>
        <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 1.5 }}>
          Are you sure you want to remove Alex Kim from the team?
        </Typography>
        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              cursor: "pointer",
            }}
          >
            <Typography sx={{ fontSize: 11, fontWeight: 500 }}>
              Cancel
            </Typography>
          </Box>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              bgcolor: "error.main",
              borderRadius: 1,
              cursor: "pointer",
            }}
          >
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>
              Remove
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Paper>
  );
}

export function ModalInlineConfirm() {
  return (
    <Paper sx={{ p: 1.5 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Team Members
      </Typography>
      <Stack spacing={0.75}>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            px: 1,
            py: 0.75,
            border: "1px solid",
            borderColor: "error.main",
            borderRadius: 1,
            bgcolor: "background.paper",
          }}
        >
          <Stack>
            <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
              Alex Kim
            </Typography>
            <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
              Remove from team?
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.75}>
            <Typography
              sx={{
                fontSize: 10,
                color: "text.secondary",
                cursor: "pointer",
                py: 0.5,
                px: 0.75,
              }}
            >
              Cancel
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.5,
                bgcolor: "error.main",
                borderRadius: 0.5,
                cursor: "pointer",
              }}
            >
              <Typography sx={{ fontSize: 10, fontWeight: 600, color: "#fff" }}>
                Remove
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            px: 1,
            py: 0.75,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Typography sx={{ fontSize: 12 }}>Jordan Lee</Typography>
          <Typography
            sx={{ fontSize: 10, color: "text.secondary", cursor: "pointer" }}
          >
            Remove
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

/* ---------- No dismiss options vs multiple dismiss methods ---------- */

export function ModalNoDismiss() {
  return (
    <Paper
      sx={{ p: 0, overflow: "hidden", position: "relative", minHeight: 160 }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.5)",
          zIndex: 1,
        }}
      />
      <Paper
        elevation={8}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          p: 2,
          zIndex: 2,
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>
          Subscribe to updates
        </Typography>
        <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 1.5 }}>
          Enter your email to receive product news and feature announcements.
        </Typography>
        <Box
          sx={{
            height: 26,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            mb: 1,
          }}
        />
        <Box
          sx={{
            px: 2,
            py: 0.5,
            bgcolor: "primary.main",
            borderRadius: 1,
            display: "inline-flex",
            cursor: "pointer",
          }}
        >
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>
            Subscribe
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 9, color: "text.disabled", mt: 1 }}>
          No close button, no backdrop click, no escape key.
        </Typography>
      </Paper>
    </Paper>
  );
}

export function ModalMultipleDismiss() {
  return (
    <Paper
      sx={{ p: 0, overflow: "hidden", position: "relative", minHeight: 160 }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.3)",
          zIndex: 1,
        }}
      >
        <Typography
          sx={{
            position: "absolute",
            bottom: 6,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 9,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Click backdrop to close
        </Typography>
      </Box>
      <Paper
        elevation={8}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          p: 2,
          zIndex: 2,
        }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 0.5,
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
            Subscribe to updates
          </Typography>
          <Typography
            sx={{
              fontSize: 16,
              color: "text.secondary",
              cursor: "pointer",
              lineHeight: 1,
              mt: -0.25,
            }}
          >
            {"\u00D7"}
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 1.5 }}>
          Enter your email to receive product news and feature announcements.
        </Typography>
        <Box
          sx={{
            height: 26,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            mb: 1,
          }}
        />
        <Stack direction="row" spacing={1}>
          <Box
            sx={{
              px: 2,
              py: 0.5,
              bgcolor: "primary.main",
              borderRadius: 1,
              display: "inline-flex",
              cursor: "pointer",
            }}
          >
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>
              Subscribe
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: 11,
              color: "text.secondary",
              cursor: "pointer",
              py: 0.5,
            }}
          >
            No thanks
          </Typography>
        </Stack>
      </Paper>
    </Paper>
  );
}

/* ---------- Modal with long form vs multi-step page flow ---------- */

export function ModalOverloadedForm() {
  return (
    <Paper
      sx={{ p: 0, overflow: "hidden", position: "relative", minHeight: 180 }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.5)",
          zIndex: 1,
        }}
      />
      <Paper
        elevation={8}
        sx={{
          position: "absolute",
          top: 8,
          left: "5%",
          width: "90%",
          bottom: 8,
          p: 1.5,
          zIndex: 2,
          overflow: "hidden",
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 1 }}>
          Create Project
        </Typography>
        <Stack spacing={0.75}>
          {[
            "Project name",
            "Description",
            "Team",
            "Start date",
            "End date",
            "Budget",
            "Priority",
            "Tags",
          ].map((label) => (
            <Box key={label}>
              <Typography
                sx={{ fontSize: 9, color: "text.secondary", mb: 0.25 }}
              >
                {label}
              </Typography>
              <Box
                sx={{
                  height: 20,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 0.5,
                }}
              />
            </Box>
          ))}
        </Stack>
      </Paper>
    </Paper>
  );
}

export function ModalMultiStepFlow() {
  return (
    <Paper sx={{ p: 1.5 }}>
      {/* Step indicator */}
      <Stack
        direction="row"
        spacing={0.75}
        sx={{ mb: 1.5, alignItems: "center" }}
      >
        {["Details", "Team", "Schedule"].map((step, i) => (
          <Stack
            key={step}
            direction="row"
            spacing={0.75}
            sx={{ alignItems: "center" }}
          >
            {i > 0 && (
              <Box
                sx={{
                  width: 16,
                  height: 1,
                  bgcolor: i <= 1 ? "primary.main" : "divider",
                }}
              />
            )}
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  bgcolor:
                    i === 1
                      ? "primary.main"
                      : i < 1
                        ? "success.main"
                        : "action.hover",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 9,
                    fontWeight: 600,
                    color: i <= 1 ? "#fff" : "text.secondary",
                  }}
                >
                  {i < 1 ? "\u2713" : i + 1}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: i === 1 ? 600 : 400,
                  color: i === 1 ? "text.primary" : "text.secondary",
                }}
              >
                {step}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Add team members
      </Typography>
      <Stack spacing={0.75}>
        {["Search people...", "Set role"].map((label) => (
          <Box key={label}>
            <Box
              sx={{
                height: 26,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                px: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 10, color: "text.disabled" }}>
                {label}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        sx={{ mt: 1.5, justifyContent: "flex-end" }}
      >
        <Typography
          sx={{
            fontSize: 11,
            color: "text.secondary",
            cursor: "pointer",
            py: 0.5,
          }}
        >
          Back
        </Typography>
        <Box
          sx={{
            px: 2,
            py: 0.5,
            bgcolor: "primary.main",
            borderRadius: 1,
            cursor: "pointer",
          }}
        >
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>
            Next
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

/* ---------- All popups on first visit vs clean first impression ---------- */

export function ModalPopupOverload() {
  return (
    <Paper
      sx={{ p: 0, overflow: "hidden", position: "relative", minHeight: 180 }}
    >
      {/* Page content */}
      <Box sx={{ p: 1.5, pb: 4 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 0.5 }}>
          Welcome to Acme
        </Typography>
        <Box
          sx={{
            height: 8,
            width: "90%",
            bgcolor: "action.hover",
            borderRadius: 1,
            mb: 0.5,
          }}
        />
        <Box
          sx={{
            height: 8,
            width: "70%",
            bgcolor: "action.hover",
            borderRadius: 1,
          }}
        />
      </Box>
      {/* Cookie banner */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          px: 1.5,
          py: 0.75,
          zIndex: 3,
        }}
      >
        <Typography sx={{ fontSize: 9, color: "text.secondary" }}>
          We use cookies. Accept all?
        </Typography>
      </Box>
      {/* Newsletter popup */}
      <Paper
        elevation={6}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 120,
          p: 1,
          zIndex: 4,
        }}
      >
        <Typography sx={{ fontSize: 9, fontWeight: 600 }}>
          Get 10% off!
        </Typography>
        <Typography sx={{ fontSize: 8, color: "text.secondary" }}>
          Subscribe now
        </Typography>
      </Paper>
      {/* Chat widget */}
      <Box
        sx={{
          position: "absolute",
          bottom: 32,
          right: 8,
          width: 100,
          bgcolor: "primary.main",
          borderRadius: 1,
          p: 0.75,
          zIndex: 4,
        }}
      >
        <Typography sx={{ fontSize: 8, color: "#fff", fontWeight: 500 }}>
          Need help? Chat with us!
        </Typography>
      </Box>
    </Paper>
  );
}

export function ModalCleanFirstVisit() {
  return (
    <Paper
      sx={{ p: 0, overflow: "hidden", position: "relative", minHeight: 180 }}
    >
      {/* Page content, fully visible */}
      <Box sx={{ p: 1.5, pb: 4 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 0.5 }}>
          Welcome to Acme
        </Typography>
        <Typography
          sx={{ fontSize: 11, color: "text.secondary", lineHeight: 1.6, mb: 1 }}
        >
          The platform that helps teams ship faster. Start exploring or create
          your first project.
        </Typography>
        <Box
          sx={{
            height: 8,
            width: "90%",
            bgcolor: "action.hover",
            borderRadius: 1,
            mb: 0.5,
          }}
        />
        <Box
          sx={{
            height: 8,
            width: "70%",
            bgcolor: "action.hover",
            borderRadius: 1,
          }}
        />
      </Box>
      {/* Only a small, unobtrusive cookie banner */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          px: 1.5,
          py: 0.75,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 3,
        }}
      >
        <Typography sx={{ fontSize: 9, color: "text.secondary" }}>
          We use cookies for analytics.
        </Typography>
        <Box
          sx={{
            px: 1,
            py: 0.25,
            bgcolor: "primary.main",
            borderRadius: 0.5,
            cursor: "pointer",
          }}
        >
          <Typography sx={{ fontSize: 8, fontWeight: 600, color: "#fff" }}>
            OK
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
