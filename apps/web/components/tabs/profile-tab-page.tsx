"use client";

import { motion } from "framer-motion";
import { useAccount } from "wagmi";

import { PageHeader } from "@/components/layout/page-header";
import { ProfileDetailsTab } from "@/components/profile/profile-details-tab";
import { ProfileInterviewsTab } from "@/components/profile/profile-interviews-tab";
import { ProfileTabBar } from "@/components/profile/profile-tab-bar";
import { ProfileWalletTab } from "@/components/profile/profile-wallet-tab";
import { useProfile } from "@/components/providers/profile-provider";
import { WalletGate } from "@/components/wallet/wallet-gate";
import { ProfileSubTab } from "@/lib/profile-tabs";

export function ProfileTabPage() {
  const { isConnected } = useAccount();
  const { profileSubTab, setProfileSubTab } = useProfile();

  return (
    <div className="iqlify-grid-bg px-4 py-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <PageHeader
          eyebrow="Identity"
          title="Profile"
          description={
            isConnected
              ? "Manage your identity, wallet, and interview history in one place."
              : "Connect your wallet to manage your profile and interview history."
          }
        />

        {!isConnected ? (
          <WalletGate
            title="Connect your wallet"
            description="Link a Monad wallet to create your profile and track interviews."
          />
        ) : (
          <>
            <ProfileTabBar
              activeTab={profileSubTab}
              onTabChange={setProfileSubTab}
            />
            <motion.div
              key={profileSubTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {profileSubTab === ProfileSubTab.Details && <ProfileDetailsTab />}
              {profileSubTab === ProfileSubTab.Wallet && <ProfileWalletTab />}
              {profileSubTab === ProfileSubTab.Interviews && (
                <ProfileInterviewsTab />
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
