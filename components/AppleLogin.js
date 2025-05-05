import React, { useEffect, useMemo, useState,useContext} from 'react'
// import '../styles/AppleLogin.css'
import Modal from "react-bootstrap/Modal";



const AppleLogin = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsactive] = useState(false)
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
      setShowPassword(prevShowPassword => !prevShowPassword);
    };
  
   
     useEffect(() => {
       let error = {}
        if(props?.loginError == "Wrong Apple Id or Password"){
         error.emails = 'Invalid Apple Id or Password';
        }
        else{
         error.emails = '';
        }
        if (Object.keys(error).length > 0) {
          setErrors(error);
        }
        
     }, [props])
   

     
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
      };
    
      const handlePasswordChange = (e) => {
        setPassword(e.target.value);
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
       
        const newErrors = {};

  
          if (email.trim() === '') {
         newErrors.email = 'email name is required';
        }
         
        if (password.trim() === '') {
          newErrors.password = 'password is required';
        }
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
        } else {
            // customSelectOptions('Other')
            props.appleContact(email,password)
          console.log('Form submitted:', email,password);
        }
        
        
    
       
   
      };
      const imagePaths = [
        {img:"images/step1.png",text:"Click on Sign in"},
        {img:"images/step2.0.png",text:"Enter your apple registered email address"},
        {img:"images/step2.png",text:"Enter your password"},
        {img:"images/step5.png",text:"Enter verification code which you will receive on your phone number"},
        {img:"images/step2222.png",text:"Click on app-Specific Passwords"},
        {img:"images/step6.png",text:"Click on Generate an app-specific password"},
        {img:"images/step8.png",text:"Enter any name which you want to give and click on create"},
        {img:"images/step7.png",text:"Re-enter your password for confirmation"},
        {img:"images/step3.png",text:"Now you will get app-specific password. Copy that and paste in our portal"}
       
      
        
       
      
      ];
      const handleDownload = async () => {
        const link = document.createElement('a');
        link.href = 'stepsPdf.pdf'; // Replace with the actual path to your PDF
        link.download = 'downloaded_pdf.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      
      }
      
  return (
    <>
   <div className="sign-in-form">
   <div>
      <h1>Authentication</h1>
      <form onSubmit={handleSubmit}>
        <div>
        
          <label htmlFor="emails">Apple ID / Email Address :</label>
          <p className='text-danger mb-0'>{errors.emails && <div className="mb-0">{errors.emails}
           </div>}</p>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder='Enter Apple ID / Email Address '
            // required
          />
          <p className='text-danger'>{errors.email && <div className="error">{errors.email}
           </div>}</p>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          {/* <input type={showPassword ? 'text' : 'password'}id="password"value={password}onChange={handlePasswordChange}required>
          <span className={`eye-icon ${showPassword ? 'visible' : ''}`}onClick={togglePasswordVisibility}>👁️</span></input> */}
          <div class="d-flex form-control p-0"><input type={showPassword ? 'text' : 'password'}id="password"value={password}onChange={handlePasswordChange}class="form-control fs-5  border-0" placeholder=" Enter Password" name="password"/><img src={showPassword ? "/icons/clarity_eye-show-line.svg":"https://aologinuat.azurewebsites.net/icons/clarity_eye-hide-line.svg"} onClick={togglePasswordVisibility} class="img-fluid cursor-pointer mx-2"/></div>
        </div>
        <p className='text-danger'>{errors.password && <div className="error">{errors.password}
                                </div>}</p>
        <button type="submit">Authenticate</button>
      </form>
      {/* <div className='d-flex justify-content-between'>
      <span className=''><b>If you have not password then <a className='linkClick' href='https://appleid.apple.com/account/manage'> click here</a></b> </span>
      <span><b><a className='linkClick'onClick={()=>setIsactive(true)}>How to Do</a></b></span>
      </div> */}
   <div className="">
  <p className="mb-2 mb-md-0">
   <b>If you don't have a password, <span><a className="linkClick" href="https://appleid.apple.com/account/manage">click here</a></span>
   </b>  </p>
  <span className="mt-2 mt-md-0">
    <b><a className="linkClick mobile" onClick={() => setIsactive(true)}>Guide to genetrate password</a></b>
    
  </span>
</div>



    </div>
    {isActive == true && <>
                  <Modal
                      show={isActive}
                      size="lg"
                      onHide={() => setIsactive(false)}
                      backdrop="static"
                      className="newModal"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "10px" }} >
                      <Modal.Header className="text-white mobileHeading" closeVariant="white" closeButton>
                      How to Generate App-Specific Password
                      </Modal.Header>
                      <Modal.Body className="rounded" style={{ maxHeight: "45rem", overflowY: "auto" }}>
                      
                        <div className='d-flex justify-content-between tab'>
                         <h5>Please follow the below mentioned steps and <a className='linkClick'href='https://appleid.apple.com/account/manage'>Click here</a></h5>
                          <button className="theme-btn" onClick={handleDownload}>Download as PDF</button>
                          </div>
                          {imagePaths.map((path, index) => (
                              <>
                                  <div className='d-flex  flex-column mobile2' style={{ margin: "3rem" }}>
                                      <span><b>Step {index + 1} : </b> {"  " + path?.text}</span>
                                      <img className='mobileImg' key={index} src={path?.img} alt={`Image ${index}`} style={{ height: "20rem", border: "2px solid black", width: "45rem" }} /><br />
                                  </div>
                              </>
                          ))}
                      </Modal.Body>

                  </Modal> 
    </>}
     </div>

    </>
  )
}

export default AppleLogin