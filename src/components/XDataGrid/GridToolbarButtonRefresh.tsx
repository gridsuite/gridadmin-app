import { forwardRef, useCallback, useState } from 'react';
import { Refresh } from '@mui/icons-material';
import RotateIcon from '../RotateIcon';
import GridToolbarButton, { GridToolbarButtonProps } from './GridToolbarButton';
import { FnSyncAsync, runFnWithState } from '../../utils/functions';

function RefreshIconRotate() {
    return <RotateIcon component={Refresh} fontSize={'small'} />;
}

function RefreshIcon() {
    return <Refresh fontSize={'small'} />;
}

export type GridToolbarRefreshProps = GridToolbarButtonProps & {
    refresh?: FnSyncAsync; // ButtonProps['onClick']; //(event: MouseEvent<HTMLButtonElement>) => void
};

export const GridToolbarRefresh = forwardRef<
    HTMLButtonElement,
    GridToolbarRefreshProps
>(function GridToolbarRefresh(props, ref) {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const onClick = useCallback(
        () => runFnWithState(props.refresh, setRefreshing),
        [props.refresh]
    );

    return (
        <GridToolbarButton
            {...props}
            ref={ref}
            tooltip={{
                titleId: 'table.toolbar.refresh.tooltip',
            }}
            button={{
                labelId: 'table.toolbar.refresh.label',
                textId: 'table.toolbar.refresh',
                startIcon: refreshing ? <RefreshIconRotate /> : <RefreshIcon />,
                onClick: onClick,
                disabled: onClick === undefined || refreshing,
            }}
        />
    );
});
export default GridToolbarRefresh;
