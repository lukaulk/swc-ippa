import Nav from '@/components/myui/Nav'
import "@/app/globals.css"
import Header from "@/components/myui/Header"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IconCursorText, IconDots, IconPlus, IconX, IconLock } from "@tabler/icons-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label }  from "@/components/ui/label"
import { useSession } from "../utils/loginAuth"
import { teamFunc, teamSchema } from "../utils/teamUtils"
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import AutoCloseAlert from "@/components/myui/AutoCloseAlert"

export default function team() {
    const { data: sessionData } = useSession();
    const uid = sessionData ? sessionData.uid : 0;

    const [teamData, setTeamData] = useState({ usuario: "", senha: "", categoria: ""})
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [msg, setMsg] = useState({ message: '' })
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [teamList, setTeamList] = useState<any[]>([])
    
    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const data = await teamFunc.findTeam(uid);
                if (data.success === false) {
                    setError(data.error);
                } else {
                    setTeamList(data.data);
                }
            } catch (err) {
                setError("Erro na requisição dos dados");
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, [uid]);

    const teamMudado = (e: ChangeEvent<HTMLInputElement>) => {
        setTeamData({ ...teamData, [e.target.id]: e.target.value });
    };
    const selectTeamMudado = (e: ChangeEvent<HTMLSelectElement>) => {
        const categoriaSel = e.target.value;
        setTeamData({ ...teamData, categoria: String(categoriaSel) });
    };

    const teamSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            teamSchema.parse(teamData);
            await teamFunc.createTeam(teamData.usuario, teamData.senha, teamData.categoria, uid)
            
            setIsDialogOpen(false);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
            
            const data = await teamFunc.findTeam(uid);
            setTeamList(data.data);
        } catch (error: any) {
            try {
                setMsg({
                    message: JSON.parse(error)[0].message
                });
            } catch (err) {
                console.log(error);
            }
        }
    };
    return (
        <div className="flex flex-row w-full h-screen">
            <Nav />
            <div className="flex-1 flex flex-col h-screen bg-gray-100">
                <Header content="Team - Trabalhar em grupo" />
                <section className="w-full max-w-[1200px]  bg-gray-50 border  mt-1 border-l-0 border-violet-500 h-screen  text-gray-950">
                {showAlert && (
                        <AutoCloseAlert
                            title="Utilizador cadastrado"
                            content="Utilizador cadastrado com sucesso!"
                            bg="bg-green-600"
                        />
                    )}
                    <div className="flex justify-between">
                        <div className="flex mt-2 mr-2">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => setIsDialogOpen(true)} className="bg-violet-700 mb-2 ml-2 text-white hover:bg-violet-800" ><IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Adicionar Utilizador</Button>
                                </DialogTrigger>
                                <DialogContent className='bg-white'>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Cadastrar Utilizador
                                        </DialogTitle>
                                        <DialogDescription>
                                        Os dados cadastrados nesta sessão podem dar acesso ao efetuar login no sistema
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className='flex flex-col mt-4'>
                                        <form onSubmit={teamSubmit}>
                                            {msg.message.trim() !== "" && (<span className="text-red-600 text-sm">{msg.message}</span>)}
                                            <div className='flex flex-col gap-4'>
                                                    <Label> Nome de utilizaddor <br/><br/>
                                                    <Input type='text' name='usuario' id='usuario' onChange={teamMudado} value={teamData.usuario} className='w-[180px] border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2' />
                                                    </Label>
                                                    <Label>  Palavra-passe  <br/><br/>
                                                    <Input type='text' name='senha' id='senha' onChange={teamMudado} value={teamData.senha}  className='w-[180px] uppercase border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2' />
                                                    </Label>
                                                    <select name='categoria' id='categoria' onChange={selectTeamMudado} value={teamData.categoria} className="px-4 w-[150px]  py-2 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200  border-slate-400 border rounded-md" >
                                                        <option>Professor/Orientador</option>
                                                        <option>Membro da banca</option>
                                                        <option>Aluno</option>
                                                    </select>
                                            </div>
                                             <Button type="submit"  name="cadastrar" id="cadastrar" className="bg-violet-700 mt-4 text-white hover:bg-violet-800 text-center w-full" ><IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Cadastar Utilizador</Button>
                                        </form>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <ScrollArea className="h-[80vh] w-full">
                    {loading ? (
                            <div className="w-full text-gray-700 text-center">Carregando...</div>
                        ) : error.trim() !== "" ? (
                            <div className="w-full text-red-700 font-semibold text-center">{error}, Porfavor entre em contacto com o suporte do site</div>
                        ) : (
                        <Table>
                            <TableCaption>Listagem dos Professores/team cadastrados</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Nome do Utilizador</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="w-full">
                                {teamList.map((team: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-bold">{index + 1}</TableCell>
                                        <TableCell>{team.usuario}</TableCell>
                                        <TableCell>{team.categotia}</TableCell>
                                        <TableCell className="text-right">
                                        <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button className="text-black hover:bg-gray-100" ><IconDots className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Opções</Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="mr-4 flex p-0 flex-col bg-white w-fit items-start">
                                                <Button className="text-black hover:bg-gray-100 active:bg-zinc-300 w-full" ><IconLock className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Senha de acesso</Button>
                                                    <Button className="text-black hover:bg-gray-100 active:bg-zinc-300 w-full" ><IconCursorText className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Renomear</Button>
                                                    <Button className="text-red-700 hover:bg-gray-100 active:bg-zinc-300 w-full" ><IconX className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Deletar</Button>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>)}
                    </ScrollArea>
                </section>
            </div>
        </div>
    )
} 