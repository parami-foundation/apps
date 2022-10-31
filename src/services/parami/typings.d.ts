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

	type ClaimHNFT = {
		ticket: {};
		site: string;
		account: string;
		nftId: string;
	}

	type BindSocial = {
		ticket?: {};
		site?: string;
		did?: string;
	}

	type AirdropLoginResp = {
		avatar?: string;
		nickname?: string;
	};

	type AirdropLink = {
		site?: string;
		wallet?: string;
	};

	type Info = {
		common: {
			languageCode?: string | null;
			releaseNotesModal?: any[] | null;
		};

		wallet: {
			passphrase?: string | null;
			keystore?: string | null;
			account?: string | null;
			did?: string | null;
			customPassphrase?: boolean;
			inProcess?: string | null;
			redirect?: string | null;
			mnemonicExported?: string | null;
		};

		dashboard: {
			accountMeta?: string | null;
			account?: string | null;
			did?: string | null;
			accounts?: any;
			assets?: any;
		};
	}
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

type NFTNetwork =
	'Unknown'
	| 'Binance'
	| 'Bitcoin'
	| 'Eosio'
	| 'Ethereum'
	| 'Kusama'
	| 'Polkadot'
	| 'Solana'
	| 'Tron'
	| 'Near';

export type AdScore = {
	tag: string;
	score: string;
}

export type AdScoreInfo = {
	scores: AdScore[],
	signature: string,
	referer: string,
	signer_account: string
}

export type Asset = {
	deposit: string;
  name: string;
  symbol: string;
  decimals: string;
  isFrozen: boolean;
	icon: string;
	id: string;
}
