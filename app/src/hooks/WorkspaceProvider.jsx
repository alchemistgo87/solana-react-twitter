import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { createContext, useMemo } from "react";
import { Provider, Program } from "@project-serum/anchor";
import idl from "../idl/solana_twitter.json";

export const WorkspaceContext = createContext();

export function WorkspaceProvider(props) {
  const preflightCommitment = "processed";
  const commitment = "processed";
  const programID = new PublicKey(idl.metadata.address);
  const wallet = useAnchorWallet();
  //const connection = new Connection("http://127.0.0.1:8899", commitment);
  const connection = new Connection(
    "https://api.devnet.solana.com",
    commitment
  );
  const provider = useMemo(() => {
    return new Provider(connection, wallet, {
      preflightCommitment,
      commitment,
    });
  }, [wallet]);

  const program = useMemo(() => {
    return new Program(idl, programID, provider);
  }, [provider]);

  return (
    <WorkspaceContext.Provider
      value={{
        wallet,
        connection,
        provider,
        program,
      }}
    >
      {props.children}
    </WorkspaceContext.Provider>
  );
}
