import { forwardRef, useMemo } from 'react';
import { AddCircleOutline, SvgIconComponent } from '@mui/icons-material';
import GridToolbarButton, { GridToolbarButtonProps } from './GridToolbarButton';

export type GridToolbarAddProps = GridToolbarButtonProps & {
    addElement?: () => void;
    icon?: SvgIconComponent;
    textId?: string;
    tooltipId: string;
    labelId: string;
};

export const GridToolbarBtnAdd = forwardRef<
    HTMLButtonElement,
    GridToolbarAddProps
>(function GridToolbarBtnAdd(props, ref) {
    const AddIcon = useMemo(() => {
        const IcnCmpnt: SvgIconComponent = props.icon ?? AddCircleOutline;
        return <IcnCmpnt fontSize="small" />;
    }, [props.icon]);

    return (
        <GridToolbarButton
            {...props}
            ref={ref}
            tooltip={{
                titleId: props.tooltipId,
            }}
            button={{
                labelId: props.labelId,
                textId: props.textId ?? 'table.toolbar.add',
                color: 'primary',
                startIcon: AddIcon,
                onClick: props.addElement,
                disabled: props.addElement === undefined,
            }}
        />
    );
});
export default GridToolbarBtnAdd;
