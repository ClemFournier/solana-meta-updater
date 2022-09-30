import { NftToProcess } from '../models/nft-to-process';
import { NftsService } from './nfts-service';

export class NftRetriever {
    private nftsService: NftsService;

    constructor(nftsService: NftsService) {
        this.nftsService = nftsService;
    }

    async getNftsToProcess(collectionId: string) : Promise<NftToProcess[] | null> {
        try {
            const nftsToProcess : NftToProcess[] = await this.nftsService.getNftsToProcess(collectionId);

            if (!nftsToProcess || nftsToProcess.length === 0) return null;

            return nftsToProcess;
        } catch (e: any) {
            console.log(`${new Date().toLocaleString()} - Error retriving the NFTs to process ${e}`);

            return null;
        }
    }
}