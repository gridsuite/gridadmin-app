import { forwardRef, useMemo } from 'react';
import { AddCircleOutline, SvgIconComponent } from '@mui/icons-material';
import { GridBaseButton, GridBaseButtonProps } from './BaseButton';

export type GridButtonAddProps = Partial<GridBaseButtonProps> & {
    icon?: SvgIconComponent;
};

function noClickProps() {
    console.error('GridButtonDelete.onClick not defined');
}

export const GridButtonAdd = forwardRef<HTMLButtonElement, GridButtonAddProps>(
    function GridButtonAdd(props, ref) {
        const AddIcon = useMemo(() => {
            const IcnCmpnt: SvgIconComponent = props.icon ?? AddCircleOutline;
            return <IcnCmpnt fontSize="small" />;
        }, [props.icon]);
        const buttonProps: GridBaseButtonProps['buttonProps'] = useMemo(
            () => ({
                disabled: props.onClick === undefined,
            }),
            [props.onClick]
        );

        return (
            <GridBaseButton
                textId="table.toolbar.add"
                tooltipTextId="table.toolbar.add.tooltip"
                labelId="table.toolbar.add.label"
                onClick={noClickProps}
                {...props}
                ref={ref}
                color="primary"
                startIcon={AddIcon}
                buttonProps={buttonProps}
            />
        );
    }
);
export default GridButtonAdd;
