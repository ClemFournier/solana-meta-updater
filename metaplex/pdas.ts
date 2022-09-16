import { Pda, TokenMetadataProgram } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";

/** @group Pdas */
export const findMetadataPda = (
    mint: PublicKey,
    programId: PublicKey = TokenMetadataProgram.publicKey
  ): Pda => {
    return Pda.find(programId, [
      Buffer.from('metadata', 'utf8'),
      programId.toBuffer(),
      mint.toBuffer(),
    ]);
  };