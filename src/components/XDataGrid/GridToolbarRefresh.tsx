import { ButtonProps, TooltipProps } from '@mui/material';
import {
    unstable_useForkRef as useForkRef,
    unstable_useId as useId,
} from '@mui/utils';
import { useGridRootProps } from '@mui/x-data-grid';
import { forwardRef, useMemo, useRef, useState } from 'react';
import { Refresh } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import RotateIcon from '../RotateIcon';

function IconRotate() {
    return <RotateIcon component={Refresh} fontSize={'small'} />;
}

function IconStatic() {
    return <Refresh fontSize={'small'} />;
}

function isPromise(obj: any): boolean {
    return (
        typeof obj?.then === 'function' || //only standard/common thing in implementations
        obj instanceof Promise || //native promise
        (obj && Object.prototype.toString.call(obj) === '[object Promise]')
    ); //ES6 Promise
}

function onClickRefresh(
    fn: GridToolbarRefreshProps['refresh'],
    setState: (n: boolean) => void
) {
    if (fn !== undefined && fn !== null) {
        if (isPromise(fn)) {
            setState(true);
            Promise.resolve()
                .then(() => (fn as () => Promise<void>)())
                .finally(() => setState(false));
        } /*if (typeof fn === 'function')*/ else {
            setState(true);
            fn();
            setState(false);
        }
    }
}

export type GridToolbarRefreshProps = {
    refresh?: () => void | Promise<void>; // ButtonProps['onClick']; //(event: MouseEvent<HTMLButtonElement>) => void

    /**
     * The props used for each slot inside.
     * @default {}
     */
    slotProps?: {
        button?: Partial<ButtonProps>;
        tooltip?: Partial<TooltipProps>;
    };
    [key: string]: any;
};

export const GridToolbarExport = forwardRef<
    HTMLButtonElement,
    GridToolbarRefreshProps
>(function GridToolbarRefresh(props, ref) {
    const { slotProps = {} } = props;
    const buttonProps = slotProps.button ?? {};
    const tooltipProps = slotProps.tooltip ?? {};

    //const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const intl = useIntl();

    const buttonRef = useRef<HTMLButtonElement>(null);
    const handleRef = useForkRef(ref, buttonRef);
    const refreshButtonId = useId();
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const onClick = useMemo(
        () => () => onClickRefresh(props.refresh, setRefreshing),
        [props.refresh]
    );

    return (
        <rootProps.slots.baseTooltip
            title={intl.formatMessage({
                id: 'table.toolbar.refresh.tooltip',
            })}
            enterDelay={1000}
            {...tooltipProps}
            {...rootProps.slotProps?.baseTooltip}
        >
            <rootProps.slots.baseButton
                ref={handleRef}
                size="small"
                startIcon={refreshing ? <IconRotate /> : <IconStatic />}
                aria-label={intl.formatMessage({
                    id: 'table.toolbar.refresh.label',
                })}
                id={refreshButtonId}
                {...buttonProps}
                onClick={onClick}
                {...rootProps.slotProps?.baseButton}
            >
                {intl.formatMessage({ id: 'table.toolbar.refresh' })}
            </rootProps.slots.baseButton>
        </rootProps.slots.baseTooltip>
    );
});
export default GridToolbarExport;
