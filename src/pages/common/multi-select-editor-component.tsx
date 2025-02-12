/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import { Autocomplete } from '@mui/lab';
import { Chip, TextField } from '@mui/material';

export interface MultiSelectCellEditorProps {
    value: string[];
    options: string[];
    setValue: (value: string[]) => void;
}

const MutiSelectEditorComponent = (props: MultiSelectCellEditorProps) => {
    const [selectedValues, setSelectedValues] = useState<string[]>(props.value || []);

    useEffect(() => {
        props.setValue(selectedValues);
    }, [props, selectedValues]);

    const handleDelete = (label: string) => {
        let newValues = [...selectedValues];
        const idx = newValues.indexOf(label);
        if (idx !== -1) {
            newValues.splice(idx, 1);
            setSelectedValues(newValues);
        }
    };

    return (
        <Autocomplete
            multiple
            options={props.options}
            value={selectedValues}
            onChange={(_, newValue) => {
                setSelectedValues(newValue);
            }}
            renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
            renderTags={(val: string[]) =>
                val.map((label: string) => (
                    <Chip
                        key={label}
                        size="small"
                        label={label}
                        sx={{ marginTop: '2px', marginRight: '5px' }}
                        onDelete={(e: Event) => handleDelete(label)}
                    />
                ))
            }
        />
    );
};

export default MutiSelectEditorComponent;
