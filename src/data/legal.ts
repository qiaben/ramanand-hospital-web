/**
 * DRAFT legal text for Ramanand Hospital's approval. Not legal advice.
 * Must be reviewed by the hospital (and ideally its legal adviser) before launch.
 * Hindi is our translation and also needs review.
 */
import type { L } from "@/lib/i18n";

type Section = { h: L; p: L };

export const privacy: { title: L; intro: L; sections: Section[] } = {
  title: { en: "Privacy notice", hi: "गोपनीयता सूचना" },
  intro: {
    en: "This notice explains how Ramanand Hospital handles the personal information you share on this website, in line with the Digital Personal Data Protection Act, 2023.",
    hi: "यह सूचना बताती है कि रामानंद हॉस्पिटल इस वेबसाइट पर आपके द्वारा दी गई व्यक्तिगत जानकारी को डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 के अनुरूप कैसे संभालता है।",
  },
  sections: [
    {
      h: { en: "Who we are", hi: "हम कौन हैं" },
      p: {
        en: "Ramanand Hospital, an individual proprietorship, Sonipat-Narela Road, Akbarpur Barota, Sonipat, Haryana 131103. Phone: 74044 77208. Email: ramanandhosp@gmail.com.",
        hi: "रामानंद हॉस्पिटल, एक व्यक्तिगत स्वामित्व (प्रोप्राइटरशिप), सोनीपत-नरेला रोड, अकबरपुर बरोटा, सोनीपत, हरियाणा 131103। फ़ोन: 74044 77208। ईमेल: ramanandhosp@gmail.com।",
      },
    },
    {
      h: { en: "What we collect", hi: "हम क्या जानकारी लेते हैं" },
      p: {
        en: "When you request an appointment: your name, mobile number, age, gender, email (optional), preferred doctor, date and time, and an optional reason for visit. When you send an enquiry: your name, mobile number and message.",
        hi: "अपॉइंटमेंट के अनुरोध पर: आपका नाम, मोबाइल नंबर, आयु, लिंग, ईमेल (वैकल्पिक), पसंदीदा डॉक्टर, तारीख और समय, तथा आने का कारण (वैकल्पिक)। पूछताछ भेजने पर: आपका नाम, मोबाइल नंबर और संदेश।",
      },
    },
    {
      h: { en: "Why we collect it", hi: "हम इसे क्यों लेते हैं" },
      p: {
        en: "Only to contact you about your appointment request or enquiry, and to arrange your visit. We do not sell your information and we do not use it for advertising.",
        hi: "केवल आपके अपॉइंटमेंट अनुरोध या पूछताछ के बारे में आपसे संपर्क करने और आपकी विज़िट की व्यवस्था करने के लिए। हम आपकी जानकारी बेचते नहीं हैं और विज्ञापन के लिए उपयोग नहीं करते।",
      },
    },
    {
      h: { en: "Who can see it", hi: "इसे कौन देख सकता है" },
      p: {
        en: "Hospital staff who handle appointments and enquiries. [To be confirmed by the hospital: any service providers, such as SMS, email or hosting providers, that process this information on our behalf.]",
        hi: "अपॉइंटमेंट और पूछताछ संभालने वाले अस्पताल कर्मी। [अस्पताल द्वारा पुष्टि की जानी है: कोई सेवा प्रदाता, जैसे SMS, ईमेल या होस्टिंग प्रदाता, जो हमारी ओर से यह जानकारी प्रोसेस करते हों।]",
      },
    },
    {
      h: { en: "How long we keep it", hi: "हम इसे कितने समय रखते हैं" },
      p: {
        en: "[To be confirmed by the hospital.]",
        hi: "[अस्पताल द्वारा पुष्टि की जानी है।]",
      },
    },
    {
      h: { en: "Your rights", hi: "आपके अधिकार" },
      p: {
        en: "You may ask us to show you the information we hold about you, correct it, or delete it, and you may withdraw your consent at any time. Please contact the Grievance Officer below.",
        hi: "आप हमसे अपनी जानकारी देखने, सुधारने या हटाने का अनुरोध कर सकते हैं, और किसी भी समय अपनी सहमति वापस ले सकते हैं। कृपया नीचे दिए शिकायत अधिकारी से संपर्क करें।",
      },
    },
    {
      h: { en: "Children", hi: "बच्चे" },
      p: {
        en: "For patients under 18, a parent or guardian should submit the request and give consent.",
        hi: "18 वर्ष से कम आयु के रोगियों के लिए अनुरोध और सहमति माता-पिता या अभिभावक द्वारा दी जानी चाहिए।",
      },
    },
    {
      h: { en: "Security", hi: "सुरक्षा" },
      p: {
        en: "We take reasonable steps to protect your information. Please do not send detailed medical history or reports through the website forms.",
        hi: "हम आपकी जानकारी की सुरक्षा के लिए उचित कदम उठाते हैं। कृपया वेबसाइट फ़ॉर्म के माध्यम से विस्तृत चिकित्सा इतिहास या रिपोर्ट न भेजें।",
      },
    },
    {
      h: { en: "Grievance Officer", hi: "शिकायत अधिकारी" },
      p: {
        en: "Dr. Arun Kumar · 74044 77208 · ramanandhosp@gmail.com",
        hi: "डॉ. अरुण कुमार · 74044 77208 · ramanandhosp@gmail.com",
      },
    },
  ],
};

export const disclaimer: { title: L; intro: L; sections: Section[] } = {
  title: { en: "Medical disclaimer", hi: "चिकित्सा अस्वीकरण" },
  intro: {
    en: "Please read this before relying on any information on this website.",
    hi: "कृपया इस वेबसाइट की किसी भी जानकारी पर भरोसा करने से पहले इसे पढ़ें।",
  },
  sections: [
    {
      h: { en: "General information only", hi: "केवल सामान्य जानकारी" },
      p: {
        en: "Content on this website is for general information. It is not medical advice and does not replace a consultation with a qualified doctor.",
        hi: "इस वेबसाइट की सामग्री सामान्य जानकारी के लिए है। यह चिकित्सा सलाह नहीं है और योग्य डॉक्टर के परामर्श का विकल्प नहीं है।",
      },
    },
    {
      h: { en: "Emergencies", hi: "आपात स्थिति" },
      p: {
        en: "Do not use the website forms in an emergency. Call the national emergency number 112 or the hospital on 74044 77208.",
        hi: "आपात स्थिति में वेबसाइट फ़ॉर्म का उपयोग न करें। राष्ट्रीय आपातकालीन नंबर 112 या अस्पताल को 74044 77208 पर कॉल करें।",
      },
    },
    {
      h: { en: "Appointment requests", hi: "अपॉइंटमेंट अनुरोध" },
      p: {
        en: "Submitting a request does not confirm an appointment. Your appointment is confirmed only when our team contacts you. No payment is taken on this website.",
        hi: "अनुरोध भेजने से अपॉइंटमेंट पक्का नहीं होता। आपका अपॉइंटमेंट तभी पक्का माना जाएगा जब हमारी टीम आपसे संपर्क करे। इस वेबसाइट पर कोई भुगतान नहीं लिया जाता।",
      },
    },
    {
      h: { en: "Accuracy", hi: "सटीकता" },
      p: {
        en: "We try to keep information accurate and up to date, but timings, doctors and services may change. Please call to confirm before you visit.",
        hi: "हम जानकारी को सटीक और अद्यतन रखने का प्रयास करते हैं, परंतु समय, डॉक्टर और सेवाएँ बदल सकती हैं। आने से पहले कृपया कॉल करके पुष्टि कर लें।",
      },
    },
  ],
};
