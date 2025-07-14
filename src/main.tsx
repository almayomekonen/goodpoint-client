import './lib/yup/yupConfig';

import { CSSPrioritize } from '@hilma/forms';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import 'filter-and-map';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#081D5A',
        },
        secondary: {
            main: '#D72465',
            dark: '#B10544',
        },
    },
    typography: {
        fontFamily: 'Rubik-light',
    },
    customColors: {
        //* `declarations/mui-styles.d.ts`
        blue1: '#5BAAB2',
        blue: '#5E6C94',
        light_blue1: '#CAE1E3',
        dark_blue1: '#081D5A',
        grey1: '#D7D7D7',
        off_white: '#9FA7BF',
        off_white1: '#F9F9FB',
        light_blue2: '#F6FAFA',
        blue2: '#26386E',
        red: '#D72465',
    },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
    <CSSPrioritize>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </CSSPrioritize>,
    // </React.StrictMode>,
);
