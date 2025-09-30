import { Translation, Language } from '../types';

export const translations: Translation = {
  'civic_catalyst': {
    en: 'Civic Catalyst',
    hi: 'नागरिक उत्प्रेरक',
    gu: 'નાગરિક ઉત્પ્રેરક'
  },
  'tagline': {
    en: 'Empowering Citizens, Transforming Cities',
    hi: 'नागरिकों को सशक्त बनाना, शहरों को बदलना',
    gu: 'નાગરિકોને સશક્ત બનાવવું, શહેરોનું પરિવર્તન'
  },
  'report_issue': {
    en: 'Report Issue',
    hi: 'समस्या रिपोर्ट करें',
    gu: 'સમસ્યા જણાવો'
  },
  'view_map': {
    en: 'View Map',
    hi: 'मैप देखें',
    gu: 'નકશો જુઓ'
  },
  'dashboard': {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    gu: 'ડેશબોર્ડ'
  },
  'about': {
    en: 'About',
    hi: 'के बारे में',
    gu: 'વિશે'
  },
  'issue_title': {
    en: 'Issue Title',
    hi: 'समस्या शीर्षक',
    gu: 'સમસ્યાનું શીર્ષક'
  },
  'description': {
    en: 'Description',
    hi: 'विवरण',
    gu: 'વર્ણન'
  },
  'category': {
    en: 'Category',
    hi: 'श्रेणी',
    gu: 'વર્ગ'
  },
  'location': {
    en: 'Location',
    hi: 'स्थान',
    gu: 'સ્થાન'
  },
  'submit': {
    en: 'Submit',
    hi: 'जमा करें',
    gu: 'સબમિટ કરો'
  },
  'anonymous': {
    en: 'Report Anonymously',
    hi: 'गुमनाम रिपोर्ट करें',
    gu: 'અજ્ઞાત રીપોર્ટ કરો'
  },
  'voice_input': {
    en: 'Use Voice Input',
    hi: 'आवाज़ इनपुट का उपयोग करें',
    gu: 'અવાજ ઇનપુટનો ઉપયોગ કરો'
  },
  'status_submitted': {
    en: 'Submitted',
    hi: 'जमा किया गया',
    gu: 'સબમિટ કર્યું'
  },
  'status_acknowledged': {
    en: 'Acknowledged',
    hi: 'स्वीकृत',
    gu: 'સ્વીકૃત'
  },
  'status_assigned': {
    en: 'Assigned',
    hi: 'आवंटित',
    gu: 'સોંપેલ'
  },
  'status_resolved': {
    en: 'Resolved',
    hi: 'हल किया गया',
    gu: 'હલ કર્યું'
  }
};

export const useTranslation = (language: Language) => {
  return (key: string): string => {
    return translations[key]?.[language] || key;
  };
};