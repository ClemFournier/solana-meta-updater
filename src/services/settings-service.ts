import { Settings } from "../models/project-settings";

require('dotenv').config({path:'./config/.env'});

export class SettingsService {
    private environment: string | undefined;
    constructor() {
        this.environment = process.env.API_ADDRESS;

        if (!this.environment) {
            throw('Enviromenent variables incorrect for SettingsService');
        }
    }

    async getSettings(projectId: string, collectionId: string): Promise<Settings> {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId, collectionId })
        };
    
        return fetch(`${this.environment}get-settings`, requestOptions)
               .then(response => response.json());
    }
}