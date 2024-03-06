/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    Button as MuiButton,
    ButtonProps,
    Tooltip,
    TooltipProps,
    useForkRef,
} from '@mui/material';
import {
    OverridableComponent,
    OverridableTypeMap,
    OverrideProps,
} from '@mui/material/OverridableComponent';
import { ExtendButtonBaseTypeMap } from '@mui/material/ButtonBase/ButtonBase';
import { ButtonTypeMap } from '@mui/material/Button/Button';
import { forwardRef, useId, useRef } from 'react';
import { useIntl } from 'react-intl';

type PropsWithoutChildren<P> = P extends any
    ? 'children' extends keyof P
        ? Omit<P, 'children'>
        : P
    : P;

export type GridBaseButtonProps = {
    tooltipTextId: string;
    textId: string;
    labelId: string;
    color?: ButtonProps['color'];
    startIcon: ButtonProps['startIcon'];
    onClick: ButtonProps['onClick'];

    buttonProps?: PropsWithoutChildren<ButtonProps>;
    tooltipProps?: PropsWithoutChildren<TooltipProps>;
};

/* Taken from MUI/materials-ui codebase
 * Mui expose button's defaultComponent as "button" and button component as "a"... but generate in reality a <button/>
 * Redefine type to cast it.
 */
type ExtendButtonBaseOverride<M extends OverridableTypeMap> = ((
    props: OverrideProps<ExtendButtonBaseTypeMap<M>, 'button'>
) => JSX.Element) &
    OverridableComponent<ExtendButtonBaseTypeMap<M>>;
const Button = MuiButton as ExtendButtonBaseOverride<ButtonTypeMap>;

export const GridBaseButton = forwardRef<
    HTMLButtonElement,
    GridBaseButtonProps
>(function GridBaseButton(props, ref) {
    const intl = useIntl();
    const buttonId = useId();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const handleRef = useForkRef(ref, buttonRef);

    return (
        <Tooltip
            enterDelay={1000}
            leaveDelay={250}
            arrow
            describeChild
            {...(props.tooltipProps ?? {})}
            title={intl.formatMessage({ id: props.textId })}
            aria-disabled={props.buttonProps?.disabled}
        >
            <span>
                <Button
                    variant="outlined"
                    {...(props.buttonProps ?? {})}
                    color={props.color ?? props.buttonProps?.color}
                    startIcon={props.startIcon ?? props.buttonProps?.startIcon}
                    onClick={props.onClick}
                    aria-label={intl.formatMessage({ id: props.labelId })}
                    id={buttonId}
                    ref={handleRef}
                    size="small"
                >
                    {intl.formatMessage({ id: props.textId })}
                </Button>
            </span>
        </Tooltip>
    );
});
