import { backendFetch, ReqResponse } from '../utils/rest-api';

const USER_ADMIN_URL = `${process.env.REACT_APP_API_GATEWAY}/user-admin`;

export function fetchValidateUser(user: Record<string, any>): Promise<boolean> {
    const sub = user?.profile?.sub;
    if (!sub) {
        return Promise.reject(
            new Error(
                `Fetching access for missing user.profile.sub : ${JSON.stringify(
                    user
                )}`
            )
        );
    }

    console.info(`Fetching access for user...`);
    const CheckAccessUrl = `${USER_ADMIN_URL}/v1/users/${sub}`;
    console.debug(CheckAccessUrl);

    return backendFetch(CheckAccessUrl, { method: 'head' }, user?.id_token)
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
