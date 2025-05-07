/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useRef, useState, useEffect } from 'react';
import { Chip, Grid, Tooltip } from '@mui/material';
import { mergeSx } from '@gridsuite/commons-ui';

const maxChipWidth = 100;
const counterChipWidth = 25;

const chipStyles = {
    default: {
        marginTop: 2,
        marginLeft: 1,
        maxWidth: maxChipWidth,
    },
    withCounter: {
        '&.MuiChip-root': {
            fontWeight: 'bold',
        },
    },
};

export interface MultiChipCellRendererProps {
    value: string[];
}

const MultiChipCellRenderer = (props: MultiChipCellRendererProps) => {
    const values: string[] = props.value || [];
    const containerRef = useRef<HTMLDivElement>(null);
    const [chipLimit, setChipLimit] = useState<number>(5);

    useEffect(() => {
        const updateChipLimit = () => {
            if (!containerRef.current) {
                return;
            }
            const zoomLevel = window.devicePixelRatio;
            const adjustedContainerWidth = containerRef.current.clientWidth / zoomLevel;
            const maxChips = Math.max(1, Math.floor(adjustedContainerWidth / (maxChipWidth + counterChipWidth)));
            setChipLimit(maxChips);
        };

        updateChipLimit();
        const resizeObserver = new ResizeObserver(updateChipLimit);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => resizeObserver.disconnect();
    }, [values.length]);

    const customChip = (label: string, index: number, chipsNumber: number) => {
        if (index < chipLimit) {
            return (
                <Tooltip title={label} key={`tooltip-${label}`}>
                    <Chip key={label} label={label} size="small" sx={chipStyles.default} />
                </Tooltip>
            );
        } else if (index === chipLimit) {
            const hiddenLabels = values.slice(chipLimit);
            const tooltipContent = (
                <>
                    {hiddenLabels.map((hiddenLabel) => (
                        <div key={`hidden-label-${hiddenLabel}`}>{'- ' + hiddenLabel}</div>
                    ))}
                </>
            );

            return (
                <Tooltip title={tooltipContent} key="tooltip-counter">
                    <Chip
                        size="small"
                        label={`+${chipsNumber - chipLimit}`}
                        key="chip-counter"
                        sx={mergeSx(chipStyles.default, chipStyles.withCounter)}
                    />
                </Tooltip>
            );
        }
        return null;
    };

    return (
        <Grid container direction="row" spacing={1} wrap="nowrap" ref={containerRef}>
            {values.map((label: string, index: number) => customChip(label, index, values.length))}
        </Grid>
    );
};

export default MultiChipCellRenderer;
