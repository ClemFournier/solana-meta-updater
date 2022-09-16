import * as web3 from '@solana/web3.js';
import * as beet from '@metaplex-foundation/beet';
import * as beetSolana from '@metaplex-foundation/beet-solana';

export enum UseMethod {
    Burn,
    Multiple,
    Single,
  }

export type Creator = {
    address: web3.PublicKey;
    verified: boolean;
    share: number;
  };

export type Collection = {
    verified: boolean;
    key: web3.PublicKey;
  };

export type Uses = {
    useMethod: UseMethod;
    remaining: beet.bignum;
    total: beet.bignum;
  };

export type DataV2 = {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: beet.COption<Creator[]>;
    collection: beet.COption<Collection>;
    uses: beet.COption<Uses>;
  };

export type UpdateMetadataAccountArgsV2 = {
    data: beet.COption<DataV2>;
    updateAuthority: beet.COption<web3.PublicKey>;
    primarySaleHappened: beet.COption<boolean>;
    isMutable: beet.COption<boolean>;
  };

/**
 * @category Instructions
 * @category UpdateMetadataAccountV2
 * @category generated
 */
 export type UpdateMetadataAccountV2InstructionArgs = {
    updateMetadataAccountArgsV2: UpdateMetadataAccountArgsV2;
  };

/**
 * Accounts required by the _UpdateMetadataAccountV2_ instruction
 *
 * @property [_writable_] metadata Metadata account
 * @property [**signer**] updateAuthority Update authority key
 * @category Instructions
 * @category UpdateMetadataAccountV2
 * @category generated
 */
 export type UpdateMetadataAccountV2InstructionAccounts = {
    metadata: web3.PublicKey;
    updateAuthority: web3.PublicKey;
  };

/**
 * @category userTypes
 * @category generated
 */
 export const creatorBeet = new beet.BeetArgsStruct<Creator>(
    [
      ['address', beetSolana.publicKey],
      ['verified', beet.bool],
      ['share', beet.u8],
    ],
    'Creator',
  );

/**
 * @category userTypes
 * @category generated
 */
 export const collectionBeet = new beet.BeetArgsStruct<Collection>(
    [
      ['verified', beet.bool],
      ['key', beetSolana.publicKey],
    ],
    'Collection',
  );

/**
 * @category userTypes
 * @category generated
 */
 export const useMethodBeet = beet.fixedScalarEnum(UseMethod) as beet.FixedSizeBeet<
 UseMethod,
 UseMethod
>;

/**
 * @category userTypes
 * @category generated
 */
 export const usesBeet = new beet.BeetArgsStruct<Uses>(
    [
      ['useMethod', useMethodBeet],
      ['remaining', beet.u64],
      ['total', beet.u64],
    ],
    'Uses',
  );

/**
 * @category userTypes
 * @category generated
 */
 export const dataV2Beet = new beet.FixableBeetArgsStruct<DataV2>(
    [
      ['name', beet.utf8String],
      ['symbol', beet.utf8String],
      ['uri', beet.utf8String],
      ['sellerFeeBasisPoints', beet.u16],
      ['creators', beet.coption(beet.array(creatorBeet))],
      ['collection', beet.coption(collectionBeet)],
      ['uses', beet.coption(usesBeet)],
    ],
    'DataV2',
  );

/**
 * @category userTypes
 * @category generated
 */
 export const updateMetadataAccountArgsV2Beet =
 new beet.FixableBeetArgsStruct<UpdateMetadataAccountArgsV2>(
   [
     ['data', beet.coption(dataV2Beet)],
     ['updateAuthority', beet.coption(beetSolana.publicKey)],
     ['primarySaleHappened', beet.coption(beet.bool)],
     ['isMutable', beet.coption(beet.bool)],
   ],
   'UpdateMetadataAccountArgsV2',
 );

/**
 * @category Instructions
 * @category UpdateMetadataAccountV2
 * @category generated
 */
 export const UpdateMetadataAccountV2Struct = new beet.FixableBeetArgsStruct<
 UpdateMetadataAccountV2InstructionArgs & {
   instructionDiscriminator: number;
 }
>(
 [
   ['instructionDiscriminator', beet.u8],
   ['updateMetadataAccountArgsV2', updateMetadataAccountArgsV2Beet],
 ],
 'UpdateMetadataAccountV2InstructionArgs',
);

export const updateMetadataAccountV2InstructionDiscriminator = 15;

/**
 * Creates a _UpdateMetadataAccountV2_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category UpdateMetadataAccountV2
 * @category generated
 */
export function createUpdateMetadataAccountV2Instruction(
    accounts: UpdateMetadataAccountV2InstructionAccounts,
    args: UpdateMetadataAccountV2InstructionArgs,
    programId = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
  ) {
    const [data] = UpdateMetadataAccountV2Struct.serialize({
      instructionDiscriminator: updateMetadataAccountV2InstructionDiscriminator,
      ...args,
    });
    const keys: web3.AccountMeta[] = [
      {
        pubkey: accounts.metadata,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: accounts.updateAuthority,
        isWritable: false,
        isSigner: true,
      },
    ];
  
    const ix = new web3.TransactionInstruction({
      programId,
      keys,
      data,
    });
    return ix;
  }