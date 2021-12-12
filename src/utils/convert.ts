import { TypeRegistry } from '@polkadot/types';
import map from '@polkadot/jsonrpc';

const registry = new TypeRegistry();

/**
 * 转化块的交易数据
 * @param block getBlock的数据
 */
export const convertExtrinsics = (
    block: any,
): [{ method: string, section: string, args: any }] => {
    return block.block.extrinsics.map((t: any) => {
        const { meta, method, section } = registry.findMetaCall(t.method.callIndex);
        return {
            meta,
            method,
            section,
            args: t.method.args.toString(),
        };
    });
}

export const convertGetTimeStamp = (block: any) => {
    const extrinsic = convertExtrinsics(block).filter(
        t => t.section === 'timestamp' && t.method === 'set',
    )[0];
    return extrinsic ? parseInt(extrinsic.args) : Date.now();
}

export const createRpcSectionOptions = () => {
    return Object.keys(window.apiWs.rpc)
        .sort()
        .filter(section => Object.keys(window.apiWs.rpc[section]).length !== 0);
}

export const createRpcMethodOptions = (sectionName: any) => {
    const section = map[sectionName];
    if (!section || Object.keys(window.apiWs.rpc[sectionName]).length === 0) {
        return [];
    }
    return Object.keys(window.apiWs.rpc[sectionName])
        .sort()
        .filter(value => {
            const { isDeprecated, isHidden, isSubscription } = section.methods[value];

            return !isDeprecated && !isHidden && !isSubscription;
        })
        .map(value => {
            const { description, params } = section.methods[value];
            return {
                description: description,
                params: params,
                value,
            };
        });
}

export const createTxSectionOptions = () => {
    return Object.keys(window.apiWs.tx)
        .sort()
        .filter(section => Object.keys(window.apiWs.tx[section]).length !== 0);
}

export const createTxMethodOptions = (sectionName: any) => {
    const section = window.apiWs.tx[sectionName];

    if (!section || Object.keys(section).length === 0) {
        return [];
    }

    return Object.keys(section)
        .sort()
        .map(value => {
            const method = section[value];
            const params = method.meta.args
                .filter(arg => arg.type.toString() !== 'Origin')
                .map(t => ({
                    name: t.name.toString(),
                    type: t.type.toString(),
                    isOptional: false,
                }));
            return {
                description: method.meta.docs[0] || value,
                params: params,
                value,
            };
        });
}

export const createConstsMethodOptions = (sectionName: any) => {
    const section = window.apiWs.consts[sectionName];

    if (!section || Object.keys(section).length === 0) {
        return [];
    }

    return Object.keys(section)
        .sort()
        .map(value => {
            const method = section[value];

            return {
                description: (
                    method.registry.metadata || method.eq.name
                ).toString(),
                params: [],
                value: value,
            };
        });
}

export const createConstsSectionOptions = () => {
    return Object.keys(window.apiWs.consts)
        .sort()
        .filter(name => Object.keys(window.apiWs.consts[name]).length);
}

export const createQuerySectionOptions = () => {
    return Object.keys(window.apiWs.query)
        .sort()
        .filter(name => Object.keys(window.apiWs.query[name]).length);
}

export const createQueryMethodOptions = (sectionName: any) => {
    const section = window.apiWs.query[sectionName];

    if (!section || Object.keys(section).length === 0) {
        return [];
    }

    return Object.keys(section)
        .sort()
        .map(value => {
            const method = section[value];
            const type = method.arguments.type;
            const params = (type.isMap
                ? [{ Name: type.asMap.key.toString(), Type: type.asMap.key.toString() }]
                : type.isDoubleMap
                    ? [
                        { Name: type.asDoubleMap.key1, Type: type.asDoubleMap.key1 },
                        { Name: type.asDoubleMap.key2, Type: type.asDoubleMap.key2 },
                    ]
                    : []
            ).map(({ Type }) => {
                let array;
                if (Type.startsWith('(')) {
                    array = Type
                        .replace('(', '')
                        .replace(')', '')
                        .split(',');
                }
                const Value = {
                    Name: Type,
                    Type: Type,
                    Fields: [],
                };
                if (array) {
                    Value.Type = 'form';
                    Value.Fields = array.map((t: any) => ({
                        Name: t,
                        Type: t,
                    }));
                }
                return Value;
            });
            return {
                description: (
                    method.arguments.docs[0] || method.name
                ).toString(),
                params: params,
                value,
            };
        });
}

export const getTxOptions = () => {
    const obj = {};
    const sectionOptions = createTxSectionOptions();
    sectionOptions.forEach(t => (obj[t] = createTxMethodOptions(t)));
    return obj;
}

export const getQueryOptions = () => {
    const obj = {};
    const sectionOptions = createQuerySectionOptions();
    sectionOptions.forEach((t: any) => (obj[t] = createQueryMethodOptions(t)));
    return obj;
}

export const getRpcOptions = () => {
    const obj = {};
    const sectionOptions = createRpcSectionOptions();
    sectionOptions.forEach((t: any) => (obj[t] = createRpcMethodOptions(t)));
    return obj;
}

export const getConstsOptions = () => {
    const obj = {};
    const sectionOptions = createConstsSectionOptions();
    sectionOptions.forEach((t: any) => (obj[t] = createConstsMethodOptions(t)));
    return obj;
}
