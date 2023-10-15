import App from './components/App'
import { render } from "react-dom";
import React from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});
const appDiv = document.getElementById("app");
render(
    <ThemeProvider theme={darkTheme}>
        <App />
    </ThemeProvider>
    , appDiv);