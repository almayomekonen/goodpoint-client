export type CustomColorNames =
    | 'light_blue1'
    | 'blue1'
    | 'grey1'
    | 'dark_blue1'
    | 'off_white'
    | 'off_white1'
    | 'light_blue2'
    | 'blue'
    | 'blue2'
    | 'red';
export type CustomColors = Partial<Record<CustomColorNames, string>>;

declare module '@mui/material/styles' {
    interface Theme {
        customColors: CustomColors;
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        customColors?: Partial<CustomColors>;
    }
}
