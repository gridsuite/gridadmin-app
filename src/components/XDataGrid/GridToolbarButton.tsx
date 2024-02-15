import { ButtonProps, TooltipProps } from '@mui/material';
import {
    unstable_useForkRef as useForkRef,
    unstable_useId as useId,
} from '@mui/utils';
import { useGridRootProps } from '@mui/x-data-grid';
import { forwardRef, useRef } from 'react';
import { useIntl } from 'react-intl';

export type GridToolbarButtonProps = {
    tooltip: {
        titleId: string;
    };
    button: {
        labelId: string;
        textId: string;
        color?: ButtonProps['color'];
        startIcon: ButtonProps['startIcon'];
        onClick: ButtonProps['onClick'];
    };

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

/*
 * Code based on sources of MUI-X Toolbar components
 */
export const GridToolbarButton = forwardRef<
    HTMLButtonElement,
    GridToolbarButtonProps
>(function GridToolbarButton(props, ref) {
    const buttonProps = props.slotProps?.button ?? {};
    const tooltipProps = props.slotProps?.tooltip ?? {};

    //const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const intl = useIntl();

    const buttonRef = useRef<HTMLButtonElement>(null);
    const handleRef = useForkRef(ref, buttonRef);
    const buttonId = useId();

    return (
        <rootProps.slots.baseTooltip
            title={intl.formatMessage({
                id: props.tooltip.titleId,
            })}
            enterDelay={1000}
            {...tooltipProps}
            {...rootProps.slotProps?.baseTooltip}
        >
            <rootProps.slots.baseButton
                ref={handleRef}
                size="small"
                startIcon={props.button.startIcon}
                aria-label={intl.formatMessage({
                    id: props.button.labelId,
                })}
                id={buttonId}
                {...buttonProps}
                onClick={props.button.onClick}
                {...rootProps.slotProps?.baseButton}
            >
                {intl.formatMessage({ id: props.button.textId })}
            </rootProps.slots.baseButton>
        </rootProps.slots.baseTooltip>
    );
});
export default GridToolbarButton;
