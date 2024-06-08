import { Button } from "@/components/ui/button"
import { IconAlertCircle, IconBook2,  IconDashboard,  IconHome2,  IconSchool, IconTable, IconUser, IconUsersGroup, IconNetwork, IconGitCommit } from "@tabler/icons-react";
import Link from "next/link"

export default function Nav(){
    return (
    <nav className="w-[200px] text-left h-screen bg-violet-700  text-white rounded-none border-r border-violet-300 shadow-lg">
         <div className="flex w-full mt-4 flex-col text-left">
               <Link className="m-2 flex-1" href={"/inicio"} ><Button  className="flex justify-start  hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white  w-full"><IconDashboard  strokeWidth={2} size={20} className="mr-3" /> Painel de Controle</Button></Link>
               <Link className="m-2 flex-1" href={"/cursos"}><Button  className="flex justify-start  hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white  w-full"><IconHome2 strokeWidth={2} size={20} className="mr-3"/> Cursos</Button></Link>
               <Link className="m-2 flex-1" href={"/alunos"}><Button  className="flex justify-start  hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white   w-full"><IconUser strokeWidth={2} size={20} className="mr-3"/> Alunos</Button></Link>
               <Link className="m-2 flex-1" href={"/professores"}><Button  className="flex justify-start  hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white   w-full"><IconUsersGroup strokeWidth={2} size={20} className="mr-3"/> Orientadores</Button></Link>
               <Link className="m-2 flex-1" href={"/tfc"} ><Button  className="flex justify-start  hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white   w-full"><IconBook2 strokeWidth={2} size={20} className="mr-3" /> TFCs</Button></Link>
               <Link className="m-2 flex-1" href={"/banca"} ><Button  className="flex justify-start  hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white   w-full"><IconTable  strokeWidth={2} size={20} className="mr-3" /> Banca</Button></Link>
               <Link className="m-2 flex-1" href={"/commits"} ><Button  className="flex justify-start  hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white  w-full"><IconGitCommit  strokeWidth={2} size={20} className="mr-3" /> Submissões</Button></Link>
               <Link className="m-2 flex-1" href={"/team"} ><Button  className="flex justify-start  hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white  w-full"><IconNetwork  strokeWidth={2} size={20} className="mr-3" /> Team</Button></Link>
               <Link className="m-2 flex-1" href={"/sobre"} ><Button  className="flex justify-start  hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white  w-full"><IconAlertCircle  strokeWidth={2} size={20} className="mr-3" /> Sobre</Button></Link>
               {/* <Link className="m-2 flex-1" href={"/estagio"} ><Button  className="flex justify-start  hover:bg-violet-800 hover:text-violet-700 text-[14px] rounded-md shadow-sm text-gray-950   w-full"><IconSchool strokeWidth={2} size={20} className="mr-3"/> Estágio</Button></Link> */}
         </div>
     </nav>
    )
}