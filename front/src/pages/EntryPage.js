import './EntryPage.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Stack,
} from '@mui/material';
import StarryParticles from '../features/StarryParticles'

const EntryPage = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    const isValid = /^[a-zA-Z0-9]*$/.test(value);

    if (!isValid || value === 'local') {
      setError(true);
    } else {
      setError(false);
    }

    const filtered = value.replace(/[^a-zA-Z0-9]/g, '');
    setRoomId(filtered);
  };

  const handleEnter = () => {
    if (roomId.trim()) {
      navigate(`/map/${roomId}`);
    }
  };

  const handleLocalEnter = () => {
    navigate('/map/local');
  };

  return (<>
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ mt: 10, p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Starry Flow
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          참여할 방 ID를 입력하세요
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="Room ID"
          value={roomId}
          onChange={handleChange}
          error={error}
          helperText={error ? "영문자와 숫자만 입력 가능합니다." : " "}
          sx={{
            mb: 3,
            input: { color: 'black' }
          }}
        />
        <Stack spacing={2} direction="column">
          <Button
            variant="contained"
            color="primary"
            onClick={handleEnter}
            disabled={!roomId.trim()}
          >
            입장하기
          </Button>
          <Button
            sx={{
              backgroundColor: '#c6ff00',
              color: 'black',
              '&:hover': {
                backgroundImage: 'linear-gradient(270deg, #c6ff00, #00e5ff, #c6ff00)',
                backgroundSize: '600% 600%',
                animation: 'gradientMove 3s ease infinite',
              },
              '@keyframes gradientMove': {
                '0%': {
                  backgroundPosition: '0% 50%',
                },
                '50%': {
                  backgroundPosition: '100% 50%',
                },
                '100%': {
                  backgroundPosition: '0% 50%',
                },
              },
            }}
            onClick={handleLocalEnter}
            disabled={roomId.trim()}
          >
            로컬로 입장하기
          </Button>
        </Stack>
      </Paper>
    </Container>
    <StarryParticles />
  </>);
};

export default EntryPage;