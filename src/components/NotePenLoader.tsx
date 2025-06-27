"use client";

import { Box, keyframes, styled } from "@mui/material";

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
`;

const write = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-2px) rotate(2deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(2px) rotate(-2deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
`;

const Note = styled("div")(({ theme }) => ({
  width: "80px",
  height: "60px",
  backgroundColor: theme.palette.primary.main,
  position: "relative",
  borderRadius: "2px",
  transform: "rotate(-5deg)",
  animation: `${bounce} 2s ease-in-out infinite`,
  "&::before": {
    content: '""',
    position: "absolute",
    top: "5px",
    left: "5px",
    right: "5px",
    bottom: "5px",
    border: `2px dashed ${theme.palette.background.paper}`,
    borderRadius: "1px",
    opacity: 0.7,
  },
}));

const Pen = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "8px",
  height: "60px",
  backgroundColor: theme.palette.secondary.main,
  transform: "translate(-50%, -50%) rotate(45deg)",
  borderRadius: "4px",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-8px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "12px",
    height: "12px",
    backgroundColor: theme.palette.secondary.dark,
    borderRadius: "50%",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-4px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "4px",
    height: "12px",
    backgroundColor: theme.palette.secondary.light,
    borderRadius: "2px",
  },
  animation: `${write} 1.5s ease-in-out infinite`,
}));

const Container = styled(Box)({
  position: "relative",
});

export default function NotePenLoader() {
  return (
    <Container>
      <Note />
      <Pen />
    </Container>
  );
}
