// https://mui.com/material-ui/customization/theming/#typescript
import { CSSObject } from '@mui/styled-engine';
import {
    Theme as MuiTheme,
    ThemeOptions as MuiThemeOptions,
} from '@mui/material/styles/createTheme';
import { AgGridClasses, AgGridCss } from './components/Grid';

declare module '@mui/material/styles/createTheme' {
    export * from '@mui/material/styles/createTheme';

    type ThemeExtension = {
        arrow: CSSObject;
        arrow_hover: CSSObject;
        circle: CSSObject;
        circle_hover: CSSObject;
        link: CSSObject;
        mapboxStyle: string;
        agGridTheme: 'ag-theme-alpine' | 'ag-theme-alpine-dark';
        agGridThemeOverride?: CSSObject & {
            [K in AgGridCss | AgGridClasses]?: CSSObject;
        };
    };
    export interface Theme extends MuiTheme, ThemeExtension {}
    // allow configuration using `createTheme`
    export interface ThemeOptions
        extends MuiThemeOptions,
            Partial<ThemeExtension> {}
}
