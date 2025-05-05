import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { CustomCurrencyInput, CustomRadio } from '../../Custom/CustomComponent'
import { radioYesNoLabelWithBool } from '../../Helper/Constant'
import { $AHelper } from '../../Helper/$AHelper'
import usePrimaryUserId from '../../Hooks/usePrimaryUserId'

const AdditionalDetails = ({setSamePremFreqForSpouse,samePremFreqForSpouse,isSameAsSpouse,setSamePrmAmtForSpouse,samePrmAmtForSpouse, startTabIndex}) => {
  const {_spousePartner}=usePrimaryUserId();
   const startingTabIndex = startTabIndex ?? 0;
  let placeholder=`Copy same data to ${_spousePartner}`;
  let placeholder2=`Save premium frequency for ${_spousePartner} also ?`;
  let placeholder3=`Premium Amount For ${_spousePartner}`;
  return (
    <>
        {isSameAsSpouse == true && 
        <Row className='mb-4'>
        <Col xs={12} md={12}>
            {/* @@Radio same premium frequency for spouse */}
            <CustomRadio tabIndex={startingTabIndex + 1} options={radioYesNoLabelWithBool} classType='' placeholder={placeholder2} value={samePremFreqForSpouse} onChange={(item) => setSamePremFreqForSpouse(item?.value)} />
        </Col>
        {samePremFreqForSpouse == 1 &&
         <Col xs={12} md={8}>
         {/* @@Input same premium amount for spouse */}
            <CustomCurrencyInput tabIndex={startingTabIndex + 2}  placeholder={placeholder3} id='SamePremAmntForSpouse' name='Premium Amount For Spouse' 
            onChange={(e) => setSamePrmAmtForSpouse(e)} 
            value={samePrmAmtForSpouse} 
            />
        </Col>}
        </Row>}
    </>
  )
}

export default AdditionalDetails 