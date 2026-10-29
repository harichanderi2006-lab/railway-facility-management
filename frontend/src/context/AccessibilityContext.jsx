import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  playRailwayChime,
  playStationAnnouncement,
  findBestVoice,
  getSpeechProfile,
  hasNativeTamilVoice,
  hasNativeHindiVoice,
} from '../utils/railwayAudio';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  // 1. High Contrast mode
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('railway_high_contrast') === 'true';
  });

  // 2. Large Text mode
  const [largeText, setLargeText] = useState(() => {
    return localStorage.getItem('railway_large_text') === 'true';
  });

  // 3. Screen Reader / Voice Assistance mode
  const [screenReaderMode, setScreenReaderMode] = useState(() => {
    return localStorage.getItem('railway_screen_reader') === 'true';
  });

  // 4. Railway Audio Announcement Settings
  // Language: 'hindi' (default as requested!), 'tamil', 'english', 'trilingual'
  const [announcementLang, setAnnouncementLang] = useState(() => {
    return localStorage.getItem('railway_announcement_lang') || 'hindi';
  });

  // Voice Gender: 'female' (authentic Indian Railways female announcer) or 'male'
  const [voiceGender, setVoiceGender] = useState(() => {
    return localStorage.getItem('railway_voice_gender') || 'female';
  });

  // Iconic Station Chime enabled
  const [chimeEnabled, setChimeEnabled] = useState(() => {
    const val = localStorage.getItem('railway_chime_enabled');
    return val !== null ? val === 'true' : true;
  });

  // Announcement active indicator (for audio visualizer / waves)
  const [isAnnouncing, setIsAnnouncing] = useState(false);

  // Apply high contrast class to document body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('railway_high_contrast', highContrast);
  }, [highContrast]);

  // Apply large text class to document body
  useEffect(() => {
    if (largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
    localStorage.setItem('railway_large_text', largeText);
  }, [largeText]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('railway_screen_reader', screenReaderMode);
  }, [screenReaderMode]);

  useEffect(() => {
    localStorage.setItem('railway_announcement_lang', announcementLang);
  }, [announcementLang]);

  useEffect(() => {
    localStorage.setItem('railway_voice_gender', voiceGender);
  }, [voiceGender]);

  useEffect(() => {
    localStorage.setItem('railway_chime_enabled', chimeEnabled);
  }, [chimeEnabled]);

  // General Speech synthesis utility for accessibility feedback
  const speak = (text, lang = 'en') => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const profile = getSpeechProfile(voiceGender);

      // Check if text has Devanagari (Hindi) or Tamil characters
      const isHindi = /[\u0900-\u097F]/.test(text) || lang === 'hi';
      const isTamil = /[\u0B80-\u0BFF]/.test(text) || lang === 'ta';

      if (isHindi && hasNativeHindiVoice()) {
        utterance.lang = 'hi-IN';
        const voice = findBestVoice('hi', voiceGender);
        if (voice) utterance.voice = voice;
      } else if (isTamil && hasNativeTamilVoice()) {
        utterance.lang = 'ta-IN';
        const voice = findBestVoice('ta', voiceGender);
        if (voice) utterance.voice = voice;
      } else {
        utterance.lang = 'en-IN';
        const voice = findBestVoice('en', voiceGender);
        if (voice) utterance.voice = voice;
      }

      utterance.rate = profile.rate;
      utterance.pitch = profile.pitch;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis not available or blocked:', err);
    }
  };

  // Play Railway station chime independently
  const playChime = async () => {
    setIsAnnouncing(true);
    await playRailwayChime();
    setIsAnnouncing(false);
  };

  // Announce a train with chime + selected language & gender
  const announceRailwayTrain = async (train, langOverride = null, genderOverride = null) => {
    if (!train) return;
    await playStationAnnouncement({
      train,
      language: langOverride || announcementLang,
      gender: genderOverride || voiceGender,
      withChime: chimeEnabled,
      onStart: () => setIsAnnouncing(true),
      onEnd: () => setIsAnnouncing(false),
    });
  };

  // Test the user's exact requested phrase:
  // "यात्री, कृपया ध्यान दें। गाड़ी क्रमांक 12804 सुपरफास्ट स्वर्ण जयंती एक्सप्रेस थोड़ी ही देर में प्लेटफॉर्म क्रमांक 3 पर आ रही है।"
  const testSampleAnnouncement = async (lang = null, gender = null) => {
    const sampleTrain = {
      trainNumber: '12804',
      trainName: 'Swarna Jayanti Superfast Express',
      hindiName: 'सुपरफास्ट स्वर्ण जयंती एक्सप्रेस',
      platform: 'Platform 3',
      status: 'ON_TIME',
      type: 'arrival',
    };
    await announceRailwayTrain(sampleTrain, lang || announcementLang, gender || voiceGender);
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      if (screenReaderMode) {
        speak(next ? 'High contrast mode enabled' : 'High contrast mode disabled');
      }
      return next;
    });
  };

  const toggleLargeText = () => {
    setLargeText((prev) => {
      const next = !prev;
      if (screenReaderMode) {
        speak(next ? 'Large font size activated' : 'Standard font size restored');
      }
      return next;
    });
  };

  const toggleScreenReader = () => {
    setScreenReaderMode((prev) => {
      const next = !prev;
      if (next) {
        speak('Voice guidance and screen assistance enabled');
      }
      return next;
    });
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast,
        largeText,
        toggleLargeText,
        screenReaderMode,
        toggleScreenReader,
        speak,
        // Railway Audio Announcer
        announcementLang,
        setAnnouncementLang,
        voiceGender,
        setVoiceGender,
        chimeEnabled,
        setChimeEnabled,
        isAnnouncing,
        playChime,
        announceRailwayTrain,
        testSampleAnnouncement,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
