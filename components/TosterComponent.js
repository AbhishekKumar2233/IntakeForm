import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import konsole from "./control/Konsole";
import suceessimg from "../public/images/success.png"
import {globalContext} from "../pages/_app"


export class TosterComponent extends Component{
  // static contextType = globalContext
    constructor(props) {
        super(props);
        this.state = {
           show:true,
        }
    }
   
   

     handleClose()  {
        this.setState({
            show:true
          })
     }
    handleClose11 =()=>{
  
      this.setState({
        show:false
      })
      // this.context.setdata({
      //   open:false,
      //   text:"",
      //   type:""
      // })
      
    }
    
     
    render(){
        var successimg= "success.png"
        var confirmimg ="confirm.png"
        konsole.log( this.props.text,"porito")
        return(
            <>
               <Modal show={this.state.show}   backdrop="static"
        // {...props}
        size="ms"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        
        style={{backgroundColor: 'rgba(62, 62, 62, 0.8)', borderRadius:"10px", zIndex:"10000"}}

      >
     
        <Modal.Body className='mt-0 ms-3 zindex' 
        
         >
       
        
          <Modal.Title  closeButton id="contained-modal-title-vcenter" className='border-0 '>
          {this.props.type == "Confirmation" ? <img src="\images\confirm.png"/> : this.props.type == "Success" ? <img src="\images\success.png"/> : <img src="\images\warning.png"/>}
        
          <span className='ms-2'>{this.props.type}</span>
          </Modal.Title>
       
          <p className='ms-4'>
          {/* Are you sure? if you select 'yes', you won't be able to change again */}
        {this.props.text}
          </p>
          
          <Button className='config-button  w-40 pt-0 text-center'  
          // onClick={this.handleClose11} 
          style={{backgroundColor:"#720C20", border:"2px solid #720C20" }}>
          No
          </Button>
          <Button className='config-button w-40 pt-0 text-center'   style={{border:"2px solid #720C20" ,backgroundColor:"white", color:"#720C20"}} >
            Yes
          </Button>
         
          
      
        </Modal.Body>
        
      </Modal>
  
            </>
        )
    }

}
export default  TosterComponent;