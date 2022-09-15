import { Pda } from "@metaplex-foundation/js";

export interface NftToProcess {
    mint: string;
    metadataToUpdate: Pda;
    updateToken: string; // USE TO UPDATE THE STATUS OF THE NFT LATER THROUGH THE API
}