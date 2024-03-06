import { forwardRef, useCallback, useMemo, useState } from 'react';
import { Refresh } from '@mui/icons-material';
import RotateIcon from '../../RotateIcon';
import { GridBaseButton, GridBaseButtonProps } from './BaseButton';
import { FnSyncAsync, runFnWithState } from '../../../utils/functions';

function RefreshIconRotate() {
    return <RotateIcon component={Refresh} fontSize="small" />;
}

function RefreshIcon() {
    return <Refresh fontSize="small" />;
}

export type GridButtonRefreshProps = Partial<
    Omit<GridBaseButtonProps, 'onClick'>
> & {
    refresh: FnSyncAsync; // ButtonProps['onClick']; //(event: MouseEvent<HTMLButtonElement>) => void
};

export const GridButtonRefresh = forwardRef<
    HTMLButtonElement,
    GridButtonRefreshProps
>(function GridButtonRefresh(props, ref) {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const onClick = useCallback(
        () => runFnWithState(props.refresh, setRefreshing),
        [props.refresh]
    );
    const buttonProps: GridBaseButtonProps['buttonProps'] = useMemo(
        () => ({
            disabled: onClick === undefined || refreshing,
        }),
        [onClick, refreshing]
    );

    return (
        <GridBaseButton
            tooltipTextId="table.toolbar.refresh.tooltip"
            labelId="table.toolbar.refresh.label"
            textId="table.toolbar.refresh"
            {...props}
            onClick={onClick}
            startIcon={refreshing ? <RefreshIconRotate /> : <RefreshIcon />}
            buttonProps={buttonProps}
            ref={ref}
        />
    );
});
export default GridButtonRefresh;
