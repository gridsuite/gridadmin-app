import {
    backendFetch,
    backendFetchJson,
    extractUserSub,
    getToken,
    getUser,
    ReqResponse,
    User,
} from '../utils/rest-api';

const USER_ADMIN_URL = `${process.env.REACT_APP_API_GATEWAY}/user-admin/v1`;

export function getUserSub(): Promise<unknown> {
    return extractUserSub(getUser());
}

/*
 * fetchValidateUser is call from commons-ui AuthServices to validate user infos before setting state.user!
 */
export function fetchValidateUser(user: User): Promise<boolean> {
    return extractUserSub(user)
        .then((sub) => {
            console.debug(`Fetching access for user "${sub}"...`);
            return backendFetch(
                `${USER_ADMIN_URL}/users/${sub}`,
                { method: 'head' },
                getToken(user)
            );
        })
        .then((response: ReqResponse) => {
            //if the response is ok, the responseCode will be either 200 or 204 otherwise it's an HTTP error and it will be caught
            return response.status === 200;
        })
        .catch((error) => {
            if (error.status === 403) {
                return false;
            } else {
                throw error;
            }
        });
}

export type UserInfos = {
    sub: string;
    isAdmin: boolean;
};

export function fetchUsers(): Promise<UserInfos[]> {
    console.debug(`Fetching list of users...`);
    return backendFetchJson(`${USER_ADMIN_URL}/users`, {
        headers: {
            Accept: 'application/json',
            //'Content-Type': 'application/json; utf-8',
        },
        cache: 'default',
    }).catch((reason) => {
        console.error(`Error while fetching the servers data : ${reason}`);
        throw reason;
    });
}

export function deleteUser(sub: string): Promise<void> {
    console.debug(`Deleting sub user "${sub}"...`);
    return backendFetch(`${USER_ADMIN_URL}/users/${sub}`, { method: 'delete' })
        .then((response: ReqResponse) => undefined)
        .catch((reason) => {
            console.error(`Error while deleting the servers data : ${reason}`);
            throw reason;
        });
}

export function addUser(sub: string): Promise<void> {
    console.debug(`Creating sub user "${sub}"...`);
    return backendFetch(`${USER_ADMIN_URL}/users/${sub}`, { method: 'put' })
        .then((response: ReqResponse) => undefined)
        .catch((reason) => {
            console.error(`Error while pushing the data : ${reason}`);
            throw reason;
        });
}

export type UserConnection = {
    sub: string;
    firstConnection: string; //$date-time
    lastConnection: string; //$date-time
    isAccepted: boolean;
};

export function fetchUsersConnections(): Promise<UserConnection[]> {
    console.debug(`Fetching users connections...`);
    return backendFetchJson(`${USER_ADMIN_URL}/connections`, {
        headers: {
            Accept: 'application/json',
        },
        cache: 'default',
    }).catch((reason) => {
        console.error(`Error while fetching the servers data : ${reason}`);
        throw reason;
    });
}
