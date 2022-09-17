import assert from 'assert';
import { MetaplexService } from '../services/metaplex-service';

require('dotenv').config({path:'../config/.env'});
  
describe("Metaplex Services", () => {
    let metaplexService: MetaplexService;

  before(async () => {
    metaplexService = new MetaplexService();
  });
  
  after(async () => {

  });
      
  describe("Update Metadata", () => {
    beforeEach(() => {
      
    });

    after(async () => {
      
    });
      
    it("Update NFT", async () => {
        if (!process.env.TEST_MINT || !process.env.TEST_METADATA) {
          assert.fail('Parameters wrong');
        }
        const metaplexNft = await metaplexService.getNft(process.env.TEST_MINT);

        if (metaplexNft === null) {
            assert.fail(`Couldn't get NFT from Metaplex`);
        } 

        const updatedNft = await metaplexService.updateMetadata(metaplexNft, process.env.TEST_METADATA);

        assert.equal(updatedNft, true);
    }).timeout(30000);
  });

});