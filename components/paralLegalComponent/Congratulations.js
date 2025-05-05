import React,{useEffect} from 'react';
export default function Congratulation(props) {
    // const navigate = useNavigate();
    useEffect(()=>{
// setTimeout(()=>{
//     props.callapidata();
    // props.setlagecycongratulationsuser(false)
//     props.handleshowverifyotppassword(false)

// },5000)

    },[])
    
    return (
    <div className="container-fluid  m-0 bg-light" style={{height: 'auto', minHeight: '20vh'}}>
            <div className="row">
            <div className=' m-auto text-center mt-0'>
                    {/* <Header /> */}
                    <h1 className='congratulationText mt-4'>Congratulations</h1>
                    
                    <p className='mt-2 fs-5'>{(props.lagecycongratulationsuser == true)?"Congratulations user is activated successfully. We also noticed that the user is already associated with us, hence request to sign in with the old password or reset the password using universal login.":"account has been activated"}</p>
                   
                    {/* <label className='link-primary cursor-pointer'> <a href="https://aologin.azurewebsites.net/Account/ForgetPassword"> Reset Password</a></label> */}
                    
                </div>
                </div>
            </div>
           
  

    );
};