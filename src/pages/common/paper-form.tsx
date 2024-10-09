/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent } from 'react';
import { Paper, PaperProps } from '@mui/material';

/*
 * <Paper> is defined in <Dialog> without generics, which default to `PaperProps => PaperProps<'div'>`,
 *   so we must trick typescript check with a cast
 */
const PaperForm: FunctionComponent<PaperProps<'form'> & { untypedProps?: PaperProps }> = (props, context) => {
    const { untypedProps, ...formProps } = props;
    const othersProps = untypedProps as PaperProps<'form'>; //trust me ts
    return <Paper component="form" {...formProps} {...(othersProps ?? {})} />;
};

export default PaperForm;
