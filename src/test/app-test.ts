import assert from 'assert';
import { SolanaMetaUpdater } from '../app';
  
describe("Solana-Meta-Updator", () => {
  let mainProgram: SolanaMetaUpdater;

  before(async () => {
    
  });
  
  after(async () => {

  });
      
  describe( "One time instance", () => {
    beforeEach(() => {
      mainProgram = new SolanaMetaUpdater('once');
    });

    after(async () => {
      await mainProgram.stopProcess();
    });
      
    it("Schedule Jobs equal 0", () => {
      const jobs = mainProgram.getProcessStatus();
      assert.equal(jobs, 0);
    });
  
    it("Schedule Jobs equal 0", async () => {
      await mainProgram.stopProcess();
      const jobs = mainProgram.getProcessStatus();
      assert.equal(jobs, 0);
    });
  });

  describe( "Schedule instance", () => {
    beforeEach(() => {
      mainProgram = new SolanaMetaUpdater('schedule', 5000);
    });

    after(async () => {
      await mainProgram.stopProcess();
    });
      
    it("Schedule Jobs equal 1", () => {
      const jobs = mainProgram.getProcessStatus();
      assert.equal(jobs, 1);
    });
  
    it("Schedule Jobs equal 0", async () => {
      await mainProgram.stopProcess();
      const jobs = mainProgram.getProcessStatus();
      assert.equal(jobs, 0);
    });
  });

});