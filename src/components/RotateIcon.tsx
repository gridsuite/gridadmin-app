import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';
import { SvgIconTypeMap } from '@mui/material/SvgIcon/SvgIcon';
import { CSSObject } from '@emotion/react';

type ExtendIconProps<I extends SvgIconComponent = any> = SvgIconProps<
    SvgIconTypeMap['defaultComponent'],
    { component: I }
>;

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

export default function RotateIcon<I extends SvgIconComponent>(
    props: ExtendIconProps<I>
) {
    const { component, ...restProps } = props;
    const Cmpnt = component as SvgIconComponent;
    return <Cmpnt {...restProps} sx={style} />;
}
