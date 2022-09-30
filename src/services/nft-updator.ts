import { NftToProcess } from "../models/nft-to-process";
import { MetaplexService } from "./metaplex-service";
import { NftsService } from "./nfts-service";

export class NftUpdator {
    private metaplexService: MetaplexService;
    private nftsService: NftsService;
    private processing: string[];

    constructor(nftsService: NftsService) {
        this.metaplexService = new MetaplexService();
        this.nftsService = nftsService;
        this.processing = [];
    }

    async processNftList(nftList: NftToProcess[]) : Promise<{ nft: NftToProcess; processed: boolean; }[]> {
        return await Promise.all(nftList.map((nft: NftToProcess) => this.updateNftMetadata(nft)));
    }

    async updateNftMetadata(nft: NftToProcess) : Promise<{nft: NftToProcess, processed: boolean}> {
        try {
            if (this.processing.includes(nft.mint)) {
                return { nft, processed: false };
            }

            this.processing.push(nft.mint);

            if (!nft || !nft.mint || !nft.metadata) {
                console.log(`${new Date().toLocaleString()} - Missing information in order to process the NFT ${nft.mint}`);
                await this.nftsService.addNftLog(nft.collectionId, nft.mint, 'none', `Missing information in order to process the NFT ${nft.mint} upgrade`);
                await this.nftsService.updateNftStatus(nft.collectionId, nft.mint, 'none');
                this.processing = this.processing.filter((mint: string) => mint !== nft.mint);
                return { nft, processed: false };
            }

            const metaplexNft = await this.metaplexService.getNft(nft.mint);
            
            if (!metaplexNft || metaplexNft === null || !nft.metadata) {
                console.log(`${new Date().toLocaleString()} - Metadata cannot be found for ${nft.mint}`);
                await this.nftsService.addNftLog(nft.collectionId, nft.mint, 'none', `Metadata cannot be found for ${nft.mint}`);
                await this.nftsService.updateNftStatus(nft.collectionId, nft.mint, 'none');
                this.processing = this.processing.filter((mint: string) => mint !== nft.mint);
                return { nft, processed: false };
            }
    
            if (metaplexNft.uri === nft.metadata) {
                console.log(`${new Date().toLocaleString()} - ${new Date().toLocaleString()} - Metadata already updated ${nft.mint}`);
                await this.nftsService.addNftLog(nft.collectionId, nft.mint, 'upgraded', `Metadata already updated ${nft.mint}`);
                await this.nftsService.updateNftStatus(nft.collectionId, nft.mint, 'upgraded');
                this.processing = this.processing.filter((mint: string) => mint !== nft.mint);
                return { nft, processed: false };
            }

            console.log(`${new Date().toLocaleString()} - Updating ${nft.mint}...`);
    
            const updateTransaction = await this.metaplexService.updateMetadata(metaplexNft, nft.metadata);

            if (!updateTransaction) {
                await this.nftsService.addNftLog(nft.collectionId, nft.mint, 'none', `Update metadata failed for ${nft.mint}`);
                await this.nftsService.updateNftStatus(nft.collectionId, nft.mint, 'none');
                this.processing = this.processing.filter((mint: string) => mint !== nft.mint);
                return { nft, processed: false };
            }

            console.log(`${new Date().toLocaleString()} - ${nft.mint} updated!`);

            await this.nftsService.addNftLog(nft.collectionId, nft.mint, 'upgrading', `Upgrading metadata for ${nft.mint}`);
            await this.nftsService.updateNftStatus(nft.collectionId, nft.mint, 'upgrading', updateTransaction);

            this.processing = this.processing.filter((mint: string) => mint !== nft.mint);

            return { nft, processed: true};
        } catch (e: any) {
            console.log(`${new Date().toLocaleString()} - Something went wrong when updating the metadata ${nft.mint} ${e}`);
            await this.nftsService.addNftLog(nft.collectionId, nft.mint, 'none', `Something went wrong when updating the metadata ${nft.mint} ${e}`);
            await this.nftsService.updateNftStatus(nft.collectionId, nft.mint, 'none');
            this.processing = this.processing.filter((mint: string) => mint !== nft.mint);
            return { nft, processed: false };
        }
    }
}