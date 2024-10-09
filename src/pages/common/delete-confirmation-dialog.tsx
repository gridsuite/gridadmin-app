/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useCallback } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

export interface DeleteConfirmationDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    itemType: string;
    itemNames: string[];
    deleteFunc: () => void;
}

const DeleteConfirmationDialog: FunctionComponent<DeleteConfirmationDialogProps> = (props) => {
    const { open, setOpen, itemType, itemNames, deleteFunc } = props;
    const intl = useIntl();

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const buildTitle = useCallback(
        (itemType: string, itemNames: string[]) => {
            const hasMultipleItems = itemNames.length > 1;
            const descriptor = {
                id: hasMultipleItems ? 'form.delete.multiple.dialog.title' : 'form.delete.dialog.title',
            };
            return intl.formatMessage(
                descriptor,
                hasMultipleItems ? { itemType: itemType, itemsCount: itemNames.length } : { itemType: itemType }
            );
        },
        [intl]
    );
    const onSubmit = useCallback(() => {
        deleteFunc();
        setOpen(false);
    }, [deleteFunc, setOpen]);

    const buildContent = useCallback(
        (itemType: string, itemNames: string[]) => {
            const hasMultipleItems = itemNames.length > 1;
            const descriptor = {
                id: hasMultipleItems ? 'form.delete.multiple.dialog.message' : 'form.delete.dialog.message',
            };
            if (hasMultipleItems) {
                return intl.formatMessage(descriptor, {
                    itemType: itemType,
                    itemsCount: itemNames.length,
                });
            }
            return intl.formatMessage(descriptor, {
                itemName: itemNames.length === 1 && itemNames[0],
            });
        },
        [intl]
    );

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{buildTitle(itemType, itemNames)}</DialogTitle>
            <DialogContent>
                <DialogContentText>{buildContent(itemType, itemNames)}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    <FormattedMessage id="cancel" />
                </Button>
                <Button type="submit" onClick={onSubmit}>
                    <FormattedMessage id="ok" />
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
