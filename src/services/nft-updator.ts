import { NftToProcess } from "../models/nft-to-process";
import { MetaplexService } from "./metaplex-service";

export class NftUpdator {
    private metaplexService: MetaplexService;

    constructor() {
        this.metaplexService = new MetaplexService();
    }

    async processNftList(nftList: NftToProcess[]) : Promise<{errors: NftToProcess[], processing: NftToProcess[]}> {
        const errors: NftToProcess[] = [];
        const processing: NftToProcess[] = [];

        nftList.forEach((nft: NftToProcess) => {
            if (!nft || !nft.mint || !nft.metadataToUpdate) {
                console.log(`Missing information in order to process the NFT ${nft.mint}`);
                errors.push(nft);
                return;
            }
            this.updateNftMetadata(nft);
            processing.push(nft);
        });

        return { errors, processing };
    }

    async updateNftMetadata(nft: NftToProcess) : Promise<NftToProcess | null> {
        try {
            const metaplexNft = await this.metaplexService.getNft(nft.mint);
            
            if (!metaplexNft || metaplexNft === null || !nft.metadataToUpdate) {
                console.log(`Metadata cannot be found for ${nft.mint}`);
                return null;
            }
    
            if (metaplexNft.uri === nft.metadataToUpdate) {
                console.log(`Metadata already updated ${nft.mint}`);
                // UPDATE NFT THROUGH API TO CHANGE THE STATUS TO PROCESSED
                return nft;
            }
    
            const updateResponse = await this.metaplexService.updateMetadata(metaplexNft, nft.metadataToUpdate);

            return updateResponse ? nft : null;
        } catch (e: any) {
            console.log(`Something went wrong when updating the metadata ${nft.mint} ${e}`);
            return null;
        }
    }
}