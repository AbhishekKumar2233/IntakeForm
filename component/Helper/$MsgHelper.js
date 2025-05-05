export const $Msg_PersonalDetails = {
    fNameErr: "First name is required",
    mNameErr: "Middle name is required",
    lNameErr: "Last name is required",
    birthPlaceErr: "Birthplace is required",
    citizenshipIdErr: "Citizenship ID is required",
    dobErr: "Date of birth is required",
};


export const $Msg_StateBackground = {
    maritalStatusIdErr: "Relationship status cannot be blank",
    warzoneErr: "Please choose war zone",
    activeServiceDurationErr: "Please choose active service",
    dischargeTypeIdErr: "Discharge type cannot be blank",
    wartimePeriodErr: "War time cannot be blank",
    occupationTypeErr: "Occupation cannot be empty",
    professionalBackgroundErr: "Professional Background cannot be empty",
    relationWithPrimaryMember: "Please select relation with primary member",
    relationWithSpouse: "Please select relation with spouse",
    relationWIthChildOfGrandChild:"Please select parent of grandchild",
    isBeneficiaryErr : "Please select Member as a Fiduciary/Beneficiary",
    isFiduciaryErr : "Please select Member as a Fiduciary/Beneficiary",
    minorFiduciary : "Fiduciary cannot be Minor. Please enter correct date of birth.",
    childLimitMsg: "Please enter valid number",
    decreaseChildErrMsg: "You can't reduce the number of children. Just remove a child from the family list, and the count will decrease.",
    minorNotHaveChildMsg: "Please provide DOB as minor can not have child",

}

export const $Msg_Calender = {
    inValidDate: "Please enter a valid date.",
    dobErr: "Date of birth is required.",
    weddingDateErr: "Wedding date cannot be greater than the present date.",
    weddingAgeErr: "User's age must be 14 or above.",
    divorceErr: "Date of divorce cannot be earlier than the wedding date.",
    weddingEmptyErr: "Please enter the date of marriage.",
    divorceLessWeddingErr: "Divorce date cannot be greater than the present date.",
    dateOfCurrentErr: "Date cannot be greater than the present date.",
    validAge: "User's age must be 14 or above.",
    dateofDeathErr:"The date of death cannot be  a future date.",
    dateofDeathBeforeMrgErr:"Please enter a valid date.",
    dateofDeathBeforeMrgErrNew:"Please enter a valid date of death.",
    dateofBirthErr: "Date of birth cannot be a future date."
};
export const $Msg_AddressDetails = {
    cityErr: "City is required",
    countryErr: "Country is required",
    aptErr: "Apartment is required",
    stateErr: "State is required",
    zipcodeErr: "ZipCode is required",
    zipCodeErr: "ZipCode is required",
    addressTypeErr: "Address type is required",
    addressTypeIdErr: "Address type is required",
    countyErr: "County is required",
    countyRefrenceErr: "County Refrence is required",
    addressLine1Err: "Address is required",
    otherErr: "Other description is required",
    emailErr: "Email is required",
    contactTypesErr: "Contact type is required",
    contactTypeErr: "Contact type is required",
    contactTypeIdErr: "Contact type is required",
    mobileErr: "Mobile number is required",
    comeTypeErr: "Communication Type is required",
    streetAddressErr:' Billing address is required',
    expireDateErr:"Expiration date is required",
    cardNumberErr:"Card number required",
    cardNickNameErr:"Cardholder name is required",
    cardCvvErr:"CVV  is required"
};


export const $Msg_InviteSpouse = {
    _emailTemplate404: "The email template is not available Please contact the administrator to send an invite."

};

export const $Msg_LongTermInsDetails = {
    insTypeIdErr : "Please select type of policy"
};
export const $Msg_BusinessIntrest = {
    nameOfBusiness: "Business name is required.",
    businessTypeId:"Business type is required."

}
export const $Msg_Liability = {
    liabilityTypeIdErr: "Type of libilitiy is required.",
    nameofInstitutionOrLenderErr:"Lender name is required."

}

export const contentObject = {
    personalContent: `Your personal information helps us tailor our services to your unique needs. Please ensure all details are accurate as they form the basis for personalized advice and recommendations.`,
    statusContent: `Provide your current status and background information to ensure we can offer guidance that's relevant to your personal circumstances.`,
    contactAddressContent: `Accurate contact and address information is essential for effective communication and service delivery. Keep these details current to ensure you receive important updates and support.`,
    spousePersonalContent: `Your personal information helps us tailor our services to your spouse's unique needs. Please ensure all details are accurate as they form the basis for personalized advice and recommendations.`,
    spouseStatusContent: `Provide your spouse's current status and background information to ensure we can offer guidance that's relevant to your personal circumstances.`,
    spouseContactAddressContent: `Accurate contact and address information is essential for effective communication and service delivery. Keep these details current to ensure your spouse receives important updates and support.`,
    childPersonalContent: `Your child's personal information helps us tailor our services to your unique needs. Please ensure all details are accurate as they form the basis for personalized advice and recommendations.`,
    childStatusContent: `Provide your child's current status and background information to ensure we can offer guidance that's relevant to your personal circumstances.`,
    childContactAddressContent: `Accurate contact and address information is essential for effective communication and service delivery. Keep these details current to ensure your child receives important updates and support.`,
    extendedPersonalContent: `Your Extended Family/Friends personal information helps us tailor our services to your unique needs. Please ensure all details are accurate as they form the basis for personalized advice and recommendations.`,
    extendedStatusContent: `Provide your Extended Family/Friends's current status and background information to ensure we can offer guidance that's relevant to your personal circumstances.`,
    extendedContactAddressContent: `Accurate contact and address information is essential for effective communication and service delivery. Keep these details current to ensure your Extended Family/Friends receive important updates and support.`,
    transportContactContent : `Accurate loan contact and address information is crucial for timely processing and communication regarding your loan. Keep these details updated to receive important notifications, repayment reminders, and assistance with your loan services.`,
    UploadFileTransport : `Upload any relevant documents related to your transport assets. Providing these documents ensures that all necessary information is available for a comprehensive review of your coverage and supports accurate alignment with your retirement planning goals.`,
    UploadFileBusinessInterests : `Upload any relevant documents related to your business interests. Providing these documents ensures that all necessary information is available for a comprehensive review of your coverage and supports accurate alignment with your retirement planning goals.`,
    UploadFileLifeInsurance : `Upload any relevant documents related to your life insurance. Providing these documents ensures that all necessary information is available for a comprehensive review of your coverage and supports accurate alignment with your retirement planning goals.`,
    dynamicFamilyContent: ( relationship ) => ({
        personalContent: `Your ${relationship}'s personal information helps us tailor our services to your unique needs. Please ensure all details are accurate as they form the basis for personalized advice and recommendations.`,
        statusContent: `Provide your ${relationship}'s current status and background information to ensure we can offer guidance that's relevant to your personal circumstances.`,
        contactAddressContent: `Accurate contact and address information is essential for effective communication and service delivery. Keep these details current to ensure your ${relationship} receives important updates and support.`,
    })
  };
  export const $OrganDonationPlaceholder = {
    content:"Specify your preferences regarding organ donation and body donation for scientific research. Documenting these choices ensures that your wishes are respected, providing clarity for your loved ones and aligning with your values and life planning goals."
}
export const $LivingWillPlaceholder = {
    content:"Provide your preferences for medical treatments in the event of terminal illness or vegetative state. This information is essential for creating a living will that reflects your wishes, helping to guide your loved ones and healthcare providers in making decisions that respect your values and preferences."
}
export const $HandleOfRemainsPlaceholder = {
    content:"Please provide your preferences regarding the handling of your remains. Documenting these choices ensures that your wishes are honored, reducing the emotional burden on your loved ones and supporting your goal of managing end-of-life arrangements with dignity and respect."
}
export const $BurialCremationPlaceholder = {
    content:"Indicate your burial or cremation plans. This information helps secure your end-of-life wishes, ensuring that your plans align with your personal goals as part of a comprehensive retirement planning strategy."
}
export const $CemetryAggrimentPlaceholder  = {
    content:"Confirm if you have made arrangements with a funeral establishment or cemetery for the handling of your remains. This step is crucial for ensuring that your end-of-life wishes are carried out smoothly, reinforcing your life planning objective of maintaining control over your final decisions and easing the process for your family."
}

export const $SpecialNeed = {
    whileCheckFiduciaryErr : "Special Needs/ Disabled cannot be fiduciary."
}
export const contentData = {
    nonRetire: {
      description: `Provide details about your non-retirement assets, such as checking accounts, savings, investments, and other financial holdings. This information helps us assess your overall financial portfolio outside of retirement accounts, allowing us to understand your asset allocation and guide you appropriately in managing your wealth and planning for financial security throughout your aging journey.`,
      institutionInfo: `Enter the Institution information to maintain accurate records of your Asset location.`,
      documentation: `Upload any relevant documents related to your non-retirement assets. Providing these documents ensures that all necessary information is available for a comprehensive review of your coverage and supports accurate alignment with your non-retirement planning goals.`
    },
    retire: {
      description: `Please provide details about your retirement assets. This helps us evaluate your financial readiness, allowing us to understand your retirement portfolio and guide you appropriately in planning for a secure and sustainable retirement while protecting you from unplanned healthcare costs.`,
      documentation: `Upload any relevant documents related to your retirement assets. Providing these documents ensures that all necessary information is available for a comprehensive review of your coverage and supports accurate alignment with your retirement planning goals.`
    }
};




