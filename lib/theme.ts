'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFD600', // Yellow
    },
    secondary: {
      main: '#FF3D00', // Orange-Red
    },
    info: {
      main: '#00B8D4', // Cyan Blue
    },
    background: {
      default: '#FFFFFF',
    },
    text: {
      primary: '#000000',
    },
  },
  typography: {
    fontFamily: 'inherit',
    h1: { fontWeight: 900, textTransform: 'uppercase' },
    h2: { fontWeight: 900, textTransform: 'uppercase' },
    h3: { fontWeight: 900, textTransform: 'uppercase' },
    button: { fontWeight: 800, textTransform: 'uppercase' },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          border: '2px solid #000000',
          boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
          '&:hover': {
            boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
            transform: 'translate(-1px, -1px)',
          },
          '&:active': {
            boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 1)',
            transform: 'translate(1px, 1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '2px solid #000000',
          boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
          borderRadius: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '2px solid #000000',
          boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
          borderRadius: 0,
        },
      },
    },
  },
});

export default theme;
