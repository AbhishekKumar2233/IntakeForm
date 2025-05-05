import React,{useState, useEffect} from "react"
// import { useForm } from "react-hook-form"
import Login from "./Login"
import konsole   from "./control/Konsole"

const Captcha = (props) =>{


// const [register , CheckFun, watch, setError, formState: { errors } ] = useForm();


    const [num1, setnum1] = useState("")
    const [num2, setnum2] = useState("")
    const [inpVal, setinpVal] = useState("")
    const [capValid , setCapValid] = useState("")
  
  
    const randomNum = () => {
      setnum1(Math.floor(Math.random() * 10))
      setnum2(Math.floor(Math.random() * 10))
    }
  
  
  
    const refreshCaptcha = () => {
      setinpVal("");
      randomNum();
    }
  
    useEffect(() => {
      refreshCaptcha();
    }, [])
  
    const getValue = (e) => {
      if (/[1-9]/.test(e.target.value)) {
        konsole.log("value", e.target.value);
        setinpVal(e.target.value)
      } else {
        setinpVal("")
      }
    }
  

    const CheckFun = () =>{

  
      let sum = num1 + num2
      let res = inpVal;
     
      if(res == "" ){
        // alert("Enter the captcha")
        setCapValid("Enter the captcha")
        props.status
      }else if(res === undefined){
        setCapValid("Enter Captcha")

      }
      else if (res == sum) {
        // props.history.push("/CounterEnter");
        // Router.push('/Account/Signup')
        // alert("Correct Captcha")
        setCapValid("Correct Captcha")

      } else {
        // alert("Incorrect Captcha!!")
        setCapValid("Incorrect Captcha!")
      }
    // }
}

    return(
        <>
          <div className="mb-3">
                      <p className="fs-5">Enter Captcha:  {num1} + {num2}</p>
                      <input type="text" className="border border-dark fs-5 text-center w-25" name="Captcha"  onBlur={CheckFun} value={inpVal} onChange={getValue}
                        maxLength="2"
                       
                        />
                      <img src="../images/refresh.png" className="p-2 refresh_img" style={{ height: "35px" }} onClick={refreshCaptcha} />
                      <p>{capValid} {props.setCaptcha}</p>
                    </div>
        </>
    )
}

export default Captcha;