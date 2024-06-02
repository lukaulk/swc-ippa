import Nav from '@/components/myui/Nav';
import Header from "@/components/myui/Header"
import "@/app/globals.css"
import {
Table,
TableBody,
TableCaption,
TableCell,
TableFooter,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table"
import {
Popover,
PopoverContent,
PopoverTrigger,
} from "@/components/ui/popover"
import {
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog"
import { IconCursorText, IconDots, IconFileTypePdf, IconFilter, IconExclamationCircle, IconPlus, IconSearch, IconX, IconStarHalf } from "@tabler/icons-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { profSchema, profFunc } from "../utils/profUtils";
import { useState, useEffect, FormEvent, ChangeEvent } from "react"
import { useSession } from "../utils/loginAuth"
import Selector from "@/components/myui/Selector"
import { tfcFunc } from "../utils/tfcUtils";
import { BancaFunc, bancaSchema } from '../utils/bancaUtils'
export default function Banca(){
    const { data: sessionData } = useSession();
    const uid = sessionData ? sessionData.uid : 0;

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [banca, setBanca] = useState({ titulo_id: "", data: "", hora_inicio: "", hora_fim: "", local: "", presidente: "", vogal1: "", vogal2: "", usuario_id: "" })
    const [tfc, setTFC] = useState({ id: ""})
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [prof, setProfs] = useState<any[]>([])
    const [tfcDados, setTFCDados] = useState<any[]>([])

    useEffect(() => {
        const fetchProf = async () => {
            try {
                const data = await profFunc.findProf(uid);
                if (data.success === false) {
                    console.log("Erro ao buscar os professores!");
                    setError(String(data.error))
                } else {
                    setProfs(data.data);
                }
            } catch (err) {
                console.log(err);
                setError(String(err))

            } finally {
                setLoading(false);
            }
        };
        fetchProf();
    }, [uid]);
    const selectItems = (items: Array<{ id: number; titulo: string }>, e: React.ChangeEvent<HTMLInputElement>) =>{
        const { name } = e.target;
        console.log("Itens selecionados:", items);
        console.log("Evento:", name);
    }
    useEffect(() => {
        const fetchTFC = async () => {
            try {
                const data = await tfcFunc.findtfc(uid);
                console.log(data.data)
                if (data.success === false) {
                    console.log("Erro ao buscar os TFCs!");
                    setError(String(data.error))
                } else {
                    setTFCDados(data.data);
                }
            } catch (err) {
                console.log(err);
                setError(String(err))
            } finally {
                setLoading(false);
            }
        };
        fetchTFC();

    }, [uid]);
    const bancaMudado = (e: ChangeEvent<HTMLInputElement>) => {
        setBanca({ ...banca, [e.target.name]: e.target.value });
    };
    const bancaSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        setBanca({ ...banca, [e.target.name]: e.target.value });
    };
    const bancaSubmit = async (e: FormEvent<HTMLFormElement>) =>{
         e.preventDefault()
          try {
            bancaSchema.parse(banca)
            console.log(banca)
          } catch(err: any){
            try {
                setError( JSON.parse(String(err))[0].message || "Erro ao cadastrar o TFC" );
            } catch (error) {
                console.log(error);
            }
          }
    }

    return (
        <div className="flex flex-row w-full h-screen">
            <Nav></Nav>
            <div className="flex-1 flex flex-col h-screen bg-gray-100">
                <Header content="Banca"  />

                <section className="w-full max-w-[1200px] bg-gray-50 border mt-1 border-l-0 border-yellow-500 h-screen text-gray-950">
                    <header className="flex mt-4 ml-6 gap-2">
                                <Input type="search" placeholder="Pesquisar Bancas..." className="w-[300px] border-slate-400 focus:outline-violet-400 border placeholder:text-slate-500 bg-slate-200" />
                                <Button className="mb-2 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200" ><IconSearch stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Pesquisar</Button>
                                {/* <Popover>
                                    <PopoverTrigger asChild>
                                        <Button className="mb-2 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200">
                                            <IconFilter stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Filtrar
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="flex p-0 flex-col bg-white w-fit items-start"></PopoverContent>
                                </Popover> */}
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-violet-700 mb-2 text-white hover:bg-violet-800" onClick={() => setIsDialogOpen(true)} ><IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> adicionar Banca</Button>
                                </DialogTrigger>
                                <DialogContent className="bg-white sm:max-w-[825px] overflow-y-scroll">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Constituição da Banca
                                        </DialogTitle>
                                        {error.trim() !== "" ? (<span className="text-white p-2 rounded-md bg-red-500">{error}</span>) : "Bem-vindo" }
                                    </DialogHeader>
                                    <form onSubmit={bancaSubmit}>
                                        <div className="flex-col mt-4 grid gap-4">
                                            <div className="flex flex-col gap-4 w-full">
                                                <Label>Tema (TFC)</Label>
                                                <Selector dados={tfcDados} name='tfc_id' onSelect={selectItems} value={tfcDados} unCheckable={true}/>
                                            </div>
                                            <div className="mt-4 flex flex-col gap-8 ">
                                               <div className="flex gap-8">
                                                    <fieldset className="flex flex-1 p-4 flex-col gap-2 border-gray-300 border rounded-md pl-8">
                                                            <legend className="font-semibold">Membros da banca</legend>
                                                       
                                                            <Label>Presidente: 
                                                            {loading ? (
                                                                    <span className="w-full ml-4 text-gray-700 text-center">Carregando professores...</span>
                                                                ) : error.trim() !== "" ? (<span className="w-full ml-4 text-red-700 font-semibold text-center">Nenhum professor</span>) 
                                                                : (<select className="px-4 py-2 ml-4 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200" name="presidente" value={banca.presidente} onChange={bancaSelect}>
                                                                        {prof.map((dados, index) => (
                                                                            <option key={index} value={dados.id} >{dados.nome}</option>
                                                                        ))}
                                                                    </select>)
                                                            }
                                                            </Label>
                                                            <Label>1º Vogal: 
                                                            {loading ? (
                                                                    <span className="w-full text-gray-700 text-center ml-4">Carregando professores...</span>
                                                                ) : error.trim() !== "" ? (<span className="w-full ml-4 text-red-700 font-semibold text-center">Nenhum professor</span>) 
                                                                : (<select className="px-4 py-2 ml-8 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200" name="vogal1" value={banca.vogal1} onChange={bancaSelect}>
                                                                        {prof.map((dados, index) => (
                                                                            <option key={index} value={dados.id} >{dados.nome}</option>
                                                                        ))}
                                                                    </select>)
                                                            }
                                                            </Label>
                                                            <Label>2º Vogal: 
                                                            {loading ? (
                                                                    <span className="w-full text-gray-700 text-center">Carregando professores...</span>
                                                                ) : error.trim() !== "" ? (<span className="w-full text-red-700 font-semibold text-center">Nenhum professor</span>) 
                                                                : (<select className="px-4 ml-8 py-2 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200" name="vogal2" value={banca.vogal2} onChange={bancaSelect}>
                                                                        {prof.map((dados, index) => (
                                                                            <option key={index} value={dados.id} >{dados.nome}</option>
                                                                        ))}
                                                                    </select>)
                                                            }
                                                            </Label>
                                                    </fieldset>
                                                    <fieldset className="flex flex-1 p-4 flex-col gap-4 border-gray-300 border rounded-md pl-8">
                                                            <legend className="font-semibold">Autor (es):</legend>
                                                            <span>Aluno</span>
                                                            
                                                    </fieldset>
                                               </div>
                                               <div className="flex gap-4">
                                                    <Label>Data  <Input type='date' className='mt-4 w-[150px] flex-1 flex border border-zinc-400 bg-zinc-100 hover:ring-violet-500 hover:ring-2' name='data' value={banca.data} onChange={bancaMudado} /></Label>
                                                    <Label>Hora Inicio  <Input type='time' className='mt-4 w-[150px] flex-1 flex border border-zinc-400 bg-zinc-100 hover:ring-violet-500 hover:ring-2' name='hora_inicio' value={banca.hora_inicio} onChange={bancaMudado} /></Label>
                                                    <Label>Hora Final  <Input type='time' className='mt-4 w-[150px] flex-1 flex border border-zinc-400 bg-zinc-100 hover:ring-violet-500 hover:ring-2' name='hora_fim' value={banca.hora_fim} onChange={bancaMudado} /></Label>
                                                    <Label>Local  <Input type='text' className='mt-4 w-[150px] flex-1 flex border border-zinc-400 bg-zinc-100 hover:ring-violet-500 hover:ring-2' name='local' value={banca.local} onChange={bancaMudado} /></Label>
                                               </div>
                                            </div>
                                            <Button type="submit" className="bg-violet-700 mt-4 text-white hover:bg-violet-800 text-center w-full" name='cadastrar'><IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Cadastar Banca da Defesa</Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                    </header>
                    <ScrollArea className="h-[80vh] w-full">
                        <Table>
                            <TableCaption>Listagem das Bancas</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">ID</TableHead>
                                    <TableHead >Tema</TableHead>
                                    <TableHead >Presidente</TableHead>
                                    <TableHead >1º, 2º Vogal</TableHead>
                                    <TableHead >Autor</TableHead>
                                    <TableHead >Arquivo TFC</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="w-full">
                                    <TableRow>
                                        <TableCell className="font-bold">1</TableCell>
                                        <TableCell>Sistema de gestão de Gastos e Despesas pessoais</TableCell>
                                        <TableCell>André Kialanda</TableCell>
                                        <TableCell>Paulo Anfonso, Miguel André</TableCell>
                                        <TableCell>Bernadinho Lukau</TableCell>
                                        <TableCell className="flex justify-center items-center cursor-pointer" onClick={() => setIsDialogOpen(true)}><IconFileTypePdf  stroke={"gray"} className="w-10 h-10 rounded-none" strokeWidth={1}/></TableCell>
                                        <TableCell className="text-right">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button className="text-black hover:bg-gray-100" ><IconDots className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Opções</Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="mr-4 flex p-0 flex-col bg-white w-fit items-start">
                                                <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className="text-black hover:bg-gray-100 active:bg-zinc-300 w-full" ><IconStarHalf className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Aplicar Classificação</Button>
                                                </DialogTrigger>
                                                    <DialogContent className="bg-white sm:max-w-[425px] overflow-y-scroll">
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Classificação da Nota
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="m-4 flex">
                                                        <Label>
                                                            Nota 
                                                            <Input type='number' className='flex border border-zinc-400 bg-zinc-100 hover:ring-violet-500 hover:ring-2' max={20} min={0}/>
                                                        </Label>
                                                     <Button type="submit" className="bg-violet-700  text-white hover:bg-violet-800 text-center" >Aplicar Nota</Button>
                                                    </div>
                                                    </DialogContent>
                                                </Dialog>
                                                    <Button className="text-black hover:bg-gray-100 active:bg-zinc-300 w-full" ><IconExclamationCircle className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Mais Informações</Button>
                                                    <Button className="text-black hover:bg-gray-100 active:bg-zinc-300 w-full" ><IconCursorText className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Editar</Button>
                                                    <Button className="text-red-700 hover:bg-gray-100 active:bg-zinc-300 w-full" ><IconX className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Deletar</Button>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                            </TableBody>
                        </Table>
                    </ScrollArea>
                    
                </section>
            </div>
        </div>
    )

}