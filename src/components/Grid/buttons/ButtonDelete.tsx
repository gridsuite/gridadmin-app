import { forwardRef, useMemo } from 'react';
import { Delete, SvgIconComponent } from '@mui/icons-material';
import { GridBaseButton, GridBaseButtonProps } from './BaseButton';

export type GridButtonDeleteProps = Partial<GridBaseButtonProps> & {
    icon?: SvgIconComponent;
    disabled?: boolean;
};

function noClickProps() {
    console.error('GridButtonDelete.onClick not defined');
}

export const GridButtonDelete = forwardRef<
    HTMLButtonElement,
    GridButtonDeleteProps
>(function GridButtonDelete(props, ref) {
    const AddIcon = useMemo(() => {
        const IcnCmpnt: SvgIconComponent = props.icon ?? Delete;
        return <IcnCmpnt fontSize="small" />;
    }, [props.icon]);
    const buttonProps: GridBaseButtonProps['buttonProps'] = useMemo(
        () => ({
            disabled: props.disabled || props.onClick === undefined,
        }),
        [props.disabled, props.onClick]
    );

    return (
        <GridBaseButton
            tooltipTextId="table.toolbar.delete.tooltip"
            textId="table.toolbar.delete"
            labelId="table.toolbar.delete.label"
            onClick={noClickProps}
            {...props}
            ref={ref}
            color="error"
            startIcon={AddIcon}
            buttonProps={buttonProps}
        />
    );
});
export default GridButtonDelete;
