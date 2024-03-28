import { Input, Card, CardBody, Button } from "@nextui-org/react";
import { useEffect, useState } from 'react';
import { loadUser, login, signup } from "../api/member";
import kakao from './../assets/login/kakao.png'
import google from './../assets/login/google.png'
import { memberType } from "../types/DataTypes";
import { saveToken, saveUserInfo } from "../store/memberSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// 회원가입 페이지

function Signup () {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // 아이디
  const [id, setId] = useState<string>('')
  const [checkId, setCheckId] = useState<boolean|null>(null)
  const idTest = function() {
    // 여기서 중복 검사하고
    setCheckId(true)
  }
  // 닉네임
  const [nickname, setNickname] = useState<string>('')
  const [checkNickname, setCheckNickname] = useState<boolean|null>(null)
  const nicknameTest = function() {
    // 여기서 중복검사
    setCheckNickname(true)
  }

  // 비밀번호1
  const [password1, setPassword1] = useState<string>('')
  // 비밀번호 보이고 안보이고 제어
  const [isVisible1, setIsVisible1] = useState(false);
  const toggleVisibility1 = () => setIsVisible1(!isVisible1);

  // 비밀번호2
  const [password2, setPassword2] = useState<string>('')
  // 비밀번호 보이고 안보이고 제어
  const [isVisible2, setIsVisible2] = useState(false);
  const toggleVisibility2 = () => setIsVisible2(!isVisible2);


  // 비밀번호 일치 확인
  const [okay, setOkay] = useState<boolean|null>(null)
  useEffect(() =>{
    // 비밀번호 확인이 입력되었을 때만 확인
    if (password2 != '') {
      // 만약 둘이 같다면
      if (password1 === password2) {
        setOkay(true)
      } else {
        // 둘이 다르다면
        setOkay(false)
      }
    } else{
      // 입력 해제했을 때는
      setOkay(null)
    }
  }, [password2])


  // 유효성
  const requestSignup = function() {
    // 중복검사를 안했다면,
    if (checkId === null){
      setCheckId(false)
    }
    if (checkNickname === null) {
      setCheckNickname(false)
    }
    // 중복검사를 모두 통과하고 비밀번호가 서로 같다면
    if (checkId === true && checkNickname === true && okay){
      handleSignup()
    }
  }

  // 회원가입....
  const handleSignup =async() => {
      const successSignup:boolean = await signup(id, password1, password2) 
      // 회원가입에 성공했다면, 로그인해주고, 토큰따오고 유저정보 가져오기
      if (successSignup === true) {
        handleLogin()
      }
  }
  

  // 유저 정보 저장
  const saveUser = async function(token:string) {
    const userInfo:memberType|void = await loadUser(token)
    if (userInfo) {
      dispatch(saveUserInfo(userInfo))
    }
  }

  // 로그인 로직
  const handleLogin = async function() {
    const token:string|void = await login(id, password1)
    if (typeof token == 'string') {
      dispatch(saveToken(token))
      saveUser(token)
      // navigate('/htp/result')
    }
  }
  
  return(
    <Card
      className="w-full h-[95vh] mt-[2.5vh] mx-auto sm:w-3/5 xl:w-1/3"
    >
      <CardBody className="flex-col content-center py-[5vh]">
        <p className="text-center text-4xl mb-2">Sign Up</p>
        {/* 아이디 입력 창 */}
        <div className="mx-auto mt-4 my-1 w-[95%] md:w-[70%] flex items-center">
          <Input 
            isClearable 
            value={id}
            onValueChange={setId}
            variant="underlined" 
            label='아이디' 
            isInvalid={checkId === false ? true : false}
            errorMessage={checkId === false ? '중복 검사를 실행해주세요' : null}
            className="mr-4"
          />
          <Button variant="ghost" className="mt-5" onClick={idTest}>중복 검사</Button>
        </div>
        {/* 닉네임 입력 창 */}
        <div className="mx-auto my-1 w-[95%] md:w-[70%] flex items-center">
          <Input 
            isClearable 
            value={nickname}
            onValueChange={setNickname}
            variant="underlined" 
            label='닉네임' 
            isInvalid={checkNickname === false ? true : false}
            errorMessage={checkNickname === false ? '중복 검사를 실행해주세요' : null}
            // placeholder="사용할 닉네임을 입력해주세요."
            className="mr-5"
          />
          <Button variant="ghost" className="mt-5" onClick={nicknameTest}>중복 검사</Button>
        </div>
        
        {/* 비밀번호 1번 입력 창 */}
        <Input
          label="비밀번호"
          value={password1}
          onValueChange={setPassword1}
          variant="underlined"
          // placeholder="비밀번호를 입력해주세요."
          endContent={
            <button className="focus:outline-none" type="button" onClick={toggleVisibility1}>
              {isVisible1 ? (
                <EyeSlashFilledIcon />
              ) : (
                <EyeFilledIcon />
              )}
            </button>
          }
          type={isVisible1 ? "text" : "password"}
          className="mx-auto my-1 w-[95%] md:w-[70%]"
        />

        {/* 비밀번호 2번 입력 창 */}
        <Input
          label="비밀번호 확인"
          value={password2}
          onValueChange={setPassword2}
          variant="underlined"
          // placeholder="위와 동일하게 입력해주세요."
          isInvalid={okay === false ? true : false}
          errorMessage={okay === false ? '비밀번호가 일치하지 않습니다' : null}
          endContent={
            <button className="focus:outline-none" type="button" onClick={toggleVisibility2}>
              {isVisible2 ? (
                <EyeSlashFilledIcon />
              ) : (
                <EyeFilledIcon />
              )}
            </button>
          }
          type={isVisible2 ? "text" : "password"}
          className="mx-auto my-1 w-[95%] md:w-[70%]"
        />

        {/* 회원가입 버튼 */}
        <Button 
          onClick={requestSignup}
          size='lg'
          variant="bordered"
          className="min-h-[40px] w-[90%] mx-auto my-5 bg-[#eeeeee] shadow md:w-[80%]">회원가입</Button>
        
        {/* Divider */}
        <div className="flex justify-center w-full items-center">
          <hr className="w-1/3"/>
          <p className="mx-5 text-slate-400 text-xs">또는</p>
          <hr className="w-1/3"/>
        </div>
        <Button isDisabled className="min-h-[40px] w-[90%] mx-auto my-2 mt-4 bg-[#FEE500] pr-7 shadow md:w-[80%]" size='lg'>
          <img className='w-8 h-9 mb-1' src={kakao} alt="kakaoLogo" />
          <p>카카오로 회원가입하기</p>
        </Button>
        <Button isDisabled className="min-h-[40px] w-[90%] mx-auto my-2 bg-[#ffffff] pr-7 shadow md:w-[80%]" size='lg'>
          <img className='w-6 h-6 mr-3' src={google} alt="googleLogo" />
          <p>구글로 회원가입하기</p>
        </Button>
      </CardBody>
    </Card>
  )
}

export default Signup


// 비밀번호용 아이콘
function EyeSlashFilledIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-1 text-2xl text-default-400 pointer-events-none">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
    </svg>
  )
}

function EyeFilledIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-1 text-2xl text-default-400 pointer-events-none">
      <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
      <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
      <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
    </svg>
  )
}