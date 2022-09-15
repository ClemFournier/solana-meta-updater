import { Nft, NftWithToken, Sft, SftWithToken } from "@metaplex-foundation/js";

require('dotenv').config({path:'./config/.env'});

export class SolanaService {
    constructor() {}

    async updateMetadata(nft: Sft | SftWithToken | Nft | NftWithToken) {
        
    }
}