"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { Copy, CopyPlus, Trash2 } from "lucide-react";
import type { AssessmentStatus } from "@/lib/assessments";
import {
  updateAssessmentStatusAction,
  deleteAssessmentAction,
  duplicateAssessmentAction,
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

  const handleStatus = (newStatus: AssessmentStatus) => {
    setAnchorEl(null);
    void updateAssessmentStatusAction(assessmentId, newStatus).then(() =>
      router.refresh(),
    );
  };

  const handleDuplicate = () => {
    setAnchorEl(null);
    void duplicateAssessmentAction(assessmentId);
  };

  const handleCopyLink = () => {
    setAnchorEl(null);
    const url = `${window.location.origin}/s/${assessmentId}`;
    void navigator.clipboard.writeText(url);
  };

  const handleDelete = () => {
    setAnchorEl(null);
    void deleteAssessmentAction(assessmentId);
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
        slotProps={{ paper: { sx: { minWidth: 180, mt: 1 } } }}
      >
        {status === "draft" && (
          <MenuItem
            onClick={() => {
              handleStatus("active");
            }}
          >
            <ListItemText>Activate</ListItemText>
          </MenuItem>
        )}
        {status === "active" && (
          <MenuItem
            onClick={() => {
              handleStatus("archived");
            }}
          >
            <ListItemText>Archive</ListItemText>
          </MenuItem>
        )}
        {status === "archived" && (
          <MenuItem
            onClick={() => {
              handleStatus("draft");
            }}
          >
            <ListItemText>Revert to draft</ListItemText>
          </MenuItem>
        )}
        {status === "active" && (
          <MenuItem onClick={handleCopyLink}>
            <ListItemIcon>
              <Copy size={16} />
            </ListItemIcon>
            <ListItemText>Copy share link</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleDuplicate}>
          <ListItemIcon>
            <CopyPlus size={16} />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <Trash2 size={16} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
