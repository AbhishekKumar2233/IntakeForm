import { route } from "express/lib/router"



export const $isChidSpouseArr=[1,47,48,49,50]
export const $dashboardLinks = [

    {
        id: 1,
        label: "Personal Info",
        isComplete: 'COMPLETED',
        icon: "",
        route: 'PersonalInfo'
    }, {
        id: 2,
        label: "Family",
        isComplete: 'INCOMPLETE',
        icon: "",
        route: "Family"
    },
    {
        id: 3,
        label: "Health",
        isComplete: 'PENDING',
        icon: "",
        route: "Health"
    },
    {
        id: 4,
        label: "Housing",
        isComplete: 'PENDING',
        icon: "",
        route: "Housing",
    },
    {
        id: 5,
        label: "Finance",
        isComplete: 'PENDING',
        icon: "",
        route: "Finance"
    },
    {
        id: 6,
        label: "Legal",
        isComplete: 'PENDING',
        icon: "",
        route: "Legal"
    },
    {
        id: 7,
        label: "My Service Providers",
        isComplete: 'PENDING',
        icon: "",
        route: "Professional"
    },
    {
        id: 8,
        label: "Agent Guidance",
        isComplete: 'PENDING',
        icon: "",
        route: "Agent"
    },


]



export const $sideBarLinks = [
    {
        id: 100,
        label: "Academy",
        isComplete: false,
        icon: "/",
        route: "academy",
        urlPath: '/setup-dashboard'
    },
    {
        id: 9,
        label: "Setup",
        isComplete: false,
        icon: "/",
        route: "",
        urlPath: '/setup-dashboard'
    },
    {
        id: 99,
        label: "Academy Testing",
        isComplete: false,
        icon: "/",
        route: "Academy",
        urlPath: '/setup-dashboard/Academy'
    },
    {
        id: 11,
        label: "File Cabinet",
        isComplete: false,
        icon: "",
        route: "Filecabinet",
        urlPath: '/setup-dashboard/Filecabinet'
    },
    {
        id: 10,
        label: "Emergency",
        isComplete: false,
        icon: "",
        route: "Emergency",
        urlPath: '/setup-dashboard/Emergency'
    },
    {
        id: 101,
        label: "Toolbox",
        isComplete: false,
        icon: "",
        route: "Toolbox",
        urlPath: '/setup-dashboard/Toolbox'
    },
    {
        id: 5,
        label: "",
        isComplete: false,
        icon: "",
        route: "AgentModule",
        urlPath: '/setup-dashboard/AgentModule'
    },
]

export const $healthInfoSidebar = [
    {
        id: 1,
        label: "Personal Medical History",
    },
    {
        id: 2,
        label: "Lifestyle",
    },
    {
        id: 3,
        label: "Family Medical History",
    },
    {
        id: 4,
        label: "Health Professionals",
        subCategory: [
            {
                id: 1,
                label: "Primary Care Physician",
            },
            {
                id: 2,
                label: "Specialists",
            },
        ]
    },
    {
        id: 5,
        label: "Health Insurance",
    },
    {
        id: 6,
        label: "Medication & Supplements",
    },
   
   
    
]
export const $housingInfoSidebar = [
    {
        id: 1,
        label: "Housing Options",
    },
    {
        id: 2,
        label: "Housing Professionals",
        subCategory: [
            {
                id: 1,
                label: "Realtor",
            },
            {
                id: 2,
                label: "Mortgage Broker",
            },
            {
                id: 3,
                label: "Handyman",
            },
            {
                id: 4,
                label: "Landscaper",
            },
        ]
    }
  
]

export const $financeInfoSidebar = [
    {
        id: 1,
        label: "Assets",
        subCategory: [
            {
                id: 11,
                value: 11,
                label: "Non-Retirement",
            },
            {
                id: 12,
                value: 12,
                label: "Retirement",
            },
            {
                id: 13,
                value: 13,
                label: "Real Estate",
            },
           
            {
                id: 14,
                value: 14,
                label: "Business Interests",
            },
            {
                id: 15,
                value: 15,
                label: "Transport Assets",
            },
            {
                id: 16,
                value: 16,
                label: "Life Insurance",
            },
            {
                id: 17,
                value: 17,
                label: "Long-Term Care Policy",
            },
            {
                id: 18,
                value: 18,
                label: "Future Expectations",
            },
            
           
        ]
    },
    {
        id: 2,
        label: "Liabilities",
    },
    {
        id: 3,
        label: "Income",
    },
    {
        id: 4,
        label: "Current Expenses",
    },
    {
        id: 5,
        label: "Tax Information",
    },
    {
        id: 6,
        label: "Financial Professionals",
        subCategory: [
            {
                id: 1,
                label: "Financial Advisor",
            },
            {
                id: 2,
                label: "Accountant",
            },
            {
                id: 3,
                label: "Bookeeper",
            },
        ]
    }
   
   
    
]
export const $legalInfoSidebar = [
    {
        id: 1,
        value: 1,
        label: "Previous Legal Documents",
    },
    {
        id: 2,
        value: 2,
        label: "Fiduciary/Beneficiary",
    },
    {
        id: 3,
        value: 3,
        label: "Living Will Details",
    },
    {
        id: 4,
        value: 4,
        label: "Organ Donation Details",
    },
    {
        id: 5,
        value: 5,
        label: "Burial Cremation Plan",
    },
    {
        id: 6,
        value: 6,
        label: "Legal Professionals",
        subCategory: [
            {
                id: 1,
                value: 1,
                label: "Elder Law Attorney",
            },
            {
                id: 2,
                value: 2,
                label: "Family Law Attorney",
            },
            {
                id: 3,
                value: 3,
                label: "Tax & Business succession",
            },
        ]
    },
    {
        id: 7,
        value: 7,
        label: "Beneficiary Letter",
    },
];


export const occurranceDetailsId = {
    'spouseJointAccount': 22
}

export const aGifts = {
    formLabelId: [459, 460],
  };
export const vowels = ['a', 'e', 'i', 'o', 'u'];

export const profConstants = {
    // HEALTH PROFESSIONALS
    "physician": {
        profTitle: 'Physician',
        profSubTitle: 'your Primary care physician here.',
        proSerDescId: '1',
        proTypeId: '10',
        tableName: "Primary Care Physicians",
        addBtnName: "Add Physician",
        nxtBtnName: "Specialists",
        nextPageId: 3,
        iDontHaveOneFormLabels: [1234],
    },
    "specialist": {
        profTitle: 'Specialist',
        profSubTile: 'View and add your specialists here.',
        proSerDescId: '1',
        proTypeId: '11',
        tableName: "Specialists",
        addBtnName: "Add Specialist",
        nxtBtnName: "health insurance",
        iDontHaveOneFormLabels: [1235],
        nextPageId: 4,
    },

    // HOUSING PROFESSIONALS
    "realtor": {
        profTitle: 'Realtor',
        profSubTile: 'View and add your Realtor’s information here.',
        proSerDescId: '2',
        proTypeId: '16',
        tableName: "Realtors",
        addBtnName: "Add Realtor",
        nxtBtnName: "Mortgage broker",
        nextPageId: 2,
        iDontHaveOneFormLabels: [1010],
    },

    "mortgageBrokers": {
        profTitle: 'Mortgage Brokers',
        profSubTile: 'View and add your Broker’s information here.',
        proSerDescId: '2',
        proTypeId: '17',
        tableName: "Mortgage Brokers",
        addBtnName: "Add Broker",
        nxtBtnName: "Handyman",
        nextPageId: 3,
        iDontHaveOneFormLabels: [1011],
    },

    "handymanServices": {
        profTitle: 'Handyman Services',
        profSubTile: 'View and add your Handyman’s information here.',
        proSerDescId: '2',
        proTypeId: '4',
        tableName: "Handyman Services",
        addBtnName: "Add Handyman Services",
        nxtBtnName: "landscaper",
        nextPageId: 4,
        iDontHaveOneFormLabels: [1012],
    },
    
    "landscaper": {
        profTitle: 'Landscaper',
        profSubTile: 'View and add your Landscaper’s information here.',
        proSerDescId: '2',
        proTypeId: '18',
        tableName: "Landscaper",
        addBtnName: "Add Landscaper Services",
        nxtBtnName: "Finance",
        nextPageId: 5,
        iDontHaveOneFormLabels: [1244],
    },

    // LEGAL PROFESSIONALS
    "elderLawAttorney": {
        profTitle: 'Elder Law Attorney',
        profSubTile: 'View and add your Elder Law Attorney’s information here.',
        proSerDescId: '4',
        proTypeId: '13',
        tableName: "Elder Attorneys ",
        addBtnName: "Add Attorney",
        nxtBtnName: "Family Law Attorney",
        nextPageId: 2,
        iDontHaveOneFormLabels: [1016],
    },

    "familyLawyer": {
        profTitle: 'Family Law Attorney',
        profSubTile: 'View and add your Family Law Attorney’s information here.',
        proSerDescId: '4',
        proTypeId: '45',
        tableName: "Family Law Attorney",
        addBtnName: "Add Family Law Attorney",
        nxtBtnName: "Tax & Business Succession",
        nextPageId: 3,
        iDontHaveOneFormLabels: [1015],
    },

    "taxBusinessSuccession": {
        profTitle: 'Tax & Business Successors',
        profSubTile: 'View and add your Business Successors’s information here.',
        proSerDescId: '4',
        proTypeId: '46',
        tableName: "Business Successors",
        addBtnName: "Add Business Successor",
        nxtBtnName: "Professionals",
        nextPageId: 4,
        iDontHaveOneFormLabels: [1017],
    },

    // FINANCIAL PROFESSIONALS
    "financialAdvisors": {
        profTitle: 'Financial Advisor',
        profSubTile: 'View and add your Financial Advisor here.',
        proSerDescId: '3',
        proTypeId: '1',
        tableName: "Financial Advisors",
        addBtnName: "Add Financial Advisor",
        nxtBtnName: "Accountant",
        // nextPageId: 2,
        // iDontHaveOneFormLabels: [994, 576, 577, 578, 579, 580, 581, 582, 1001],
        iDontHaveOneFormLabels: [994, 576, 581, 582, 577, 578, 1001, 579, 580],
        metaDataFormLabels: [565, 566, 567, 568, 569, 570, 571],
    },

    "accountants": {
        profTitle: 'Accountant',
        profSubTile: 'View and add your Accountant here.',
        proSerDescId: '3',
        proTypeId: '3',
        tableName: "Accountants",
        addBtnName: "Add Accountant",
        nxtBtnName: "Bookkeeper",
        // nextPageId: 3,
        iDontHaveOneFormLabels: [993, 683, 686, 684, 685],
        metaDataFormLabels: [912, 672, 673],
    },

    "bookkeepers": {
        profTitle: 'Bookkeeper',
        profSubTile: 'View and add your Bookkeeper here.',
        proSerDescId: '3',
        proTypeId: '12',
        tableName: "Bookkeepers",
        addBtnName: "Add Bookkeeper",
        nxtBtnName: "Legal",
        // nextPageId: 4,
        iDontHaveOneFormLabels: [992],
        metaDataFormLabels: [774, 910, 775],
    },

    // My Professional Service Provider
    "myProfessional": {
        profTitle: 'Professional',
        profSubTile: 'View and add your professionals information here.',
        proSerDescId: '',
        proTypeId: '',
        tableName: "Professionals",
        addBtnName: "Add Professional",
        nxtBtnName: "Agent/Guidance",
    },

    // Professional Categories
    "category": [
        {
            proSerDescId: '1',
            title: 'Health',
            imgSrc: '/icons/profHealthIcon.svg',
            ActiveImgSrc: '/icons/profHealthIconWhite.svg',
        },
        {
            proSerDescId: '2',
            title: 'Housing',
            imgSrc: '/icons/profHousingIcon.svg',
            ActiveImgSrc: '/icons/profHousingIconWhite.svg',
        },
        {
            proSerDescId: '3',
            title: 'Finance',
            imgSrc: '/icons/profFinanceIcon.svg',
            ActiveImgSrc: '/icons/profFinanceIconWhite.svg',
        },
        {
            proSerDescId: '4',
            title: 'Legal',
            imgSrc: '/icons/profLegalIcon.svg',
            ActiveImgSrc: '/icons/profLegalIconWhite.svg',
        },
        {
            proSerDescId: '5',
            title: 'Other',
            imgSrc: '/icons/profOtherIcon.svg',
            ActiveImgSrc: '/icons/profOtherIconWhite.svg',
        },
    ],

    // Error messages
    "errorMsgs": {
        fNameEmpty: 'First name is required',
        lNameEmpty: 'Last name is required',
        specialtyEmpty: 'Please select specialty',
        linkInValid: 'Please enter valid website link',
        proTypeSelectedErr: 'Please select atleast one service provider',
        proSerDescSelectErr: 'Please select atleast one specialty',
        proSubTypeErr: 'Please select atleast one specialty'
    },

    // TABLE HEADERS
    "allTableHeaders": {
        0: ['Name', 'Specialty', 'Phone number', 'Email address', 'View/Edit/Delete'],
        // 1: ['Name', 'Business Name', 'Business Type', 'Phone number', 'Email address', 'Actions']
        1: ['Name', 'Business Name', 'Phone number', 'Email address', 'View/Edit/Delete']
    },
}

export const specialIPv4 = [
    {
        "value": "203.110.90.18",
        "label": "IndianOffice"
    },
    {
        "value": "23.25.130.161",
        "label": "AmericanOffice"
    }
];

export const agreementTypeOptions = [
    "AMA",
    "feeAgreement",
]

export const disableInLawDelete = [
    {
        "value": "1",
        "label": "Spouse"
    },
    {
        "value": "44",
        "label": "Child-in-law"
    },
    {
        "value": "47",
        "label": "Daughter-in-law"
    },
    {
        "value": "48",
        "label": "Son-in-law"
    },
    {
        "value": "49",
        "label": "Step Daughter-in-law"
    },
    {
        "value": "50",
        "label": "Step Son-in-law"
    },
]

export const specialUserIds = [
    {
        "value": "2273b2ab-2546-48e5-82fc-cad0dd3c261e",
        "label": "My Para",
        "demo": true
    },
    { 
        "value": "9e6ea069-3eff-429a-8ffd-6a082f1c72b3",
        "label": "Rajiv Nagaich",
        "demo": false
    },
    {
        "value": "90506f58-9880-4bcd-a6c2-0994ac64eb1f",
        "label": "Jeff",
        "demo": false
    },
    { 
        "value": "69c907ba-740c-45db-a160-bfbea46ebc55",
        "label": "Jeff",
        "demo": true
    }
]

export const specialRoleIds = [
    {
      "value": "3",
      "label": "Paralegal"
    },
    {
      "value": "4",
      "label": "Platform Administrator"
    },
    {
      "value": "6",
      "label": "Event Coordinator"
    },
    {
      "value": "11",
      "label": "Firm Administrator"
    },
    {
      "value": "13",
      "label": "Attorney"
    },
    {
      "value": "14",
      "label": "Legal Assistant"
    },
    {
      "value": "15",
      "label": "Law Office Staff"
    }
];



export const fakeNameList = ['Kirn', 'Rosy', 'KIRAN'];

export const radioYesNoLabelWithBool = [{ label: "Yes", value: true }, { label: "No", value: false }];
export const radioSimpleCompound = [{ label: "Simple", value: 1 }, { label: "Compound", value: 2 }];


export const $setGuidanceLinks = [

    // {
    //     id: 1,
    //     label: "Introduction",
    //     isComplete: 'COMPLETED',
    //     icon: "",
    //     route: 'Introduction'
    // },
    {
        id: 1,
        label: "Health",
        isComplete: 'COMPLETED',
        icon: "",
        route: 'Health&CarePreferences'
    }, {
        id: 2,
        label: "Finance",
        isComplete: 'INCOMPLETE',
        icon: "",
        route: "FinanceAgent"
    },
    {
        id: 3,
        label: "Personal Preferences",
        isComplete: 'PENDING',
        icon: "",
        route: "PersonalPreferences"
    },
    {
        id: 4,
        label: "Agents/Legal D",
        isComplete: 'PENDING',
        icon: "",
        route: "AgentLegal"
    }
]

export const $sideBarToolBox= [
    {
      id:'TB01',  
      imageSrc: "healthTile.png",
      title: "Health ToolBox",
      subtitle: "CREATE",
      isCommingSoon: true,
    },
    {
      id:'TB02',  
      imageSrc: "legal-tool.svg",
      title: "Legal ToolBox",
      subtitle: "CREATE",
      isCommingSoon: false,
    },
    {
      id:'TB03', 
      imageSrc: "FinanceTile.png",
      title: "Finance ToolBox",
      subtitle: "CREATE",
      isCommingSoon: false,
    },
    {
      id:'TB04', 
      imageSrc: "OtherTile.png",
      title: "Other",
      subtitle: "CREATE",
      isCommingSoon: true,
    },
  ]
export const $editProfileSideBar= [
    {
      id:'TB01',  
      imageSrcBlack: "userBlack.svg",
      imageSrcRed: "userRed.svg",
      title: "Profile Details",
      subtitle: "CREATE",
      isCommingSoon: true,
    },
    {
      id:'TB02',  
      imageSrcBlack: "folderBlack.svg",
      imageSrcRed: "folderRed.svg",
      title: "Product/Plans",
      subtitle: "CREATE",
      isCommingSoon: false,
    }
  ]

