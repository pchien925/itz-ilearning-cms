import { setupApi } from '@itz/react-core';
import { getCacheAccessToken, removeCacheToken } from './userService';

export const { axiosInstance, sendRequest, config } = setupApi({
    getAccessToken: () => getCacheAccessToken(),
    onUnauthorized: () => {
        removeCacheToken();
        window.location.href = '/login';
    },
});