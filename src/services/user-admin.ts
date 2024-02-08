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
            console.info(`Fetching access for user...`);
            const CheckAccessUrl = `${USER_ADMIN_URL}/users/${sub}`;
            console.debug(CheckAccessUrl);
            return backendFetch(
                CheckAccessUrl,
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
    console.info(`Fetching list of users...`);
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

export type UserConnection = {
    sub: string;
    firstConnection: string; //$date-time
    lastConnection: string; //$date-time
    isAccepted: boolean;
};

export function fetchUsersConnections(): Promise<UserConnection[]> {
    console.info(`Fetching users connections...`);
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
