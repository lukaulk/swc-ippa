import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { IconLogout2, IconUser } from "@tabler/icons-react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import moment from "moment"
import Cookies from "js-cookie"
import { useRouter } from 'next/router'
import { useSession } from "../../../utils/loginAuth"
import { useEffect } from "react"
import { Capitalize, AnalyzeString} from "../../../utils/basics"

interface HProps {
  content?: string
}

export default function Header(props: HProps) {
  const router = useRouter()
  const session = useSession()

  var nomeLogin:any;
  var categoria:any;
  var timestamp:any;


  if(session.sucess == true){
    nomeLogin = session.data.key
    categoria = session.data.type
    timestamp = session.data.timestamp

  } 
  
  const killSession = () => {
    Cookies.remove("sessao")
    router.push("login/")
  }
  useEffect(()=>{
    if (session.sucess === false) {
      alert("Ocorreu um erro por questões de segurança deves fazer o login novamente!")
      console.log("Erro de sessão");
      router.push("/login");
    }

    var user = document.querySelector("#username") !== null ? document.querySelector("#username").innerHTML = Capitalize(String(nomeLogin)) : "ERR!"
    var fall = document.querySelector("#fallused") !== null ? document.querySelector("#fallused").innerHTML = AnalyzeString(String(nomeLogin)) : "ERR!"
    var cat = document.querySelector("#categoria") !== null ? document.querySelector("#categoria").innerHTML = AnalyzeString(String(categoria)) : "ERR!"
  
  }, [])
  return (<div className="flex flex-row w-full justify-center items-center bg-white border rounded-lg border-l-0  border-zinc-300 h-16 min-h-15 text-gray-950 relative">
  <h1 className="text-md text-violet-700 ml-6 font-semibold c">
    {props.content ? props.content : "Nome da Seção"}
  </h1>
  <Popover >
    <PopoverTrigger asChild>
      <div className="flex h-full px-4 text-sm font-semibold hover:bg-zinc-50 items-center gap-3 cursor-pointer absolute right-0">
        <span className="text-capitalize" id="username"></span>
        <Avatar className="w-8 h-8  border ring-2 ring-blue-300 border-white ">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback ><span id="fallused"></span></AvatarFallback>
        </Avatar>
      </div>
    </PopoverTrigger>
    <PopoverContent className="mr-4 flex p-0 flex-col bg-white w-fit">
      <Dialog>
        <DialogTrigger>
          <Button className="text-black hover:bg-gray-100 active:bg-zinc-300 flex justify-start w-full" ><IconUser className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} />Informações da Conta</Button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Informações da Conta</DialogTitle>
            <br />
            <br />
            <DialogDescription className="flex flex-col items-center justify-center">
              <Avatar className="w-24 h-24 border ring-2 ring-blue-300 border-white ">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback >{AnalyzeString(String(nomeLogin))}</AvatarFallback>
              </Avatar>
              <br />
              <br />
              <span className="text-xl text-capitalize" >Nome: {String(nomeLogin)}</span>
              <span className="text-md text-capitalize" >{String(categoria)}</span>

              <br />
              <br />
              <span className="text-base text-green-600">Sessão Iniciada </span>
              <span className="text-sm text-slate-700">Desde {timestamp ? moment(timestamp).format("HH:mm - YYYY") : "Agora"}</span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
        <Button className="text-red-700 hover:bg-gray-100 active:bg-zinc-300 flex justify-start w-full" onClick={killSession}><IconLogout2 className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Terminar Sessão</Button>
      </PopoverContent>
  </Popover>
</div>)
}