import axios from 'axios';
import { NftToProcess } from '../models/nft-to-process';

export class NftRetriever {
    constructor() {}

    async getNftsToProcess() : Promise<NftToProcess[] | null> {
        try {
            const isProcessActive = true; // GET PROCESS STATUS FROM API

            if (!isProcessActive) return null;

            const nftsToProcess : NftToProcess[] = []; // GET NFTS TO PROCESS FROM API

            if (!nftsToProcess || nftsToProcess.length === 0) return null;

            return nftsToProcess;
        } catch (e: any) {
            console.log(`Error retriving the NFTs to process ${e}`);

            return null;
        }
    }
}