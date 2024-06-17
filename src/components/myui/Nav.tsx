import { Button } from "@/components/ui/button"
import { IconAlertCircle, IconBook2, IconDashboard, IconHome2, IconTable, IconUser, IconUsersGroup, IconNetwork, IconGitCommit } from "@tabler/icons-react";
import Link from "next/link"
import { useSession } from '../../../utils/loginAuth'
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

interface IAuth {
    uid(): number;
    type(): string;
}

export default function Nav() {
    const { data: sessionData } = useSession();
    const [authType, setAuthType] = useState<string>('nenhum');
    const router = useRouter();

    const auth: IAuth = {
        uid: () => sessionData ? sessionData.uid : 0,
        type: () => sessionData ? sessionData.type : 'nenhum'
    }

    useEffect(() => {
        setAuthType(auth.type());
    }, [sessionData]);


    return (
        <nav className="w-[200px] text-left h-screen bg-violet-700 text-white rounded-none border-r border-violet-300 shadow-lg">
            <div className="flex w-full mt-4 flex-col text-left">
                {(authType === 'administrador' || authType === 'coordenador' || authType === 'secretario' ) && (
                    <>
                        <Link className="m-2 flex-1" href={"/inicio"}>
                            <Button className={`flex justify-start hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white w-full  transition-colors ${router.pathname === '/inicio' ? 'bg-violet-500' : ''}`}>
                                <IconDashboard strokeWidth={2} size={20} className="mr-3" /> Painel de Controle
                            </Button>
                        </Link>
                        <Link className="m-2 flex-1" href={"/cursos"}>
                            <Button className={`flex justify-start hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white w-full  transition-colors ${router.pathname === '/cursos' ? 'bg-violet-500' : ''}`}>
                                <IconHome2 strokeWidth={2} size={20} className="mr-3" /> Cursos
                            </Button>
                        </Link>
                    </>
                )}
                {(authType === 'administrador' || authType === 'coordenador' || authType === 'secretaria') && (
                    <>
                        <Link className="m-2 flex-1" href={"/alunos"}>
                            <Button className={`flex justify-start hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white w-full  transition-colors ${router.pathname === '/alunos' ? 'bg-violet-500' : ''}`}>
                                <IconUser strokeWidth={2} size={20} className="mr-3" /> Alunos
                            </Button>
                        </Link>
                        <Link className="m-2 flex-1" href={"/professores"}>
                            <Button className={`flex justify-start hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white w-full  transition-colors ${router.pathname === '/professores' ? 'bg-violet-500' : ''}`}>
                                <IconUsersGroup strokeWidth={2} size={20} className="mr-3" /> Orientadores
                            </Button>
                        </Link>
                    </>
                )}
                {(authType === 'administrador' || authType === 'coordenador' || authType === 'banca') && (
                    <>
                        <Link className="m-2 flex-1" href={"/tfc"}>
                            <Button className={`flex justify-start hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white w-full  transition-colors ${router.pathname === '/tfc' ? 'bg-violet-500' : ''}`}>
                                <IconBook2 strokeWidth={2} size={20} className="mr-3" /> TFCs
                            </Button>
                        </Link>
                        <Link className="m-2 flex-1" href={"/banca"}>
                            <Button className={`flex justify-start hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white w-full  transition-colors ${router.pathname === '/banca' ? 'bg-violet-500' : ''}`}>
                                <IconTable strokeWidth={2} size={20} className="mr-3" /> Banca
                            </Button>
                        </Link>
                    </>
                )}
                {(authType === 'administrador' || authType === 'aluno' || authType === 'professor') && (
                    <>
                        <Link className="m-2 flex-1" href={"/commits"}>
                            <Button className={`flex justify-start hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white w-full  transition-colors ${router.pathname === '/commits' ? 'bg-violet-500' : ''}`}>
                                <IconGitCommit strokeWidth={2} size={20} className="mr-3" /> Submissões
                            </Button>
                        </Link>
                    </>
                )}
                {(authType === 'administrador') && (
                    <>
                        <Link className="m-2 flex-1" href={"/team"}>
                            <Button className={`flex justify-start hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white w-full  transition-colors ${router.pathname === '/team' ? 'bg-violet-500' : ''}`}>
                                <IconNetwork strokeWidth={2} size={20} className="mr-3" /> Team
                            </Button>
                        </Link>
                    
                    </>
                )}
                <Link className="m-2 flex-1" href={"/sobre"}>
                    <Button className={`flex justify-start hover:bg-violet-800 hover:text-violet-100 text-[14px] rounded-md shadow-sm text-white w-full  transition-colors ${router.pathname === '/sobre' ? 'bg-violet-500' : ''}`}>
                        <IconAlertCircle strokeWidth={2} size={20} className="mr-3" /> Sobre
                    </Button>
                </Link>
                {/* <Link className="m-2 flex-1" href={"/estagio"}>
                    <Button className="flex justify-start hover:bg-violet-800 hover:text-violet-700 text-[14px] rounded-md shadow-sm text-gray-950 w-full">
                        <IconSchool strokeWidth={2} size={20} className="mr-3"/> Estágio
                    </Button>
                </Link> */}
            </div>
        </nav>
    )
}
