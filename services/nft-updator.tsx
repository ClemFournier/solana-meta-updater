import { NftToProcess } from "../models/nft-to-process";
import { MetaplexService } from "./metaplex-service";
import { SolanaService } from "./solana-service";

export class NftUpdator {
    private solanaService: SolanaService;
    private metaplexService: MetaplexService;

    constructor() {
        this.solanaService = new SolanaService();
        this.metaplexService = new MetaplexService();
    }

    async processNftList(nftList: NftToProcess[]) : Promise<NftToProcess[]> {
        const errors = [];

        nftList.forEach((nft: NftToProcess) => {
            if (!nft || !nft.mint || !nft.metadataToUpdate) {
                console.log(`Missing information in order to process the NFT ${nft}`);
                errors.push(nft);
                return;
            }
            this.updateNftMetadata(nft);
        });

        return errors;
    }

    async updateNftMetadata(nft: NftToProcess) {
        const metaplexNft = await this.metaplexService.getNft(nft.mint);
        
        if (metaplexNft.metadataAddress === nft.metadataToUpdate) {
            console.log(`Metadata already updated ${nft.mint}`);
            // UPDATE NFT THROUGH API TO CHANGE THE STATUS TO PROCESSED
            return;
        }

        const updateResponse = await this.solanaService.updateMetadata(metaplexNft);
    }
}