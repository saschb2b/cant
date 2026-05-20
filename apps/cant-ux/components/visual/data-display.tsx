import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

/* ---------- Left-aligned numbers vs right-aligned with striping ---------- */

const tableRows = [
  { name: "Pro plan", users: "1,204", revenue: "$48,160" },
  { name: "Team plan", users: "387", revenue: "$11,610" },
  { name: "Enterprise", users: "42", revenue: "$25,200" },
  { name: "Free tier", users: "8,931", revenue: "$0" },
];

export function DataLeftAlignedNumbers() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      <Box sx={{ px: 1.5, py: 1 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
          Plan Revenue
        </Typography>
      </Box>
      <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
        <Box component="thead">
          <Box component="tr">
            {["Plan", "Users", "Revenue"].map((h) => (
              <Box
                key={h}
                component="th"
                sx={{
                  px: 1.5,
                  py: 0.75,
                  fontSize: 10,
                  fontWeight: 600,
                  color: "text.secondary",
                  textAlign: "left",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                {h}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {tableRows.map((row) => (
            <Box component="tr" key={row.name}>
              <Box component="td" sx={{ px: 1.5, py: 0.75, fontSize: 11 }}>
                {row.name}
              </Box>
              <Box component="td" sx={{ px: 1.5, py: 0.75, fontSize: 11 }}>
                {row.users}
              </Box>
              <Box component="td" sx={{ px: 1.5, py: 0.75, fontSize: 11 }}>
                {row.revenue}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}

export function DataRightAlignedNumbers() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      <Box sx={{ px: 1.5, py: 1 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
          Plan Revenue
        </Typography>
      </Box>
      <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
        <Box component="thead">
          <Box component="tr">
            {["Plan", "Users", "Revenue"].map((h, i) => (
              <Box
                key={h}
                component="th"
                sx={{
                  px: 1.5,
                  py: 0.75,
                  fontSize: 10,
                  fontWeight: 600,
                  color: "text.secondary",
                  textAlign: i === 0 ? "left" : "right",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                {h}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {tableRows.map((row, idx) => (
            <Box
              component="tr"
              key={row.name}
              sx={{
                bgcolor: idx % 2 === 1 ? "action.hover" : "transparent",
              }}
            >
              <Box component="td" sx={{ px: 1.5, py: 0.75, fontSize: 11 }}>
                {row.name}
              </Box>
              <Box
                component="td"
                sx={{
                  px: 1.5,
                  py: 0.75,
                  fontSize: 11,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {row.users}
              </Box>
              <Box
                component="td"
                sx={{
                  px: 1.5,
                  py: 0.75,
                  fontSize: 11,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {row.revenue}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}

/* ---------- Text cut off vs ellipsis with tooltip ---------- */

const longTextRows = [
  {
    name: "Annual infrastructure scaling review and cost optimization",
    status: "Active",
  },
  {
    name: "Q3 marketing campaign performance analysis report",
    status: "Draft",
  },
  {
    name: "Customer onboarding flow redesign project",
    status: "Active",
  },
];

export function DataTextCutOff() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden", maxWidth: 280, mx: "auto" }}>
      <Box sx={{ px: 1.5, py: 1 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Projects</Typography>
      </Box>
      <Stack
        spacing={0}
        sx={{ borderTop: "1px solid", borderColor: "divider" }}
      >
        {longTextRows.map((row) => (
          <Stack
            key={row.name}
            direction="row"
            sx={{
              px: 1.5,
              py: 0.75,
              borderBottom: "1px solid",
              borderColor: "divider",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {row.name}
            </Typography>
            <Typography
              sx={{
                fontSize: 10,
                color: "text.secondary",
                ml: 1,
                flexShrink: 0,
              }}
            >
              {row.status}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

export function DataEllipsisWithTooltip() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden", maxWidth: 280, mx: "auto" }}>
      <Box sx={{ px: 1.5, py: 1 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Projects</Typography>
      </Box>
      <Stack
        spacing={0}
        sx={{ borderTop: "1px solid", borderColor: "divider" }}
      >
        {longTextRows.map((row) => (
          <Stack
            key={row.name}
            direction="row"
            sx={{
              px: 1.5,
              py: 0.75,
              borderBottom: "1px solid",
              borderColor: "divider",
              alignItems: "center",
            }}
          >
            <Tooltip title={row.name} placement="top" arrow>
              <Typography
                sx={{
                  fontSize: 11,
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row.name}
              </Typography>
            </Tooltip>
            <Typography
              sx={{
                fontSize: 10,
                color: "text.secondary",
                ml: 1,
                flexShrink: 0,
              }}
            >
              {row.status}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

/* ---------- Dense table vs prioritized columns ---------- */

export function DataDenseTable() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      <Box sx={{ px: 1.5, py: 1 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Orders</Typography>
      </Box>
      <Box
        sx={{
          overflowX: "auto",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Box
          component="table"
          sx={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}
        >
          <Box component="thead">
            <Box component="tr">
              {[
                "ID",
                "Customer",
                "Email",
                "Product",
                "Qty",
                "Price",
                "Status",
                "Date",
              ].map((h) => (
                <Box
                  key={h}
                  component="th"
                  sx={{
                    px: 0.75,
                    py: 0.5,
                    fontSize: 9,
                    fontWeight: 600,
                    color: "text.secondary",
                    textAlign: "left",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </Box>
              ))}
            </Box>
          </Box>
          <Box component="tbody">
            {[
              [
                "#401",
                "Alex",
                "alex@co",
                "Widget",
                "3",
                "$45",
                "Shipped",
                "Apr 1",
              ],
              [
                "#402",
                "Sam",
                "sam@co",
                "Gadget",
                "1",
                "$89",
                "Pending",
                "Apr 2",
              ],
            ].map((row) => (
              <Box component="tr" key={row[0]}>
                {row.map((cell, i) => (
                  <Box
                    key={i}
                    component="td"
                    sx={{
                      px: 0.75,
                      py: 0.5,
                      fontSize: 9,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cell}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export function DataPrioritizedTable() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      <Box sx={{ px: 1.5, py: 1 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Orders</Typography>
      </Box>
      <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
        <Box component="thead">
          <Box component="tr">
            {["Customer", "Product", "Total", "Status"].map((h, i) => (
              <Box
                key={h}
                component="th"
                sx={{
                  px: 1.5,
                  py: 0.75,
                  fontSize: 10,
                  fontWeight: 600,
                  color: "text.secondary",
                  textAlign: i >= 2 ? "right" : "left",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                {h}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {[
            {
              customer: "Alex",
              product: "Widget x3",
              total: "$45",
              status: "Shipped",
            },
            {
              customer: "Sam",
              product: "Gadget x1",
              total: "$89",
              status: "Pending",
            },
          ].map((row) => (
            <Box component="tr" key={row.customer}>
              <Box component="td" sx={{ px: 1.5, py: 0.75, fontSize: 11 }}>
                {row.customer}
              </Box>
              <Box
                component="td"
                sx={{
                  px: 1.5,
                  py: 0.75,
                  fontSize: 11,
                  color: "text.secondary",
                }}
              >
                {row.product}
              </Box>
              <Box
                component="td"
                sx={{
                  px: 1.5,
                  py: 0.75,
                  fontSize: 11,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {row.total}
              </Box>
              <Box
                component="td"
                sx={{ px: 1.5, py: 0.75, fontSize: 11, textAlign: "right" }}
              >
                <Box
                  component="span"
                  sx={{
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 0.5,
                    fontSize: 10,
                    fontWeight: 500,
                    bgcolor:
                      row.status === "Shipped"
                        ? "success.main"
                        : "warning.main",
                    color: "#fff",
                  }}
                >
                  {row.status}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: 10,
          color: "primary.main",
          fontWeight: 500,
          px: 1.5,
          py: 1,
          cursor: "pointer",
        }}
      >
        View full details &rarr;
      </Typography>
    </Paper>
  );
}

/* ---------- Bare empty table vs helpful empty state ---------- */

export function DataEmptyBare() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      <Box sx={{ px: 1.5, py: 1 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Invoices</Typography>
      </Box>
      <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
        <Box component="thead">
          <Box component="tr">
            {["Invoice", "Date", "Amount", "Status"].map((h) => (
              <Box
                key={h}
                component="th"
                sx={{
                  px: 1.5,
                  py: 0.75,
                  fontSize: 10,
                  fontWeight: 600,
                  color: "text.secondary",
                  textAlign: "left",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                {h}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          <Box component="tr">
            <Box
              component="td"
              colSpan={4}
              sx={{
                px: 1.5,
                py: 3,
                fontSize: 11,
                color: "text.disabled",
                textAlign: "center",
              }}
            >
              No data
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export function DataEmptyHelpful() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      <Box sx={{ px: 1.5, py: 1 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Invoices</Typography>
      </Box>
      <Box
        sx={{
          px: 2,
          py: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={1} sx={{ alignItems: "center", maxWidth: 220 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              bgcolor: "action.hover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ fontSize: 16, color: "text.disabled" }}>
              {"\u2709"}
            </Typography>
          </Box>
          <Typography
            sx={{ fontSize: 13, fontWeight: 600, textAlign: "center" }}
          >
            No invoices yet
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              color: "text.secondary",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Invoices will appear here once you have completed your first billing
            cycle.
          </Typography>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              bgcolor: "primary.main",
              borderRadius: 1,
              cursor: "pointer",
            }}
          >
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>
              View plans
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
