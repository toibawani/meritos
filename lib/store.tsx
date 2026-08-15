"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, SkillNode, DomainType, ActivityEntry } from "./types";
import { MOCK_USER_PROFILE, INITIAL_SKILLS, INITIAL_ACTIVITY_LEDGER } from "./data/seedData";
import { sound } from "./sound";

interface AppContextType {
  profile: UserProfile;
  selectedSkill: SkillNode | null;
  setSelectedSkill: (skill: SkillNode | null) => void;
  domainFilter: DomainType | "all";
  setDomainFilter: (domain: DomainType | "all") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  soundMuted: boolean;
  setSoundMuted: (muted: boolean) => void;
  toggleSound: () => void;
  isDossierOpen: boolean;
  setIsDossierOpen: (open: boolean) => void;
  isBadgeModalOpen: boolean;
  setIsBadgeModalOpen: (open: boolean) => void;
  isAttestModalOpen: boolean;
  setIsAttestModalOpen: (open: boolean) => void;
  addNewSkillAttestation: (skill: SkillNode) => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [selectedSkill, setSelectedSkillState] = useState<SkillNode | null>(null);
  const [domainFilter, setDomainFilterState] = useState<DomainType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [soundMuted, setSoundMutedState] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isAttestModalOpen, setIsAttestModalOpen] = useState(false);

  // Load persisted state if available
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("meritos_profile_v1");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
      }
      const savedMute = localStorage.getItem("meritos_sound_muted");
      if (savedMute !== null) {
        const isMuted = savedMute === "true";
        setSoundMutedState(isMuted);
        sound.setMuted(isMuted);
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  const setSelectedSkill = (skill: SkillNode | null) => {
    if (skill) {
      sound.playSelect();
    }
    setSelectedSkillState(skill);
  };

  const setDomainFilter = (domain: DomainType | "all") => {
    sound.playClick(900);
    setDomainFilterState(domain);
  };

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMutedState(next);
    sound.setMuted(next);
    try {
      localStorage.setItem("meritos_sound_muted", String(next));
    } catch {}
    if (!next) {
      sound.playClick(1000);
    }
  };

  const addNewSkillAttestation = (newSkill: SkillNode) => {
    sound.playVerifiedChime();
    setProfile((prev) => {
      const existingIdx = prev.skills.findIndex((s) => s.id === newSkill.id);
      let updatedSkills = [...prev.skills];
      if (existingIdx >= 0) {
        updatedSkills[existingIdx] = newSkill;
      } else {
        updatedSkills.push(newSkill);
      }

      const totalXp = updatedSkills.reduce((acc, s) => acc + s.xp, 0);
      const verifiedCount = updatedSkills.filter((s) => s.status === "verified").length;

      const newActivity: ActivityEntry = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: "attestation_signed",
        skillId: newSkill.id,
        skillName: newSkill.label,
        domain: newSkill.domain,
        status: "verified",
        receiptHash: newSkill.proofReceipt?.proof.signatureValue?.substring(0, 16) || "0x9f8a...23ef",
        blockHeight: 894500 + Math.floor(Math.random() * 100),
      };

      const updatedProfile: UserProfile = {
        ...prev,
        skills: updatedSkills,
        totalVerifiedSkills: verifiedCount,
        verificationScore: Math.min(99.9, +(prev.verificationScore + 0.2).toFixed(1)),
        activityLedger: [newActivity, ...prev.activityLedger],
      };

      try {
        localStorage.setItem("meritos_profile_v1", JSON.stringify(updatedProfile));
      } catch {}

      return updatedProfile;
    });
  };

  const resetToDefaultData = () => {
    try {
      localStorage.removeItem("meritos_profile_v1");
    } catch {}
    setProfile(MOCK_USER_PROFILE);
    sound.playClick(600);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        selectedSkill,
        setSelectedSkill,
        domainFilter,
        setDomainFilter,
        searchQuery,
        setSearchQuery,
        soundMuted,
        setSoundMuted: setSoundMutedState,
        toggleSound,
        isDossierOpen,
        setIsDossierOpen,
        isBadgeModalOpen,
        setIsBadgeModalOpen,
        isAttestModalOpen,
        setIsAttestModalOpen,
        addNewSkillAttestation,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
