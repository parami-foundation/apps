declare namespace Discord {
    interface DiscordLoginProps {
        clientId: string,
        redirectUri: string,
        scope?: string,
        render?: any,
    }

    interface DiscordResponse {
        token_type: string,
        access_token: string,
        expires_in: number,
        scope: string,
    }
}