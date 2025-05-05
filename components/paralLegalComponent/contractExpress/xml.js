export const getXMLObj = (name, value) => {
    const json = {
        "@Name": name,
        "Value": value,
    }
    return json;
}


export const memberCount  = (name, count) => {
    return getXMLObj(name, count);
}

export const getJSONXML = (name, value, repeatContext) => {
    const json = {
        "@Name": name,
        "Value": value,
        "@RepeatContext": `[${repeatContext}]`
    }
    return json;
}

export const ParametersObj = (contractId, contractReference, templateVersion) => {
    return [
        {
            "@Name": "db_contract_id",
            "Value": `${contractId}`
        },
        {
            "@Name": "db_questionnaire_complete",
            "Value": "False"
        },
        {
            "@Name": "db_questionnaire_complete_compulsory",
            "Value": "Fasle"
        },
        {
            "@Name": "db_questionnaire_complete_key",
            "Value": "False"
        },
        {
            "@Name": "db_template_reference",
            "Value": `${contractReference}`
        },
        {
            "@Name": "db_template_version",
            "Value": `${templateVersion}`
        },
    ]
}

export const getJSONXMLmultiValue = (name,values,repeatContext) => {
    let obj = { Value: [] };  
       values.forEach(d => {   
     obj.Value.push(d);
         });
    let json = [{
        "@Name": name,
        ...obj,
        "@RepeatContext": `[${repeatContext}]`
    }
    ]
    return json;
    
}

export const docList = (name, value1,value2,value3,value4,value5,value6,value7,value8,value9,value10,value11, value12, value13) => {
    let json = [{
        "@Name": name,
         "Value": [value1,
                 value2,
                 value3,
                 value4,
                 value5,
                 value6,
                 value7,
                 value8,
                 value9,
                 value10,
                 value11, 
                 value12,
                 value13]
    }
    ]
    return json;
}


export const jsonforArray = (memberType, member, contact, physicalAddress, mailingAddress) => {
    return {
        memberType: memberType,
        member: member,
        contactMap: contact,
        physicalAddress: physicalAddress,
        mailingAddress: mailingAddress,
    }
}

export const jsonObj = (memberType, member,contact, address, mailingAddress, repeatContext = 1) => {
    switch(memberType){
        case "Client":{
            const ClientHomeAddressLine1N2=(address?.addressLine2 !== undefined && address?.addressLine2 !==null && address?.addressLine2 !=='')? `#${address?.addressLine2} ` + address?.addressLine1:address?.addressLine1
            const mailingAddressLine1N2=(mailingAddress?.addressLine2 !== undefined && mailingAddress?.addressLine2 !==null && mailingAddress?.addressLine2 !=='')? `#${mailingAddress?.addressLine2} ` + mailingAddress?.addressLine1:mailingAddress?.addressLine1
            let clientJson = [
                getXMLObj('PhoneNumFormat', '(253) 838-3454'),
                getXMLObj('ClientUS', 'Yes'),
                getXMLObj('ClientRelationshipStatus', member.maritalStatus),
                getXMLObj('ClientNameFull', member.fullName.toUpperCase()),
                getXMLObj('ClientNameFullAsk', member.fullName.toUpperCase()),
                getXMLObj('ClientDoB', member?.dob),
                getXMLObj('ClientEmail', contact.email),
                getXMLObj('ClientPhone', (contact.phone1 !== undefined && contact.phone1 !== null) ? contact.phone1.slice(-10) : contact.phone1),
                getXMLObj('ClientPhone2', (contact.phone2 !== undefined && contact.phone2 !== null) ? contact.phone2.slice(-10) : contact.phone2),
                getXMLObj('ClientPhone3', (contact.phone3 !== undefined && contact.phone3 !== null) ? contact.phone3.slice(-10) : contact.phone3),
                getXMLObj('ClientGender', member.gender),
                getXMLObj('ClientHomeCity', address?.city),
                getXMLObj('ClientHomeZip', address?.zipcode),
                getXMLObj('ClientHomeState', address?.state),
                getXMLObj('ClientHomeStreet',ClientHomeAddressLine1N2),
                getXMLObj('ClientMailingAddressSameYN', member.addresSame),
            ]

            const newJSON = (member.addresSame !== "true")? [
                getXMLObj('ClientMailingFull',mailingAddressLine1N2),
                getXMLObj('ClientMailingFullStreet_CSZ',mailingAddressLine1N2),
                getXMLObj('ClientMailingStreetAsk',mailingAddressLine1N2),
                getXMLObj('ClientMailingCityAsk', mailingAddress?.city),
                getXMLObj('ClientMailingStateAsk', mailingAddress?.state),
                getXMLObj('ClientMailingZipAsk', mailingAddress?.zipcode)]:[]

            clientJson.push(...newJSON);
            return clientJson;
            break;
        }
        case "Spouse": {
            const ClientHomeAddressLine1N2=(address?.addressLine2 !== undefined && address?.addressLine2 !==null && address?.addressLine2 !=='')? `#${address?.addressLine2} ` + address?.addressLine1:address?.addressLine1
            const mailingAddressLine1N2=(mailingAddress?.addressLine2 !== undefined && mailingAddress?.addressLine2 !==null && mailingAddress?.addressLine2 !=='')?  `#${mailingAddress?.addressLine2} `+ mailingAddress?.addressLine1:mailingAddress?.addressLine1
          
            let spouseJson = [
                getXMLObj('SpouseUS', 'Yes'),
                getXMLObj('SpouseRelationshipStatus',),
                getXMLObj('SpouseNameFull', member.fullName.toUpperCase()),
                getXMLObj('SpouseNameFullAsk', member.fullName.toUpperCase()),
                getXMLObj('SpouseDoB', member?.dob),
                getXMLObj('SpouseEmail', contact.email),
                getXMLObj('SpousePhone',  (contact.phone1 !== undefined && contact.phone1 !== null)? contact.phone1.slice(-10) : contact.phone1),
                getXMLObj('SpousePhone2', (contact.phone2 !== undefined && contact.phone2 !== null)? contact.phone2.slice(-10) : contact.phone2),
                getXMLObj('SpousePhone3', (contact.phone3 !== undefined && contact.phone3 !== null)? contact.phone3.slice(-10) : contact.phone3),
                getXMLObj('SpouseGender', member.gender),
                getXMLObj('SpouseHomeCity', address?.city),
                getXMLObj('SpouseHomeZip', address?.zipcode),
                getXMLObj('SpouseHomeState', address?.state),
                getXMLObj('SpouseHomeFull',ClientHomeAddressLine1N2),
                getXMLObj('SpouseMailingAddressSameYN', member.addresSame),
                
            ]


            const newJSON = (member.addresSame !== "true")?
            [getXMLObj('SpouseMailingFull',mailingAddressLine1N2),
            getXMLObj('SpouseMailingFullStreet_CSZ', mailingAddressLine1N2),
            getXMLObj('SpouseMailingStreetAsk', mailingAddressLine1N2),
            getXMLObj('SpouseMailingCityAsk', mailingAddress?.city),
            getXMLObj('SpouseMailingStateAsk', mailingAddress?.state),
            getXMLObj('SpouseMailingZipAsk', mailingAddress?.zipcode)]
            :[]
            spouseJson.push(...newJSON);

            return spouseJson;
            break;
        }
        case "Child": {
            const ClientHomeAddressLine1N2=(address?.addressLine2 !== undefined && address?.addressLine2 !==null && address?.addressLine2 !=='')? `#${address?.addressLine2} ` + address?.addressLine1:address?.addressLine1
            const mailingAddressLine1N2=(mailingAddress?.addressLine2 !== undefined && mailingAddress?.addressLine2 !==null && mailingAddress?.addressLine2 !=='')? `#${mailingAddress?.addressLine2} ` + mailingAddress?.addressLine1:mailingAddress?.addressLine1
          
            let spouseJson = [
                getJSONXML('ChildUS', 'Yes',repeatContext),
                getXMLObj('ChildrenYN', 'true'),
                getJSONXML('ChildMarried', (member.maritalStatusId == 1 || member.maritalStatusId == 2)? true: false,repeatContext),
                getJSONXML('ChildNameFull', member.fullName.toUpperCase(), repeatContext),
                getJSONXML('ChildNameFullAsk', member.fullName.toUpperCase(), repeatContext),
                getJSONXML('ChildDoB', member?.dob, repeatContext),
                getJSONXML('ChildEmail', contact.email, repeatContext),
                getJSONXML('ChildPhone', (contact.phone1 !== undefined && contact.phone1 !== null) ? contact.phone1.slice(-10) : contact.phone1, repeatContext),
                getJSONXML('ChildPhone2', (contact.phone2 !== undefined && contact.phone2 !== null) ? contact.phone2.slice(-10) : contact.phone2, repeatContext),
                getJSONXML('ChildPhone3', (contact.phone3 !== undefined && contact.phone3 !== null) ? contact.phone3.slice(-10) : contact.phone3, repeatContext),
                getJSONXML('ChildGender', member.gender, repeatContext),
                getJSONXML('ChildHomeCity', address?.city, repeatContext),
                getJSONXML('ChildHomeZip', address?.zipcode, repeatContext),
                getJSONXML('ChildHomeState', address?.state, repeatContext),
                getJSONXML('ChildHomeFull', ClientHomeAddressLine1N2, repeatContext),
                getJSONXML('ChildMailingAddressSameYN', member.addresSame, repeatContext),  
                getJSONXML('ChildMailingFull', mailingAddressLine1N2, repeatContext),
                getJSONXML('ChildMailingFullStreet_CSZ', mailingAddressLine1N2, repeatContext),
            ]


            const newJSON = (member.addressSame !== 'true')?
            [getXMLObj('ChildMailingStreetAsk', mailingAddressLine1N2),
            getXMLObj('ChildMailingCityAsk', mailingAddress?.city),
            getXMLObj('ChildMailingStateAsk', mailingAddress?.state),
            getXMLObj('ChildMailingZipAsk', mailingAddress?.zipcode)]:
            []
            
            spouseJson.push(...newJSON);

            return spouseJson;
            break;
        }
        case "Person": {

            console.log("PersonPerson",member)
            const addressJSON =  [];
            const personAlias = [];
            const ClientHomeAddressLine1N2=(address?.addressLine2 !== undefined && address?.addressLine2 !==null && address?.addressLine2 !=='')? `#${address?.addressLine2} ` + address?.addressLine1:address?.addressLine1
            const mailingAddressLine1N2=(mailingAddress?.addressLine2 !== undefined && mailingAddress?.addressLine2 !==null && mailingAddress?.addressLine2 !=='')? `#${mailingAddress?.addressLine2} `+ mailingAddress?.addressLine1:mailingAddress?.addressLine1
          

            if(member.addresSame !== "true"){
                addressJSON.push(getJSONXML('PersonMAddress', mailingAddress?.addressId, repeatContext),
                    getJSONXML('PersonMailingFull', mailingAddressLine1N2, repeatContext),
                    getJSONXML('PersonMailingFullStreet_CSZ', mailingAddressLine1N2, repeatContext),
                    getJSONXML('PersonMAddress:Street', mailingAddressLine1N2, repeatContext),
                    getJSONXML('PersonMAddress:City', mailingAddress?.city, repeatContext),
                    getJSONXML('PersonMAddress:State', mailingAddress?.state, repeatContext),
                    getJSONXML('PersonMAddress:Zip', mailingAddress?.zipcode, repeatContext))
            }
            if(member.nickName!== null && member.nickName!== '')
            {
                personAlias.push(getJSONXML('PersonNameAlias', member?.nickName.toUpperCase(), repeatContext))
            }

            let spouseJson = [
                getJSONXML('PersonUS', 'Yes', repeatContext),
                getJSONXML('PersonrenYN', 'true', repeatContext),
                getJSONXML('PersonName', member.fullName.toUpperCase(), repeatContext),
                getJSONXML('PersonDoB', member?.dob, repeatContext),
                getJSONXML('PersonEmail', contact.email, repeatContext),
                getJSONXML('PersonPhone', (contact.phone1 !== undefined && contact.phone1 !== null) ? contact.phone1.slice(-10) : contact.phone1, repeatContext),
                getJSONXML('PersonPhone2', (contact.phone2 !== undefined && contact.phone2 !== null) ? contact.phone2.slice(-10) : contact.phone2, repeatContext),
                getJSONXML('PersonPhone3', (contact.phone3 !== undefined && contact.phone3 !== null) ? contact.phone3.slice(-10) : contact.phone3, repeatContext),
                getJSONXML('PersonGender', member.gender, repeatContext),
                getJSONXML('PersonRelationshipClient',( member?.relationshipName !==undefined &&  member?.relationshipName !==null &&  member?.relationshipName !=='')? member?.relationshipName?.toLowerCase():null, repeatContext),
                getJSONXML('PersonRelationshipSpouse',( member?.rltnTypeWithSpouse !==undefined &&  member?.rltnTypeWithSpouse !==null &&  member?.rltnTypeWithSpouse !=='')? member?.rltnTypeWithSpouse?.toLowerCase():null, repeatContext),
                getJSONXML('MailingAddressSame', member.addresSame, repeatContext),
                getJSONXML('PersonAddress:City', address?.city, repeatContext),
                getJSONXML('PersonAddress:Zip', address?.zipcode, repeatContext),
                getJSONXML('PersonAddress:State', address?.state, repeatContext),
                getJSONXML('PersonAddress:Street', ClientHomeAddressLine1N2, repeatContext),
                getJSONXML('PersonOccupation', member?.personOccupation, repeatContext),
                getJSONXML('PersonAddress', address?.addressId, repeatContext),
                getJSONXML('PersonMailingAddressSameYN', member.addresSame, repeatContext),
                ...personAlias,
                ...addressJSON
            ]
            return spouseJson;
            break;
        }
        case "ChildSpouse": {
            let spouseJson = [
                getJSONXML("ChildSpouseNameFirst",member?.fName, repeatContext),
                getJSONXML("ChildSpouseNameLast", member?.fName, repeatContext),
                getJSONXML("ChildSpouseDob", member?.dob, repeatContext),
                getJSONXML("ChildSpouseOccupation", member?.Occupation, repeatContext),
            ]
            return spouseJson;
            break;
        }
    }
}

