"use client";

import { Box, Typography } from "@mui/material";
import TaskDetailsBoard from "@/components/TaskDetailsBoard";

export default function TestSubTasksPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(120deg, #f8fafc 0%, #e9ecef 100%)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          boxShadow: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              sx={{
                color: "primary.main",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Test Subtasks Board
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mt: 1,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Testing the subtasks functionality
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              background: "primary.main",
              color: "white",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "primary.dark",
                transform: "translateY(-1px)",
              },
            }}
            onClick={() => (window.location.href = "/")}
          >
            Back to Dashboard
          </Typography>
        </Box>
      </Box>

      {/* Board area */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 4 },
          overflow: "auto",
        }}
      >
        <TaskDetailsBoard parentTaskId="3" />
      </Box>
    </Box>
  );
}
