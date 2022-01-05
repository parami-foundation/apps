// @ts-ignore
/* eslint-disable */

declare namespace API {
    type Error = {
        Type?: string;
        Message?: string;
    };

    type Resp = {
        data?: Result;
        response?: Response;
    };

    type AirdropLogin = {
        ticket?: {};
        site?: string;
        wallet?: string;
    };

    type AirdropLoginResp = {
        avatar?: string;
        nickname?: string;
    };

    type AirdropLink = {
        site?: string;
        wallet?: string;
    };
};

declare namespace State {
    type Controller = {
        free?: any;
        reserved?: any;
        total?: any;
        nonce?: any;
    };

    type Stash = {
        free?: any;
        reserved?: any;
        total?: any;
        nonce?: any;
    };

    type Assets = {
        assetID?: string;
        balance?: any;
        valueOf?: any;
    }[];

    type Tags = {
        count?: any;
        value?: any;
    }[];
}