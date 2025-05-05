
import { GET_Auth_TOKEN, GET_USER_DETAILS, SET_LOADER ,FEEDBACK_TYPE} from '../Actions/action'

function reducer(state = {showFeedbackBtn:true}, action) {
  switch (action.type) {
    case GET_USER_DETAILS:
      return {
        ...state,
        userDetail: action.payload,
      }
    case GET_Auth_TOKEN:
      return {
        ...state,
        authToken: action.payload,
      }
    case SET_LOADER:
      return {
        ...state,
        showloader: action.payload,
      }
    case FEEDBACK_TYPE:
      return{
        ...state,
        showFeedbackBtn:action.payload
      }
      

    default:
      return state
  }
}

export default reducer;