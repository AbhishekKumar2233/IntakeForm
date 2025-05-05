import React, { Component } from 'react'
import konsole from './control/Konsole';
import { $CommonServiceFn } from './network/Service';
import { $Service_Url } from './network/UrlPath';

export class ProfessServices extends Component {
    // static contextType = globalContext
    constructor(props) {
      super(props);
      this.state = {
        professServicesDiv : [],
      }
    }

    componentDidMount(){
        this.professSerChecks()
        if(this.props.typeOfPage == true){
            this.props?.getMappedServiceArr(this.state.professServicesDiv)
        }
    }

    componentDidUpdate(prevProps,prevState){
        if(prevState.professServicesDiv !== this.state.professServicesDiv){
            if(this.props.typeOfPage == true){
                this.props?.getMappedServiceArr(this.state.professServicesDiv)
            }
        }
    }

    professSerChecks = () =>{

        $CommonServiceFn.InvokeCommonApi("Get", $Service_Url.getProfessionalSecDesc,'', (response, error) => {
         if (response) {
           konsole.log("responseServicePro",response.data.data)
           const responseData = response.data.data
           const themeIcons = [
            "icons/healthTheme.svg",
            "icons/housingTheme.svg",
            "icons/financeTheme.svg" ,
            "icons/legalTheme.svg",
            "icons/otherTheme.svg"
           ]
    
           const whiteIcons = [
            "icons/Healthwhite.svg",
            "icons/housing white.svg",
            "icons/Financewhite.svg" ,
            "icons/Legal white.svg",
            "icons/Otherswhite.svg"
           ]
           for(let i = 0; i < responseData.length; i++){
                  responseData[i]["themeIcons"] = themeIcons[i]
                  responseData[i]["whiteIcons"] = whiteIcons[i]
          }
          konsole.log("responseDataIconsCommon",responseData)
           this.setState({
            professServicesDiv : responseData
           })
           if(this.props?.proCategories?.length > 0){
             this.props.updateProCategories(this.props?.proCategories,responseData)
           }
         }
         else {
             
             konsole.log("ErroService",error)
         }
       })
     }

     selectService = (index, data, click) => {
      konsole.log("sdatta",data)
        if (click === "clicked") {
          const updatedDivArray = [...this.state.professServicesDiv];
          updatedDivArray[index].checked = !updatedDivArray[index].checked;
          this.setState({ professServicesDiv: updatedDivArray }, () => {
            if(this.props.typeOfPage == true && this.props.calledFrom == "fromProServiceProvider"){
              konsole.log("ywetywhgdhw",updatedDivArray[index])
              // ------------------------------
                this.props.fetchProfessType(updatedDivArray[index].checked,data);
            }
          });
        }
        // konsole.log("eventstss", event, this.state.selectedServices, click,data);
      };

     handleMouseEnter = (event,data) => {
        konsole.log("evnetOnHover",event,data)
        this.setState({
          isHovered : true,
          hoveredProSerDesc : data.value
        })
      }
    
       handleMouseLeave = () => {
        this.setState({
          isHovered : false,
          hoveredProSerDesc : ""
        })
      };    

    render(){
        {konsole.log("itemsssCommon",this.state.professServicesDiv)}
        return(
            <>
                      {this.state.professServicesDiv.map((item, index)=>{
                            return (
                              <>
                              <div className='m-1 cursor-pointer'>
                              <div className= {`${item.checked == true ? "selectedServiceCss" : "proffSearchButton"} d-flex `}
                               onClick={()=>this.selectService(index,item,"clicked")}
                               onMouseEnter={(event)=>this.handleMouseEnter(event,item)}
                               onMouseLeave={this.handleMouseLeave}
                              >
                              <img className="mb-1" src={((this.state.isHovered == true && this.state.hoveredProSerDesc == item.value) || item.checked == true) ? item.whiteIcons : item.themeIcons} alt={`Image ${index}`} style={{height:"20px",width:"20px"}}/>
                              <div className="ms-1 fw-bold d-flex align-items-center" >{item.label}</div>
                              </div>
                                </div>
                              </>
                            );
                          }
                        )}
            </>
        )
    }
}
export default ProfessServices;