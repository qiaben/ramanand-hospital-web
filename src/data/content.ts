/**
 * All hospital content, in English and Hindi.
 *
 * Source: "Ramanand Hospital: Website Creation – Requirements & Content Collection" form.
 * English text is the client's own wording. Hindi text is our translation and must be
 * reviewed by the hospital before launch.
 * Anything marked PENDING has not been supplied yet and shows an "updating soon" note.
 */
import type { L, LL } from "@/lib/i18n";

export const site = {
  name: { en: "Ramanand Hospital", hi: "रामानंद हॉस्पिटल" } satisfies L,
  tagline: { en: "Trust, Care, and Healing.", hi: "विश्वास, देखभाल और उपचार।" } satisfies L,
  entity: { en: "Individual Proprietorship", hi: "व्यक्तिगत स्वामित्व (प्रोप्राइटरशिप)" } satisfies L,
  domain: "www.ramanandhospital.com",
  facilityId: "IN061165402",
  phoneDisplay: "74044 77208",
  tel: "+917404477208",
  email: "ramanandhosp@gmail.com",
  address: {
    en: "Sonipat-Narela Road, Akbarpur Barota, Sonipat, Haryana – 131103",
    hi: "सोनीपत-नरेला रोड, अकबरपुर बरोटा, सोनीपत, हरियाणा – 131103",
  } satisfies L,
  mapUrl: "https://maps.app.goo.gl/CzDuUPwdhQ2y9m826",
  // Exact pin of "Ramanand Hospital" from the client's Google Maps link (resolved from the short link).
  coords: { lat: 28.9074552, lng: 77.0670583 },
  opdDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
  opdStartHour: 18,
  opdEndHour: 22,
  opdText: { en: "Mon–Sat · 6 PM – 10 PM", hi: "सोम–शनि · शाम 6 बजे – रात 10 बजे" } satisfies L,
  grievance: { name: { en: "Dr. Arun Kumar", hi: "डॉ. अरुण कुमार" } satisfies L },
  social: [] as { label: string; href: string }[], // PENDING: none supplied
};

export const nav = [
  { href: "", label: { en: "Home", hi: "होम" } },
  { href: "/about", label: { en: "About", hi: "हमारे बारे में" } },
  { href: "/departments", label: { en: "Departments", hi: "विभाग" } },
  { href: "/doctors", label: { en: "Doctors", hi: "डॉक्टर" } },
  { href: "/facilities", label: { en: "Facilities", hi: "सुविधाएँ" } },
  { href: "/patient-info", label: { en: "Patient Info", hi: "रोगी जानकारी" } },
  { href: "/contact", label: { en: "Contact", hi: "संपर्क" } },
] satisfies { href: string; label: L }[];

export const pillars = [
  {
    key: "trust",
    title: { en: "Trust", hi: "विश्वास" },
    points: [
      {
        h: { en: "Patient-First Integrity", hi: "रोगी-प्रथम ईमानदारी" },
        t: {
          en: "Maintaining complete transparency, medical ethics, and standard-of-care protocols in every diagnosis, treatment, and consultation.",
          hi: "हर जाँच, उपचार और परामर्श में पूर्ण पारदर्शिता, चिकित्सा नैतिकता और मानक देखभाल प्रोटोकॉल का पालन।",
        },
      },
      {
        h: { en: "Clinical Excellence", hi: "चिकित्सकीय उत्कृष्टता" },
        t: {
          en: "Employing skilled medical professionals, experienced nurses, and advanced technology to ensure accurate outcomes and patient safety.",
          hi: "सटीक परिणाम और रोगी सुरक्षा सुनिश्चित करने के लिए कुशल चिकित्सक, अनुभवी नर्सें और उन्नत तकनीक।",
        },
      },
      {
        h: { en: "Community Connection", hi: "समुदाय से जुड़ाव" },
        t: {
          en: "Building long-term relationships of confidence with patients through dependable, round-the-clock medical care.",
          hi: "भरोसेमंद, चौबीसों घंटे चिकित्सा देखभाल के माध्यम से रोगियों के साथ दीर्घकालिक विश्वास के संबंध बनाना।",
        },
      },
    ],
  },
  {
    key: "care",
    title: { en: "Care", hi: "देखभाल" },
    points: [
      {
        h: { en: "Compassionate Service", hi: "करुणामय सेवा" },
        t: {
          en: "Treating every patient with empathy, dignity, and personalized attention throughout their healthcare journey.",
          hi: "स्वास्थ्य यात्रा के हर चरण में प्रत्येक रोगी के साथ सहानुभूति, सम्मान और व्यक्तिगत ध्यान के साथ व्यवहार।",
        },
      },
      {
        h: { en: "Comprehensive Care", hi: "समग्र देखभाल" },
        t: {
          en: "Ensuring seamless support from preventive health checks and diagnostic evaluation to treatment, rehabilitation, and follow-up.",
          hi: "निवारक स्वास्थ्य जाँच और निदान से लेकर उपचार, पुनर्वास और फॉलो-अप तक निर्बाध सहयोग।",
        },
      },
      {
        h: { en: "Comfortable Environment", hi: "आरामदायक वातावरण" },
        t: {
          en: "Fostering a supportive, clean, and patient-friendly healing environment for patients and their families.",
          hi: "रोगियों और उनके परिवारों के लिए सहयोगी, स्वच्छ और रोगी-अनुकूल उपचार वातावरण।",
        },
      },
    ],
  },
  {
    key: "healing",
    title: { en: "Healing", hi: "उपचार" },
    points: [
      {
        h: { en: "Holistic Recovery", hi: "समग्र स्वास्थ्य लाभ" },
        t: {
          en: "Focusing not just on treating disease, but on complete physical, emotional, and preventive wellness.",
          hi: "केवल रोग के उपचार पर ही नहीं, बल्कि संपूर्ण शारीरिक, भावनात्मक और निवारक स्वास्थ्य पर ध्यान।",
        },
      },
      {
        h: { en: "Evidence-Based Practices", hi: "प्रमाण-आधारित पद्धतियाँ" },
        t: {
          en: "Utilizing proven diagnostic methodologies and clinical management protocols to promote rapid, safe, and effective recovery.",
          hi: "तेज़, सुरक्षित और प्रभावी स्वास्थ्य लाभ के लिए सिद्ध निदान पद्धतियों और क्लिनिकल प्रबंधन प्रोटोकॉल का उपयोग।",
        },
      },
      {
        h: { en: "Restoration of Health", hi: "स्वास्थ्य की पुनर्स्थापना" },
        t: {
          en: "Empowering patients through medical education, wellness guidance, and continuous post-treatment support.",
          hi: "चिकित्सा शिक्षा, स्वास्थ्य मार्गदर्शन और उपचार के बाद निरंतर सहयोग के माध्यम से रोगियों को सशक्त बनाना।",
        },
      },
    ],
  },
];

export const about = {
  vision: {
    en: "To be a premier and trusted healthcare institution recognized for excellence in clinical care, compassionate service, and a holistic approach to patient healing and recovery.",
    hi: "एक अग्रणी और विश्वसनीय स्वास्थ्य संस्थान बनना, जो चिकित्सकीय उत्कृष्टता, करुणामय सेवा और रोगियों के उपचार एवं स्वास्थ्य लाभ के समग्र दृष्टिकोण के लिए जाना जाए।",
  } satisfies L,
  mission: {
    en: "To deliver accessible, reliable, and high-quality medical care through state-of-the-art facilities, clinical expertise, and patient-first practices, guided by our core commitment to Trust, Care, and Healing.",
    hi: "अत्याधुनिक सुविधाओं, चिकित्सकीय विशेषज्ञता और रोगी-प्रथम पद्धतियों के माध्यम से सुलभ, भरोसेमंद और उच्च गुणवत्ता की चिकित्सा सेवा देना, जो विश्वास, देखभाल और उपचार की हमारी मूल प्रतिबद्धता से निर्देशित हो।",
  } satisfies L,
  history: {
    en: [
      "Ramanand Hospital was established under the vision of providing accessible, patient-centered, and ethical healthcare to the rural community.",
      "Founded with a commitment to bridge the gap in quality healthcare services, Ramanand Hospital was designed to bring reliable clinical expertise, nursing care, and emergency medical services closer to the residents of Sonipat and surrounding rural and suburban regions.",
    ],
    hi: [
      "रामानंद हॉस्पिटल की स्थापना ग्रामीण समुदाय को सुलभ, रोगी-केंद्रित और नैतिक स्वास्थ्य सेवा उपलब्ध कराने के संकल्प के साथ की गई।",
      "गुणवत्तापूर्ण स्वास्थ्य सेवाओं की कमी को दूर करने की प्रतिबद्धता के साथ स्थापित, रामानंद हॉस्पिटल का उद्देश्य सोनीपत तथा आसपास के ग्रामीण और उपनगरीय क्षेत्रों के निवासियों के निकट भरोसेमंद चिकित्सकीय विशेषज्ञता, नर्सिंग देखभाल और आपातकालीन चिकित्सा सेवाएँ उपलब्ध कराना है।",
    ],
  } satisfies LL,
  message: {
    name: { en: "Dr. Arun Kumar", hi: "डॉ. अरुण कुमार" } satisfies L,
    role: { en: "Owner", hi: "स्वामी" } satisfies L,
    greeting: { en: "Greetings and a warm welcome to Ramanand Hospital.", hi: "रामानंद हॉस्पिटल में आपका हार्दिक स्वागत है।" } satisfies L,
    intro: {
      en: "At Ramanand Hospital, our journey began with a simple yet profound vision: to provide accessible, compassionate, and high-quality healthcare to our community. We understand that seeking medical care can often be a daunting experience for patients and their loved ones. That is why we have built an institution centered around empathy, medical excellence, and unwavering ethics.",
      hi: "रामानंद हॉस्पिटल की यात्रा एक सरल किंतु गहरे संकल्प से शुरू हुई: अपने समुदाय को सुलभ, करुणामय और उच्च गुणवत्ता की स्वास्थ्य सेवा देना। हम समझते हैं कि इलाज के लिए आना रोगियों और उनके परिजनों के लिए अक्सर चिंता भरा अनुभव होता है। इसीलिए हमने ऐसी संस्था बनाई है जो सहानुभूति, चिकित्सकीय उत्कृष्टता और अटल नैतिकता पर आधारित है।",
    } satisfies L,
    motto: {
      en: "Our motto, “Trust. Care. Healing.”, is not just a slogan; it is the core philosophy that guides every decision we make.",
      hi: "हमारा ध्येय वाक्य “विश्वास. देखभाल. उपचार.” केवल एक नारा नहीं है; यह वह मूल दर्शन है जो हमारे हर निर्णय का मार्गदर्शन करता है।",
    } satisfies L,
    trust: {
      en: "We believe that the foundation of effective healthcare lies in transparency and clinical integrity. Every treatment plan at our hospital is guided by medical standards, clear communication, and patient safety.",
      hi: "हमारा मानना है कि प्रभावी स्वास्थ्य सेवा की नींव पारदर्शिता और चिकित्सकीय ईमानदारी में है। हमारे अस्पताल की हर उपचार योजना चिकित्सा मानकों, स्पष्ट संवाद और रोगी सुरक्षा से निर्देशित होती है।",
    } satisfies L,
    care: {
      en: "Beyond medicines and technology, true healing requires human connection. Our dedicated team of doctors, nurses, and healthcare staff are committed to treating every individual with warmth, respect, and dignity.",
      hi: "दवाओं और तकनीक से परे, सच्चे उपचार के लिए मानवीय जुड़ाव ज़रूरी है। हमारे समर्पित डॉक्टर, नर्स और स्वास्थ्य कर्मी हर व्यक्ति के साथ अपनत्व, आदर और सम्मान से व्यवहार करने के लिए प्रतिबद्ध हैं।",
    } satisfies L,
    healing: {
      en: "Our ultimate goal is complete recovery and wellness. Through state-of-the-art facilities, continuous medical expertise, and holistic care, we strive to help our patients return to optimal health as smoothly as possible.",
      hi: "हमारा अंतिम लक्ष्य पूर्ण स्वास्थ्य लाभ और कल्याण है। अत्याधुनिक सुविधाओं, निरंतर चिकित्सकीय विशेषज्ञता और समग्र देखभाल के माध्यम से हम अपने रोगियों को यथासंभव सहजता से पूर्ण स्वास्थ्य तक पहुँचाने का प्रयास करते हैं।",
    } satisfies L,
    closing: {
      en: "As we continue to grow and adapt to the modern healthcare needs of Sonipat and its surrounding regions, our commitment to your health and well-being remains steadfast. Whether you are visiting us for preventive health checks, specialized treatments, or emergency care, you can count on us to be your trusted healthcare partner. Thank you for placing your faith in Ramanand Hospital. We wish you and your family good health and happiness.",
      hi: "जैसे-जैसे हम सोनीपत और आसपास के क्षेत्रों की आधुनिक स्वास्थ्य आवश्यकताओं के अनुसार आगे बढ़ रहे हैं, आपके स्वास्थ्य और कल्याण के प्रति हमारी प्रतिबद्धता अटल है। चाहे आप निवारक स्वास्थ्य जाँच, विशेष उपचार या आपातकालीन देखभाल के लिए आएँ, आप हमें अपना भरोसेमंद स्वास्थ्य साथी मान सकते हैं। रामानंद हॉस्पिटल पर विश्वास रखने के लिए धन्यवाद। हम आपके और आपके परिवार के अच्छे स्वास्थ्य और सुख की कामना करते हैं।",
    } satisfies L,
    regards: { en: "Warm regards,", hi: "सादर," } satisfies L,
  },
  team: [
    { name: { en: "Dr. Arun Kumar", hi: "डॉ. अरुण कुमार" }, role: { en: "Owner", hi: "स्वामी" }, doctor: "arun-kumar" },
    { name: { en: "Dr. Shikha Siwach", hi: "डॉ. शिखा सिवाच" }, role: { en: "Obstetrics and Gynecology", hi: "प्रसूति एवं स्त्री रोग" }, doctor: "shikha-siwach" },
    { name: { en: "Dr. Robin Tyagi", hi: "डॉ. रॉबिन त्यागी" }, role: { en: "Management team", hi: "प्रबंधन टीम" } },
    { name: { en: "Mr. Hritik Pal", hi: "श्री हृतिक पाल" }, role: { en: "Pharmacist", hi: "फार्मासिस्ट" } },
  ] as { name: L; role: L; doctor?: string }[],
};

export type Department = {
  slug: string;
  icon: "Baby" | "Stethoscope";
  name: L;
  short: L;
  description: L;
  treatments: LL;
  equipment: LL;
  head: string; // doctor slug
  packages: null; // PENDING: client entered "-----"
};

export const departments: Department[] = [
  {
    slug: "general-practice-internal-medicine",
    icon: "Stethoscope",
    name: { en: "General Practice & Internal Medicine", hi: "जनरल प्रैक्टिस एवं इंटरनल मेडिसिन" },
    short: { en: "First point of care for patients of all age groups.", hi: "सभी आयु वर्ग के रोगियों के लिए देखभाल का पहला पड़ाव।" },
    description: {
      en: "The Department of General Practice & Internal Medicine serves as the primary point of medical evaluation, treatment, and preventive care for patients of all age groups. We specialize in diagnosing and treating acute illnesses, managing chronic lifestyle diseases, providing routine health screenings, and offering timely referrals to specialized medical disciplines when needed.",
      hi: "जनरल प्रैक्टिस एवं इंटरनल मेडिसिन विभाग सभी आयु वर्ग के रोगियों के लिए चिकित्सकीय मूल्यांकन, उपचार और निवारक देखभाल का प्रमुख केंद्र है। हम तीव्र बीमारियों की जाँच और उपचार, जीवनशैली से जुड़े दीर्घकालिक रोगों के प्रबंधन, नियमित स्वास्थ्य जाँच और ज़रूरत पड़ने पर समय पर विशेषज्ञ विभागों को रेफर करने में दक्ष हैं।",
    },
    treatments: {
      en: [
        "Diagnosis and Management of Acute Infectious Diseases (Fever, Respiratory Infections, Typhoid, Dengue, UTI)",
        "Long-term Management of Chronic Conditions (Diabetes, Hypertension, Thyroid Disorders, Asthma)",
        "Comprehensive Adult & Senior Health Checks",
        "Preventive Care & Vaccination Services",
        "Outpatient Consultations & First-Contact Emergency Care",
        "Minor Outpatient Surgical & Wound Care Procedures",
      ],
      hi: [
        "तीव्र संक्रामक रोगों की जाँच और प्रबंधन (बुखार, श्वसन संक्रमण, टाइफाइड, डेंगू, मूत्र मार्ग संक्रमण)",
        "दीर्घकालिक रोगों का प्रबंधन (मधुमेह, उच्च रक्तचाप, थायरॉइड विकार, दमा)",
        "वयस्कों और वरिष्ठ नागरिकों की व्यापक स्वास्थ्य जाँच",
        "निवारक देखभाल एवं टीकाकरण सेवाएँ",
        "ओपीडी परामर्श एवं प्रथम-संपर्क आपातकालीन देखभाल",
        "छोटी ओपीडी शल्य एवं घाव देखभाल प्रक्रियाएँ",
      ],
    },
    equipment: {
      en: [
        "OPD & Emergency Consultation Desk",
        "In-house Diagnostic Clinical Laboratory (Microbiology, Biochemistry, Hematology)",
        "Electrocardiogram (ECG) & Routine Diagnostics",
        "Patient Observation Beds with Vital Sign Monitoring",
      ],
      hi: [
        "ओपीडी एवं आपातकालीन परामर्श डेस्क",
        "इन-हाउस नैदानिक प्रयोगशाला (माइक्रोबायोलॉजी, बायोकेमिस्ट्री, हेमेटोलॉजी)",
        "इलेक्ट्रोकार्डियोग्राम (ECG) एवं नियमित जाँच",
        "वाइटल साइन मॉनिटरिंग के साथ रोगी निगरानी बिस्तर",
      ],
    },
    head: "arun-kumar",
    packages: null,
  },
  {
    slug: "obstetrics-and-gynecology",
    icon: "Baby",
    name: { en: "Obstetrics and Gynecology (OBG)", hi: "प्रसूति एवं स्त्री रोग (OBG)" },
    short: { en: "Comprehensive healthcare for women at every stage of life.", hi: "जीवन के हर चरण में महिलाओं के लिए व्यापक स्वास्थ्य सेवा।" },
    description: {
      en: "The Department of Obstetrics and Gynecology provides comprehensive healthcare services for women at every stage of life. From routine gynecological checkups, family planning, and prenatal care to high-risk pregnancy management and safe deliveries, our team is dedicated to offering personalized, compassionate, and evidence-based clinical care in a safe environment.",
      hi: "प्रसूति एवं स्त्री रोग विभाग जीवन के हर चरण में महिलाओं को व्यापक स्वास्थ्य सेवाएँ प्रदान करता है। नियमित स्त्री रोग जाँच, परिवार नियोजन और प्रसव-पूर्व देखभाल से लेकर उच्च-जोखिम गर्भावस्था प्रबंधन और सुरक्षित प्रसव तक, हमारी टीम सुरक्षित वातावरण में व्यक्तिगत, करुणामय और प्रमाण-आधारित चिकित्सकीय देखभाल देने के लिए समर्पित है।",
    },
    treatments: {
      en: [
        "Normal and Assisted Vaginal Deliveries",
        "Antenatal and Postnatal Care & Counselling",
        "High-Risk Pregnancy Management",
        "Routine Gynecological Consultations & Screening (Pap Smears)",
        "Management of Menstrual Disorders, PCOS, and Endometriosis",
        "Infertility Evaluation & Basic Management",
        "Minor Gynecological Procedures",
      ],
      hi: [
        "सामान्य एवं सहायता-प्राप्त योनि प्रसव",
        "प्रसव-पूर्व एवं प्रसवोत्तर देखभाल व परामर्श",
        "उच्च-जोखिम गर्भावस्था प्रबंधन",
        "नियमित स्त्री रोग परामर्श एवं स्क्रीनिंग (पैप स्मीयर)",
        "मासिक धर्म विकार, PCOS और एंडोमेट्रियोसिस का प्रबंधन",
        "बांझपन की जाँच एवं प्राथमिक प्रबंधन",
        "छोटी स्त्री रोग प्रक्रियाएँ",
      ],
    },
    equipment: {
      en: [
        "Dedicated Labor & Delivery Suite",
        "Fetal Monitoring System / Cardiotocography (CTG)",
        "Post-Delivery Recovery Ward",
      ],
      hi: [
        "समर्पित लेबर एवं डिलीवरी सूट",
        "भ्रूण निगरानी प्रणाली / कार्डियोटोकोग्राफी (CTG)",
        "प्रसवोत्तर रिकवरी वार्ड",
      ],
    },
    head: "shikha-siwach",
    packages: null,
  },
];

export type Doctor = {
  slug: string;
  initials: L;
  name: L;
  department: string; // department slug
  designation: L;
  qualification: string;
  experienceYears: number;
  registration: string;
  council: L;
  languages: LL;
  /** Patient-facing introduction. Uses only facts the hospital supplied; the Hindi text needs the hospital's review. */
  about: LL;
};

export const doctors: Doctor[] = [
  {
    slug: "arun-kumar",
    initials: { en: "AK", hi: "अ" },
    name: { en: "Dr. Arun Kumar", hi: "डॉ. अरुण कुमार" },
    department: "general-practice-internal-medicine",
    designation: { en: "General Practice", hi: "जनरल प्रैक्टिस" },
    qualification: "MBBS, MD",
    experienceYears: 5,
    registration: "2022087430",
    council: { en: "Maharashtra Medical Council", hi: "महाराष्ट्र मेडिकल काउंसिल" },
    languages: {
      en: ["Hindi", "English", "Haryanvi", "Marathi", "Punjabi"],
      hi: ["हिंदी", "अंग्रेज़ी", "हरियाणवी", "मराठी", "पंजाबी"],
    },
    about: {
      en: [
        "Dr. Arun Kumar is the General Practice physician at Ramanand Hospital, and the hospital's owner. He holds an MBBS and an MD, has 5 years of experience, and heads the General Practice & Internal Medicine department.",
        "Patients come to him as their first point of care: for fevers and infections, for long-term conditions such as diabetes, high blood pressure, thyroid problems and asthma, and for health checks for adults and senior citizens. He speaks Hindi, English, Haryanvi, Marathi and Punjabi, so you can explain your problem in the language you are most comfortable with.",
        "He is registered with the Maharashtra Medical Council (Reg. No. 2022087430). You can meet him in OPD, Monday to Saturday, 6 PM to 10 PM.",
      ],
      hi: [
        "डॉ. अरुण कुमार रामानंद हॉस्पिटल में जनरल प्रैक्टिस चिकित्सक हैं और अस्पताल के स्वामी भी। उनके पास MBBS और MD की योग्यता है, 5 वर्ष का अनुभव है, और वे जनरल प्रैक्टिस एवं इंटरनल मेडिसिन विभाग के प्रमुख हैं।",
        "मरीज़ इलाज के लिए सबसे पहले उनके पास आते हैं: बुखार और संक्रमण के लिए, मधुमेह, उच्च रक्तचाप, थायरॉइड और अस्थमा जैसी लंबी बीमारियों के लिए, और वयस्कों व वरिष्ठ नागरिकों की स्वास्थ्य जाँच के लिए। वे हिंदी, अंग्रेज़ी, हरियाणवी, मराठी और पंजाबी बोलते हैं, इसलिए आप अपनी समस्या अपनी सहज भाषा में बता सकते हैं।",
        "वे महाराष्ट्र मेडिकल काउंसिल में पंजीकृत हैं (पंजीकरण सं. 2022087430)। आप उनसे ओपीडी में सोमवार से शनिवार, शाम 6 बजे से रात 10 बजे तक मिल सकते हैं।",
      ],
    },
  },
  {
    slug: "shikha-siwach",
    initials: { en: "SS", hi: "शि" },
    name: { en: "Dr. Shikha Siwach", hi: "डॉ. शिखा सिवाच" },
    department: "obstetrics-and-gynecology",
    designation: { en: "Obstetrics and Gynecology", hi: "प्रसूति एवं स्त्री रोग" },
    qualification: "MBBS",
    experienceYears: 2,
    registration: "114852",
    council: { en: "Delhi Medical Council", hi: "दिल्ली मेडिकल काउंसिल" },
    languages: {
      en: ["Hindi", "English", "Haryanvi", "Punjabi"],
      hi: ["हिंदी", "अंग्रेज़ी", "हरियाणवी", "पंजाबी"],
    },
    about: {
      en: [
        "Dr. Shikha Siwach looks after Obstetrics and Gynecology at Ramanand Hospital and heads the department. She holds an MBBS and has 2 years of experience.",
        "Women come to her for care at every stage of life: normal and assisted vaginal deliveries, antenatal and postnatal care and counselling, high-risk pregnancy management, and routine gynecological check-ups. She speaks Hindi, English, Haryanvi and Punjabi, so you can talk to her openly and comfortably.",
        "She is registered with the Delhi Medical Council (Reg. No. 114852). You can meet her in OPD, Monday to Saturday, 6 PM to 10 PM.",
      ],
      hi: [
        "डॉ. शिखा सिवाच रामानंद हॉस्पिटल में प्रसूति एवं स्त्री रोग विभाग देखती हैं और विभाग की प्रमुख हैं। उनके पास MBBS की योग्यता और 2 वर्ष का अनुभव है।",
        "महिलाएँ जीवन के हर चरण में उनके पास आती हैं: सामान्य एवं सहायता-प्राप्त प्रसव, प्रसव-पूर्व एवं प्रसवोत्तर देखभाल व परामर्श, उच्च-जोखिम गर्भावस्था प्रबंधन, और नियमित स्त्री रोग जाँच के लिए। वे हिंदी, अंग्रेज़ी, हरियाणवी और पंजाबी बोलती हैं, इसलिए आप उनसे खुलकर और सहजता से बात कर सकती हैं।",
        "वे दिल्ली मेडिकल काउंसिल में पंजीकृत हैं (पंजीकरण सं. 114852)। आप उनसे ओपीडी में सोमवार से शनिवार, शाम 6 बजे से रात 10 बजे तक मिल सकती हैं।",
      ],
    },
  },
];

export const deptBySlug = (slug: string) => departments.find((d) => d.slug === slug);
export const doctorBySlug = (slug: string) => doctors.find((d) => d.slug === slug);

export const facilities = [
  {
    key: "daycare",
    stat: "5",
    title: { en: "Day Care", hi: "डे केयर" },
    text: { en: "Day care facility with 5 beds.", hi: "5 बिस्तरों वाली डे-केयर सुविधा।" },
  },
  {
    key: "lab",
    stat: "Lab",
    title: { en: "Laboratory & Diagnostics", hi: "प्रयोगशाला एवं जाँच" },
    text: {
      en: "In-house clinical laboratory covering Microbiology, Biochemistry and Hematology, with ECG.",
      hi: "माइक्रोबायोलॉजी, बायोकेमिस्ट्री और हेमेटोलॉजी की इन-हाउस नैदानिक प्रयोगशाला, तथा ECG।",
    },
  },
  {
    key: "pharmacy",
    stat: "Rx",
    title: { en: "Pharmacy", hi: "फार्मेसी" },
    text: { en: "On-site pharmacy. Pharmacist: Mr. Hritik Pal.", hi: "परिसर में फार्मेसी। फार्मासिस्ट: श्री हृतिक पाल।" },
  },
];

export const steps = [
  { t: { en: "Choose", hi: "चुनें" }, d: { en: "Pick the department and doctor you wish to see.", hi: "वह विभाग और डॉक्टर चुनें जिनसे आप मिलना चाहते हैं।" } },
  { t: { en: "Request", hi: "अनुरोध करें" }, d: { en: "Share your preferred day and time with a few details.", hi: "कुछ जानकारी के साथ अपना पसंदीदा दिन और समय बताएँ।" } },
  { t: { en: "Confirmation", hi: "पुष्टि" }, d: { en: "Our team contacts you to confirm the appointment.", hi: "हमारी टीम आपसे संपर्क करके अपॉइंटमेंट की पुष्टि करेगी।" } },
  { t: { en: "Visit", hi: "पधारें" }, d: { en: "Come in during OPD hours. No online payment is needed.", hi: "ओपीडी समय में आएँ। ऑनलाइन भुगतान की आवश्यकता नहीं है।" } },
];

// PENDING items: the client form still says "[TO BE PROVIDED]" for each of these.
export const patientTopics = [
  { key: "admission", title: { en: "Admission process", hi: "भर्ती प्रक्रिया" } },
  { key: "discharge", title: { en: "Discharge process", hi: "डिस्चार्ज प्रक्रिया" } },
  { key: "documents", title: { en: "Documents to bring", hi: "साथ लाने वाले दस्तावेज़" } },
  { key: "visiting", title: { en: "Visiting hours and rules", hi: "मिलने का समय और नियम" } },
  { key: "insurance", title: { en: "Insurance and cashless", hi: "बीमा और कैशलेस" } },
  { key: "payment", title: { en: "Payment modes at the counter", hi: "काउंटर पर भुगतान के तरीके" } },
  { key: "rights", title: { en: "Patient rights and responsibilities", hi: "रोगी के अधिकार और ज़िम्मेदारियाँ" } },
  { key: "access", title: { en: "Accessibility and assistance", hi: "सुगमता और सहायता" } },
];

export const faqs = [
  {
    q: { en: "What are the OPD timings?", hi: "ओपीडी का समय क्या है?" },
    a: { en: "OPD is open Monday to Saturday, 6 PM to 10 PM.", hi: "ओपीडी सोमवार से शनिवार, शाम 6 बजे से रात 10 बजे तक खुली रहती है।" },
  },
  {
    q: { en: "How do I request an appointment?", hi: "अपॉइंटमेंट के लिए अनुरोध कैसे करें?" },
    a: {
      en: "Use the Request Appointment page, or call 74044 77208. Our team will contact you to confirm. No online payment is taken.",
      hi: "अपॉइंटमेंट अनुरोध पेज का उपयोग करें, या 74044 77208 पर कॉल करें। हमारी टीम पुष्टि के लिए आपसे संपर्क करेगी। ऑनलाइन कोई भुगतान नहीं लिया जाता।",
    },
  },
  {
    q: { en: "Which departments are available?", hi: "कौन-कौन से विभाग उपलब्ध हैं?" },
    a: {
      en: "General Practice & Internal Medicine, and Obstetrics and Gynecology (OBG).",
      hi: "जनरल प्रैक्टिस एवं इंटरनल मेडिसिन, तथा प्रसूति एवं स्त्री रोग (OBG)।",
    },
  },
  {
    q: { en: "What languages do the doctors speak?", hi: "डॉक्टर कौन-सी भाषाएँ बोलते हैं?" },
    a: {
      en: "Hindi, English, Haryanvi and Punjabi. Dr. Arun Kumar also speaks Marathi.",
      hi: "हिंदी, अंग्रेज़ी, हरियाणवी और पंजाबी। डॉ. अरुण कुमार मराठी भी बोलते हैं।",
    },
  },
];
