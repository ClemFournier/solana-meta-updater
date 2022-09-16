import { bundlrStorage, keypairIdentity, Metaplex, Nft, NftWithToken, Sft, SftWithToken } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Cluster, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { toInstructionData } from "../metaplex/instructions";
import { findMetadataPda } from "../metaplex/pdas";
import { createUpdateMetadataAccountV2Instruction } from "../metaplex/update";

require('dotenv').config({path:'./config/.env'});

export class MetaplexService {
    private metaplex: Metaplex;
    private connection: Connection;
    private secretKey: Uint8Array;
    private wallet: Keypair;

    constructor() {
        this.secretKey = Uint8Array.from(JSON.parse(process.env.UPDATE_AUTHORITY_KEY as string));
        this.wallet = Keypair.fromSecretKey(this.secretKey);
        this.connection = new Connection(clusterApiUrl(process.env.NETWORK as Cluster));
        this.metaplex = Metaplex.make(this.connection)
        .use(keypairIdentity(this.wallet))
        .use(bundlrStorage());
    }

    async getNft(mint: string): Promise<Sft | SftWithToken | Nft | NftWithToken | null> {
        try {
            return await this.metaplex.nfts().findByMint({ mintAddress: new PublicKey(mint) }).run();
        } catch (e: any) {
            console.log(`Error retrieving NFT info from Metaplex ${mint} ${e}`);
            return null;
        }
    }

    async updateMetadata(nft: Sft | SftWithToken | Nft | NftWithToken, metadata: string) : Promise<boolean> {
        try {
            const updateInstructionData = toInstructionData(nft, {
                uri: metadata,
                nftOrSft: nft,
            });

            const tx = createUpdateMetadataAccountV2Instruction(
                {
                    metadata: findMetadataPda(nft.address),
                    updateAuthority: this.metaplex.identity().publicKey,
                },
                {
                    updateMetadataAccountArgsV2: updateInstructionData,
                }
            )

            const transaction = new Transaction().add(tx);
            const blockHash = await this.connection.getLatestBlockhash();
            transaction.feePayer = this.wallet.publicKey;
            transaction.recentBlockhash = blockHash.blockhash;

            const res = await sendAndConfirmTransaction(this.connection, transaction, [this.wallet]); // RETURN THE TRANSACTION HASH

            // SAVE THE TRANSACTION HASH TO THE DATABASE THROUGHT THE API

            console.log(res);
              
            return true;
        } catch (e: any) {
            console.log(`Cannot update NFT metadata ${nft} ${e}`);
            return false;
        }
    }
}