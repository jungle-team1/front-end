import axios from "axios"
import { KAKAO_AUTH_URL, KAKAO_TOKEN_URL } from "../oauth/Oauth"

const Login = () => {
    console.log(import.meta.env.VITE_SOCKET_SERVER_URL);
    return (
        <div>
            로그인 페이지1113
            <button onClick={() => { window.location.href = KAKAO_AUTH_URL }}>
                로그인 하기
            </button>
        </div>
    )
}

export default Login;