export type Language = "fr" | "en" | "ar" | "am" | "sw" | "so" | "orm";

export const translations: Record<Language, any> = {
  fr: {
    nav: {
      aboutUs: "À Propos",
      ourCompany: "Notre Entreprise",
      ourTeam: "Notre Équipe",
      careers: "Carrières",
      ourBusiness: "Nos Activités",
      ourProjects: "Nos Projets",
      contactUs: "Contactez-nous",
      login: "Connexion",
      admin: "Admin",
      language: "Français"
    },
    hero: {
      headline: "La Porte vers Djibouti, l'Éthiopie & l'Afrique de l'Est",
      subheadline: "Votre partenaire de référence pour l'import-export entre l'Europe, l'Asie et l'Afrique de l'Est — via le port stratégique de Djibouti.",
      cta: "Découvrir nos services"
    },
    about: {
      title: "Spécialiste du Corridor Djibouti — Éthiopie",
      description: "Global Transit and Transport Services orchestre les flux de marchandises entre les marchés mondiaux et l'Afrique de l'Est. Implantés à Djibouti, porte d'entrée incontournable de l'Éthiopie et du corridor est-africain, nous maîtrisons les dédouanements, la logistique portuaire et la chaîne d'approvisionnement régionale avec une expertise inégalée.",
      backgroundText: "Depuis 2012, Global Transit and Transport Services accompagne les entreprises, les commerçants et les opérateurs économiques avec des solutions professionnelles en transit, transport, logistique et dédouanement. Fort de son expertise, de sa présence stratégique à Djibouti, de sa connexion opérationnelle avec l'Éthiopie et de sa vision régionale en Afrique de l'Est, l'entreprise s'est établie comme un partenaire fiable, structuré et engagé. Animée par une équipe compétente et une culture de service axée sur la satisfaction des clients, Global Transit and Transport Services continue sa croissance avec une ambition claire : livrer des services de qualité, faciliter le commerce et contribuer activement à la performance logistique de ses clients.",
      missionTitle: "Notre Mission",
      missionText: "Faciliter l'accès des importateurs et exportateurs éthiopiens et est-africains aux marchés mondiaux, en offrant des solutions logistiques fiables, rapides et adaptées aux réalités locales.",
      stats: [
        { value: "Djibouti", label: "Hub Stratégique" },
        { value: "Éthiopie", label: "Marché Principal" },
        { value: "15+", label: "Pays d'Afrique de l'Est Desservis" }
      ]
    },
    regions: {
      title: "Notre Zone de Couverture",
      subtitle: "Djibouti, Éthiopie et Afrique de l'Est",
      djibouti: {
        name: "Djibouti",
        role: "Hub Maritime Stratégique",
        desc: "Djibouti est la porte d'entrée maritime de l'Afrique de l'Est. Notre bureau principal coordonne toutes les opérations portuaires, le transit douanier et le stockage."
      },
      ethiopia: {
        name: "Éthiopie",
        role: "Marché d'Importation Clé",
        desc: "Pays enclavé de 120 millions d'habitants, l'Éthiopie dépend du port de Djibouti pour 95% de ses échanges. Nous gérons l'import de marchandises, équipements et matières premières."
      },
      eastAfrica: {
        name: "Afrique de l'Est",
        role: "Expansion Régionale",
        desc: "Somalie, Kenya, Soudan, Érythrée, Ouganda, Rwanda — notre réseau régional s'étend à travers toute l'Afrique de l'Est pour une logistique sans frontières."
      }
    },
    services: {
      title: "Nos services",
      clearance: {
        title: "Clearance",
        desc: "Dédouanement import / export, formalités et déclarations au port de Djibouti et sur les corridors régionaux."
      },
      logistics: {
        title: "Logistics",
        desc: "Chaîne logistique : manutention, entreposage, transport et coordination des flux porte à porte."
      },
      transit: {
        title: "Transit",
        desc: "Transit de marchandises sur le corridor Djibouti — Éthiopie et en Afrique de l’Est : suivi, affrètement et livraison."
      },
      customs: {
        title: "Système douanes",
        desc: "Accompagnement du système douanier : conformité réglementaire, classification, fiscalité et relations avec les administrations."
      },
      documents: {
        title: "Documents",
        desc: "Constitution et suivi des dossiers : connaissements, factures, certificats d’origine et pièces administratives."
      }
    },
    projects: {
      title: "Projets Phares",
      p1: {
        title: "Corridor Djibouti — Addis-Abeba",
        desc: "Gestion de la chaîne logistique complète pour un importateur d'équipements industriels éthiopien — du port de Shanghaï jusqu'aux entrepôts d'Addis-Abeba."
      },
      p2: {
        title: "Expansion du Port de Djibouti",
        desc: "Participation logistique à la modernisation du Doraleh Multi-Purpose Port — terminal à conteneurs, manutention et gestion des flux."
      },
      p3: {
        title: "Relais Humanitaire Afrique de l'Est",
        desc: "Acheminement de vivres, médicaments et équipements d'urgence pour des ONG internationales en Éthiopie, Somalie et Soudan."
      },
      viewAll: "Voir Tous les Projets"
    },
    contact: {
      title: "Parlons de votre Projet",
      form: {
        name: "Nom Complet",
        email: "Adresse Email",
        service: "Service Souhaité",
        message: "Décrivez votre besoin logistique",
        submit: "Demander un Devis"
      },
      info: {
        title: "Siège Social — Djibouti",
        address: "Avenue du Général de Gaulle, BP 2450, Djibouti-Ville",
        phone: "+253 77 82 18 32 | +253 21 34 17 16 | +253 77 69 61 30",
        email: "info@gttsgroup.com"
      }
    },
    contactPage: {
      eyebrow: "PRENDRE CONTACT",
      headline: "Lancez votre projet logistique.",
      intro:
        "Décrivez vos besoins : type de fret, volumes, corridors (Djibouti, Éthiopie, etc.), délais. Nous vous répondons sous 24 à 48 h ouvrées.",
      officeLabel: "BUREAU",
      office: "Djibouti",
      phoneLabel: "LIGNE DIRECTE",
      phoneDisplay: "+253 21 34 17 16",
      emailLabel: "E-MAIL",
      emailDisplay: "info@gttsgroup.com",
      formTitle: "Envoyer une demande",
      firstName: "Prénom",
      lastName: "Nom",
      email: "E-mail",
      phone: "Téléphone",
      interestLabel: "Je suis intéressé par...",
      otherService: "Autre / à définir",
      destinationsLabel: "Corridor / destination préférés",
      destinationsPlaceholder: "ex. Port de Djibouti, Addis-Abeba, corridor terrestre...",
      messageLabel: "Message",
      messagePlaceholder: "Volumes, type de marchandises, calendrier...",
      submit: "ENVOYER LA DEMANDE",
      toastTitle: "Demande enregistrée",
      toastDesc: "Nous vous recontactons très bientôt.",
      sendError: "Envoi impossible. Vérifiez la connexion ou réessayez plus tard."
    },
    activitiesPage: {
      eyebrow: "NOS ACTIVITÉS",
      title: "Sur le terrain, à Djibouti et en Afrique de l’Est",
      subtitle: "Manutention portuaire, transport routier, entreposage et corridor Djibouti — Éthiopie.",
      intro:
        "Nos équipes interviennent sur les terminaux, zones logistiques et routes stratégiques : clearance, logistics, transit, système douanes et documents. Découvrez nos cinq pôles métiers et un aperçu de nos opérations.",
      pillarsTitle: "Nos cinq pôles métiers",
      galleryTitle: "Nos opérations en images",
      cta: "Parler de votre flux logistique",
      cap1: "Fret maritime et transit via le port de Djibouti.",
      cap2: "Transport terrestre — corridor Djibouti — Éthiopie.",
      cap3: "Chaîne d’approvisionnement et entreposage sécurisé.",
      cap4: "Projets industriels et équipements lourds.",
      cap5: "Infrastructures logistiques et manutention portuaire.",
      cap6: "Liaisons maritimes internationales et flux régionaux."
    },
    ui: {
      brandTagline: "Transport & Logistique",
      navClients: "Nos Clients",
      navNews: "Actualités",
      selectLanguage: "Choisir la langue",
      companySummary: "Expertise logistique, transit et douane basée à Djibouti.",
      companyTrustNote: "Partenaire de confiance pour les opérations de fret régionales et internationales.",
      keyStrengths: "Points forts",
      professionalStandards: "Standards Professionnels",
      strengthCommunication: "Communication",
      strengthTeamwork: "Travail d'équipe",
      strengthProcessReport: "Reporting de process",
      strengthResponsibility: "Responsabilité",
      strengthFinalReport: "Rapport final",
      experienceTitle: "Expérience",
      experienceValue: "15 ans",
      experienceDesc: "Solide expérience opérationnelle en logistique, transit et coordination douanière.",
      teamEyebrow: "NOTRE ÉQUIPE",
      teamIntro:
        "Une équipe engagée pour sécuriser vos opérations logistiques, du port de Djibouti jusqu’aux corridors régionaux.",
      careersEyebrow: "CARRIÈRES",
      careersIntro:
        "Rejoignez une équipe ancrée sur le corridor Djibouti — Éthiopie et au service des flux régionaux.",
      projectsIntro: "Découvrez nos projets et opérations phares.",
      loadErrorTryLater: "Erreur de chargement. Réessayez plus tard.",
      noTeamMembers: "Aucun membre n’est encore publié.",
      noCareers: "Aucune offre n’est publiée pour le moment.",
      noProjects: "Aucun projet n’est publié pour le moment.",
      contactUsShort: "Contactez-nous",
      applyNow: "Postuler",
      projectGeneric: "Projet"
    },
    login: {
      title: "Connexion",
      user: "Utilisateur",
      userPlaceholder: "globaltransit ou votre e-mail",
      password: "Mot de passe",
      passwordPlaceholder: "••••••••",
      submit: "Se connecter",
      error: "Identifiants incorrects.",
      backHome: "Retour à l’accueil"
    },
    adminPage: {
      title: "Administration",
      subtitle: "Tableau de bord",
      noInquiries: "Aucune demande pour le moment.",
      colId: "ID",
      colDate: "Date",
      colName: "Nom",
      colEmail: "E-mail",
      colPhone: "Téléphone",
      colInterest: "Service",
      colDescription: "Description",
      colMessage: "Message",
      colReviewer: "Traité par",
      colAction: "Action",
      logout: "Déconnexion",
      loginRequired: "Espace réservé aux administrateurs.",
      goLogin: "Connexion",
      loadError: "Erreur de chargement.",
      backToSite: "Retour au site",
      menu: "Menu",
      navStats: "Statistiques site",
      navActivities: "Nos activités",
      navTeam: "Notre équipe",
      navCareers: "Carrières",
      navProjects: "Nos projets",
      navContact: "Contact",
      navSettings: "Paramètres",
      navUsers: "Utilisateurs",
      navRoles: "Rôles",
      navPermissions: "Permissions",
      statsTitle: "Indicateurs",
      statInquiries: "Demandes de contact",
      statUsers: "Comptes utilisateurs",
      statAdmins: "Administrateurs",
      statsHint: "Données issues de la base MongoDB.",
      inquiriesTitle: "Demandes reçues",
      cmsTitle: "Contenu du site",
      cmsBody:
        "La gestion éditoriale de cette rubrique pourra être ajoutée ici. En attendant, ouvrez la page publique correspondante.",
      cmsOpenSite: "Voir sur le site",
      settingsTitle: "Paramètres",
      settingsAccount: "Compte connecté",
      settingsBody:
        "Options avancées (mot de passe, notifications, etc.) pourront être proposées ici."
    },
    footer: {
      copyright: "© 2025 Global Transit and Transport Services. Tous droits réservés. | Djibouti & Éthiopie",
      developer: "Développé par GEOSOM Technologies",
      links: ["Politique de Confidentialité", "Termes & Conditions", "Conformité Douanière"]
    }
  },
  en: {
    nav: {
      aboutUs: "About",
      ourCompany: "Our Company",
      ourTeam: "Our Team",
      careers: "Careers",
      ourBusiness: "Our Activities",
      ourProjects: "Our Projects",
      contactUs: "Contact us",
      login: "Login",
      admin: "Admin",
      language: "English",
    },
    hero: {
      headline: "Your Gateway to Djibouti, Ethiopia & East Africa",
      subheadline:
        "Your trusted partner for import-export between Europe, Asia and East Africa — via the strategic port of Djibouti.",
      cta: "Explore our services",
    },
    about: {
      title: "Specialist of the Djibouti — Ethiopia Corridor",
      description:
        "Global Transit and Transport Services orchestrates freight flows between global markets and East Africa. Based in Djibouti — the key gateway to Ethiopia and the East African corridor — we master customs clearance, port logistics and the regional supply chain with unmatched expertise.",
      backgroundText: "Since 2012, Global Transit and Transport Services has been supporting businesses, traders, and economic operators with professional solutions in transit, transportation, logistics, and customs clearance. Through its expertise, its strategic presence in Djibouti, its operational connection with Ethiopia, and its regional vision across East Africa, the company has established itself as a reliable, structured, and committed partner. Driven by a competent team and a service culture focused on client satisfaction, Global Transit and Transport Services continues to grow with a clear ambition, to deliver quality services, facilitate trade, and actively contribute to the logistical performance of its clients.",
      missionTitle: "Our Mission",
      missionText:
        "Enable Ethiopian and East African importers and exporters to access global markets by delivering reliable, fast logistics solutions tailored to local realities.",
      stats: [
        { value: "Djibouti", label: "Strategic hub" },
        { value: "Ethiopia", label: "Primary market" },
        { value: "15+", label: "East African countries served" },
      ],
    },
    regions: {
      title: "Coverage Area",
      subtitle: "Djibouti, Ethiopia and East Africa",
      djibouti: {
        name: "Djibouti",
        role: "Strategic maritime hub",
        desc: "Djibouti is East Africa’s maritime gateway. Our headquarters coordinates port operations, customs transit and warehousing.",
      },
      ethiopia: {
        name: "Ethiopia",
        role: "Key import market",
        desc: "A landlocked country of 120M people, Ethiopia relies on the port of Djibouti for 95% of its trade. We manage imports of goods, equipment and raw materials.",
      },
      eastAfrica: {
        name: "East Africa",
        role: "Regional expansion",
        desc: "Somalia, Kenya, Sudan, Eritrea, Uganda, Rwanda — our regional network spans East Africa for borderless logistics.",
      },
    },
    services: {
      title: "Our services",
      clearance: {
        title: "Clearance",
        desc: "Import/export customs clearance, formalities and declarations at the Port of Djibouti and across regional corridors.",
      },
      logistics: {
        title: "Logistics",
        desc: "End-to-end logistics: handling, warehousing, transport and door-to-door flow coordination.",
      },
      transit: {
        title: "Transit",
        desc: "Cargo transit along the Djibouti — Ethiopia corridor and across East Africa: tracking, forwarding and delivery.",
      },
      customs: {
        title: "Customs system",
        desc: "Customs support: regulatory compliance, classification, taxation and relationships with administrations.",
      },
      documents: {
        title: "Documents",
        desc: "File preparation and follow-up: bills of lading, invoices, certificates of origin and administrative documents.",
      },
    },
    projects: {
      title: "Featured Projects",
      p1: {
        title: "Djibouti — Addis Ababa Corridor",
        desc: "End-to-end supply chain management for an Ethiopian industrial equipment importer — from the Port of Shanghai to warehouses in Addis Ababa.",
      },
      p2: {
        title: "Expansion of the Port of Djibouti",
        desc: "Logistics contribution to the modernization of Doraleh Multi-Purpose Port — container terminal, handling and flow management.",
      },
      p3: {
        title: "East Africa Humanitarian Relay",
        desc: "Transport of food, medicines and emergency equipment for international NGOs in Ethiopia, Somalia and Sudan.",
      },
      viewAll: "View all projects",
    },
    contact: {
      title: "Let’s discuss your project",
      form: {
        name: "Full name",
        email: "Email address",
        service: "Desired service",
        message: "Describe your logistics need",
        submit: "Request a quote",
      },
      info: {
        title: "Head office — Djibouti",
        address: "Avenue du Général de Gaulle, PO Box 2450, Djibouti City",
        phone: "+253 77 82 18 32 | +253 21 34 17 16 | +253 77 69 61 30",
        email: "info@gttsgroup.com",
      },
    },
    contactPage: {
      eyebrow: "GET IN TOUCH",
      headline: "Kick off your logistics project.",
      intro:
        "Describe your needs: cargo type, volumes, corridors (Djibouti, Ethiopia, etc.), timelines. We reply within 24–48 business hours.",
      officeLabel: "OFFICE",
      office: "Djibouti",
      phoneLabel: "DIRECT LINE",
      phoneDisplay: "+253 21 34 17 16",
      emailLabel: "E-MAIL",
      emailDisplay: "info@gttsgroup.com",
      formTitle: "Send a request",
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      phone: "Phone",
      interestLabel: "I’m interested in…",
      otherService: "Other / to be defined",
      destinationsLabel: "Preferred corridor / destination",
      destinationsPlaceholder: "e.g., Port of Djibouti, Addis Ababa, land corridor…",
      messageLabel: "Message",
      messagePlaceholder: "Volumes, cargo type, timeline…",
      submit: "SEND REQUEST",
      toastTitle: "Request saved",
      toastDesc: "We’ll contact you shortly.",
      sendError: "Unable to send. Check your connection or try again later.",
    },
    activitiesPage: {
      eyebrow: "OUR ACTIVITIES",
      title: "On the ground, in Djibouti and East Africa",
      subtitle: "Port handling, road transport, warehousing and the Djibouti — Ethiopia corridor.",
      intro:
        "Our teams operate across terminals, logistics zones and strategic routes: clearance, logistics, transit, customs system and documents. Discover our five business pillars and a glimpse of our operations.",
      pillarsTitle: "Our five business pillars",
      galleryTitle: "Operations in pictures",
      cta: "Discuss your logistics flow",
      cap1: "Sea freight and transit via the Port of Djibouti.",
      cap2: "Land transport — Djibouti — Ethiopia corridor.",
      cap3: "Supply chain and secure warehousing.",
      cap4: "Industrial projects and heavy equipment.",
      cap5: "Logistics infrastructure and port handling.",
      cap6: "International maritime links and regional flows.",
    },
    ui: {
      brandTagline: "Transport & Logistics",
      navClients: "Our Clients",
      navNews: "News",
      selectLanguage: "Select Language",
      companySummary: "Djibouti-based logistics, transit and customs expertise.",
      companyTrustNote: "Trusted partner for regional and international freight operations.",
      keyStrengths: "Key strengths",
      professionalStandards: "Professional Standards",
      strengthCommunication: "Communication",
      strengthTeamwork: "Team work",
      strengthProcessReport: "Process report",
      strengthResponsibility: "Work responsibility",
      strengthFinalReport: "Final report",
      experienceTitle: "Experience",
      experienceValue: "15 years",
      experienceDesc: "Strong operational experience in logistics, transit and customs coordination.",
      teamEyebrow: "OUR TEAM",
      teamIntro:
        "A committed team to secure your logistics operations, from the Port of Djibouti to regional corridors.",
      careersEyebrow: "CAREERS",
      careersIntro:
        "Join a team rooted in the Djibouti — Ethiopia corridor and serving regional trade flows.",
      projectsIntro: "Discover our flagship projects and operations.",
      loadErrorTryLater: "Loading error. Please try again later.",
      noTeamMembers: "No team member has been published yet.",
      noCareers: "No job offer is currently published.",
      noProjects: "No project is currently published.",
      contactUsShort: "Contact us",
      applyNow: "Apply now",
      projectGeneric: "Project"
    },
    login: {
      title: "Login",
      user: "User",
      userPlaceholder: "globaltransit or your email",
      password: "Password",
      passwordPlaceholder: "••••••••",
      submit: "Sign in",
      error: "Invalid credentials.",
      backHome: "Back to home",
    },
    adminPage: {
      title: "Administration",
      subtitle: "Dashboard",
      noInquiries: "No requests yet.",
      colId: "ID",
      colDate: "Date",
      colName: "Name",
      colEmail: "Email",
      colPhone: "Phone",
      colInterest: "Service",
      colDescription: "Description",
      colMessage: "Message",
      colReviewer: "Handled by",
      colAction: "Action",
      logout: "Logout",
      loginRequired: "Admins only area.",
      goLogin: "Login",
      loadError: "Loading error.",
      backToSite: "Back to site",
      menu: "Menu",
      navStats: "Website statistics",
      navActivities: "Our activities",
      navTeam: "Our team",
      navCareers: "Careers",
      navProjects: "Our projects",
      navContact: "Contact",
      navSettings: "Settings",
      navUsers: "Users",
      navRoles: "Roles",
      navPermissions: "Permissions",
      statsTitle: "Indicators",
      statInquiries: "Contact requests",
      statUsers: "User accounts",
      statAdmins: "Administrators",
      statsHint: "Data from MongoDB.",
      inquiriesTitle: "Received requests",
      cmsTitle: "Website content",
      cmsBody:
        "Content management for this section can be added here. For now, open the corresponding public page.",
      cmsOpenSite: "View on site",
      settingsTitle: "Settings",
      settingsAccount: "Logged-in account",
      settingsBody:
        "Advanced options (password, notifications, etc.) can be added here later.",
    },
    footer: {
      copyright: "© 2025 Global Transit and Transport Services. All rights reserved. | Djibouti & Ethiopia",
      developer: "Developed by GEOSOM Technologies",
      links: ["Privacy Policy", "Terms & Conditions", "Customs Compliance"],
    },
  },
  ar: {
    nav: {
      aboutUs: "معلومات عنا",
      ourCompany: "شركتنا",
      ourTeam: "فريقنا",
      careers: "الوظائف",
      ourBusiness: "أعمالنا",
      ourProjects: "مشاريعنا",
      contactUs: "اتصل بنا",
      login: "تسجيل الدخول",
      admin: "المسؤول",
      language: "العربية"
    },
    hero: {
      headline: "بوابتكم إلى جيبوتي وإثيوبيا وشرق أفريقيا",
      subheadline: "شريككم المتخصص في الاستيراد والتصدير بين الأسواق العالمية وشرق أفريقيا، عبر الميناء الاستراتيجي لجيبوتي.",
      cta: "اكتشف خدماتنا"
    },
    about: {
      title: "متخصصون في ممر جيبوتي — إثيوبيا",
      description: "تنسق شركة Global Transit حركة البضائع بين الأسواق العالمية وشرق أفريقيا. بوجودنا في جيبوتي، بوابة إثيوبيا والممر الأفريقي الشرقي، نتقن إجراءات الجمارك، واللوجستيات الميناءية، وسلسلة التوريد الإقليمية بخبرة لا مثيل لها.",
      backgroundText: "منذ عام 2012، تدعم شركة Global Transit and Transport Services الشركات والتجار والعاملين الاقتصاديين بحلول احترافية في مجالات النقل واللوجستيات والتخليص الجمركي. بفضل خبرتها والحضور الاستراتيجي في جيبوتي والارتباط العملياتي بإثيوبيا والرؤية الإقليمية في شرق أفريقيا، أصبحت الشركة شريكاً موثوقاً ومنظماً وملتزماً. بقيادة فريق كفء وثقافة خدمة تركز على رضا العملاء، تستمر Global Transit and Transport Services في النمو برغبة واضحة لتقديم خدمات عالية الجودة وتسهيل التجارة والمساهمة الفعالة في الأداء اللوجستي لعملائها.",
      missionTitle: "مهمتنا",
      missionText: "تيسير وصول المستوردين والمصدرين الإثيوبيين وشرق أفريقيا إلى الأسواق العالمية، مع تقديم حلول لوجستية موثوقة وسريعة تتكيف مع الواقع المحلي.",
      stats: [
        { value: "جيبوتي", label: "مركز استراتيجي" },
        { value: "إثيوبيا", label: "السوق الرئيسية" },
        { value: "15+", label: "دول شرق أفريقيا مخدومة" }
      ]
    },
    regions: {
      title: "منطقة تغطيتنا",
      subtitle: "جيبوتي وإثيوبيا وشرق أفريقيا",
      djibouti: {
        name: "جيبوتي",
        role: "مركز بحري استراتيجي",
        desc: "جيبوتي هي بوابة شرق أفريقيا البحرية. يقوم مكتبنا الرئيسي بتنسيق جميع العمليات الميناءية والعبور الجمركي والتخزين."
      },
      ethiopia: {
        name: "إثيوبيا",
        role: "سوق الاستيراد الرئيسية",
        desc: "تعتمد إثيوبيا، الدولة الحبيسة ذات 120 مليون نسمة، على ميناء جيبوتي في 95% من تجارتها. ندير استيراد البضائع والمعدات والمواد الخام."
      },
      eastAfrica: {
        name: "شرق أفريقيا",
        role: "توسع إقليمي",
        desc: "الصومال وكينيا والسودان وإريتريا وأوغندا ورواندا — يمتد شبكتنا الإقليمية عبر شرق أفريقيا بأسرها للوجستيات بلا حدود."
      }
    },
    services: {
      title: "خدماتنا",
      clearance: {
        title: "التخليص",
        desc: "تخليص جمركي للاستيراد والتصدير، إجراءات وإقرارات في ميناء جيبوتي والممرات الإقليمية."
      },
      logistics: {
        title: "اللوجستيات",
        desc: "سلسلة لوجستية: المناولة، التخزين، النقل وتنسيق التدفقات من الباب إلى الباب."
      },
      transit: {
        title: "الترانزيت",
        desc: "عبور البضائع عبر ممر جيبوتي — إثيوبيا وشرق أفريقيا: تتبع، شحن وتسليم."
      },
      customs: {
        title: "النظام الجمركي",
        desc: "دعم النظام الجمركي: الامتثال التنظيمي، التصنيف، الضرائب والعلاقة مع الإدارات."
      },
      documents: {
        title: "المستندات",
        desc: "إعداد ومتابعة الملفات: بوليصات الشحن، الفواتير، شهادات المنشأ والوثائق الإدارية."
      }
    },
    projects: {
      title: "المشاريع البارزة",
      p1: {
        title: "ممر جيبوتي — أديس أبابا",
        desc: "إدارة سلسلة اللوجستيات الكاملة لمستورد إثيوبي للمعدات الصناعية — من ميناء شنغهاي حتى مستودعات أديس أبابا."
      },
      p2: {
        title: "توسيع ميناء جيبوتي",
        desc: "المشاركة اللوجستية في تحديث ميناء دورالة متعدد الأغراض — محطة الحاويات والمناولة وإدارة تدفقات البضائع."
      },
      p3: {
        title: "الإغاثة الإنسانية في شرق أفريقيا",
        desc: "إيصال الغذاء والأدوية والمعدات الطارئة للمنظمات الدولية غير الحكومية في إثيوبيا والصومال والسودان."
      },
      viewAll: "عرض كل المشاريع"
    },
    contact: {
      title: "تحدث معنا عن مشروعك",
      form: {
        name: "الاسم الكامل",
        email: "البريد الإلكتروني",
        service: "الخدمة المطلوبة",
        message: "اشرح احتياجاتك اللوجستية",
        submit: "اطلب تسعيرة"
      },
      info: {
        title: "المقر الرئيسي — جيبوتي",
        address: "شارع الجنرال ديغول، ص.ب 2450، مدينة جيبوتي",
        phone: "+253 77 82 18 32 | +253 21 34 17 16 | +253 77 69 61 30",
        email: "info@gttsgroup.com"
      }
    },
    contactPage: {
      eyebrow: "تواصل معنا",
      headline: "ابدأ مشروعك اللوجستي.",
      intro:
        "صف احتياجاتك: نوع الشحن، الأحجام، الممرات (جيبوتي، إثيوبيا، إلخ)، والمواعيد. نرد خلال 24–48 ساعة عمل.",
      officeLabel: "المكتب",
      office: "جيبوتي",
      phoneLabel: "الخط المباشر",
      phoneDisplay: "+253 21 34 17 16",
      emailLabel: "البريد",
      emailDisplay: "info@gttsgroup.com",
      formTitle: "إرسال طلب",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      interestLabel: "أنا مهتم بـ...",
      otherService: "أخرى",
      destinationsLabel: "الممر / الوجهة المفضلة",
      destinationsPlaceholder: "مثال: ميناء جيبوتي، أديس أبابا، الممر البري...",
      messageLabel: "الرسالة",
      messagePlaceholder: "الأحجام، نوع البضائع، الجدول الزمني...",
      submit: "إرسال الطلب",
      toastTitle: "تم استلام الطلب",
      toastDesc: "سنعود إليك قريبًا.",
      sendError: "تعذر الإرسال. حاول لاحقًا."
    },
    activitiesPage: {
      eyebrow: "أعمالنا",
      title: "في الميدان — جيبوتي وشرق أفريقيا",
      subtitle: "المناولة المينائية، النقل البري، التخزين وممر جيبوتي — إثيوبيا.",
      intro:
        "فرقنا تعمل على الأرصفة والمناطق اللوجستية والطرق الحيوية: تحميل الحاويات، الشحن، العبور الجمركي والتوزيع نحو أديس أبابا والمنطقة.",
      pillarsTitle: "مجالات خبرتنا",
      galleryTitle: "عملياتنا بالصور",
      cta: "ناقش احتياجك اللوجستي",
      cap1: "الشحن البحري والعبور عبر ميناء جيبوتي.",
      cap2: "النقل البري — ممر جيبوتي — إثيوبيا.",
      cap3: "سلسلة التوريد والتخزين الآمن.",
      cap4: "مشاريع صناعية ومعدات ثقيلة.",
      cap5: "بنية تحتية لوجستية ومناولة مينائية.",
      cap6: "روابط بحرية دولية وتدفقات إقليمية."
    },
    ui: {
      brandTagline: "النقل والخدمات اللوجستية",
      navClients: "عملاؤنا",
      navNews: "الأخبار",
      selectLanguage: "اختر اللغة",
      companySummary: "خبرة في اللوجستيات والعبور والجمارك في جيبوتي.",
      companyTrustNote: "شريك موثوق لعمليات الشحن الإقليمية والدولية.",
      keyStrengths: "نقاط القوة",
      professionalStandards: "معايير احترافية",
      strengthCommunication: "التواصل",
      strengthTeamwork: "العمل الجماعي",
      strengthProcessReport: "تقرير العمليات",
      strengthResponsibility: "المسؤولية",
      strengthFinalReport: "التقرير النهائي",
      experienceTitle: "الخبرة",
      experienceValue: "15 سنة",
      experienceDesc: "خبرة تشغيلية قوية في اللوجستيات والعبور والتنسيق الجمركي.",
      teamEyebrow: "فريقنا",
      teamIntro: "فريق ملتزم لتأمين عملياتك اللوجستية من ميناء جيبوتي إلى الممرات الإقليمية.",
      careersEyebrow: "الوظائف",
      careersIntro: "انضم إلى فريق يعمل على ممر جيبوتي — إثيوبيا ويخدم التدفقات الإقليمية.",
      projectsIntro: "اكتشف مشاريعنا وعملياتنا المميزة.",
      loadErrorTryLater: "خطأ في التحميل. حاول مرة أخرى لاحقًا.",
      noTeamMembers: "لا يوجد أعضاء منشورون حاليًا.",
      noCareers: "لا توجد وظائف منشورة حاليًا.",
      noProjects: "لا توجد مشاريع منشورة حاليًا.",
      contactUsShort: "اتصل بنا",
      applyNow: "تقدّم الآن",
      projectGeneric: "مشروع"
    },
    login: {
      title: "تسجيل الدخول",
      user: "المستخدم",
      userPlaceholder: "البريد الإلكتروني",
      password: "كلمة المرور",
      passwordPlaceholder: "••••••••",
      submit: "دخول",
      error: "بيانات غير صحيحة.",
      backHome: "العودة للرئيسية"
    },
    adminPage: {
      title: "لوحة الإدارة",
      subtitle: "لوحة التحكم",
      noInquiries: "لا توجد طلبات بعد.",
      colId: "المعرّف",
      colDate: "التاريخ",
      colName: "الاسم",
      colEmail: "البريد",
      colPhone: "الهاتف",
      colInterest: "الخدمة",
      colDescription: "الوصف",
      colMessage: "الرسالة",
      colReviewer: "المعالج",
      colAction: "إجراء",
      logout: "خروج",
      loginRequired: "للمسؤولين فقط.",
      goLogin: "تسجيل الدخول",
      loadError: "خطأ في التحميل.",
      backToSite: "العودة للموقع",
      menu: "القائمة",
      navStats: "إحصائيات الموقع",
      navActivities: "أنشطتنا",
      navTeam: "فريقنا",
      navCareers: "الوظائف",
      navProjects: "مشاريعنا",
      navContact: "اتصل بنا",
      navSettings: "الإعدادات",
      statsTitle: "المؤشرات",
      statInquiries: "طلبات الاتصال",
      statUsers: "حسابات المستخدمين",
      statAdmins: "المسؤولون",
      statsHint: "بيانات من قاعدة MongoDB.",
      inquiriesTitle: "الطلبات الواردة",
      cmsTitle: "محتوى الموقع",
      cmsBody: "يمكن إضافة إدارة المحتوى لاحقًا. افتح الصفحة العامة المقابلة.",
      cmsOpenSite: "عرض على الموقع",
      settingsTitle: "الإعدادات",
      settingsAccount: "الحساب المتصل",
      settingsBody: "خيارات متقدمة (كلمة المرور، الإشعارات…) لاحقًا.",
      navUsers: "المستخدمون",
      navRoles: "الأدوار",
      navPermissions: "الصلاحيات"
    },
    footer: {
      developer: "تم التطوير بواسطة GEOSOM Technologies",
      copyright: "© 2025 Global Transit and Transport Services. جميع الحقوق محفوظة. | جيبوتي وإثيوبيا",
      links: ["سياسة الخصوصية", "الشروط والأحكام", "الامتثال الجمركي"]
    }
  },
  am: {
    nav: {
      aboutUs: "ስለ እኛ",
      ourCompany: "ድርጅታችን",
      ourTeam: "ቡድናችን",
      careers: "የስራ እድሎች",
      ourBusiness: "ስራችን",
      ourProjects: "ፕሮጀክቶቻችን",
      contactUs: "ያግኙን",
      login: "መግቢያ",
      admin: "አስተዳዳሪ",
      language: "አማርኛ"
    },
    hero: {
      headline: "ወደ ጅቡቲ፣ ኢትዮጵያ እና ምስራቅ አፍሪካ በሮ",
      subheadline: "ከዓለም ገበያዎች ወደ ምስራቅ አፍሪካ — የጅቡቲ ስትራቴጂካዊ ወደብ በኩል ለማስመጣት እና ለመላክ ታማኝ አጋርዎ።",
      cta: "አገልግሎቶቻችንን ያግኙ"
    },
    about: {
      title: "በጅቡቲ — ኢትዮጵያ ኮሪደር ላይ ባለሙያዎች",
      backgroundText: "ከ2012 ጀምሮ ኩባንያ Global Transit and Transport Services ትግበራ፣ ትራንስፖርት፣ ሎጂስቲክስ እና ጉምሩክ ማስፈቀዳ ሙያዊ ስራዎች ለቅንጅቶች፣ ነጋዴዎች እና ኢኮኖሚ ተሠራተኞች ደግፈዋል። በወጣ ተማሪ ስራ፣ በጅቡቲ ስትራቴጂካዊ ቦታ፣ በኢትዮጵያ ስራ ግንኙነት እና በምስራቅ አፍሪካ ክልላዊ ራእይ፣ ኩባንያው አስተሳሰብ ባለሙያ፣ ከተዋቀረ እና ታሳቢ አዋቃቂ ሆናለች። በልልሆ ቡጅንን ለንግጋ በደንበኛ ለርከታ ላይ የተሰነረሮራ የሀገልግሎት ባህል በ በ Global Transit and Transport Services ከፍተኛ ደረጃ ሎጂስቲክስ ስራ፣ ንግድ ማቅለልና የደንበኛ ሎጂስቲክስ አፈፃፀም ለማሻሻል ግልጽ ምኞት ያለበት ዕድገት።",
      description: "Global Transit ከዓለም ገበያዎች ወደ ምስራቅ አፍሪካ የሚደረጉ የዕቃ ዝውውሮችን ያስተባብራል። በኢትዮጵያ እና በምስራቅ አፍሪካ ኮሪደር ዋና መዳረሻ በሆነው ጅቡቲ ተቀምጠን፣ ጉምሩክ ማስፈቀጃ፣ ወደብ ሎጂስቲክስ እና ክልላዊ አቅርቦት ሰንሰለትን ቁጥጥር ወደር በሌለው ሙያ እናካሂዳለን።",
      missionTitle: "ተልእኳችን",
      missionText: "ኢትዮጵያዊያን እና ምስራቅ አፍሪካዊያን አስመጪዎች እና ላኪዎች ወደ ዓለም ገበያዎች እንዲደርሱ ማመቻቸት — አስተማማኝ፣ ፈጣን እና ለአካባቢ ሁኔታ የተስማሙ ሎጂስቲክስ መፍትሄዎች በማቅረብ።",
      stats: [
        { value: "ጅቡቲ", label: "ስትራቴጂካዊ ማዕከል" },
        { value: "ኢትዮጵያ", label: "ዋና ገበያ" },
        { value: "15+", label: "የምስራቅ አፍሪካ ሀገራት" }
      ]
    },
    regions: {
      title: "የሽፋን አካባቢያችን",
      subtitle: "ጅቡቲ፣ ኢትዮጵያ እና ምስራቅ አፍሪካ",
      djibouti: {
        name: "ጅቡቲ",
        role: "ስትራቴጂካዊ የባህር ማዕከል",
        desc: "ጅቡቲ የምስራቅ አፍሪካ የባህር መዳረሻ ናት። ዋና ቢሮአችን ሁሉንም የወደብ ስራዎች፣ የጉምሩክ ሽግግር እና ማቋቋሚያ ያስተባብራል።"
      },
      ethiopia: {
        name: "ኢትዮጵያ",
        role: "ዋና የማስመጣት ገበያ",
        desc: "120 ሚሊዮን ሕዝብ ያላት ምድር ተቦቅ ሀገር ኢትዮጵያ ለ95% ንግዷ የጅቡቲ ወደብ ትጠቀማለች። ዕቃዎችን፣ መሳሪያዎችን እና ጥሬ ዕቃዎችን ማስመጣትን እናስተዳድራለን።"
      },
      eastAfrica: {
        name: "ምስራቅ አፍሪካ",
        role: "ክልላዊ ስርጭት",
        desc: "ሶማሊያ፣ ኬንያ፣ ሱዳን፣ ኤርትራ፣ ዩጋንዳ፣ ሩዋንዳ — ድንበር አልባ ሎጂስቲክስ ለሁሉም ምስራቅ አፍሪካ ክልላዊ አውታርነታችን ተዘርጋ ነው።"
      }
    },
    services: {
      title: "አገልግሎቶቻችን",
      clearance: {
        title: "ክሊራንስ",
        desc: "የመጡ እና የወጡ ጉምሩክ፣ በጅቡቲ ወደብ እና በክልላዊ መንገዶች ላይ ሂደቶች እና መግለጫዎች።"
      },
      logistics: {
        title: "ሎጂስቲክስ",
        desc: "የሎጂስቲክስ ሰንሰለት፦ ማንሻ፣ ማቆያ፣ ትራንስፖርት እና ከበር እስከ በር ፍሰት ቅንብር።"
      },
      transit: {
        title: "ትራንዚት",
        desc: "በጅቡቲ — ኢትዮጵያ እና በምስራቅ አፍሪካ ኮሪደር ላይ የእቃ ሽግግር፦ ክትትል፣ ኪራይ እና ማድረስ።"
      },
      customs: {
        title: "የጉምሩክ ስርዓት",
        desc: "የጉምሩክ ስርዓት ድጋፍ፦ ደንብ ተገቢነት፣ ምደባ፣ ታክስ እና ከአስተዳደሮች ጋር ግንኙነት።"
      },
      documents: {
        title: "ሰነዶች",
        desc: "የፋይሎች ዝግጅት እና ክትትል፦ ኮንዞሜንቶች፣ ደረሰኞች፣ የመነሻ ሰርተፊኬት እና አስተዳደራዊ ዶክመንቶች።"
      }
    },
    projects: {
      title: "ዋና ፕሮጀክቶቻችን",
      p1: {
        title: "ጅቡቲ — አዲስ አበባ ኮሪደር",
        desc: "ለኢትዮጵያ ኢንዱስትሪ መሳሪያ አስመጪ ሙሉ ሎጂስቲክስ ሰንሰለት አስተዳደር — ከሻንጋይ ወደብ እስከ አዲስ አበባ መጋዘኖች።"
      },
      p2: {
        title: "የጅቡቲ ወደብ ማስፋፊያ",
        desc: "ወደ ዶራሌ ባለብዙ ዓላማ ወደብ ዘመናዊነት ሎጂስቲክስ ተሳትፎ — ኮንቴይነር ተርሚናል፣ ስራ አያያዝ እና የፍሰት አስተዳደር።"
      },
      p3: {
        title: "የምስራቅ አፍሪካ የሰብዓዊ ዕርዳታ",
        desc: "ለዓለም አቀፍ ኢ-መንግስታዊ ድርጅቶች በኢትዮጵያ፣ ሶማሊያ እና ሱዳን ምግብ፣ መድሃኒቶች እና አስቸኳይ መሳሪያዎች ማድረስ።"
      },
      viewAll: "ሁሉንም ፕሮጀክቶች ይመልከቱ"
    },
    contact: {
      title: "ፕሮጀክትዎን እንነጋገር",
      form: {
        name: "ሙሉ ስም",
        email: "ኢሜይል አድራሻ",
        service: "የሚፈለግ አገልግሎት",
        message: "የሎጂስቲክስ ፍላጎትዎን ይግለጹ",
        submit: "ዋጋ ይጠይቁ"
      },
      info: {
        title: "ዋና መሥሪያ ቤት — ጅቡቲ",
        address: "አቨኑ ዱ ጄነራል ዴ ጎል፣ ፒኦ ሳጥን 2450፣ ጅቡቲ ከተማ",
        phone: "+253 77 82 18 32 | +253 21 34 17 16 | +253 77 69 61 30",
        email: "info@gttsgroup.com"
      }
    },
    contactPage: {
      eyebrow: "ያግኙን",
      headline: "የሎጂስቲክስ ፕሮጀክትዎን ይጀምሩ።",
      intro:
        "ፍላጎትዎን ይግለጹ፦ የጭነት አይነት፣ መጠን፣ ኮሪደሮች (ጅቡቲ፣ ኢትዮጵያ፣ ወዘተ)፣ ጊዜ። በ24–48 ሰዓት የስራ ቀናት ውስጥ እንመልሳለን።",
      officeLabel: "ቢሮ",
      office: "ጅቡቲ",
      phoneLabel: "ቀጥታ መስመር",
      phoneDisplay: "+253 21 34 17 16",
      emailLabel: "ኢሜይል",
      emailDisplay: "info@gttsgroup.com",
      formTitle: "ጥያቄ ላክ",
      firstName: "ስም",
      lastName: "የአባት ስም",
      email: "ኢሜይል",
      phone: "ስልክ",
      interestLabel: "የሚፈለገ አገልግሎት...",
      otherService: "ሌላ",
      destinationsLabel: "የሚመረጥ ኮሪደር / መድረሻ",
      destinationsPlaceholder: "ለምሳሌ፦ የጅቡቲ ወደብ፣ አዲስ አበባ...",
      messageLabel: "መልዕክት",
      messagePlaceholder: "መጠኖች፣ የእቃ አይነት፣ የጊዜ ሰሌዳ...",
      submit: "ጥያቄ ላክ",
      toastTitle: "ተቀብለናል",
      toastDesc: "በቅርቡ እንደገና እንገናኛለን።",
      sendError: "መላክ አልተሳካም። እንደገና ይሞክሩ።"
    },
    activitiesPage: {
      eyebrow: "ስራዎቻችን",
      title: "በመስክ ላይ — ጅቡቲ እና በምስራቅ አፍሪካ",
      subtitle: "የወደብ ስራ፣ የመንገድ ትራንስፖርት፣ ማቆያ እና የጅቡቲ — ኢትዮጵያ ኮሪደር።",
      intro:
        "ቡድኖቻችን በተርሚናሎች፣ በሎጂስቲክስ ዞኖች እና በአስፈላጊ መንገዶች ላይ ይሰራሉ፦ የኮንቴይነር ጭነት፣ ትራንስፖርት፣ ጉምሩክ እና ወደ አዲስ አበባ ስርጭት።",
      pillarsTitle: "የሙያ ዘርፎቻችን",
      galleryTitle: "ስራዎቻችን በምስል",
      cta: "ስለ ሎጂስቲክስ ይወያዩ",
      cap1: "በጅቡቲ ወደብ የባህር ጭነት እና ትራንዚት።",
      cap2: "የመንገድ ትራንስፖርት — ጅቡቲ — ኢትዮጵያ ኮሪደር።",
      cap3: "የአቅርቦት ሰንሰለት እና ደህንነቱ የተጠበቀ ማቆያ።",
      cap4: "ኢንዱስትሪ ፕሮጀክቶች እና ከባድ መሳሪያዎች።",
      cap5: "የሎጂስቲክስ መሠረተ ልማት እና የወደብ ማንሻ።",
      cap6: "ዓለም አቀፍ የባህር ግንኙነቶች እና ክልላዊ ፍሰቶች።"
    },
    ui: {
      brandTagline: "ትራንስፖርት እና ሎጂስቲክስ",
      navClients: "ደንበኞቻችን",
      navNews: "ዜና",
      selectLanguage: "ቋንቋ ይምረጡ",
      companySummary: "በጅቡቲ የተመሰረተ የሎጂስቲክስ፣ ትራንዚት እና ጉምሩክ ሙያ።",
      companyTrustNote: "ለክልላዊ እና ዓለም አቀፍ ጭነት እርምጃዎች የታመነ አጋር።",
      keyStrengths: "ዋና ጥንካሬዎች",
      professionalStandards: "የሙያ ደረጃዎች",
      strengthCommunication: "ግንኙነት",
      strengthTeamwork: "የቡድን ሥራ",
      strengthProcessReport: "የሂደት ሪፖርት",
      strengthResponsibility: "ኃላፊነት",
      strengthFinalReport: "የመጨረሻ ሪፖርት",
      experienceTitle: "ልምድ",
      experienceValue: "15 ዓመት",
      experienceDesc: "በሎጂስቲክስ፣ ትራንዚት እና ጉምሩክ ማስተባበር ጠንካራ የስራ ልምድ።",
      teamEyebrow: "ቡድናችን",
      teamIntro: "ከጅቡቲ ወደብ እስከ ክልላዊ ኮሪደሮች ድረስ የሎጂስቲክስ ክንውኖችዎን የሚያስጠብቅ ቡድን።",
      careersEyebrow: "የስራ እድሎች",
      careersIntro: "በጅቡቲ — ኢትዮጵያ ኮሪደር ላይ ከሚሰራ ቡድን ጋር ይቀላቀሉ።",
      projectsIntro: "ዋና ፕሮጀክቶቻችንን እና ኦፕሬሽኖቻችንን ይመልከቱ።",
      loadErrorTryLater: "የመጫን ችግር አለ። በኋላ ይሞክሩ።",
      noTeamMembers: "ገና የታተመ የቡድን አባል የለም።",
      noCareers: "አሁን የታተመ የስራ ማስታወቂያ የለም።",
      noProjects: "አሁን የታተመ ፕሮጀክት የለም።",
      contactUsShort: "ያግኙን",
      applyNow: "አሁን ያመልክቱ",
      projectGeneric: "ፕሮጀክት"
    },
    login: {
      title: "መግቢያ",
      user: "ተጠቃሚ",
      userPlaceholder: "ኢሜይል አድራሻ",
      password: "የይለፍ ቃል",
      passwordPlaceholder: "••••••••",
      submit: "ግባ",
      error: "የተሳሳተ መረጃ።",
      backHome: "ወደ መነሻ ተመለስ"
    },
    adminPage: {
      title: "አስተዳዳሪ",
      subtitle: "ዳሽቦርድ",
      noInquiries: "ጥያቄ የለም።",
      colId: "መለያ",
      colDate: "ቀን",
      colName: "ስም",
      colEmail: "ኢሜይል",
      colPhone: "ስልክ",
      colInterest: "አገልግሎት",
      colDescription: "መግለጫ",
      colMessage: "መልዕክት",
      colReviewer: "አስተናጋጅ",
      colAction: "እርምጃ",
      logout: "ውጣ",
      loginRequired: "ለአስተዳዳሪዎች ብቻ።",
      goLogin: "መግቢያ",
      loadError: "መጫን አልተሳካም።",
      backToSite: "ወደ ጣቢያ ተመለስ",
      menu: "ምናሌ",
      navStats: "የድር ጣቢያ ስታትስቲክስ",
      navActivities: "እንቅስቃሴዎቻችን",
      navTeam: "ቡድናችን",
      navCareers: "ስራዎች",
      navProjects: "ፕሮጀክቶቻችን",
      navContact: "እውቂያ",
      navSettings: "ቅንብሮች",
      statsTitle: "አመልካቾች",
      statInquiries: "የእውቂያ ጥያቄዎች",
      statUsers: "የተጠቃሚ መለያዎች",
      statAdmins: "አስተዳዳሪዎች",
      statsHint: "ከ MongoDB ውሂብ።",
      inquiriesTitle: "የተቀበሉ ጥያቄዎች",
      cmsTitle: "የጣቢያ ይዘት",
      cmsBody: "የይዘት አስተዳደር በኋላ ሊጨመር ይችላል። የህዝብ ገጹን ይክፈቱ።",
      cmsOpenSite: "በጣቢያ ላይ ይመልከቱ",
      settingsTitle: "ቅንብሮች",
      settingsAccount: "የተገናኘ መለያ",
      settingsBody: "የላቀ አማራጮች በኋላ።",
      navUsers: "ተረትላግርች",
      navRoles: "ምንላች",
      navPermissions: "ግታላሎች"
    },
    footer: {
      developer: "በGEOSOM Technologies ተዘጋጀ",
      copyright: "© 2025 Global Transit and Transport Services. መብቱ በህግ የተጠበቀ ነው። | ጅቡቲ እና ኢትዮጵያ",
      links: ["የግላዊነት ፖሊሲ", "ውሎች እና ሁኔታዎች", "የጉምሩክ ህጎች"]
    }
  },
  sw: {
    nav: {
      aboutUs: "Kuhusu Sisi",
      ourCompany: "Kampuni Yetu",
      ourTeam: "Timu Yetu",
      careers: "Ajira",
      ourBusiness: "Biashara Yetu",
      ourProjects: "Miradi Yetu",
      contactUs: "Wasiliana Nasi",
      login: "Ingia",
      admin: "Msimamizi",
      language: "Kiswahili"
    },
    hero: {
      headline: "Lango lako la Djibouti, Ethiopia na Afrika Mashariki",
      subheadline: "Mshirika wako maalum wa uingizaji na usafirishaji wa bidhaa kati ya masoko ya kimataifa na Afrika Mashariki — kupitia bandari ya kimkakati ya Djibouti.",
      cta: "Gundua Huduma Zetu"
    },
    about: {
      title: "Wataalamu wa Njia ya Djibouti — Ethiopia",
      backgroundText: "Tangu 2012, Global Transit and Transport Services imesaada biashara, wanabiashara, na waendeshaji wa kiuchumi kwa suluhisho za kitaalamu katika usafirishaji, usafiri, mantiki, na ufutaji wa forodha. Kupitia ujuzi wake, kuwepo kwa kimkakati Djibouti, uunganisho wa uendeshaji na Ethiopia, na maoni ya kikanda yanayoenea Afrika Mashariki, kampuni imejifanya kama mshirika wa kuaminika, wenye muundo, na wenye majibu. Ikioongezwa na timu yenye ustadi na utamaduni wa huduma unaozingatia kuridhika kwa ajili, Global Transit and Transport Services inaendelea kukua kwa makusudi wazi ya kutoa huduma za kipekee, kurahisisha biashara, na kuchangia kwa bidii katika utendaji wa mantiki wa wateja wake.",
      description: "Global Transit inaratibu mtiririko wa bidhaa kati ya masoko ya kimataifa na Afrika Mashariki. Tukiwa Djibouti, lango kuu la Ethiopia na ukanda wa Afrika Mashariki, tunamiliki utaratibu wa forodha, mantiki ya bandari, na mnyororo wa usambazaji wa kikanda kwa utaalamu usio na kifani.",
      missionTitle: "Dhamira Yetu",
      missionText: "Kurahisisha ufikiaji wa waingizaji na wasafirishaji wa Ethiopia na Afrika Mashariki kwenye masoko ya kimataifa, kwa kutoa suluhisho za usafirishaji zinazotegemewa, za haraka na zinazofaa hali ya hewa ya ndani.",
      stats: [
        { value: "Djibouti", label: "Kituo cha Kimkakati" },
        { value: "Ethiopia", label: "Soko Kuu" },
        { value: "15+", label: "Nchi za Afrika Mashariki" }
      ]
    },
    regions: {
      title: "Eneo Letu la Huduma",
      subtitle: "Djibouti, Ethiopia na Afrika Mashariki",
      djibouti: {
        name: "Djibouti",
        role: "Kituo cha Kimkakati cha Baharini",
        desc: "Djibouti ni lango la baharini la Afrika Mashariki. Ofisi yetu kuu inaratibu shughuli zote za bandari, usafiri wa forodha na uhifadhi."
      },
      ethiopia: {
        name: "Ethiopia",
        role: "Soko Kuu la Uingizaji",
        desc: "Ethiopia, nchi isiyopakana na bahari yenye watu milioni 120, inategemea bandari ya Djibouti kwa 95% ya biashara yake. Tunasimamia uingizaji wa bidhaa, vifaa na malighafi."
      },
      eastAfrica: {
        name: "Afrika Mashariki",
        role: "Upanuzi wa Kikanda",
        desc: "Somalia, Kenya, Sudan, Eritrea, Uganda, Rwanda — mtandao wetu wa kikanda unaenea Afrika Mashariki nzima kwa mantiki isiyo na mipaka."
      }
    },
    services: {
      title: "Huduma zetu",
      clearance: {
        title: "Clearance",
        desc: "Ufutaji wa forodha wa uingizaji na usafirishaji, taratibu na matangazo katika Bandari ya Djibouti na njia za kikanda."
      },
      logistics: {
        title: "Logistics",
        desc: "Mnyororo wa mantiki: upakiaji, uhifadhi, usafirishaji na uratibu wa mtiririko kutoka mlango hadi mlango."
      },
      transit: {
        title: "Transit",
        desc: "Upitishaji wa bidhaa kwenye njia ya Djibouti — Ethiopia na Afrika Mashariki: ufuatiliaji, usafirishaji na utoaji."
      },
      customs: {
        title: "Mfumo wa forodha",
        desc: "Msaada wa mfumo wa forodha: kufuata kanuni, uainishaji, ushuru na uhusiano na idara."
      },
      documents: {
        title: "Nyaraka",
        desc: "Kuandaa na kufuatilia faili: vyeti vya usafirishaji, ankara, vyeti vya asili na nyaraka za kiutawala."
      }
    },
    projects: {
      title: "Miradi Mashuhuri",
      p1: {
        title: "Njia ya Djibouti — Addis Ababa",
        desc: "Usimamizi wa mnyororo wa mantiki kamili kwa mwingizaji wa vifaa vya viwanda wa Ethiopia — kutoka bandari ya Shanghai hadi maghala ya Addis Ababa."
      },
      p2: {
        title: "Upanuzi wa Bandari ya Djibouti",
        desc: "Ushiriki wa kimantiki katika usasishaji wa Bandari ya Doraleh ya Matumizi Mengi — kituo cha makontena, uendeshaji na usimamizi wa mtiririko."
      },
      p3: {
        title: "Misaada ya Kibinadamu Afrika Mashariki",
        desc: "Uwasilishaji wa chakula, dawa na vifaa vya dharura kwa mashirika ya kimataifa yasiyokuwa ya serikali nchini Ethiopia, Somalia na Sudan."
      },
      viewAll: "Tazama Miradi Yote"
    },
    contact: {
      title: "Tuzungumze kuhusu Mradi Wako",
      form: {
        name: "Jina Kamili",
        email: "Barua Pepe",
        service: "Huduma Inayohitajika",
        message: "Eleza mahitaji yako ya mantiki",
        submit: "Omba Nukuu"
      },
      info: {
        title: "Makao Makuu — Djibouti",
        address: "Njia ya Jenerali de Gaulle, S.L.P 2450, Mji wa Djibouti",
        phone: "+253 77 82 18 32 | +253 21 34 17 16 | +253 77 69 61 30",
        email: "info@gttsgroup.com"
      }
    },
    contactPage: {
      eyebrow: "WASILIANA NASI",
      headline: "Anzisha mradi wako wa usafirishaji.",
      intro:
        "Eleza mahitaji: aina ya mizigo, kiasi, njia (Djibouti, Ethiopia, n.k.), na ratiba. Tutajibu ndani ya saa 24–48 za kazi.",
      officeLabel: "OFISI",
      office: "Djibouti",
      phoneLabel: "SIMU YA MOJA KWA MOJA",
      phoneDisplay: "+253 21 34 17 16",
      emailLabel: "BARUA PEPE",
      emailDisplay: "info@gttsgroup.com",
      formTitle: "Tuma ombi",
      firstName: "Jina la kwanza",
      lastName: "Jina la ukoo",
      email: "Barua pepe",
      phone: "Simu",
      interestLabel: "Nina nia na...",
      otherService: "Nyingine",
      destinationsLabel: "Njia / eneo unalotaka",
      destinationsPlaceholder: "mf. Bandari ya Djibouti, Addis Ababa...",
      messageLabel: "Ujumbe",
      messagePlaceholder: "Kiasi, aina ya bidhaa, ratiba...",
      submit: "TUMA OMBI",
      toastTitle: "Ombi limepokelewa",
      toastDesc: "Tutawasiliana nawe hivi karibuni.",
      sendError: "Imeshindikana kutuma. Jaribu tena baadaye."
    },
    activitiesPage: {
      eyebrow: "SHUGHULI ZETU",
      title: "Ardhini — Djibouti na Afrika Mashariki",
      subtitle: "Uhandisi bandarini, usafiri wa barabara, hifadhi na njia ya Djibouti — Ethiopia.",
      intro:
        "Timu zetu hufanya kazi kwenye viwanja vya mizigo, maeneo ya mantiki na barabara muhimu: upakiaji wa makontena, usafirishaji, forodha na usambazaji hadi Addis Ababa na kanda.",
      pillarsTitle: "Maeneo ya utaalamu",
      galleryTitle: "Shughuli zetu picha",
      cta: "Zungumza kuhusu mtiririko wako",
      cap1: "Usafirishaji wa baharini na mpito kupitia bandari ya Djibouti.",
      cap2: "Usafiri wa barabara — njia ya Djibouti — Ethiopia.",
      cap3: "Mnyororo wa usambazaji na hifadhi salama.",
      cap4: "Miradi ya viwanda na vifaa vizito.",
      cap5: "Miundombinu ya mantiki na uhandisi wa bandarini.",
      cap6: "Miunganiko ya kimataifa ya baharini na mtiririko wa kikanda."
    },
    ui: {
      brandTagline: "Usafiri & Lojistiki",
      navClients: "Wateja Wetu",
      navNews: "Habari",
      selectLanguage: "Chagua lugha",
      companySummary: "Utaalamu wa lojistiki, transit na forodha unaoendeshwa Djibouti.",
      companyTrustNote: "Mshirika wa kuaminika kwa operesheni za mizigo za kikanda na kimataifa.",
      keyStrengths: "Nguvu kuu",
      professionalStandards: "Viwango vya Kitaalamu",
      strengthCommunication: "Mawasiliano",
      strengthTeamwork: "Kazi ya timu",
      strengthProcessReport: "Ripoti ya mchakato",
      strengthResponsibility: "Uwajibikaji",
      strengthFinalReport: "Ripoti ya mwisho",
      experienceTitle: "Uzoefu",
      experienceValue: "Miaka 15",
      experienceDesc: "Uzoefu imara wa kiutendaji katika lojistiki, transit na uratibu wa forodha.",
      teamEyebrow: "TIMU YETU",
      teamIntro: "Timu iliyojitolea kulinda operesheni zako za lojistiki kutoka bandari ya Djibouti hadi njia za kikanda.",
      careersEyebrow: "AJIRA",
      careersIntro: "Jiunge na timu inayofanya kazi kwenye ukanda wa Djibouti — Ethiopia.",
      projectsIntro: "Gundua miradi na operesheni zetu bora.",
      loadErrorTryLater: "Hitilafu ya kupakia. Jaribu tena baadaye.",
      noTeamMembers: "Bado hakuna mwanachama wa timu aliyechapishwa.",
      noCareers: "Kwa sasa hakuna nafasi ya kazi iliyochapishwa.",
      noProjects: "Kwa sasa hakuna mradi uliochapishwa.",
      contactUsShort: "Wasiliana nasi",
      applyNow: "Omba sasa",
      projectGeneric: "Mradi"
    },
    login: {
      title: "Ingia",
      user: "Mtumiaji",
      userPlaceholder: "Barua pepe",
      password: "Nenosiri",
      passwordPlaceholder: "••••••••",
      submit: "Ingia",
      error: "Taarifa si sahihi.",
      backHome: "Rudi mwanzo"
    },
    adminPage: {
      title: "Msimamizi",
      subtitle: "Dashibodi",
      noInquiries: "Hakuna maombi bado.",
      colId: "ID",
      colDate: "Tarehe",
      colName: "Jina",
      colEmail: "Barua pepe",
      colPhone: "Simu",
      colInterest: "Huduma",
      colDescription: "Maelezo",
      colMessage: "Ujumbe",
      colReviewer: "Aliyehakiki",
      colAction: "Kitendo",
      logout: "Toka",
      loginRequired: "Kwa wasimamizi tu.",
      goLogin: "Ingia",
      loadError: "Hitilafu ya kupakia.",
      backToSite: "Rudi kwenye tovuti",
      menu: "Menyu",
      navStats: "Takwimu za tovuti",
      navActivities: "Shughuli zetu",
      navTeam: "Timu yetu",
      navCareers: "Kazi",
      navProjects: "Miradi yetu",
      navContact: "Mawasiliano",
      navSettings: "Mipangilio",
      statsTitle: "Viashiria",
      statInquiries: "Maombi ya mawasiliano",
      statUsers: "Akaunti za watumiaji",
      statAdmins: "Wasimamizi",
      statsHint: "Data kutoka MongoDB.",
      inquiriesTitle: "Maombi yaliyopokelewa",
      cmsTitle: "Maudhui ya tovuti",
      cmsBody: "Utawala wa maudhui utaongezwa baadaye. Fungua ukurasa wa umma.",
      cmsOpenSite: "Tazama kwenye tovuti",
      settingsTitle: "Mipangilio",
      settingsAccount: "Akaunti iliyounganishwa",
      settingsBody: "Chaguo za hali ya juu baadaye.",
      navUsers: "Watumiaji",
      navRoles: "Majukumu",
      navPermissions: "Ruhusa"
    },
    footer: {
      developer: "Iliwezeshwa na GEOSOM Technologies",
      copyright: "© 2025 Global Transit and Transport Services. Haki zote zimehifadhiwa. | Djibouti & Ethiopia",
      links: ["Sera ya Faragha", "Vigezo na Masharti", "Utekelezaji wa Forodha"]
    }
  },
  so: {
    nav: {
      aboutUs: "Nagu Saabsan",
      ourCompany: "Shirkadeena",
      ourTeam: "Kooxdeena",
      careers: "Shaqooyinka",
      ourBusiness: "Ganacsigeena",
      ourProjects: "Mashaariicdeena",
      contactUs: "Nala Soo Xiriir",
      login: "Gal",
      admin: "Maamulaha",
      language: "Soomaali"
    },
    hero: {
      headline: "Albaabkaaga Jabuuti, Itoobiya iyo Bariga Afrika",
      subheadline: "Wadaagaaga khaaska ah ee soo dejinta iyo dirista alaabta u dhexeeya suuqyada caalamiga ah iyo Bariga Afrika — iyada oo loo marayo dekedda istiraatiijiyada ah ee Jabuuti.",
      cta: "Ogow Adeegyadeena"
    },
    about: {
      title: "Khabiirada marinka Jabuuti — Itoobiya",
      description:
        "Global Transit waxay isku xiraysaa suuqyada adduunka iyo Bariga Afrika. Iyadoo xarunteedu tahay Jabuuti — albaabka Itoobiya iyo marinnada Bariga Afrika — waxaan ku takhasusnay jamaarada, saadka dekedda, iyo silsilada saadka gobolka.",
      backgroundText: "Intii laga bilaabay 2012, Global Transit and Transport Services waxay taageersatay ganacsiyo, ganacsatoyaal, iyo maliyeyaal oo kale iyada oo la bixiya xallinta xirfadlaysiinta ah ee marinta, gaadiidka, saadka, iyo jamaarada. Iyada oo ay leedahay khibrad, joog istiraatiijiyad Jabuuti, xiriir hawl loo yeesho Itoobiya, iyo aragtiyaha gobolka ee loo dhaaftay Afrika Mashariki, kampanigu wuxuu noqday wadaag lagu kalsoon yahay oo habaysan. Koox xirfad leh iyo dhaqan adeeg oo diiradda saaraya qanacsiga macaamiisha, Global Transit and Transport Services waxay sii wadaysaa inay bixiso adeegyo tayo leh, fududeyso ganacsiga, waxayna gacan ka geysato waxqabadka saadka macaamiisheeda.",
      missionTitle: "Hadafkeena",
      missionText: "Fududaynta helitaanka soo dejiyeyaasha iyo diriyeyaasha Itoobiyaanka iyo Bariga Afrika ee suuqyada adduunka, iyaga oo la siinayo xalalka saadka ee laydin ammaan ahaan, degdeg ahaan iyo midka u eg dunida haweenkaa Afrika, waxaan si fiican u garannaa habraacyada jamaarada, shaqaynta dekedda, iyo silsilada saadka gobolka oo khibrad aan la mid lahayn.",
      stats: [
        { value: "Jabuuti", label: "Xarun Istiraatiijiyad" },
        { value: "Itoobiya", label: "Suuqda Weyn" },
        { value: "15+", label: "Wadamada Bariga Afrika" }
      ]
    },
    regions: {
      title: "Goobta Aan Daboolno",
      subtitle: "Jabuuti, Itoobiya iyo Bariga Afrika",
      djibouti: {
        name: "Jabuuti",
        role: "Xarun Badeed oo Istiraatiijiyad ah",
        desc: "Jabuuti waa albaabka badeed ee Bariga Afrika. Xafiiskayaga ugu weyn wuxuu iska hagaajiyaa dhammaan hawlaha dekedda, gudbinta jamaarada iyo kaydinta."
      },
      ethiopia: {
        name: "Itoobiya",
        role: "Suuqda Weyn ee Soo Dejinta",
        desc: "Itoobiya, dalka aan bad lahayn ee 120 milyan oo qof, waxay ku tirsantaa dekedda Jabuuti 95% ganacsigeedu. Waxaan maamulinaa soo dejinta alaabta, qaladka iyo agabka."
      },
      eastAfrica: {
        name: "Bariga Afrika",
        role: "Ballaarinta Gobolka",
        desc: "Soomaaliya, Kenya, Sudan, Eritrea, Uganda, Rwanda — shabakadeena gobolka waxay ku fadhiyaan dhammaan Bariga Afrika saadka aan xuduud lahayn."
      }
    },
    services: {
      title: "Adeegyadeena",
      clearance: {
        title: "Clearance",
        desc: "Soo dejinta iyo dirista jamaarada, nidaamyada iyo ogeysiisyada dekedda Jabuuti iyo wadooyinka gobolka."
      },
      logistics: {
        title: "Logistics",
        desc: "Silsilada saadka: shaqada dekedda, kaydinta, gaadiidka iyo isku xirka socodka albaabka ilaa albaabka."
      },
      transit: {
        title: "Transit",
        desc: "Marinta alaabta jidka Jabuuti — Itoobiya iyo Bariga Afrika: raadraaca, rarida iyo gaarsiinta."
      },
      customs: {
        title: "Nidaamka jamaarada",
        desc: "Taageerada nidaamka jamaarada: u hoggaansanaanta, kala-soocidda, canshuuraha iyo xiriirka hay'adaha."
      },
      documents: {
        title: "Dukumiintiyada",
        desc: "Diyaarinta iyo raadraaca faylasha: waraaqaha maraakiibta, biilasha, shahaadooyinka asalka iyo dukumiintiyada maamulka."
      }
    },
    projects: {
      title: "Mashaariicda Muhiimka ah",
      p1: {
        title: "Jidka Jabuuti — Addis Ababa",
        desc: "Maamulka silsilada saadka oo dhamaystiran oo loogu talagalay soo dejiye Itoobiyaan ah ee qaladka wershadaha — ka dekedda Shanghai ilaa kaydiyaasha Addis Ababa."
      },
      p2: {
        title: "Ballaarinta Dekedda Jabuuti",
        desc: "Kaqeyb-galka saadka ah ee casriyeynta Dekadda Doraleh ee Ujeedooyin Badan — guriga weelasha, gacanta iyo maamulka socdaalka."
      },
      p3: {
        title: "Gargaarka Bulsho ee Bariga Afrika",
        desc: "Gaarsiinta cunto, dawo iyo qalab deg-deg ah ee ururada caalamiga ah ee aan dowli ahayn ee Itoobiya, Soomaaliya iyo Sudan."
      },
      viewAll: "Daawo Dhammaan Mashaariicda"
    },
    contact: {
      title: "Nala Hadal Mashruucaaga",
      form: {
        name: "Magaca Buuxa",
        email: "Cinwaanka Iimaylka",
        service: "Adeegga Loo Baahan Yahay",
        message: "Sharax baahidaada saadka",
        submit: "Codsiga Qiimaynta"
      },
      info: {
        title: "Xafiiska Guud — Jabuuti",
        address: "Avenue du Général de Gaulle, BP 2450, Magaalada Jabuuti",
        phone: "+253 77 82 18 32 | +253 21 34 17 16 | +253 77 69 61 30",
        email: "info@gttsgroup.com"
      }
    },
    contactPage: {
      eyebrow: "NOLA SOO XIRIIR",
      headline: "Bilow mashruuca saadkaaga.",
      intro:
        "Ku sharax baahida: nooca rarka, tirada, wadooyinka (Jabuuti, Itoobiya, iwm.), jadwalka. Waxaan kuugu jawaabi doonaa 24–48 saacadood oo shaqo gudahood.",
      officeLabel: "XAFIIS",
      office: "Jabuuti",
      phoneLabel: "SI TAXADA TOOSKA AH",
      phoneDisplay: "+253 21 34 17 16",
      emailLabel: "IIMEYL",
      emailDisplay: "info@gttsgroup.com",
      formTitle: "Dir codsiga",
      firstName: "Magaca hore",
      lastName: "Magaca qoyska",
      email: "Iimayl",
      phone: "Taleefan",
      interestLabel: "Waxaan xiiseynayaa...",
      otherService: "Kale",
      destinationsLabel: "Wadada / meesha aad jeceshahay",
      destinationsPlaceholder: "tusaale: Dekedda Jabuuti, Addis Ababa...",
      messageLabel: "Fariin",
      messagePlaceholder: "Tirada, nooca alaabta, jadwalka...",
      submit: "DIR CODSIGA",
      toastTitle: "Codsiga waa la helay",
      toastDesc: "Waxaan kula soo xiriiri doonaa dhowaan.",
      sendError: "Lama diri karin. Mar kale isku day."
    },
    activitiesPage: {
      eyebrow: "HAWLAHAAGA",
      title: "Goobta — Jabuuti iyo Bariga Afrika",
      subtitle: "Shaqada dekedda, gaadiidka waddooyinka, kaydinta iyo wadada Jabuuti — Itoobiya.",
      intro:
        "Kooxdeenu waxay ka shaqeeyaan xarumaha, goobaha saadka iyo wadooyinka muhiimka ah: rarida weelasha, gaadiidka, jamaarada iyo qaybinta Addis Ababa iyo gobolka.",
      pillarsTitle: "Meelaha khibrada",
      galleryTitle: "Hawlaha sawirada",
      cta: "Ka wada hadal socodkaaga saadka",
      cap1: "Rarida badda iyo gudbinta dekedda Jabuuti.",
      cap2: "Gaadiidka waddooyinka — wadada Jabuuti — Itoobiya.",
      cap3: "Silsilada saadka iyo kaydinta ammaan ah.",
      cap4: "Mashaariicda warshadaha iyo qalabka culus.",
      cap5: "Kaabayaasha saadka iyo shaqada dekedda.",
      cap6: "Xiriirka badda ee caalamiga ah iyo socodka gobolka."
    },
    ui: {
      brandTagline: "Gaadiid & Saad",
      navClients: "Macaamiisheena",
      navNews: "Warar",
      selectLanguage: "Dooro luqadda",
      companySummary: "Khibrad saadka, transit iyo kastamka oo ku saleysan Jabuuti.",
      companyTrustNote: "Wadaag lagu kalsoon yahay howlaha xamuulka ee gobol iyo caalami.",
      keyStrengths: "Awoodaha muhiimka ah",
      professionalStandards: "Heerarka Xirfadeed",
      strengthCommunication: "Isgaarsiin",
      strengthTeamwork: "Wadashaqeyn",
      strengthProcessReport: "Warbixinta habraaca",
      strengthResponsibility: "Mas'uuliyad",
      strengthFinalReport: "Warbixin kama dambeys ah",
      experienceTitle: "Khibrad",
      experienceValue: "15 sano",
      experienceDesc: "Khibrad hawlgal oo xooggan oo ku saabsan saadka, transit iyo isku-duwidda kastamka.",
      teamEyebrow: "KOOXDEENA",
      teamIntro: "Koox heegan ah oo ilaalisa howlahaaga saadka laga bilaabo dekedda Jabuuti ilaa marinnada gobolka.",
      careersEyebrow: "SHAQOOYIN",
      careersIntro: "Ku biir koox ka shaqeysa marinka Jabuuti — Itoobiya iyo socodka gobolka.",
      projectsIntro: "Ogow mashaariicdeena iyo hawlgallada muhiimka ah.",
      loadErrorTryLater: "Khalad soo dejin ah. Fadlan mar kale isku day.",
      noTeamMembers: "Weli lama daabicin xubin kooxeed.",
      noCareers: "Weli lama daabicin fursad shaqo.",
      noProjects: "Weli lama daabicin mashruuc.",
      contactUsShort: "Nala soo xiriir",
      applyNow: "Codso hadda",
      projectGeneric: "Mashruuc"
    },
    login: {
      title: "Gal",
      user: "Isticmaale",
      userPlaceholder: "Iimaylkaaga",
      password: "Eray sir",
      passwordPlaceholder: "••••••••",
      submit: "Gal",
      error: "Macluumaad khalad ah.",
      backHome: "Ku laabo bogga hore"
    },
    adminPage: {
      title: "Maamulaha",
      subtitle: "Dashboard",
      noInquiries: "Weli codsi ma jiro.",
      colId: "ID",
      colDate: "Taariikh",
      colName: "Magac",
      colEmail: "Iimayl",
      colPhone: "Taleefoon",
      colInterest: "Adeeg",
      colDescription: "Sharaxaad",
      colMessage: "Fariin",
      colReviewer: "Wax ka qaatay",
      colAction: "Ficil",
      logout: "Ka bax",
      loginRequired: "Kaliya maamulayaasha.",
      goLogin: "Gal",
      loadError: "Khalad soo dejinta.",
      backToSite: "Ku laabo bogga",
      menu: "Liiska",
      navStats: "Tirakoobka bogga",
      navActivities: "Howlaheena",
      navTeam: "Kooxdeena",
      navCareers: "Shaqooyinka",
      navProjects: "Mashaariicdeena",
      navContact: "Xiriir",
      navSettings: "Dejinta",
      statsTitle: "Tilmaamayaasha",
      statInquiries: "Codsiyada xiriirka",
      statUsers: "Akoonnada isticmaalayaasha",
      statAdmins: "Maamulayaasha",
      statsHint: "Xog ka timid MongoDB.",
      inquiriesTitle: "Codsiyada la helay",
      cmsTitle: "Mawduuca bogga",
      cmsBody: "Maamulka mawduuca waa la dari karaa. Fur bogga dadweynaha.",
      cmsOpenSite: "Ku eeg bogga",
      settingsTitle: "Dejinta",
      settingsAccount: "Akoonka ku xiran",
      settingsBody: "Xulashooyin horumarsan markale.",
      navUsers: "Isticmaaleyaasha",
      navRoles: "Doorka",
      navPermissions: "Ogolaanshaha"
    },
    footer: {
      copyright: "© 2025 Global Transit and Transport Services. Dhammaan xuquuqaha waa la xafiday. | Jabuuti & Itoobiya",
      developer: "Waxaa lagu samaynayay GEOSOM Technologies",
      links: ["Siyaasadda Khaaska ah", "Shuruudaha & Xaaladaha", "Xeerka Jamaarada"]
    }
  },
  orm: {
    nav: {
      aboutUs: "Waa'ee Keenya",
      ourCompany: "Dhaabbata Keenya",
      ourTeam: "Garee Keenya",
      careers: "Carraa Hojii",
      ourBusiness: "Hojii Keenya",
      ourProjects: "Pirojektota Keenya",
      contactUs: "Nu Quunnamaa",
      login: "Seensa",
      admin: "Bulchaa",
      language: "Afaan Oromoo"
    },
    hero: {
      headline: "Balbala Keessan Jibuutii, Itoophiyaa fi Baha Afriikaa",
      subheadline: "Michuu keessan addaa kan gabaa addunyaa fi Baha Afriikaa walitti fidu — buufata galaanaa Jibuutii hundeessaa qabuun.",
      cta: "Tajaajilawwan Keenya Baradhaa"
    },
    about: {
      title: "Ogeeyyii Daandii Jibuutii — Itoophiyaa",
      description: "Global Transit socha meeshaalee gabaa addunyaa fi Baha Afriikaa gidduutti ni qindeessa. Jibuutii, balbala guddaa Itoophiyaa fi daandii Baha Afriikaatti argamnee, gurgurtaa gumrukaa, loojistiiksii buufataa, fi raabsii dhiyeessii naannoo muuxannoo qabuun ni bulchina.",
      backgroundText: "Jalqabee 2012 irraa, Global Transit and Transport Services dhaabbilee, gadaatota fi hojjechiisa ekonomikaa tajaajilawwan ogeeyyii irratti gargaara ture. Muuxannoo isaa, jiru strategii Jibuutiitti, walitti dhufeenya hojii Itoophiyaa waliin, fi hubannoo naannoo Baha Afriikaa irratti, dhaabbatni kaayyoo tajaajila itti fe'uu, miccaa gaarii, fi hirmaannaa dhaabbaa tajaajila dandeettii loojistiiksii namaa gidduutti ni jiraata. Garee ogeessa fi harkaawwan tajaajila cunqursaa irratti jiidhaaf Global Transit and Transport Services itti fufiinsa babal'ina tajaajila gaarii kennuu, gurgurtaa salphiisuu, fi hirmaannaa tajaajila loojistiiksii namaa gidduutti hojjechuun itti fufa.",
      missionTitle: "Ergama Keenya",
      missionText: "Futaachuu fi erguu dhaabbilee Itoophiyaa fi Baha Afriikaa gabaa addunyaa irra akka gahuuf gargaaruu tajaajilawwan loojistiiksii itti fe'uu jalqabu, saffisa fi gaar biiroon muuxannoo keessaa itti fufiinsa qabuun.",
      stats: [
        { value: "Jibuutii", label: "Buufata Strategii" },
        { value: "Itoophiyaa", label: "Gabaa Gurguddoo" },
        { value: "15+", label: "Biyyoota Baha Afriikaa" }
      ]
    },
    regions: {
      title: "Naannoo Hojii Keenya",
      subtitle: "Jibuutii, Itoophiyaa fi Baha Afriikaa",
      djibouti: {
        name: "Jibuutii",
        role: "Buufata Galaanaa Strategii",
        desc: "Jibuutii balbala galaanaa Baha Afriikaati. Waajjirri keenya ol'aanaan hojii buufataa, daandii gumrukaa fi kuusaa hunda ni qindeessa."
      },
      ethiopia: {
        name: "Itoophiyaa",
        role: "Gabaa Fudhataa Gurguddoo",
        desc: "Itoophiyaan, biyya galaanaa hin qabne miliyoona 120 jiraattu, gurgurtaa isii keessaa 95% buufata Jibuutiitti hirkata. Fudhataa meeshaalee, meeshaalee hojii fi qabeenya irratti too'annaa ni goona."
      },
      eastAfrica: {
        name: "Baha Afriikaa",
        role: "Babal'ina Naannoo",
        desc: "Somaaliyaa, Keeniyaa, Suudaan, Eertiraa, Yugaandaa, Ruwaandaa — neetwoorkiin naannoo keenya Baha Afriikaa guutuu loojistiiksii daangaa malee taasiisa."
      }
    },
    services: {
      title: "Tajaajilawwan keenya",
      clearance: {
        title: "Clearance",
        desc: "Gumruka fudhachuu fi erguu, adeemsa fi beeksisa buufata Jibuutii fi daandiiwwan naannoo irratti."
      },
      logistics: {
        title: "Logistics",
        desc: "Silsa loojistiiksii: hojii buufataa, kuusaa, geejjiba fi walitti qindaa'ina sochaa balbala irraa gara balbalaa."
      },
      transit: {
        title: "Transit",
        desc: "Meeshaalee gara daandii Jibuutii — Itoophiyaa fi Baha Afriikaa irratti darbachuu: hordoffii, fe'umsa fi geejjibsa."
      },
      customs: {
        title: "Sirna gumrukaa",
        desc: "Gargaarsa sirna gumrukaa: itti fufiinsa seeraa, ramaddii, gibira fi walitti dhufeenya dhaabbilee."
      },
      documents: {
        title: "Sanadoota",
        desc: "Qopheessuu fi hordoffii galmeewwanii: waraqaa fe'umsaa, bilbilli, ragaa maddaa fi sanadoota bulchiinsaa."
      }
    },
    projects: {
      title: "Pirojektota Gurguddoo",
      p1: {
        title: "Daandii Jibuutii — Finfinnee",
        desc: "Bulchiinsa silsila loojistiiksii guutuu fudhataa meeshaalee industirii Itoophiyaatiif — buufata Shanghaay irraa gara kuusaa Finfinnee."
      },
      p2: {
        title: "Babal'ina Buufata Jibuutii",
        desc: "Hirmaannaa loojistiiksii ammayyeessuu Buufata Doraleh Kaayyoo Hedduu — buufata konteenarii, harkisuu fi bulchiinsa socha."
      },
      p3: {
        title: "Gargaarsa Namoomaa Baha Afriikaa",
        desc: "Dhiyeessuu nyaataa, qorichaa fi meeshaalee ariifataa dhaabbilee miti-mootummaa idla-addunyaatiif Itoophiyaa, Somaaliyaa fi Suudaan keessatti."
      },
      viewAll: "Pirojektota Hunda Ilaali"
    },
    contact: {
      title: "Pirojektii Keessan Irratti Haa Haasofnu",
      form: {
        name: "Maqaa Guutuu",
        email: "Teessoo Iimeelii",
        service: "Tajaajila Barbaadame",
        message: "Fedhii loojistiiksii keessan ibsaa",
        submit: "Gatii Gaafadhu"
      },
      info: {
        title: "Waajjira Muummee — Jibuutii",
        address: "Avenue du Général de Gaulle, BP 2450, Magaalaa Jibuutii",
        phone: "+253 77 82 18 32 | +253 21 34 17 16 | +253 77 69 61 30",
        email: "info@gttsgroup.com"
      }
    },
    contactPage: {
      eyebrow: "NU QUNNAMA",
      headline: "Pirojektii loojistiiksii keessan eegali.",
      intro:
        "Fedhii keessan ibsaa: gosa fe'umsaa, baay'ina, daandiiwwan (Jibuutii, Itoophiyaa, kkf.), yeroo. Sa'aatii hojii 24–48 keessatti deebi'na.",
      officeLabel: "WAJJIRA",
      office: "Jibuutii",
      phoneLabel: "LAKKII TOORA",
      phoneDisplay: "+253 21 34 17 16",
      emailLabel: "IMEELII",
      emailDisplay: "info@gttsgroup.com",
      formTitle: "Gaaffii ergi",
      firstName: "Maqaa",
      lastName: "Maqaa abbaa",
      email: "Imeelii",
      phone: "Bilbilaa",
      interestLabel: "Kan na hawwatu...",
      otherService: "Kan biraa",
      destinationsLabel: "Daandii / bakka filatame",
      destinationsPlaceholder: "fakkeenya: Buufata Jibuutii, Finfinnee...",
      messageLabel: "Ergaa",
      messagePlaceholder: "Baay'ina, gosa meeshaalee, yeroo...",
      submit: "GAFFII ERGI",
      toastTitle: "Fudhatameera",
      toastDesc: "Dafee nuti si qunnama.",
      sendError: "Erguu hin dandeenye. Irra deebi'i yaali."
    },
    activitiesPage: {
      eyebrow: "HOJJIIWWAN",
      title: "Bakka hojii — Jibuutii fi Baha Afriikaa",
      subtitle: "Hojii buufataa, geejjiba lafaa, kuusaa fi daandii Jibuutii — Itoophiyaa.",
      intro:
        "Gareen keenya buufata, naannoo loojistiiksii fi karaa strateegii irratti hojjeta: fe'umsa konteenarii, geejjiba, gumrukaa fi raabsii Finfinnee fi naannoo.",
      pillarsTitle: "Naannoowwan muuxannoo",
      galleryTitle: "Hojiiwwan suuraa",
      cta: "Socchaakee irratti haasofsiisi",
      cap1: "Fe'umsa galaanaa fi gudbiinsa buufata Jibuutii.",
      cap2: "Geejjiba lafaa — daandii Jibuutii — Itoophiyaa.",
      cap3: "Raabsii dhiyeessii fi kuusaa nageenya qabu.",
      cap4: "Pirojektoota industriiifi meeshaalee ulfaatoo.",
      cap5: "Daandii loojistiiksii fi hojii buufataa.",
      cap6: "Walitti hidhamiinsa galaanaa idil-addunyaa fi soccha naannoo."
    },
    ui: {
      brandTagline: "Geejjibaa & Loojistiiksii",
      navClients: "Maamiltoota Keenya",
      navNews: "Oduu",
      selectLanguage: "Afaan filadhu",
      companySummary: "Muuxannoo loojistiiksii, transit fi gumrukaa kan Jibuutii keessatti hundaa'e.",
      companyTrustNote: "Michuu amanamaa hojii fe'umsaa naannoo fi addunyaa irratti.",
      keyStrengths: "Cimina ijoo",
      professionalStandards: "Ulaagaa Ogeessaa",
      strengthCommunication: "Quunnamtii",
      strengthTeamwork: "Hojii garee",
      strengthProcessReport: "Gabaasa adeemsa",
      strengthResponsibility: "Itti gaafatamummaa",
      strengthFinalReport: "Gabaasa xumuraa",
      experienceTitle: "Muuxannoo",
      experienceValue: "Waggaa 15",
      experienceDesc: "Muuxannoo hojii cimaa loojistiiksii, transit fi qindoomina gumrukaa irratti.",
      teamEyebrow: "GAREE KEENYA",
      teamIntro: "Garee kutannoo qabu kan hojii loojistiiksii keessan buufata Jibuutii irraa hanga daandiiwwan naannootti eegu.",
      careersEyebrow: "CARAA HOJII",
      careersIntro: "Garee daandii Jibuutii — Itoophiyaa irratti hojjetu waliin hirmaadhaa.",
      projectsIntro: "Pirojektoota fi hojiiwwan keenya filatamoo ilaalaa.",
      loadErrorTryLater: "Dogoggora fe'umsaa. Booda irra deebi'aa yaalaa.",
      noTeamMembers: "Ammaaf miseensi garee maxxanfame hin jiru.",
      noCareers: "Ammaaf beeksisni hojii maxxanfame hin jiru.",
      noProjects: "Ammaaf pirojektiin maxxanfame hin jiru.",
      contactUsShort: "Nu quunnamaa",
      applyNow: "Amma iyyadhaa",
      projectGeneric: "Pirojektii"
    },
    login: {
      title: "Seensa",
      user: "Fayyadamaa",
      userPlaceholder: "Teessoo imeelii",
      password: "Jecha icciitii",
      passwordPlaceholder: "••••••••",
      submit: "Seeni",
      error: "Odeeffannoon dogoggora.",
      backHome: "Gara fuula jalqabaa deebi'i"
    },
    adminPage: {
      title: "Bulchaa",
      subtitle: "Daashboordii",
      noInquiries: "Amalli hin jiru.",
      colId: "ID",
      colDate: "Guyyaa",
      colName: "Maqaa",
      colEmail: "Imeelii",
      colPhone: "Bilbila",
      colInterest: "Tajaajila",
      colDescription: "Ibsa",
      colMessage: "Ergaa",
      colReviewer: "Hojjete",
      colAction: "Gocha",
      logout: "Ba'i",
      loginRequired: "Bulchootaaf qofa.",
      goLogin: "Seensa",
      loadError: "Fe'umsaanni hin milkoofne.",
      backToSite: "Gara marsariitii deebi'i",
      menu: "Galmee",
      navStats: "Statistiksii marsariitii",
      navActivities: "Hojiiwwan keenya",
      navTeam: "Gareen keenya",
      navCareers: "Hojiiwwan barbaachisoo",
      navProjects: "Piroojektoota keenya",
      navContact: "Quunnamtii",
      navSettings: "Qindaa'ina",
      statsTitle: "Mallattoolee",
      statInquiries: "Gaaffiiwwan quunnamtii",
      statUsers: "Akkaawuntii fayyadamtootaa",
      statAdmins: "Bulchitoota",
      statsHint: "Odeeffannoo MongoDB irraa.",
      inquiriesTitle: "Gaaffiiwwan dhufan",
      cmsTitle: "Qabiyyee marsariitii",
      cmsBody: "Bulchiinsa qabiyyee booda ni danda'ama. Fuula ummataa bani.",
      cmsOpenSite: "Marsariitii irratti ilaali",
      settingsTitle: "Qindaa'ina",
      settingsAccount: "Akkaawuntii walitti qabame",
      settingsBody: "Filannoo ol'aanaa booda.",
      navUsers: "Fayyadamtoota",
      navRoles: "Gahee",
      navPermissions: "Hayyama"
    },
    footer: {
      copyright: "© 2025 Global Transit and Transport Services. Mirgi hunduu seeraan eegamaadha. | Jibuutii & Itoophiyaa",
      developer: "Kan yoophaa ta'e GEOSOM Technologies",
      links: ["Imaammata Iccitii", "Haalawwan & Dambiiwwan", "Seeraa Gumrukaa"]
    }
  }
};
