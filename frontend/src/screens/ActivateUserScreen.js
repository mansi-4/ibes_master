import React,{useState,useEffect} from 'react'
import {Link,useNavigate, useParams} from 'react-router-dom'
import {Card,Row,Col,Button} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import Loader from "../components/Loader"
import Message from "../components/Message"
import FormContainer from "../components/FormContainer"
import {activateUser,getUserActivationDetails,reActivateUser} from '../actions/userAction'
import jwt_decode from "jwt-decode";
function ActivateUser() {
    const {token} = useParams();
    let history = useNavigate();
    const dispatch= useDispatch()
    const userDetails=useSelector(state => state.userDetails)
    const {error:errorUserDetails,loading:loadingUserDetails,user} = userDetails
    
    const userActivation=useSelector(state => state.userActivation)
    const {error,loading,activation} = userActivation

    const userReActivation=useSelector(state => state.userReActivation)
    const {error:erroruserReActivation,loading:loadinguserReActivation,reactivation} = userReActivation
    
    const [user_id,setUserId]=useState("")
    useEffect(()=>{
        var decodedHeader=jwt_decode(token)
        setUserId(decodedHeader.id)
        var id=decodedHeader.id
        dispatch(getUserActivationDetails(id))
    },[token,dispatch])
    useEffect(() => {
      if (user && user.isActive!=0) {
        dispatch(activateUser(token));
      }
    }, [user, token, dispatch]);
    function resendActivation(){
      dispatch(reActivateUser(user_id))
    }
  return (
    <FormContainer>
      <h1>Account Activation</h1>
      
      
      <Card className="h-70 my-3 p-3 rounded">
        
        <Card.Body>
            {user.isActive === 0 ? 
                  <>
                  <h5>Your Account is already activated</h5> <Row className='py-3'>
                    <Col>
                        <Link
                            to={'/login'}>
                            Sign In
                            </Link>
                    </Col>
                  </Row>
                  </>: (
              <>
              <Card.Title as="div">
                  <h5>Your Account is being activated...</h5>
              </Card.Title>
              <Card.Text as="div">
                <div>
                  {error && 
                  <>
                  <Message variant="danger">{error}</Message>
                  <Row className='py-3'>
                  <Col>
                      <Button type="button" variant="light" onClick={resendActivation}>
                          Resend Activation Link
                      </Button>
                  </Col>
                </Row>
                </>
                }
                {erroruserReActivation&& 
                  <>
                  <Message variant="danger">{error}</Message>
                  <Row className='py-3'>
                  <Col>
                      <Button type="button" variant="light" onClick={resendActivation}>
                          Resend Activation Link
                      </Button>
                  </Col>
                </Row>
                </>}
                  {loading && <Loader/>}
                  {loadinguserReActivation && <Loader/>}  
                  {activation && <Message variant="info">{activation}</Message>}
                  {activation === "Account Activated Successfully" ? 
                  <Row className='py-3'>
                    <Col>
                        <Link
                            to={'/login'}>
                            Sign In
                            </Link>
                    </Col>
                  </Row>:""}
                  {reactivation && <Message variant="info">{reactivation}</Message>}
                  {reactivation === "Account Activated Successfully" ? 
                  <Row className='py-3'>
                    <Col>
                        <Link
                            to={'/login'}>
                            Sign In
                            </Link>
                    </Col>
                  </Row>:""}
                </div>
              </Card.Text>
              </>
            )}
              
           
        </Card.Body>
        
    </Card>
    </FormContainer>
  )
}

export default ActivateUser
