"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserProfile, SkillNode, DomainType, ActivityEntry, PeerAttestation } from "./types";
import { MOCK_USER_PROFILE, INITIAL_SKILLS, TOIBA_PROFILE, ALEX_PROFILE, ELENA_PROFILE } from "./data/seedData";
import { sound } from "./sound";

interface ChaosRunState {
  isRunning: boolean;
  skillId: string | null;
  scenarioId: string | null;
  progress: number; // 0-100
  logBuffer: string[];
  result: "pass" | "fail" | null;
}

interface AppContextType {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  availablePersonas: UserProfile[];
  switchPersona: (username: string) => void;
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
  isHumaneLedgerOpen: boolean;
  setIsHumaneLedgerOpen: (open: boolean) => void;
  isRecruiterFastTrackOpen: boolean;
  setIsRecruiterFastTrackOpen: (open: boolean) => void;
  isBlindEvaluationMode: boolean;
  setIsBlindEvaluationMode: (mode: boolean) => void;
  toggleBlindEvaluationMode: () => void;
  isHumaneTheme: boolean;
  setIsHumaneTheme: (theme: boolean) => void;
  toggleHumaneTheme: () => void;
  radarMode: "systems" | "humane";
  setRadarMode: (mode: "systems" | "humane") => void;
  addNewSkillAttestation: (skill: SkillNode) => void;
  addPeerVoucher: (voucher: PeerAttestation) => void;
  resetToDefaultData: () => void;
  chaosRun: ChaosRunState;
  startChaosRun: (skillId: string, scenarioId: string, durationMs?: number) => void;
  claimMastery: (skillId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(TOIBA_PROFILE);
  const [selectedSkill, setSelectedSkillState] = useState<SkillNode | null>(null);
  const [domainFilter, setDomainFilterState] = useState<DomainType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [soundMuted, setSoundMutedState] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isAttestModalOpen, setIsAttestModalOpen] = useState(false);
  const [isHumaneLedgerOpen, setIsHumaneLedgerOpen] = useState(false);
  const [isRecruiterFastTrackOpen, setIsRecruiterFastTrackOpen] = useState(false);
  const [isBlindEvaluationMode, setIsBlindEvaluationModeState] = useState(false);
  const [isHumaneTheme, setIsHumaneThemeState] = useState(false);
  const [radarMode, setRadarModeState] = useState<"systems" | "humane">("systems");

  const [chaosRun, setChaosRun] = useState<ChaosRunState>({
    isRunning: false,
    skillId: null,
    scenarioId: null,
    progress: 0,
    logBuffer: [],
    result: null,
  });

  const availablePersonas: UserProfile[] = [TOIBA_PROFILE, ALEX_PROFILE, ELENA_PROFILE];

  // Restore persisted state
  useEffect(() => {
    try {
      const savedMute = localStorage.getItem("meritos_sound_muted");
      if (savedMute !== null) {
        const isMuted = savedMute === "true";
        setSoundMutedState(isMuted);
        sound.setMuted(isMuted);
      }
      const savedPersona = localStorage.getItem("meritos_active_persona");
      if (savedPersona) {
        const found = [TOIBA_PROFILE, ALEX_PROFILE, ELENA_PROFILE].find(p => p.username === savedPersona);
        if (found) setProfile(found);
      }
    } catch {}
  }, []);

  const switchPersona = useCallback((username: string) => {
    const found = availablePersonas.find(p => p.username === username);
    if (!found) return;
    sound.playClick(800);
    setProfile(found);
    setSelectedSkillState(null);
    try { localStorage.setItem("meritos_active_persona", username); } catch {}
  }, []);

  const setSelectedSkill = (skill: SkillNode | null) => {
    if (skill) sound.playSelect();
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
    try { localStorage.setItem("meritos_sound_muted", String(next)); } catch {}
    if (!next) sound.playClick(1000);
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

      const xpGained = newSkill.xp;
      let newXp = prev.xp + xpGained;
      let newLevel = prev.level;
      let newNextLevelXp = prev.nextLevelXp;
      if (newXp >= newNextLevelXp) {
        newLevel += 1;
        newXp = newXp - newNextLevelXp;
        newNextLevelXp = Math.floor(newNextLevelXp * 1.35);
        sound.playLevelUp();
      }

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

      return {
        ...prev,
        skills: updatedSkills,
        totalVerifiedSkills: updatedSkills.filter(s => s.status === "verified").length,
        verificationScore: Math.min(99.9, +(prev.verificationScore + 0.2).toFixed(1)),
        xp: newXp,
        level: newLevel,
        nextLevelXp: newNextLevelXp,
        activityLedger: [newActivity, ...prev.activityLedger],
      };
    });
  };

  const claimMastery = (skillId: string) => {
    sound.playVerifiedChime();
    setProfile(prev => {
      const updatedSkills = prev.skills.map(s => {
        if (s.id === skillId) {
          return { ...s, masteryCount: (s.masteryCount || 0) + 1, freshnessPercentage: 100 };
        }
        return s;
      });
      const masteryActivity: ActivityEntry = {
        id: `act-mastery-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: "mastery_claimed",
        skillId,
        skillName: prev.skills.find(s => s.id === skillId)?.label || skillId,
        domain: prev.skills.find(s => s.id === skillId)?.domain || "systems",
        status: "verified",
        receiptHash: `0x${Math.random().toString(16).substring(2, 18)}`,
        blockHeight: 894500 + Math.floor(Math.random() * 1000),
      };
      return {
        ...prev,
        skills: updatedSkills,
        activityLedger: [masteryActivity, ...prev.activityLedger],
      };
    });
  };

  const startChaosRun = useCallback((skillId: string, scenarioId: string, durationMs = 4000) => {
    sound.playChaosRumble();
    const skill = profile.skills.find(s => s.id === skillId);
    const scenario = skill?.evidence.chaosScenarios?.find(c => c.id === scenarioId);
    if (!scenario) return;

    setChaosRun({ isRunning: true, skillId, scenarioId, progress: 0, logBuffer: [], result: null });

    const logs = scenario.terminalLogs;
    const stepInterval = durationMs / Math.max(logs.length, 1);

    logs.forEach((log, idx) => {
      setTimeout(() => {
        sound.playTerminalTick();
        setChaosRun(prev => ({
          ...prev,
          progress: Math.round(((idx + 1) / logs.length) * 100),
          logBuffer: [...prev.logBuffer, log.text],
        }));
        if (idx === logs.length - 1) {
          setTimeout(() => {
            setChaosRun(prev => ({ ...prev, isRunning: false, result: "pass" }));
            sound.playVerifiedChime();
            setProfile(prev => {
              const chaosActivity: ActivityEntry = {
                id: `act-chaos-${Date.now()}`,
                timestamp: new Date().toISOString(),
                type: "chaos_simulated",
                skillId,
                skillName: skill?.label || skillId,
                domain: skill?.domain || "systems",
                status: "verified",
                receiptHash: `0x${Math.random().toString(16).substring(2, 18)}`,
                blockHeight: 894500 + Math.floor(Math.random() * 1000),
              };
              return { ...prev, activityLedger: [chaosActivity, ...prev.activityLedger] };
            });
          }, 600);
        }
      }, stepInterval * idx);
    });
  }, [profile.skills]);

  const toggleBlindEvaluationMode = () => {
    sound.playWarmNote(440);
    setIsBlindEvaluationModeState(prev => !prev);
  };

  const toggleHumaneTheme = () => {
    sound.playHumaneChime();
    setIsHumaneThemeState(prev => !prev);
  };

  const setRadarMode = (mode: "systems" | "humane") => {
    if (mode === "humane") sound.playHumaneChime();
    else sound.playClick(900);
    setRadarModeState(mode);
  };

  const addPeerVoucher = (voucher: PeerAttestation) => {
    sound.playHumaneChime();
    setProfile(prev => {
      const newActivity: ActivityEntry = {
        id: `act-peer-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: "peer_voucher_signed",
        skillId: "peer-mentorship",
        skillName: `${voucher.voucherName} (${voucher.relationship})`,
        domain: "systems",
        status: "verified",
        receiptHash: voucher.signature.substring(0, 16),
        blockHeight: 894600 + Math.floor(Math.random() * 50),
      };

      return {
        ...prev,
        peerAttestations: [voucher, ...prev.peerAttestations],
        activityLedger: [newActivity, ...prev.activityLedger],
        verificationScore: Math.min(99.9, +(prev.verificationScore + 0.1).toFixed(1)),
        xp: prev.xp + 350,
      };
    });
  };

  const resetToDefaultData = () => {
    try { localStorage.removeItem("meritos_profile_v1"); } catch {}
    setProfile(TOIBA_PROFILE);
    sound.playClick(600);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        availablePersonas,
        switchPersona,
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
        isHumaneLedgerOpen,
        setIsHumaneLedgerOpen,
        isRecruiterFastTrackOpen,
        setIsRecruiterFastTrackOpen,
        isBlindEvaluationMode,
        setIsBlindEvaluationMode: setIsBlindEvaluationModeState,
        toggleBlindEvaluationMode,
        isHumaneTheme,
        setIsHumaneTheme: setIsHumaneThemeState,
        toggleHumaneTheme,
        radarMode,
        setRadarMode,
        addNewSkillAttestation,
        addPeerVoucher,
        resetToDefaultData,
        chaosRun,
        startChaosRun,
        claimMastery,
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
