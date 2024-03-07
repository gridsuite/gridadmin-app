/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch, SetStateAction, useDebugValue, useState } from 'react';

export function useStateWithLabel<S>(
    label: string,
    initialValue: S | (() => S)
): [S, Dispatch<SetStateAction<S>>];
export function useStateWithLabel<S = undefined>(
    label: string
): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
export function useStateWithLabel<S>(
    label: string,
    initialValue?: S | (() => S)
): [S, Dispatch<SetStateAction<S>>] {
    const [value, setValue] = useState<S>(initialValue as S);
    useDebugValue(`${label}: ${value}`);
    return [value, setValue];
}
