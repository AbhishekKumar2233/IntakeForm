
const ClientInformationForm = ({primaryUser,spouseUserId}) => {

  let primaryuserdetails=primaryUser
  let splitInarray=primaryuserdetails?.split(' ')
  let firstName=splitInarray[0]
  let lastName=splitInarray[splitInarray?.length-1]
  let userShowdata=`Mr.& Mrs. ${lastName}`
  if(spouseUserId==''){
    userShowdata=`Mr. ${firstName}`
  }

  return (
    <div className="container-fluid clientInformation ">
      <div className=" d-flex justify-content-center">
        <h1 class="h4 display-4 generate-pdf-main-color clientInformation">Client Information Form</h1>
      </div>

      <div className=" d-flex justify-content-center border-bottom ">
        <h5 className="text-muted">NON-CRISIS Life Planning</h5>
      </div>

      <div className="container-fluid fw-bold generate-pdf-main-color">
        <p>
          {/* Dear */}
           <span className="fullnamecss ">
          {userShowdata}
           {/* { primaryUser } */}
           </span>,</p>
        <br></br>
        <p>
          {/* This is a very thorough and extensive form that may take some time to
          finish. Please be sure to fill in as much of the information as
          possible, to the best of your abilities. It is NOT a requirement that
          you complete every box or line—do the best that you can. The
          information that you provide informs our recommendations. Thus, the
          more information you can provide, the greater the possibility that all
          of your needs will be met. */}
          Thank you for taking time to complete the online organizer.  It should prove to be a program that you will maintain over time without having to put the work you put in to create the first one.  The information will be useful not only for you but your agents and family members, when they have to fulfill their obligations under the various documents in which you may have named them to be your agents.  Though there is no need to print the form, many people like to have a hard copy.  You can get that hard copy here.  If you have any questions please contact us
           {/* (give a link that goes to the law firm). */}
       &nbsp;    <a href="https://lifepointlaw.com/" target="_blank" style={{color:"blue", zIndex: "9999999999999999"}}>https://lifepointlaw.com/.</a>  <br /><br />
We are grateful for the opportunity to be of service to you. If you have any feedback on how we can make this process better please do provide us feedback. If you found this process to be valuable, please consider sharing this form with your friends and family (they should be able to enter emails and the form should be sent to these people with an explanation of what the form does).
        </p>
        <br></br>
        <p>Gratefully,</p>
        <br></br>
        <p>Your Legal Team at</p>
      </div>
      <div className="text-center">
        <img
        src="icons/LPLlogo.png"
        alt="icon-life-point-law"
      ></img>
      </div>

      {/* <div className="container-fluid">
        <p>Please bring the following items to your appointment:</p>
        <div className="row">
          <div className="col-1 w10 ">
            <div className="form-check">
              <input className="form-check-input" id="check-1" type="checkbox" />
            </div>
          </div>
          <div className="col-4 ">
            <p>This completed packet</p>
          </div>
        </div>

        <div className="row">
          <div className="col-1 w10">
            <div className="form-check">
              <input className="form-check-input" id="check-2" type="checkbox" />
            </div>
          </div>
          <div className="col-6">
            <p>
              Copies of your <mark>Health Insurance Cards</mark>
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-1 w10">
            <div className="form-check">
              <input className="form-check-input" id="check-3" type="checkbox" />
            </div>
          </div>
          <div className="col-6">
            <p>
              Copies of your{" "}
              <mark>
                Latest <mark>Tax Return</mark>
              </mark>
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-1 w10">
            <div className="form-check">
              <input className="form-check-input" id="check-4" type="checkbox" />
            </div>
          </div>
          <div className="col-8">
            <p>
              <mark>Long-Term Care Policy</mark>{" "}
              {"(i.e., a complete copy of your policy, if you have one)"}
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-1 w10">
            <div className="form-check">
              <input className="form-check-input" id="check-5" type="checkbox" />
            </div>
          </div>
          <div className="col-11">
            <p>
              <mark>Life Insurance Policy</mark>
              {
                "(i.e., a complete copy of your policy and latest statement with current values, if you have one)"
              }
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-1 w10">
            <div className="form-check">
              <input className="form-check-input" id="check-6" type="checkbox" />
            </div>
          </div>
          <div className="col-8">
            <p>
              <mark>Latest Financial Statement</mark>:{" "}
              {"(e.g., Bank, Investment, Retirement accounts)"}
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-1 w10">
            <div className="form-check">
              <input className="form-check-input" id="check-7" type="checkbox" />
            </div>
          </div>
          <div className="col-8">
            <p>
              <mark>Deed</mark> to real property
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-1 w10">
            <div className="form-check">
              <input className="form-check-input" id="check-8" type="checkbox" />
            </div>
          </div>
          <div className="col-8">
            <p>
              Copies of all{" "}
              <mark>Existing Legal Estate Planning and Trust Documents </mark>
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-5">
            <p>May we send correspondence and drafts of documents via email?</p>
          </div>
          <div className="col-2">
            <div className="form-check">
              <input className="form-check-input" id="check-9-Y" type="checkbox" />
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col-2">
            <div className="form-check">
              <input className="form-check-input" id="check-9-N" type="checkbox" />
              <label className="form-check-label">No</label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-5">
            <p>Have you listened to our radio show?</p>
          </div>
          <div className="col-2">
            <div className="form-check">
              <input className="form-check-input" id="check-9-Y" type="checkbox" />
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col-2">
            <div className="form-check">
              <input className="form-check-input" id="check-9-N" type="checkbox" />
              <label className="form-check-label">No</label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <p>What are your planning objectives?</p>
          </div>
          <div className="col">
            <input className="long-input" id="txt-l-1"></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
          <input className="long-input" id="txt-l-2"></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
          <input className="long-input" id="txt-l-3"></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
          <input className="long-input"  id="txt-l-4"></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
          <input className="long-input" id="txt-l-5"></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
          <input className="long-input" id="txt-l-6"></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
          <input className="long-input" id="txt-l-7"></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
          <input className="long-input" id="txt-l-8"></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
          <input className="long-input" id="txt-l-9"></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
          <input className="long-input" id="txt-l-10"></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
          <input className="long-input" id="txt-l-11"></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
          <input className="long-input" id="txt-l-12"></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
          <input className="long-input" id="txt-l-13"></input>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ClientInformationForm;
