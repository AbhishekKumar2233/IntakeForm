import { livingMemberStatusId } from "../../components/Reusable/ReusableCom"

export const $JsonHelper = {


    createPersonalDetails: (subtenantId, loggedInUserId) => {
        return {
            subtenantId : subtenantId ?? null,
            fName: null,
            mName: null,
            lName: null,
            nickName: null,
            suffixId: null,
            citizenshipId: '187',
            genderId: null,
            birthPlace: null,
            maritalStatusId: null,
            memberStatusId: 1,
            dob: null,
            dateOfDeath: null,
            dateOfWedding: null,
            createdBy: loggedInUserId ?? null,
            memberStatusDesc: null,
            matNo:null,
            noOfChildren: null,
            dateofDivorce:null,
        }
    },

    updateMemberRelationship : (userId, isFiduciary, isBeneficiary, relationshipTypeId,relativeMemberID, relativeUserId, loggedInUserId) =>{
        return {
            "primaryUserId": userId ?? "",
            "relationshipTypeId": relationshipTypeId ?? 0,
            "relativeMemberID": relativeMemberID ?? 0,
            "isFiduciary": isFiduciary ?? null,
            "isBeneficiary": isBeneficiary ?? null,
            "rltnTypeWithSpouseId": null,
            "relativeUserId": relativeUserId ?? "",
            "userRltnshipId": 0,
            "isEmergencyContact": null,
            "isChildCapableMgmtfinanc": null,
            "upsertedBy": loggedInUserId ?? ""
          }
    },

    createMemberRelationship: (primaryUserId, relativeUserId) => {
        return {
            "primaryUserId": primaryUserId ?? "",
            "relationshipTypeId": null,
            "isFiduciary": false,
            "isBeneficiary": false,
            "rltnTypeWithSpouseId": null,
            "relativeUserId": relativeUserId ?? null,
            "isEmergencyContact": null,
            isChildCapableMgmtfinanc: null
        }
    },
    // json for update member by id api
    createJsonUpdateMemberById: ({ subtenantId, fName, memberStatusDesc, mName, lName, nickName, dob, isVeteran, isPrimaryMember, suffixId,
        citizenshipId, noOfChildren, genderId, maritalStatusId, birthPlace, fileId, signatureId, memberStatusId, dateOfWedding,
        dateOfDeath, noOfDecease, matNo, dateofDivorce, userPrice, userId, updatedBy, primaryUserId, relationshipTypeId, isFiduciary,
        isBeneficiary, rltnTypeWithSpouseId, relativeUserId, isEmergencyContact, userRltnshipId, userMemberId, relationshipType, isChildCapableMgmtfinanc
    }) => {

        console.log("dateOfDeath",dateOfDeath,'dateOfDeath',dateOfDeath)
        return {
            "updatedBy": updatedBy ?? '',
            "subtenantId": subtenantId ?? null,
            "fName": fName ?? null,
            "mName": mName ?? null,
            "lName": lName ?? null,
            "nickName": nickName ?? null,
            "dob": dob ?? null,
            "isVeteran": isVeteran ?? null,
            "isPrimaryMember": isPrimaryMember ?? false,
            "suffixId": suffixId ?? null,
            "citizenshipId": citizenshipId ?? 187,
            "noOfChildren": noOfChildren ?? null,
            "genderId": genderId ?? null,
            "maritalStatusId": maritalStatusId ?? null,
            "birthPlace": birthPlace ?? null,
            "fileId": fileId ?? null,
            "signatureId": signatureId ?? null,
            "memberStatusId": memberStatusId ?? livingMemberStatusId,
            "dateOfWedding": dateOfWedding ?? null,
            "dateOfDeath": dateOfDeath ?? null,
            "noOfDecease": noOfDecease ?? null,
            "matNo": matNo ?? null,
            "dateofDivorce": dateofDivorce ?? null,
            "userPrice": userPrice ?? null,
            "userId": userId ?? null,
            "updatedBy": updatedBy ?? null,
            'memberStatusDesc': memberStatusDesc ?? null,
            "memberRelationship": {
                "primaryUserId": primaryUserId ?? null,
                "relationshipTypeId": relationshipTypeId ?? null,
                "isFiduciary": isFiduciary ?? false,
                "isBeneficiary": isBeneficiary ?? false,
                "rltnTypeWithSpouseId": rltnTypeWithSpouseId ?? null,
                "relativeUserId": relativeUserId ?? null,
                "isEmergencyContact":  isEmergencyContact ?? null,
                "userRltnshipId": userRltnshipId ?? null,
                "userMemberId": userMemberId ?? null,
                "relationshipType": relationshipType ?? null,
                "isChildCapableMgmtfinanc": isChildCapableMgmtfinanc ?? null
            }
        }
    },

    // @@ User-Subscription JSON OBJ

    createAddUserSubscriptionJson : ({ userId, selectAttorneyId, showHourlyBody, showFlatFeeBody, totalAmount, totalPaid, totalDiscount, validityFrom, futurePayDate, subtenantId, loggedInUserId, installmentAmount, isInstallmentPlan, totalInstallment }) => {
        return {
            "userId": userId ?? null,
            "attorneyId": selectAttorneyId ?? null,
            "isActive": true,
            "subsStatusId": 1,
            "subscriptionId": 2,
            "isHourly": showHourlyBody ? true : false,
            "isFlatFee": showFlatFeeBody ? true : false,
            "totalAmount": totalAmount ?? 0,
            "totalPaid": totalPaid ?? 0,
            "totalDiscount": totalDiscount ?? 0,
            "validityFrom": validityFrom ?? null,
            "futurePayDate": futurePayDate ?? null,
            "subtenantId": subtenantId ?? null,
            "createdBy": loggedInUserId ?? null,
            "installmentAmount": installmentAmount ?? 0,
            "totalInstallment": totalInstallment ?? 0,
            "isInstallmentPlan": isInstallmentPlan,
        };
    }, 
    
    createUserRecurringSubscription: ({
        userLoginId, userId, subscriptionName, paySchedule, totalOccurrences, amount,
        customerProfileId, paymentProfileId, cardNumber, expireDate, isOneTimePay,
        userSubscriptionId, subscriptionId
    }) => {
        return ({
            "userLoginId": userLoginId ?? 0,
            "userId": userId ?? "",
            "subscriptionName": subscriptionName ?? "",
            "paySchedule": {
              "length": paySchedule?.length ?? 0,
              "unit": paySchedule?.unit ?? "days"
            },
            "totalOccurrences": totalOccurrences ?? 0,
            // "trialOccurrences": 0,
            "amount": amount ?? 0,
            // "trialAmount": 0,
            "customerProfileId": customerProfileId ?? "",
            "paymentProfileId": paymentProfileId ?? "",
            // "customerAddressId": "",
            "cardNumber": cardNumber ?? "",
            "expirationDate": expireDate ?? "",
            "isOneTimePay": isOneTimePay ?? false,
            "userSubscriptionId": userSubscriptionId ?? 0,
            "subscriptionId": subscriptionId ?? 0
        })
    },

    createUpdateUserSubscriptionJson : ({  userId, orderId, selectAttorneyId, subsGetData, result, showHourlyBody, showFlatFeeBody, selectedDate, validityToDate, subtenantId, fileId, loggedInUserId, futurePayDate, totalAmount, totalPaid, totalDiscount, installmentAmount, isInstallmentPlan, totalInstallment 
    }) => {
        return {
            "userId": userId ?? null,
            "attorneyId": selectAttorneyId ?? null,
            "authorizeSubscriptionId": (subsGetData?.authorizeSubscriptionId ?? result?.authorizeSubscriptionId) ?? null,
            "isCancelSubscription": (subsGetData?.isCancelSubscription ?? result?.isCancelSubscription) ?? false,
            "orderId": orderId ?? null,
            "isActive": true,
            "subsStatusId": (subsGetData?.subsStatusId ?? result?.subsStatusId) ?? null,
            "isHourly": showHourlyBody ? true : false,
            "isFlatFee": showFlatFeeBody ? true : false,
            "subscriptionId": (subsGetData?.subscriptionId ?? result?.subscriptionId) ?? null,
            "userLinkId": (subsGetData?.userLinkId ?? result?.userLinkId) ?? null,
            "subtenantId": subtenantId ?? null,
            "userSubscriptionId": (subsGetData?.userSubscriptionId ?? result?.userSubscriptionId) ?? null,
            "subsFileId": fileId ?? null,
            "validityFrom": selectedDate ?? null,
            "validityTo": validityToDate ?? null,
            "updatedBy": loggedInUserId ?? null,
            "futurePayDate": futurePayDate ?? null,
            "totalAmount": totalAmount ?? 0,
            "totalPaid": totalPaid ?? 0,
            "totalDiscount": totalDiscount ?? 0,
            "installmentAmount": installmentAmount ?? 0,
            "totalInstallment": totalInstallment ?? 0,
            "isInstallmentPlan": isInstallmentPlan,
          }          
    },   

    // @@ VETERN JSON OBJ

    createVeternJson: () => {
        return {
            "activeServiceDuration": "",
            "warzone": "",
            "wartimePeriod": "",
            "dischargeTypeId": 0,
            "activityTypeId": 2,
            "userId": "",
            "createdBy": "",
            "UpdatedBy": "",
            "veteranId": "",
            "isVeteran": "",
        }
    },
    createJsonAddOcccupation: () => {
        return {
            "isWorking": '',
            "occupationType": "",
            "ageOfRetirement": '',
            "professionalBackground": "",
            "isDisabled": '',
            "isRetirementOverseas":'',
            "overseasRetirementPlace":'',
            "reasonOfDisable": "",
            "userId": "",
            "createdBy": ""
        }
    },
    //ADDRESS JSON

    createAddressJson: (userId, lattitude, longitude, addressLine1, apt, zipcode, county, country, city, state, addressTypeId, countyRefId, logginUserId) => {
        return {

            "userId": userId,
            "address": {
                "lattitude": lattitude,
                "longitude": longitude,
                "addressLine1": addressLine1,
                "addressLine2": apt,
                "addressLine3": "",
                "zipcode": zipcode,
                "county": county,
                "city": city,
                "state": state,
                "country": country,
                "addressTypeId": addressTypeId || 1,
                "countyRefId": countyRefId,
                "createdBy": logginUserId,
            }
        }
    },
    createAddressJsons : (userId, logginUserId, addressTypeId, addjson, apiType = "") => {
    
        return {
            userId,
            address: {
                lattitude: null,
                longitude: null,
                addressLine1: null,
                addressLine2: null,
                addressLine3: null,
                zipcode: null,
                county: null,
                city: null,
                state: null,
                country: null,
                addressTypeId,
                countyRefId: null,
                parish: null,
                island: null,
                province: null,
                canton: null,
                zone: null,
                department: null,
                municipality_Borough: null,
                district: null,
                quarter: null,
                region: null,
                ...addjson, // Overrides defaults with provided values
                [apiType === "PUT" ? "updatedBy" : "createdBy"]: logginUserId // Dynamic key assignment
            }
        };
    
    
    },
    createAddressJsonWithoutUserUd: (lattitude, longitude, addressLine1, apt, zipcode, county, city, state, country, countyRefId, logginUserId, addressTypes, addressTypeLable) => {
        return {
            "lattitude": lattitude,
            "longitude": longitude,
            "addressLine1": addressLine1,
            "addressLine2": apt,
            "addressLine3": "",
            "zipcode": zipcode,
            "county": county,
            "city": city,
            "state": state,
            "country": country,
            "addressTypeId": addressTypes || 1,
            "countyRefId": countyRefId,
            "createdBy": logginUserId,
            "addressType": addressTypeLable


        }
    },

    // @@ Health Insurance Json
    createHealthInsuranceJson: () => {
        return {
            "typePlanId": null,
            "suppPlanId": null,
            "insNameId": null,
            "premiumFrePerYear": null,
            "premiumAmt": null,
            "insCardPath1": null,
            "insCardPath2": null,
            "insName": null,
            "insComId": null,
            "quesReponse": null,
            "createdBy": null,
            "userInsuranceDocs": [],
            "groupNo": null,
            'deductibleAmount': null,
            "coPayment": null,
            "outOfPocketMaximum": null,
            "insStartDate": null,
            "insEndDate": null

        }

    },

    createProfCatJson: (_proCatId, _proSerDescId, _proTypeId, _proSubTypeId, _isActive) => {
        return {
            proCatId: _proCatId ?? 0,
            proSerDescId: _proSerDescId ?? 0,
            proTypeId: _proTypeId ?? 0,
            proSubTypeId: _proSubTypeId ?? 0,
            isActive: _isActive ?? true,
        }
    },

    createLiablitiesData: {
        liabilityTypeId:"",nameofInstitutionOrLender:"",payOffDate:"",outstandingBalance:"",paymentAmount:"",othersName:"",liabilityId:"",ownershipType:"",natureId:""
    },

    createProfBaseDetailJson: () => {
        return {
            fName: '',
            lName: '',
            specialty: '',
            businessName: '',
            website: '',
        }
    },

    createUprtProfJson: ({ proUserId, userId, isGenAuth, isStatus, isActive, upsertedBy, proCategories,
        businessName, businessTypeId, websiteLink
    }) => {
        return {
            proUserId: proUserId ?? 0,
            userId: userId ?? null,
            isGenAuth: isGenAuth ?? false,
            isStatus: isStatus ?? true,
            isActive: isActive ?? true,
            upsertedBy: upsertedBy ?? null,
            proCategories: proCategories ?? [],
            businessName: businessName ?? "",
            businessTypeId: businessTypeId ?? null,
            websiteLink: websiteLink ?? websiteLink,
        }
    },

    userProfileJson: () => {
        return { id: 0, merchantCustomerId: "", customerProfileId: "", userId: "", profileType: "", isDeleted: false, createdBy: "", isActive: true}
    },

    userCardJson: () => {
        return {
            id: 0, userProfileId: 0, cardNickName: "", paymentProfileId: "", customerProfileId: "", 
            cardNumber: "", expireDate: "", cardType: "", cardIsDeleted: false, isDefault: false, streetAddress: "",
            apartmentNo: "", city : "", state: "", zipCode: "", cardIsActive: true, remarks: "", createdBy: "",
            updatedBy :"" , userLoginId:"", userId:"", firstName:"" , lastName:"", emailId:"" , phoneNumber:""
        }
    },

    createPrimaryProf: ({ userId, professionalUserId, isPhysician, isGCM, isGCMCertified,
        proUserId, isHappy, visitDuration, sameAsSpouse, createdBy, updatedBy,
        doc_User_Id, primary_Care_Id
    }) => {
        return {
            userId: userId,
            physician: {
                docMemberUserId: professionalUserId,
                doc_License: null,
                experience_yrs: 0,
                is_Primary: isPhysician,
                is_GCM: isGCM,
                is_GCM_Certified: isGCMCertified,
                speciality_Id: null,
                other: null,
                is_Primary_Care: isPhysician,
                isProUserAdded: true,
                pro_User_Id: proUserId,
                happy_With_Service: isHappy,
                visit_Duration: visitDuration,
                isSameSpecialist: sameAsSpouse,
                createdBy: createdBy ? createdBy : undefined,
                updatedBy: updatedBy ? updatedBy : undefined,
                primary_Care_Id: primary_Care_Id,
                doc_User_Id: doc_User_Id
            },
        }
    },

    // @@ User Assets Json

    createUserAgingAsset: () => {
        return {
            "agingAssetCatId": 0,
            "agingAssetTypeId": 0,
            "ownerTypeId": 0,
            "nameOfInstitution": '',
            "balance": null,
            "maturityYear": 0,
            "vinno": null,
            "licensePlate": null,
            "productColor": null,
            "quesReponse": null,
            "createdBy": null,
            "isActive": true,
            "assetDocuments": [],
            "assetOwners": [],
            "assetBeneficiarys": [],
            "isRealPropertys": []
        }
    },

    // @@ Create upload User Document
    createUploadUserDocument: ({ File, UploadedBy, FileId, UserId, FileTypeId, FileCategoryId, FileStatusId, UserFileName, DateFinalized, Description, DocumentLocation, EmergencyDocument }) => {
        return {
            'File': File ?? null,
            'UploadedBy': UploadedBy ?? null,
            "FileId": FileId ?? null,
            'UserId': UserId ?? null,
            'FileTypeId': FileTypeId ?? null,
            'FileCategoryId': FileCategoryId ?? null,
            'FileStatusId': FileStatusId ?? null,
            'UserFileName': UserFileName ?? null,
            'DateFinalized': DateFinalized ?? null,
            'Description': Description ?? null,
            'DocumentLocation': DocumentLocation ?? null,
            'EmergencyDocument': EmergencyDocument ?? null
        }
    },
    medicalHistoryObj: () => {
        return {
            "medicalHistId": 0,
            "medicalHistType": "Relatives",
            "disease": undefined,
            "medicalHistTypeId": 2,
            "relationshipId": 0,
            "isCurrentlyLiving": true,
            "age": "",
            "isSuffering": false,
            "illnessDuration": 0,
            "illnessDurationTime": "0",
            "causeOfDeath": "",
            "noOfLivingSibling": null,
            "noOfDeceasedSibling": null,
            "diseaseId": undefined,
            "medicalHistoryInfo": null,
            "formallyDiagnosed":"",
            "illnessDurationTime":"",
            "symptomsSigns":""
        };
    },

    sendEmailWithCCnBcc: ({ emailType, emailTo, emailSubject, emailContent, emailFrom, emailFromDisplayName, emailTemplateId, emailStatusId, emailMappingTable, emailMappingTablePKId, createdBy, emailcc, emailBcc, }) => {
        return {
            "emailType": emailType ?? null,
            "emailTo": emailTo ?? null,
            "emailSubject": emailSubject ?? null,
            "emailContent": emailContent ?? null,
            "emailFrom": emailFrom ?? null,
            "emailFromDisplayName": emailFromDisplayName ?? null,
            "emailTemplateId": emailTemplateId ?? null,
            "emailStatusId": emailStatusId ?? null,
            "emailMappingTable": emailMappingTable ?? null,
            "emailMappingTablePKId": emailMappingTablePKId ?? null,
            "createdBy": createdBy ?? null,
            "emailcc": emailcc ?? null,
            "emailBcc": emailBcc ?? null
        }
    },
    jsonForLiabilities: ({ primaryUserId, loggedInUserId, liabilityTypeId, nameofInstitutionOrLender, outstandingBalance, payOffDate,paymentAmount,userRealPropertyId,liabilityId,interestRatePercent,loanNumber,lenderUserId,userLiabilityId,addressData, contactData}) => {
        return {         
                "userId": primaryUserId,
                "upsertedBy": loggedInUserId,
                "upsertUserLiabilities": [
                  {
                    "liabilityTypeId": liabilityTypeId,
                    "liabilityId": liabilityId,
                    "userRealPropertyId":userRealPropertyId,
                    "description": "string",
                    "interestRatePercent" :interestRatePercent,
                    "loanNumber": loanNumber,
                    "nameofInstitutionOrLender": nameofInstitutionOrLender,
                    "outstandingBalance": outstandingBalance,
                    "payOffDate": payOffDate,
                    "paymentAmount": paymentAmount,
                    "lenderUserId": lenderUserId,
                    "userLiabilityId":userLiabilityId,
                    "isActive": true,
                    "liabilityDocs": [],
                    "lenderInformation": {
                      "addresses": 
                        addressData
                      ,
                      "contacts":contactData?.contact,
                    }
                  }
                ]
            }
        
    },
    sendTextNo: ({ smsType, textTo, textContent, smsTemplateId, smsStatusId, smsMappingTable, smsMappingTablePKId, createdBy }) => {
        return {
            "smsType": smsType ?? null,
            "textTo": textTo ?? null,
            "textContent": textContent ?? null,
            "smsTemplateId": smsTemplateId ?? null,
            "smsStatusId": smsStatusId ?? null,
            "smsMappingTable": smsMappingTable ?? null,
            "smsMappingTablePKId": smsMappingTablePKId ?? null,
            "createdBy": createdBy ?? null
        }
    },
    newFormDataObj: () => {
        return {
            userMedicationId: 0,
            medicationId: null,
            doseAmount: '',
            frequency: '',
            time: '',
            startDate: '',
            endDate: '',
            doctorPrescription: ''
        }
    },

    createLongTermInsurancePolicy: () => {
        return {
            insTypeId: null,
            insCompanyId: 0,
            policyStartDate: "",
            dailyBenefitNHSetting: "",
            dailyBenefitOtherThanNH: "",
            eliminationPeriod: "",
            maxLifeBenefits: "",
            maxBenefitYears: "",
            maxBenefitAmount: 0,
            planWithInflationRider: null,
            lastTimePremiumIncrease: "",
            additionalDetails: "",
            // longTermInsDocs: longTermInsDocs,
            premiumFrequencyId: 0,
            premiumAmount: null,
            planWithInflationRiderPer: "",
            inflationRiderTypeId: 0,
            isActive: true,
            quesReponse: null
        }
    },
    metaDataJson: ({ responseId, subResponseData, subjectId, userId, userSubjectDataId }) => {
        return {
            "responseId": responseId ?? null,
            "subResponseData": subResponseData ?? null,
            "subjectId": subjectId ?? null,
            "userId": userId ?? null,
            "userSubjectDataId": userSubjectDataId ?? 0
        }

    },
    createJsonForNonExpense: () => {
        return {
            expense: '',
            expenseAmt: 0,
            paymentMethodId: null,
            expenseId: 0,
            expenseFreqId: 5,
            expenseFrequency: "Non-Monthly",
            isActive: true,
            createdBy: '',
            userExpenseId: 0,
            isChanged: true,
        }
    },
    lifeInsuranceJson: () => {
        return {
            "userLifeInsuranceId": 0,
            "insuranceCompany": "",
            "policyType": "",
            "premiumType": "",
            "createdBy": "",
            "createdOn": "",
            "updatedBy": "",
            "updatedOn": "",
            "isActive": true,
            "remarks": null,
            "quesReponse": "{}",
            "beneficiary": [
                {
                    "userLifeInsuranceBeneficiaryId": "",
                    "beneficiaryName": "",
                    "beneficiaryUserId": ""
                }
            ],
            "insuranceDocs": [
                {
                    "userLifeInsuranceDocId": 0,
                    "isActive": true,
                    "documentName": "",
                    "documentPath": "",
                    "docFileId": 0
                }
            ],
            "insuranceCompanyId": 0,
            "policyTypeId": 0,
            "policyStartDate": "",
            "policyExpiryDate": "",
            "premium": 0,
            "premiumId": 0,
            "cashValue": 0,
            "deathBenefits": "",
            "additionalDetails": ""
        }
    },

    assetObj: () => {
        return {
            agingAssetCatId: 0,
            agingAssetTypeId: null,
            ownerTypeId: null,
            UpdatedBy: '',
            nameOfInstitution: '',
            balance: null,
            userAgingAssetId: 0,
            createdBy: '',
            assetDocuments: [],
            assetOwners: [],
            assetBeneficiarys: [],
            isRealPropertys: [],
            isActive: true,
            vinno: "",
            licensePlate: "",
            productColor: "",
            yearMade: "",
            modelNumber: "",
            expiryDate: "",
            quesReponse: null
        }
    },

    objLiability: () => {
        return {
            nameofInstitutionOrLender: '',
            userRealPropertyId: '',
            createdBy: '',
            payOffDate: null,
            paymentAmount: null,
            outstandingBalance: null,
            liabilityTypeId: '',
            liabilityId: ''
        };
    },

    isRealPropertyNewObj: () => {
        return {
            purchasePrice: '',
            purchaseDate: '',
            value: '',
            isDebtAgainstProperty: null,
            addressId: null,
            // loanSelection:false,
        };
    },

    taxInformation: ({ taxableIncome, adjustedGrossIncome, totalTaxAmount, effTaxRate, marTaxRate , taxableIncomeErr,adjustedGrossIncomeErr,totalTaxAmountErr,taxYearFin,taxYearFinErr}) => {
        return {
            taxableIncome: taxableIncome ?? 0,
            marTaxRate: marTaxRate ?? 0,
            adjustedGrossIncome: adjustedGrossIncome ?? 0,
            effTaxRate: effTaxRate ?? 0,
            totalTaxAmount: totalTaxAmount ?? 0,
            taxYearFin:taxYearFin ?? 0 ,
            taxableIncomeErr: taxableIncomeErr ?? "" ,
            adjustedGrossIncomeErr:adjustedGrossIncomeErr??"",
            totalTaxAmountErr:totalTaxAmountErr??"",
            taxYearFinErr:taxYearFinErr??""
        }
    },

    $mothlyIcomeOtherObje: () => {
        return {
            incomeTypes: 'Other',
            incomeTypeId: 999999,
            isActive: true,
            othersName: "Other",

            incomeSpouse: '0.00',
            incomeRetirementSpouse: '0.00',
            userIncomeIDSpouse: undefined,
            othersIdSpouse: '',
            
            incomePrimary: '0.00',
            incomeRetirementPrimary: '0.00',
            userIncomeIDPrimary:  undefined,
            othersIdPrimary: '',
        }
    },
    $UserLegalDocJson: ({ legalDocTypeId, dateExecuted, docName, docPath, userLegalDocId, docFileId, upsertedBy, isActive }) => {
        return {
            "legalDocTypeId": legalDocTypeId ?? null,
            "dateExecuted": dateExecuted ?? null,
            "docName": docName ?? null,
            "docPath": docPath ?? null,
            "docFileId": docFileId ?? null,
            "userLegalDocId": userLegalDocId ?? 0,
            "upsertedBy": upsertedBy ?? null,
            "isActive": isActive ?? false
        }
    },

    lenderObj: () => {
        return {
            "liabilityTypeId": 6,
            "liabilityId": 0,
            "userRealPropertyId": 0,
            "description": "",
            "nameofInstitutionOrLender": "",
            "debtAmount": 0,
            "outstandingBalance": null,
            "payOffDate": "",
            "interestRateTypeId": null,
            "interestRatePercent": null,
            "extraPaymentMode": "",
            "paymentFrequencyId": null,
            "paymentAmount": null,
            "lenderUserId": "",
            "loanNumber": "",
            "userLiabilityId": 0,
            "isActive": true,
            "liabilityDocs": [],
            "lenderInformation": {
                "addresses": [],
                "contacts": {}
            }
        }
    },
    $jsonAddprofessional: (type) => {
        return  {
            "fName":"",
            "lName":"",
            "businessName": "",
            "businessTypeId": null,
            "isActive": true,
            "isGenAuth": true,
            "isStatus": true,
            "proCategories": [
                {
                    "proCatId": 0,
                    "proSerDescId": 1,
                    "proSubTypeId": null,
                    "proTypeId": type == 3 ? 13 : 7
                }
            ],
            "proUserId": 0,
            "upsertedBy": "",
            "userId": "",
            "websiteLink": "",
            "instructionsToAgent":''
        }
    },
    $jsonProfessional: ()=>{
        return {
            "userProId":0,
            "proUserId":0,
            "proCatId":0,
            "userId":'',
            "lpoStatus":true,
            "upsertedBy":'',
            "instructionsToAgent":'',
            "isActive":true
          }
    },
    updatetoAgentjson: () => {
        return {
            "agentId":0,
            "agentUserId":0,
            "agentUserName":'',
            "memberUserId":'',
            "agentRoleId":1,
            "agentRankId":0,
            "agentAcceptanceStatus":false,
            "agentActiveStatus":true,
            "fileId":null,
            "legalDocId":7,
            "isJoin":false,
            "testDocId":null,
            "testSupportDocId":null,
            "upsertedBy":'',
            "statusId":1,
            "agentUserRelation":''
        }
    },
    monthlyExpensesJson: () => {
        return {
                expenseId: 999999,
                expenseAmt: 0,
                expenseFreqId: 4,
                paymentMethodId: null,
                userExpenseId: 0,
                isActive: true,
                label:'Other',
                expenseType:undefined,
                value:999999
            }
    },
    $emergencyCardjson: ({ emergencyCardId, userId, bloodTypeId, allergiesDescription, medications, medicalConditions, isOrganDonor, isDependentsHome, isPetsAtHome, addinationalInfo, petsAtHome, allergiesToMedications, pinCode, isActive, upsertedBy, emergAllergies, emergencyContacts, emergencyPhysicians }) => {
        return {
            "emergencyCardId": emergencyCardId ?? 0,
            "userId": userId ?? null,
            "bloodTypeId": bloodTypeId ?? null,
            "allergiesDescription": allergiesDescription ?? '',
            "medications": medications ?? null,
            "medicalConditions": medicalConditions ?? '',
            "isOrganDonor": isOrganDonor ?? false,
            "isDependentsHome": isDependentsHome ?? null,
            "isPetsAtHome": isPetsAtHome ?? null,
            "addinationalInfo": addinationalInfo ?? '',
            "petsAtHome": petsAtHome ?? '',
            "allergiesToMedications": allergiesToMedications ?? ' ',
            "pinCode": pinCode ?? null,
            "isActive": isActive ?? true,
            "upsertedBy": upsertedBy ?? null,
            "emergAllergies": emergAllergies ?? [],
            "emergencyContacts": emergencyContacts ?? [],
            "emergencyPhysicians": emergencyPhysicians ?? [],
        }
 
    },
      // Function to create a mobile JSON object
      $createMobileData(mobileNumber, contactTypes, countryCode, loggedInUserId, mobileOther, comeTypes, contactTypeLabel, contactId,isEdit) {
        const data = {
          contactTypeId: contactTypes,
          mobileNo: countryCode + mobileNumber,
        //   createdBy: loggedInUserId,
          [isEdit ? "updatedBy" : "createdBy"]: loggedInUserId,
          mobileOther: mobileOther,
          commTypeId: comeTypes,
          contactType: contactTypeLabel
        };    
        // Add `contactId` only if it's provided (not null/undefined)
        if (contactId) {
          data.contactId = contactId;
        }
    
        return data;
    },
  // Function to create an email JSON object
  $createEmailData(email, contactTypes, loggedInUserId, emailOther, contactTypeLabel, contactId,isEdit) {
    const data = {
      contactTypeId: contactTypes,
    //   createdBy: loggedInUserId,
      [isEdit ? "updatedBy" : "createdBy"]: loggedInUserId,
      emailId: email,
      emailOther: emailOther,
      contactType: contactTypeLabel
    };

    // Add `contactId` only if it's provided (not null/undefined)
    if (contactId) {
      data.contactId = contactId;
    }

    return data;
}

}
