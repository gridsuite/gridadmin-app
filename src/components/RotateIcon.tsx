import { FunctionComponent } from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';
import { SvgIconTypeMap } from '@mui/material/SvgIcon/SvgIcon';
import { CSSObject } from '@emotion/react';

type ExtendIconProps<I extends SvgIconComponent = any> = SvgIconProps<
    SvgIconTypeMap['defaultComponent'],
    { component: I }
>;
interface ExtendIcon<
    I extends SvgIconComponent = any,
    P extends ExtendIconProps<I> = any
> extends FunctionComponent<P> {
    (props: P, context?: any): I;
}

const style: CSSObject = {
    animation: 'spin 2s linear infinite',
    '@keyframes spin': {
        '0%': {
            transform: 'rotate(0deg)',
        },
        '100%': {
            transform: 'rotate(360deg)',
        },
    },
};

export const RotateIcon: ExtendIcon = (props, context) => (
    <props.component {...props} sx={style} />
);
export default RotateIcon;
