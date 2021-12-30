import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { createContext, useMemo } from "react";
import { Provider, Program } from "@project-serum/anchor";
import idl from "../idl.json";

export const WorkspaceContext = createContext();
const preflightCommitment = "processed";
const commitment = "processed";
const programID = new PublicKey(idl.metadata.address);
//const connection = new Connection("http://127.0.0.1:8899", commitment);
const connection = new Connection("https://api.devnet.solana.com", commitment);

export function WorkspaceProvider(props) {
  const wallet = useAnchorWallet();

  const provider = useMemo(() => {
    return new Provider(connection, wallet, {
      preflightCommitment,
      commitment,
    });
  }, [wallet]);

  const program = useMemo(() => {
    console.log("Idl: ", idl);
    console.log("ProgramId:", programID.toBase58());
    console.log("Provider:", provider);
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
