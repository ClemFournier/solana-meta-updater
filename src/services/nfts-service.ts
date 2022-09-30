import { NftToProcess } from "../models/nft-to-process";

require('dotenv').config({path:'./config/.env'});

export class NftsService {
    private environment: string | undefined;
    constructor() {
        this.environment = process.env.API_ADDRESS;

        if (!this.environment) {
            throw('Enviromenent variables incorrect for NftsService');
        }
    }

    async getNftsToProcess(collectionId: string): Promise<NftToProcess[]> {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collectionId })
            };
        
            return fetch(`${this.environment}mints/get-nfts-to-process`, requestOptions)
                   .then(response => response.json());
        } catch (e: any) {
            console.log(`Error getNftsToProcess ${e}`);
            return [];
        }
    }

    async updateNftStatus(collectionId: string, mint: string, status: string, transaction?: string): Promise<NftToProcess[]> {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collectionId, mint, status, transaction })
            };
        
            return fetch(`${this.environment}mints/update-nft-status`, requestOptions)
                   .then(response => response.json());
        } catch (e: any) {
            console.log(`Error updateNftStatus ${e}`);
            return [];
        }
    }

    async addNftLog(collectionId: string, mint: string, status: string, message?: string, transaction?: string): Promise<NftToProcess[]> {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collectionId, mint, status, message, transaction })
            };
        
            return fetch(`${this.environment}nft-logs/add-nft-log`, requestOptions)
                   .then(response => response.json());
        } catch (e: any) {
            console.log(`Error addNftLog ${e}`);
            return [];
        }
    }
}