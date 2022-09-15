import { bundlrStorage, keypairIdentity, Metaplex, Nft, NftWithToken, Sft, SftWithToken } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Cluster, Keypair, PublicKey } from "@solana/web3.js";

require('dotenv').config({path:'./config/.env'});

export class MetaplexService {
    private metaplex: Metaplex;
    private connection: Connection;
    private secretKey: Uint8Array;
    private wallet: Keypair;

    constructor() {
        this.secretKey = Uint8Array.from(JSON.parse(process.env.UPDATE_AUTHORITY_KEY));
        this.wallet = Keypair.fromSecretKey(this.secretKey);
        this.connection = new Connection(clusterApiUrl(process.env.NETWORK as Cluster));
        this.metaplex = Metaplex.make(this.connection)
        .use(keypairIdentity(this.wallet))
        .use(bundlrStorage());
    }

    async getNft(mint: string): Promise<Sft | SftWithToken | Nft | NftWithToken> {
        try {
            return await this.metaplex.nfts().findByMint({ mintAddress: new PublicKey(mint) }).run();
        } catch (e: any) {
            console.log(`Error retrieving NFT info from Metaplex ${mint} ${e}`);
            return null;
        }

    }
}