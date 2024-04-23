import { FunctionComponent, useCallback } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { UserInfos } from '../../services';

export interface DeleteUserDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    usersInfos: UserInfos[];
    deleteUsers: () => void;
}

const DeleteUserDialog: FunctionComponent<DeleteUserDialogProps> = (props) => {
    const { open, setOpen, deleteUsers, usersInfos } = props;
    const intl = useIntl();

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const buildTitle = useCallback(
        (users: UserInfos[]) => {
            const hasMultipleItems = users.length > 1;
            const descriptor = {
                id: hasMultipleItems
                    ? 'users.form.delete.multiple.dialog.title'
                    : 'users.form.delete.dialog.title',
            };
            return intl.formatMessage(
                descriptor,
                hasMultipleItems ? { itemsCount: users.length } : undefined
            );
        },
        [intl]
    );
    const onSubmit = useCallback(() => {
        deleteUsers();
        setOpen(false);
    }, [deleteUsers, setOpen]);

    const buildContent = useCallback(
        (users: UserInfos[]) => {
            const hasMultipleItems = users.length > 1;
            const descriptor = {
                id: hasMultipleItems
                    ? 'users.form.delete.multiple.dialog.message'
                    : 'users.form.delete.dialog.message',
            };
            if (hasMultipleItems) {
                return intl.formatMessage(descriptor, {
                    itemsCount: users.length,
                });
            }
            return intl.formatMessage(descriptor, {
                itemName: users.length === 1 && users[0].sub,
            });
        },
        [intl]
    );

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{buildTitle(usersInfos)}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {buildContent(usersInfos)}
                </DialogContentText>
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

export default DeleteUserDialog;
