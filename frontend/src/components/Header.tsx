import HomeIcon from "../atoms/Icons/HomeIcon"
import MessageIcon from "../atoms/Icons/MessageIcon"
import { useNavigate } from "react-router-dom"
import {Button, Card, Badge, CardBody} from "@nextui-org/react";
import { useEffect, useState } from "react";
import EventSource from "react-native-sse";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { villageBackgroundColor } from "../atoms/color";
import axios from "axios";
import Swal from "sweetalert2";


type notificationType = {
  message: string
}
function Header() {
  const navigate = useNavigate()
  const [openMessage, setOpenMessage] = useState<Boolean>(false)
  const [alarmCount, setAlarmCount] = useState<number>(0)
  const [notifications, setnotifications] = useState<notificationType[]|null>(null)

  useEffect(() => {
    // 처음엔 메세지창 닫아주고
    setOpenMessage(false)
    // 서버 ON
    fetchSSE()
  }, [])

  let accessToken = useSelector((state:RootState) => state.accessToken.value)
  let member = useSelector((state:RootState) => state.member)
  

  const Toast = Swal.mixin({
    toast: true,
    position:'top',
    timer: 1000
  })
  
  // 알림 서버 연결 및 데이터 가져오기
  const fetchSSE = () => {
    let lastHeartbeat = Date.now()
    console.log(lastHeartbeat)
    const eventSource = new EventSource('https://mindtrip.site/api/notifications/v1/subscribe', {
      headers: {
        Authorization: accessToken
      }
    })

    eventSource.addEventListener("open", () => {
      console.log('알림서버 연결 지속중')
    })

    eventSource.addEventListener('message', (e) => {
      if (e.data) {
        const parsedData = JSON.parse(e.data)
        // console.log(parsedData)
        // 처음에 count갯수가 오면 바로 보여주고
        if (parsedData.type === 'COUNT') {
          setAlarmCount(parsedData.count)
        }
        // 알림이 온다면 +1해주기
        else if (parsedData.type === 'NOTIFICATION') {
          // console.log(parsedData)
          setAlarmCount(alarmCount + 1)
          console.log(parsedData.message)
          Toast.fire({
            title: parsedData.message
          })
        }
        // heartbeat를 수신하면 시간 업데이트
        else if (parsedData.type === 'HEARTBEAT') {
          lastHeartbeat = Date.now()
        }
      }
    })

    eventSource.addEventListener('error', (err) => {
      console.log(err)
    })
  }

  // 로딩중
  const [loading, setLoading] = useState<boolean>(false)

  // 알림 확인하면 메세지 보여주기
  const handleAlarm = function() {
    setLoading(true)
    setOpenMessage(!openMessage)
    axios.post('https://mindtrip.site/api/notifications/v1', null, {
      headers:{
        Authorization: accessToken
      }
    }).then((res) => {
      setLoading(false)
      setnotifications(res.data.result)
      setAlarmCount(0)
    }) .catch((err) => console.log(err))
  }

  
  return(
    <div className="relactive">
      <div className="h-[9vh] flex justify-between px-5 items-center">
        <Button 
          isIconOnly 
          variant="light"
          onClick={() => {navigate('/main')}}
        >
          <HomeIcon />
        </Button>
        <Badge content={alarmCount} className={villageBackgroundColor[member.villageName]}>
          <Button 
            isIconOnly 
            variant="light"
            onClick={handleAlarm}
          >
            <MessageIcon />
          </Button>
        </Badge>
        
      </div>
      {/* 메세지창 */}
      <Card 
        className={`${openMessage ? '' : 'hidden'} 
        absolute w-[80vw] h-[30vh] p-3
        bg-white top-[8vh] right-[2vw] z-20`}
      >
        <CardBody>
          {
            loading && (<p>로딩중</p>)
          }
          {
            (notifications?.length == 0) ? (<p>수신된 메세지가 없습니다!</p>) : (<div>
              {
                notifications?.map((noti, idx) => {return(
                  <div key={idx} className="py-1">{noti.message}</div>
                )})
              }
            </div>)
          }
        </CardBody>
        
      </Card>
    </div>
    
  )
}

export default Header