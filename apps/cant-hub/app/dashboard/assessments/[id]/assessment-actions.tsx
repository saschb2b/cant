"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import type { AssessmentStatus } from "@/lib/assessments";
import {
  updateAssessmentStatusAction,
  deleteAssessmentAction,
} from "./actions";

export function AssessmentActions({
  assessmentId,
  status,
}: {
  assessmentId: string;
  status: AssessmentStatus;
}) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleStatus = async (newStatus: AssessmentStatus) => {
    setAnchorEl(null);
    await updateAssessmentStatusAction(assessmentId, newStatus);
    router.refresh();
  };

  const handleDelete = async () => {
    setAnchorEl(null);
    await deleteAssessmentAction(assessmentId);
  };

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        color="inherit"
        sx={{ color: "text.secondary", flexShrink: 0 }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        Actions
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{ paper: { sx: { minWidth: 160, mt: 1 } } }}
      >
        {status === "draft" && (
          <MenuItem onClick={() => handleStatus("active")}>
            <ListItemText>Activate</ListItemText>
          </MenuItem>
        )}
        {status === "active" && (
          <MenuItem onClick={() => handleStatus("archived")}>
            <ListItemText>Archive</ListItemText>
          </MenuItem>
        )}
        {status === "archived" && (
          <MenuItem onClick={() => handleStatus("draft")}>
            <ListItemText>Revert to draft</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
