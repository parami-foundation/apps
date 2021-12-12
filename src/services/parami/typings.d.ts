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

    type TelegramLogin = {
        ticket?: {};
        site?: string;
        wallet?: string;
    };

    type TelegramLoginResp = {
        avatar?: string;
    };

    type TelegramLink = {
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