import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import {
  getPhantomWallet,
  getSolflareWallet,
} from "@solana/wallet-adapter-wallets";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { WorkspaceProvider } from "./hooks/WorkspaceProvider";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

// Day.js
import dayjs from "dayjs";
import { MainLayout } from "./components/MainLayout";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

function App() {
  const wallets = [getPhantomWallet(), getSolflareWallet()];

  return (
    <Router>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WorkspaceProvider>
          <div className="w-full max-w-3xl lg:max-w-4xl mx-auto">
            <div className="fixed w-20 md:w-64 py-4 md:py-8 md:pl-4 md:pr-8">
              <Sidebar />
            </div>
            <main className="flex-1 border-r border-l ml-20 md:ml-64 min-h-screen">
              <MainLayout />
            </main>
          </div>
        </WorkspaceProvider>
      </WalletProvider>
    </Router>
  );
}

export default App;
