import { isFunction } from '@polkadot/util';

function hasEndpoint(api: any, endpoint: any) {
    const [area, section, method] = endpoint.split('.');
    try {
        return isFunction(api[area][section][method]);
    } catch (error) {
        return false;
    }
}

export function hasApis(api: any, needsApi: any[]) {
    const notFound = needsApi.filter((endpoint: any) => {
        return !hasEndpoint(api, endpoint);
    });
    return notFound.length === 0;
}
