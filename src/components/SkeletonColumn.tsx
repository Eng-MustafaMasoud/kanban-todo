import { Skeleton, Box } from '@mui/material';

const SkeletonColumn = () => {
  return (
    <Box
      sx={{
        width: 300,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Skeleton 
        variant="rectangular" 
        width={200} 
        height={40} 
        sx={{ 
          borderRadius: 1,
          bgcolor: 'grey.200',
          alignSelf: 'flex-start',
          mb: 2
        }} 
      />
      {[1, 2, 3].map((i) => (
        <Skeleton 
          key={i} 
          variant="rectangular" 
          width="100%" 
          height={120} 
          sx={{ 
            borderRadius: 2,
            bgcolor: 'grey.100'
          }} 
        />
      ))}
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={56} 
        sx={{ 
          borderRadius: 1,
          bgcolor: 'grey.100',
          mt: 'auto'
        }} 
      />
    </Box>
  );
};

export default SkeletonColumn;
