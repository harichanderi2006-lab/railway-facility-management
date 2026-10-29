// ─────────────────────────────────────────────────────────────
// Authentic Indian Railways Station Announcement & Audio System
// Synthesizes the iconic 4-note station chime using Web Audio API
// and speaks authentic trilingual railway announcements (Hindi, Tamil, English)
// Fully compatible across all OS, with native & phonetic engines for Tamil & Hindi
// ─────────────────────────────────────────────────────────────

// Track cached voices reliably across Chrome, Edge, Safari, Firefox
let cachedVoices = [];

function refreshVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = refreshVoices;
  refreshVoices();
}

export function getAvailableVoices() {
  if (cachedVoices.length === 0) {
    refreshVoices();
  }
  return cachedVoices;
}

// Check if system has a native Tamil voice
export function hasNativeTamilVoice() {
  const voices = getAvailableVoices();
  return voices.some(
    (v) => (v.lang && /ta|tamil/i.test(v.lang)) || /tamil|தமிழ்/i.test(v.name)
  );
}

// Check if system has a native Hindi voice
export function hasNativeHindiVoice() {
  const voices = getAvailableVoices();
  return voices.some(
    (v) => (v.lang && /hi|hindi/i.test(v.lang)) || /hindi|हिन्दी|हिंदी/i.test(v.name)
  );
}

// Hindi name mappings for trains
export const HINDI_TRAIN_NAMES = {
  '12804': 'सुपरफास्ट स्वर्ण जयंती एक्सप्रेस',
  '12695': 'चेन्नई त्रिवेंद्रम सुपरफास्ट एक्सप्रेस',
  '12163': 'चेन्नई दादर सुपरफास्ट एक्सप्रेस',
  '22653': 'वंदे भारत एक्सप्रेस',
  '12621': 'तमिलनाडु एक्सप्रेस',
  '22625': 'चेन्नई बेंगलुरु डबल डेकर एक्सप्रेस',
  '12842': 'कोरोमंडल एक्सप्रेस',
  '43001': 'चेन्नई सेंट्रल अरक्कोणम फास्ट लोकल',
};

// Tamil name mappings for trains
export const TAMIL_TRAIN_NAMES = {
  '12804': 'சொர்ண ஜெயந்தி சூப்பர்ஃபாஸ்ட் எக்ஸ்பிரஸ்',
  '12695': 'சென்னை திருவனந்தபுரம் சூப்பர்பாஸ்ட் எக்ஸ்பிரஸ்',
  '12163': 'சென்னை தாதர் சூப்பர்பாஸ்ட் எக்ஸ்பிரஸ்',
  '22653': 'வந்தே பாரத் எக்ஸ்பிரஸ்',
  '12621': 'தமிழ்நாடு எக்ஸ்பிரஸ்',
  '22625': 'டபுள் டெக்கர் எக்ஸ்பிரஸ்',
  '12842': 'கோரமண்டல் எக்ஸ்பிரஸ்',
  '43001': 'சென்னை சென்ட்ரல் அரக்கோணம் புறநகர் ரயில்',
};

// Phonetic Tamil name mappings for systems without native Tamil speech pack
export const PHONETIC_TAMIL_TRAIN_NAMES = {
  '12804': 'Swarna Jayanti Superfast Express',
  '12695': 'Chennai Trivandrum Superfast Express',
  '12163': 'Chennai Dadar Superfast Express',
  '22653': 'Vande Bharat Express',
  '12621': 'Tamil Nadu Express',
  '22625': 'Double Decker Express',
  '12842': 'Coromandel Express',
  '43001': 'Chennai Central Arakkonam Suburban Fast Local',
};

// Extract just the platform number digit
export function extractPlatformNumber(platformStr) {
  if (!platformStr) return '1';
  const match = platformStr.match(/\d+/);
  return match ? match[0] : '1';
}

// ── 1. Web Audio API: Iconic Indian Railways Announcement Chime ────────
// Classic 4-note melodic chime: D5 (587Hz) -> F#5 (740Hz) -> A5 (880Hz) -> D6 (1175Hz)
// with acoustic station concourse reverb
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playRailwayChime() {
  return new Promise((resolve) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) {
        resolve();
        return;
      }

      const now = ctx.currentTime;

      // Master output gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.35, now);

      // Create station concourse reverb / echo delay
      const delay = ctx.createDelay();
      delay.delayTime.setValueAtTime(0.18, now); // 180ms station echo
      const feedback = ctx.createGain();
      feedback.gain.setValueAtTime(0.25, now); // gentle decay
      delay.connect(feedback);
      feedback.connect(delay);

      masterGain.connect(ctx.destination);
      masterGain.connect(delay);
      delay.connect(ctx.destination);

      // 4 Chime notes (D5, F#5, A5, D6)
      const notes = [
        { freq: 587.33, start: 0.0, duration: 0.55 }, // D5
        { freq: 739.99, start: 0.32, duration: 0.55 }, // F#5
        { freq: 880.00, start: 0.64, duration: 0.55 }, // A5
        { freq: 1174.66, start: 0.96, duration: 0.85 }, // D6 (longer resonant tail)
      ];

      notes.forEach((n) => {
        const noteStart = now + n.start;
        const noteEnd = noteStart + n.duration;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(n.freq, noteStart);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(n.freq * 2.01, noteStart); // metallic harmonic shimmer

        noteGain.gain.setValueAtTime(0.0001, noteStart);
        noteGain.gain.linearRampToValueAtTime(0.8, noteStart + 0.015);
        noteGain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

        osc1.connect(noteGain);
        osc2.connect(noteGain);
        noteGain.connect(masterGain);

        osc1.start(noteStart);
        osc2.start(noteStart);
        osc1.stop(noteEnd + 0.05);
        osc2.stop(noteEnd + 0.05);
      });

      // Total chime duration is ~1.85s before speech begins
      setTimeout(() => {
        resolve();
      }, 1850);
    } catch (err) {
      console.warn('Web Audio chime not supported or blocked:', err);
      resolve();
    }
  });
}

// Format train number with spaced digits for crystal-clear PA enunciation
export function formatSpacedDigits(numStr) {
  if (!numStr) return '';
  return numStr.toString().split('').join(' ');
}

// ── 2. Announcement Text Generators ───────────────────────────────────

// Hindi (Exact authentic Indian Railways format requested by user)
export function getHindiAnnouncement(train) {
  const rawNo = train.trainNumber || '12804';
  const trainNoSpaced = formatSpacedDigits(rawNo);
  const pf = extractPlatformNumber(train.platform);
  const trainName = HINDI_TRAIN_NAMES[rawNo] || train.hindiName || train.trainName;

  if (train.status === 'DELAYED' && train.delayMinutes > 0) {
    return `यात्री, कृपया ध्यान दें। गाड़ी क्रमांक ${trainNoSpaced}, ${trainName}, अपने निर्धारित समय से ${train.delayMinutes} मिनट की देरी से चल रही है। अब यह प्लेटफॉर्म क्रमांक ${pf} पर आ रही है। असुविधा के लिए हमें खेद है।`;
  }

  if (train.type === 'departure') {
    return `यात्री, कृपया ध्यान दें। गाड़ी क्रमांक ${trainNoSpaced}, ${trainName}, थोड़ी ही देर में प्लेटफॉर्म क्रमांक ${pf} से रवाना हो रही है।`;
  }

  // Default arrival (Exact format requested)
  return `यात्री, कृपया ध्यान दें। गाड़ी क्रमांक ${trainNoSpaced}, ${trainName}, थोड़ी ही देर में प्लेटफॉर्म क्रमांक ${pf} पर आ रही है।`;
}

// Phonetic Hindi (For systems where native Hindi TTS voice is not installed)
export function getPhoneticHindiAnnouncement(train) {
  const rawNo = train.trainNumber || '12804';
  const trainNoSpaced = formatSpacedDigits(rawNo);
  const pf = extractPlatformNumber(train.platform);
  const trainName = train.trainName || 'Swarna Jayanti Express';

  if (train.status === 'DELAYED' && train.delayMinutes > 0) {
    return `Yatri, kripya dhyan dein. Gaadi number ${trainNoSpaced}, ${trainName}, apne nirdharit samay se ${train.delayMinutes} minute ki deri se chal rahi hai. Ab yeh platform number ${pf} par aa rahi hai. Asuvidha ke liye hamein khed hai.`;
  }

  if (train.type === 'departure') {
    return `Yatri, kripya dhyan dein. Gaadi number ${trainNoSpaced}, ${trainName}, thodi hi der mein platform number ${pf} se ravana ho rahi hai.`;
  }

  return `Yatri, kripya dhyan dein. Gaadi number ${trainNoSpaced}, ${trainName}, thodi hi der mein platform number ${pf} par aa rahi hai.`;
}

// Tamil (Traditional Chennai Central announcement)
export function getTamilAnnouncement(train) {
  const rawNo = train.trainNumber || '12804';
  const trainNoSpaced = formatSpacedDigits(rawNo);
  const pf = extractPlatformNumber(train.platform);
  const trainName = TAMIL_TRAIN_NAMES[rawNo] || train.trainName;

  if (train.status === 'DELAYED' && train.delayMinutes > 0) {
    return `பயணிகள் கவனிக்கவும். வண்டி எண் ${trainNoSpaced}, ${trainName}, ${train.delayMinutes} நிமிடம் தாமதமாக நடைமேடை எண் ${pf}-ல் வந்து சேரும்.`;
  }

  if (train.type === 'departure') {
    return `பயணிகள் கவனிக்கவும். வண்டி எண் ${trainNoSpaced}, ${trainName}, நடைமேடை எண் ${pf}-லிருந்து சிறிது நேரத்தில் புறப்பட தயாராக உள்ளது.`;
  }

  return `பயணிகள் கவனிக்கவும். வண்டி எண் ${trainNoSpaced}, ${trainName}, இன்னும் சற்று நேரத்தில் நடைமேடை எண் ${pf}-ல் வந்து சேரும்.`;
}

// Phonetic Tamil (Tuned for maximum clarity and natural Tamil phonetics on any English/Indian voice)
export function getPhoneticTamilAnnouncement(train) {
  const rawNo = train.trainNumber || '12804';
  const trainNoSpaced = formatSpacedDigits(rawNo);
  const pf = extractPlatformNumber(train.platform);
  const trainName = PHONETIC_TAMIL_TRAIN_NAMES[rawNo] || train.trainName;

  if (train.status === 'DELAYED' && train.delayMinutes > 0) {
    return `Payanigal, kavanikkavum. Vandi en, ${trainNoSpaced}, ${trainName}, ${train.delayMinutes} nimidam thaamadhamaaga, platform en ${pf} il, vandhu sayrum. Sramathirkku varunthugiroam.`;
  }

  if (train.type === 'departure') {
    return `Payanigal, kavanikkavum. Vandi en, ${trainNoSpaced}, ${trainName}, platform en ${pf} ilirundhu, purappada thayaaraaga ulladhu.`;
  }

  return `Payanigal, kavanikkavum. Vandi en, ${trainNoSpaced}, ${trainName}, innum satru nerathil, platform en ${pf} il, vandhu sayrum.`;
}

// English (Standard Indian Railways PA format)
export function getEnglishAnnouncement(train) {
  const rawNo = train.trainNumber || '12804';
  const trainNoSpaced = formatSpacedDigits(rawNo);
  const pf = extractPlatformNumber(train.platform);
  const trainName = train.trainName;

  if (train.status === 'DELAYED' && train.delayMinutes > 0) {
    return `May I have your attention please. Train number ${trainNoSpaced}, ${trainName}, is running late by ${train.delayMinutes} minutes. It will now arrive on platform number ${pf}. Inconvenience caused is deeply regretted.`;
  }

  if (train.type === 'departure') {
    return `May I have your attention please. Train number ${trainNoSpaced}, ${trainName}, is scheduled to depart shortly from platform number ${pf}.`;
  }

  return `May I have your attention please. Train number ${trainNoSpaced}, ${trainName}, is arriving shortly on platform number ${pf}.`;
}

// ── 3. High-Precision Voice Matcher (Male vs Female & Language) ────────
export function findBestVoice(lang = 'hi', gender = 'female') {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  const isFemale = gender === 'female';

  // Specific regex filters for female & male voice identification
  const femalePattern = /female|zira|swara|priya|kalpana|geeta|heera|samantha|victoria|karen|susan|hazel|cortana|woman|aria|veena/i;
  const malePattern = /male|david|mark|hemant|ravi|george|guy|alex|daniel|oliver|man|eric|stefan|prakash/i;

  // 1. Try matching preferred language + preferred gender
  const targetPrefix = lang === 'hi' ? 'hi' : lang === 'ta' ? 'ta' : 'en';
  const langVoices = voices.filter(
    (v) => v.lang && v.lang.toLowerCase().startsWith(targetPrefix)
  );

  if (langVoices.length > 0) {
    if (isFemale) {
      const match = langVoices.find((v) => femalePattern.test(v.name));
      if (match) return match;
    } else {
      const match = langVoices.find((v) => malePattern.test(v.name));
      if (match) return match;
    }
    // If only one voice for that language, return it
    return langVoices[0];
  }

  // 2. Cross-language gender match (e.g. Microsoft Zira for Female, Microsoft David for Male)
  if (isFemale) {
    // Check Indian English female voices first (Google Hindi, Priya, Swara, Heera)
    const indianFemale = voices.find(
      (v) => /en-in|hi-in/i.test(v.lang) && femalePattern.test(v.name)
    );
    if (indianFemale) return indianFemale;

    const anyFemale = voices.find((v) => femalePattern.test(v.name));
    if (anyFemale) return anyFemale;
  } else {
    // Check Indian English male voices first (Ravi, Hemant)
    const indianMale = voices.find(
      (v) => /en-in|hi-in/i.test(v.lang) && malePattern.test(v.name)
    );
    if (indianMale) return indianMale;

    const anyMale = voices.find((v) => malePattern.test(v.name));
    if (anyMale) return anyMale;
  }

  // 3. Fallback to default
  return voices[0] || null;
}

// Get speech parameters ensuring dramatic, immediate contrast between Female and Male
export function getSpeechProfile(gender = 'female') {
  if (gender === 'female') {
    return {
      pitch: 1.18, // Melodious, natural, clear female railway announcer voice
      rate: 0.88,  // Crisp, natural cadence
    };
  }
  return {
    pitch: 0.70, // Deep, resonant, authoritative baritone male announcer
    rate: 0.82,  // Authoritative, measured railway cadence
  };
}

// ── 4. Main Announce Function with Chime + Voice ──────────────────────
export async function playStationAnnouncement({
  train,
  language = 'hindi', // 'hindi' | 'tamil' | 'english' | 'trilingual'
  gender = 'female',
  withChime = true,
  onStart = null,
  onEnd = null,
}) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser');
    return;
  }

  // Resume context if suspended
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
  window.speechSynthesis.cancel(); // cancel any pending audio

  if (onStart) onStart();

  // 1. Play authentic station chime first
  if (withChime) {
    await playRailwayChime();
  }

  refreshVoices();
  const hasTamil = hasNativeTamilVoice();
  const hasHindi = hasNativeHindiVoice();
  const profile = getSpeechProfile(gender);

  // 2. Prepare announcement text sequence
  const queue = [];

  // HINDI
  if (language === 'hindi' || language === 'trilingual') {
    if (hasHindi) {
      queue.push({
        text: getHindiAnnouncement(train),
        langCode: 'hi-IN',
        voiceLang: 'hi',
        rate: profile.rate,
        pitch: profile.pitch,
      });
    } else {
      // High-compatibility phonetic Hindi (works on any voice!)
      queue.push({
        text: getPhoneticHindiAnnouncement(train),
        langCode: 'en-IN',
        voiceLang: 'en',
        rate: profile.rate,
        pitch: profile.pitch,
      });
    }
  }

  // ENGLISH
  if (language === 'english' || language === 'trilingual') {
    queue.push({
      text: getEnglishAnnouncement(train),
      langCode: 'en-IN',
      voiceLang: 'en',
      rate: profile.rate,
      pitch: profile.pitch,
    });
  }

  // TAMIL
  if (language === 'tamil' || language === 'trilingual') {
    if (hasTamil) {
      queue.push({
        text: getTamilAnnouncement(train),
        langCode: 'ta-IN',
        voiceLang: 'ta',
        rate: profile.rate,
        pitch: profile.pitch,
      });
    } else {
      // High-compatibility phonetic Tamil (Never silent, works on every computer!)
      queue.push({
        text: getPhoneticTamilAnnouncement(train),
        langCode: 'en-IN',
        voiceLang: 'en',
        rate: profile.rate,
        pitch: profile.pitch,
      });
    }
  }

  // Fallback if queue somehow empty
  if (queue.length === 0) {
    queue.push({
      text: getEnglishAnnouncement(train),
      langCode: 'en-IN',
      voiceLang: 'en',
      rate: profile.rate,
      pitch: profile.pitch,
    });
  }

  // Execute sequence sequentially
  let index = 0;

  function speakNext() {
    if (index >= queue.length) {
      if (onEnd) onEnd();
      return;
    }

    const item = queue[index];
    index++;

    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = item.langCode;
    utterance.rate = item.rate;
    utterance.pitch = item.pitch;

    const matchedVoice = findBestVoice(item.voiceLang, gender);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      if (index < queue.length) {
        setTimeout(speakNext, 500); // 500ms pause between language announcements
      } else {
        if (onEnd) onEnd();
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech utterance encountered event:', e);
      // If error occurred (e.g. interrupted), proceed to next or finish
      if (index < queue.length) {
        speakNext();
      } else {
        if (onEnd) onEnd();
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  speakNext();
}
