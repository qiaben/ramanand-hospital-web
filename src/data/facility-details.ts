/**
 * Detail pages for each facility. Everything here comes from facts the hospital supplied
 * (5 day-care beds, the lab's Microbiology / Biochemistry / Hematology / ECG, the on-site pharmacy and
 * its pharmacist, lab and pharmacy hours of 10 AM to 10 PM) or is plain explanatory wording. Nothing about
 * prices or test lists is invented: where the hospital has not supplied something, the page says so and
 * points to the phone number. Day Care hours have not been supplied, so none are shown for it.
 * Hindi text is our translation and needs the hospital's review.
 */
import type { L, LL } from "@/lib/i18n";

export type FacilityDetail = {
  intro: LL;
  facts: { k: L; v: L }[];
  offersTitle: L;
  offers: { h: L; t: L }[];
  goodToKnow: L[];
};

export const facilityDetails: Record<string, FacilityDetail> = {
  daycare: {
    intro: {
      en: [
        "Our Day Care unit has 5 beds for patients who need treatment or close observation during the day and do not need to stay overnight.",
        "It sits alongside our OPD, laboratory and pharmacy, so a patient can be seen, tested and given medicines under one roof.",
      ],
      hi: [
        "हमारी डे-केयर इकाई में 5 बिस्तर हैं, उन रोगियों के लिए जिन्हें दिन के समय उपचार या निकट निगरानी की ज़रूरत होती है और जिन्हें रात भर रुकने की आवश्यकता नहीं होती।",
        "यह हमारी ओपीडी, प्रयोगशाला और फार्मेसी के साथ ही है, इसलिए रोगी को एक ही छत के नीचे दिखाया, जाँचा और दवा दी जा सकती है।",
      ],
    },
    facts: [
      { k: { en: "Beds", hi: "बिस्तर" }, v: { en: "5", hi: "5" } },
      { k: { en: "Supported by", hi: "सहयोग" }, v: { en: "Laboratory and pharmacy on site", hi: "परिसर में प्रयोगशाला और फार्मेसी" } },
    ],
    offersTitle: { en: "What you will find in Day Care", hi: "डे केयर में आपको क्या मिलेगा" },
    offers: [
      {
        h: { en: "5 day-care beds", hi: "5 डे-केयर बिस्तर" },
        t: { en: "Beds for patients who need treatment or observation during the day.", hi: "दिन के समय उपचार या निगरानी की ज़रूरत वाले रोगियों के लिए बिस्तर।" },
      },
      {
        h: { en: "Observation with vital-sign monitoring", hi: "वाइटल साइन मॉनिटरिंग के साथ निगरानी" },
        t: { en: "Patient observation beds with vital-sign monitoring, as part of our General Practice department.", hi: "हमारे जनरल प्रैक्टिस विभाग के अंतर्गत वाइटल साइन मॉनिटरिंग वाले रोगी निगरानी बिस्तर।" },
      },
      {
        h: { en: "Tests and medicines close by", hi: "जाँच और दवाइयाँ पास में" },
        t: { en: "Our in-house laboratory and pharmacy are under the same roof, so care is not interrupted.", hi: "हमारी इन-हाउस प्रयोगशाला और फार्मेसी एक ही छत के नीचे हैं, इसलिए देखभाल में रुकावट नहीं आती।" },
      },
      {
        h: { en: "Clear communication", hi: "स्पष्ट संवाद" },
        t: { en: "Our team explains the plan of care, in line with our commitment to transparency and patient safety.", hi: "हमारी टीम पारदर्शिता और रोगी सुरक्षा की हमारी प्रतिबद्धता के अनुरूप उपचार की योजना समझाती है।" },
      },
    ],
    goodToKnow: [
      { en: "Day care is meant for care that does not need an overnight stay.", hi: "डे केयर उस देखभाल के लिए है जिसमें रात भर रुकने की आवश्यकता नहीं होती।" },
      { en: "To arrange a day-care visit, request an appointment or call 74044 77208. The team will guide you on timing and what to bring.", hi: "डे-केयर के लिए अपॉइंटमेंट का अनुरोध करें या 74044 77208 पर कॉल करें। टीम आपको समय और साथ लाने वाली चीज़ों के बारे में बताएगी।" },
      { en: "In an emergency, call 112 or 74044 77208 straight away. Do not wait for an appointment.", hi: "आपातकाल में तुरंत 112 या 74044 77208 पर कॉल करें। अपॉइंटमेंट का इंतज़ार न करें।" },
    ],
  },

  lab: {
    intro: {
      en: [
        "Our in-house clinical laboratory covers Microbiology, Biochemistry and Hematology, and we also offer ECG.",
        "Having the laboratory inside the hospital means your doctor can order the tests you need and you can have them done without going to another centre.",
      ],
      hi: [
        "हमारी इन-हाउस नैदानिक प्रयोगशाला में माइक्रोबायोलॉजी, बायोकेमिस्ट्री और हेमेटोलॉजी की जाँचें होती हैं, और साथ में ECG की सुविधा भी है।",
        "प्रयोगशाला अस्पताल के भीतर होने का मतलब है कि आपके डॉक्टर ज़रूरी जाँच लिख सकते हैं और आप उन्हें किसी दूसरे केंद्र पर जाए बिना करवा सकते हैं।",
      ],
    },
    facts: [
      { k: { en: "Test areas", hi: "जाँच के क्षेत्र" }, v: { en: "Microbiology · Biochemistry · Hematology · ECG", hi: "माइक्रोबायोलॉजी · बायोकेमिस्ट्री · हेमेटोलॉजी · ECG" } },
      { k: { en: "Opening hours", hi: "खुलने का समय" }, v: { en: "10 AM to 10 PM", hi: "सुबह 10 बजे से रात 10 बजे" } },
      { k: { en: "Type", hi: "प्रकार" }, v: { en: "In-house clinical laboratory", hi: "इन-हाउस नैदानिक प्रयोगशाला" } },
    ],
    offersTitle: { en: "What our laboratory covers", hi: "हमारी प्रयोगशाला में क्या होता है" },
    offers: [
      {
        h: { en: "Microbiology", hi: "माइक्रोबायोलॉजी" },
        t: { en: "Tests that help find infections and the germs that cause them.", hi: "ऐसी जाँचें जो संक्रमण और उसके कारक कीटाणुओं का पता लगाने में मदद करती हैं।" },
      },
      {
        h: { en: "Biochemistry", hi: "बायोकेमिस्ट्री" },
        t: { en: "Tests on blood and body fluids that show how the body's organs and chemistry are working.", hi: "रक्त और शरीर के तरल पदार्थों की जाँचें जो दिखाती हैं कि शरीर के अंग और रसायन कैसे काम कर रहे हैं।" },
      },
      {
        h: { en: "Hematology", hi: "हेमेटोलॉजी" },
        t: { en: "Blood tests that look at your blood cells and help your doctor understand your overall health.", hi: "रक्त की जाँचें जो आपकी रक्त कोशिकाओं को देखती हैं और डॉक्टर को आपके समग्र स्वास्थ्य को समझने में मदद करती हैं।" },
      },
      {
        h: { en: "ECG", hi: "ECG" },
        t: { en: "A quick, painless recording of the heart's electrical activity.", hi: "हृदय की विद्युत गतिविधि की तेज़ और दर्द-रहित रिकॉर्डिंग।" },
      },
    ],
    goodToKnow: [
      { en: "Your doctor will tell you which tests you need. You do not have to decide this on your own.", hi: "आपको कौन-सी जाँच चाहिए, यह आपके डॉक्टर बताएँगे। यह आपको खुद तय करने की ज़रूरत नहीं है।" },
      { en: "The complete list of tests is being prepared. To check whether a particular test is available, call 74044 77208.", hi: "जाँचों की पूरी सूची तैयार की जा रही है। किसी विशेष जाँच की उपलब्धता जानने के लिए 74044 77208 पर कॉल करें।" },
      { en: "Ask our staff if you have any question about how to prepare for a test.", hi: "किसी जाँच की तैयारी के बारे में कोई प्रश्न हो तो हमारे स्टाफ से पूछें।" },
    ],
  },

  pharmacy: {
    intro: {
      en: [
        "Ramanand Hospital has its own pharmacy on site, run by our pharmacist, Mr. Hritik Pal.",
        "After your consultation you can collect your prescribed medicines at the hospital itself, and ask the pharmacist if you are unsure about anything.",
      ],
      hi: [
        "रामानंद हॉस्पिटल की अपनी फार्मेसी परिसर में ही है, जिसे हमारे फार्मासिस्ट श्री हृतिक पाल संभालते हैं।",
        "परामर्श के बाद आप अपनी लिखी हुई दवाइयाँ अस्पताल में ही ले सकते हैं, और कोई बात स्पष्ट न हो तो फार्मासिस्ट से पूछ सकते हैं।",
      ],
    },
    facts: [
      { k: { en: "Pharmacist", hi: "फार्मासिस्ट" }, v: { en: "Mr. Hritik Pal", hi: "श्री हृतिक पाल" } },
      { k: { en: "Opening hours", hi: "खुलने का समय" }, v: { en: "10 AM to 10 PM", hi: "सुबह 10 बजे से रात 10 बजे" } },
      { k: { en: "Location", hi: "स्थान" }, v: { en: "On site, inside the hospital", hi: "परिसर में, अस्पताल के भीतर" } },
    ],
    offersTitle: { en: "What you can expect at our pharmacy", hi: "हमारी फार्मेसी में आप क्या उम्मीद कर सकते हैं" },
    offers: [
      {
        h: { en: "On-site pharmacy", hi: "परिसर में फार्मेसी" },
        t: { en: "Collect your prescribed medicines at the hospital without going elsewhere.", hi: "अपनी लिखी हुई दवाइयाँ कहीं और जाए बिना अस्पताल में ही लें।" },
      },
      {
        h: { en: "A pharmacist to ask", hi: "पूछने के लिए फार्मासिस्ट" },
        t: { en: "Mr. Hritik Pal can help if you are unsure how or when to take a medicine.", hi: "कोई दवा कैसे या कब लेनी है, यह स्पष्ट न हो तो श्री हृतिक पाल मदद कर सकते हैं।" },
      },
      {
        h: { en: "Part of one visit", hi: "एक ही विज़िट का हिस्सा" },
        t: { en: "See the doctor, get tested and collect medicines in the same place.", hi: "डॉक्टर को दिखाएँ, जाँच करवाएँ और दवाइयाँ एक ही जगह से लें।" },
      },
    ],
    goodToKnow: [
      { en: "Bring your prescription with you when you visit the pharmacy.", hi: "फार्मेसी जाते समय अपना पर्चा साथ रखें।" },
      { en: "To check whether a particular medicine is available, ask the pharmacist or call 74044 77208.", hi: "कोई विशेष दवा उपलब्ध है या नहीं, यह जानने के लिए फार्मासिस्ट से पूछें या 74044 77208 पर कॉल करें।" },
      { en: "Please do not stop or change a medicine without asking your doctor.", hi: "कृपया अपने डॉक्टर से पूछे बिना कोई दवा बंद न करें और न बदलें।" },
    ],
  },
};
