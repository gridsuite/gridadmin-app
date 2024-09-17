/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import yup from '../../utils/yup-config';
import { Duration, parse, serialize } from 'tinyduration';

export const ID = 'id';
export const DATE = 'creationDate';
export const MESSAGE = 'message';
export const DURATION = 'duration';
export const DAYS = 'days';
export const HOURS = 'hours';
export const MINUTES = 'minutes';

export interface DurationFormData {
    [DAYS]: number | null;
    [HOURS]: number | null;
    [MINUTES]: number | null;
}

export interface AnnouncementFormData {
    [MESSAGE]: string;
    [DURATION]: DurationFormData;
}

export const emptyFormData: AnnouncementFormData = {
    [MESSAGE]: '',
    [DURATION]: {
        [DAYS]: null,
        [HOURS]: null,
        [MINUTES]: null,
    },
};

// const formSchema: ObjectSchema<FormData> = yup
export const formSchema = yup
    .object()
    .shape({
        [MESSAGE]: yup.string().max(100).required(),
        [DURATION]: yup
            .object()
            .shape(
                {
                    [DAYS]: getDurationUnitSchema(HOURS, MINUTES),
                    [HOURS]: getDurationUnitSchema(DAYS, MINUTES),
                    [MINUTES]: getDurationUnitSchema(DAYS, HOURS),
                },
                // to avoid cyclic dependencies
                [
                    [HOURS, MINUTES],
                    [DAYS, MINUTES],
                    [DAYS, HOURS],
                ]
            )
            .required(),
    })
    .required();

function getDurationUnitSchema(otherUnitName1: string, otherUnitName2: string) {
    return yup.number().when([otherUnitName1, otherUnitName2], {
        is: (v1: number | null, v2: number | null) => v1 === null && v2 === null,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.nullable(),
    });
}

export interface AnnouncementServerData {
    [ID]: string;
    [DATE]: string;
    [MESSAGE]: string;
    [DURATION]: string;
}

export function fromFrontToBack(formData: AnnouncementFormData) {
    return {
        [MESSAGE]: formData[MESSAGE],
        [DURATION]: serialize(formData[DURATION] as Duration), // null values also works
    };
}

export interface Announcement extends AnnouncementFormData {
    [ID]: string;
    [DATE]: string;
}

export function fromBackToFront(serverData: AnnouncementServerData): Announcement {
    // In server side, duration is stored in hours only, so we need to compute the days
    const duration = parse(serverData[DURATION]);
    if (duration[HOURS] && duration[HOURS] >= 24) {
        duration[DAYS] = Math.trunc(duration[HOURS] / 24);
        duration[HOURS] %= 24;
    }
    return {
        [ID]: serverData[ID],
        [DATE]: new Date(serverData[DATE]).toLocaleString(),
        [MESSAGE]: serverData[MESSAGE],
        [DURATION]: duration as DurationFormData,
    };
}
