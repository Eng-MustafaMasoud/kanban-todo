'use client';

import { Box, keyframes, styled } from '@mui/material';

const movePen = keyframes`
  0% {
    transform: translateX(0) rotate(0deg);
  }
  20% {
    transform: translateX(0) rotate(5deg);
  }
  40%, 60% {
    transform: translateX(20px) rotate(-2deg);
  }
  80% {
    transform: translateX(40px) rotate(5deg);
  }
  100% {
    transform: translateX(40px) rotate(0deg);
  }
`;

const drawDot1 = keyframes`
  0%, 25% {
    opacity: 0;
    transform: scale(0);
  }
  30%, 100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const drawDot2 = keyframes`
  0%, 45% {
    opacity: 0;
    transform: scale(0);
  }
  50%, 100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const drawDot3 = keyframes`
  0%, 65% {
    opacity: 0;
    transform: scale(0);
  }
  70%, 100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const Container = styled(Box)({
  position: 'relative',
  width: '120px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Pen = styled('svg')({
  position: 'absolute',
  left: '10px',
  width: '40px',
  height: '40px',
  transformOrigin: 'center right',
  animation: `${movePen} 2s ease-in-out infinite`,
});

const DotsContainer = styled(Box)({
  display: 'flex',
  gap: '10px',
  position: 'absolute',
  right: '10px',
});

const Dot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'delay',
})<{ delay: number }>(({ theme, delay }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  opacity: 0,
  animation: `${delay === 0 ? drawDot1 : delay === 1 ? drawDot2 : drawDot3} 2s ease-in-out infinite`,
  animationDelay: `${delay * 0.3}s`,
}));

export default function PenWritingDots() {
  return (
    <Container>
      <Pen viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87L20.71 7.04ZM3 17.25V21H6.75L17.81 9.93L14.06 6.18L3 17.25Z"
          fill="currentColor"
        />
      </Pen>
      <DotsContainer>
        {[0, 1, 2].map((dot) => (
          <Dot key={dot} delay={dot} />
        ))}
      </DotsContainer>
    </Container>
  );
}
