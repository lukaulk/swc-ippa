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
import { IconCursorText, IconDots, IconFileTypePdf, IconFilter, IconExclamationCircle, IconPlus, IconSearch, IconX, IconStarHalf, IconPdf } from "@tabler/icons-react"
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
import { useRouter } from 'next/navigation'
import { alunoFunc } from "../utils/alunoUtils";
import Link from "next/link"
import PDFGenerator from "@/components/myui/Ata"


export default function Banca(){
    const { data: sessionData } = useSession();
    const uid = sessionData ? sessionData.uid : 0;

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [banca, setBanca] = useState({ 
        tfc_id: "",
        data: "", 
        hora_inicio: "", 
        hora_fim: "", 
        local: "", 
        presidente: "", 
        vogal1: "", 
        vogal2: "" })

        const router = useRouter()
        const [listaBanca, setListaBanca] = useState<any[]>([]);
        const [searchTerm, setSearchTerm] = useState('');
        const [bancaFiltro, setBancaFiltro] = useState([]);
        const [tfc, setTFC] = useState({ id: ""})
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState("");
        const [prof, setProfs] = useState<any[]>([])
        const [tfcDados, setTFCDados] = useState<any[]>([])
        const [errorBanca, setErrorBanca] = useState(" ")
        const [alunos, setAlunos] = useState<any[]>([]); 
        
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

        useEffect(() => {
            const fetchTFC = async () => {
                try {
                    const data = await tfcFunc.findtfc(uid);
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

        useEffect(() => {
            const fetchDadosAluno = async () => {
                try {
                    const data = await alunoFunc.findAluno(uid);
                    if (data.success === false) {
                        setError(data.error);
                    } else {
                        setAlunos(data.data);
                    }
                } catch (err) {
                    console.log(err);
                    setError(String(err) || "Erro na requisição dos dados");
                } finally {
                    setLoading(false);
                }
            };
            fetchDadosAluno();
        }, [uid]);

        const selectItems = (items: Array<{ id: number; nome?: string; titulo?: string }>, e: React.ChangeEvent<HTMLInputElement>) =>{
            const { name } = e.target;
            setBanca(banca => ({ ...banca, [name]: String(items[0]?.id) }));
        }

    const bancaMudado = (e: ChangeEvent<HTMLInputElement>) => {
        setBanca({ ...banca, [e.target.name]: e.target.value });
    };
    
    
    useEffect(() => {
        const findBanca = async () => {
            try {
                const data = await BancaFunc.find(uid);
                if (data.success === false) {
                    setErrorBanca(data.error);
                } else {
                    setListaBanca(data.data)
                    setBancaFiltro(data.data)
                }
            } catch (err) {
                console.log("Erro ao requisitar dados da banca " + err)
                setError(String(err) || "Erro na requisição dos dados");
            } finally {
                setLoading(false);
            }
        };
        findBanca();
    }, [uid]);

    const bancaSubmit = async (e: FormEvent<HTMLFormElement>) =>{
         e.preventDefault()
          try {
            bancaSchema.parse(banca)
            await BancaFunc.create(banca.data, banca.hora_inicio, banca.hora_fim, banca.local, Number(banca.presidente), Number(banca.vogal1), Number(banca.vogal2), Number( banca.tfc_id ), Number( uid))
            alert("Foi constituido uma nova banca para o TFC: " + banca.tfc_id)
            router.refresh()

          } catch(err: any){
            try {
                setErrorBanca( JSON.parse(String(err))[0].message || "Erro ao cadastrar o TFC" );
            } catch (error) {
                console.log(error);
            }
          }
    }
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    
    return (
        <div className="flex flex-row w-full h-screen">
            <Nav></Nav>
           
            <div className="flex-1 flex flex-col h-screen bg-gray-100">
                <Header content="Banca"  />
                <section className="w-full max-w-[1200px] bg-gray-50 border mt-1 border-l-0 border-yellow-500 h-screen text-gray-950">
                    <header className="flex mt-4 ml-6 gap-2">
                                <Input type="search" placeholder="Pesquisar Bancas..." className="w-[300px] border-slate-400 focus:outline-violet-400 border placeholder:text-slate-500 bg-slate-200" onChange={handleSearch}/>
                                <Button className="mb-2 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200" ><IconSearch stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Pesquisar</Button>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-violet-700 mb-2 text-white hover:bg-violet-800" onClick={() => setIsDialogOpen(true)} ><IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> adicionar Banca</Button>
                                </DialogTrigger>
                                <DialogContent className="bg-white sm:max-w-[825px] overflow-y-scroll">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Constituição da Banca
                                        </DialogTitle>
                                        {errorBanca.trim() !== "" ? (<span className="text-white p-2 rounded-md bg-red-500">{error}</span>) : "Bem-vindo" }
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
                                                            <Label>Presidente: <Selector dados={prof} name='presidente' onSelect={selectItems} value={[]} unCheckable={true}/>
                                                            </Label>
                                                            <Label>1º Vogal: <Selector dados={prof} name='vogal1' onSelect={selectItems} value={[]} unCheckable={true}/>
                                                            </Label>
                                                            <Label>2º Vogal: <Selector dados={prof} name='vogal2' onSelect={selectItems} value={[]} unCheckable={true}/>
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
                    {loading ? (<div className="w-full text-gray-700 text-center">Carregando...</div>) : 
                    errorBanca.trim() === " " ? (<div className="w-full text-gray-700 font-semibold text-center">Nenhum dados registrado!</div> ) :
                    (<ScrollArea className="h-[80vh] w-full">
                        <Table>
                            <TableCaption>Listagem das Bancas</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">ID</TableHead>
                                    <TableHead >Tema</TableHead>
                                    <TableHead >Presidente, 1º, 2º Vogal</TableHead>
                                    <TableHead >Data</TableHead>
                                    <TableHead >Autor</TableHead>
                                    <TableHead >Arquivo TFC</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="w-full">
                            {listaBanca.map((d: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell key={index} className="font-bold">{index + 1}</TableCell>
                                        <TableCell>{tfcDados.find(e => e.id == d.tfc_id)?.titulo}</TableCell>
                                        <TableCell className="flex flex-col gap-2">
                                             <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm font-semibold">{prof.find(e => e.id === d.presidente)?.nome + ", "}</span>
                                             <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm font-semibold">{prof.find(e => e.id === d.vogal1)?.nome + " & "}</span> 
                                             <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm font-semibold">{prof.find(e => e.id === d.vogal2)?.nome}</span>
                                        </TableCell>
                                        <TableCell>{String(d.data).substring(0, 10)} <br/> 
                                        <b className='text-green-600'>{String(d.hora_inicio).substring(0, 10)}</b> - <b className="text-red-600">{String(d.hora_fim).substring(0, 10)}</b>
                                        </TableCell>
                                        <TableCell>{alunos.find(e=> e.id == JSON.parse(tfcDados.find(i => i.id == d.tfc_id)?.aluno_id)[0]?.nome)} </TableCell>
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
                                                    <div className="flex">
                                                        <Label>
                                                            Nota 
                                                            <Input type='number' className='flex border border-zinc-400 bg-zinc-100 hover:ring-violet-500 hover:ring-2' max={20} min={0}/>
                                                        </Label>
                                                     <Button type="submit" className="bg-violet-700  text-white hover:bg-violet-800 text-center" >Aplicar Nota</Button>
                                                    </div>
                                                    </DialogContent>
                                                </Dialog>
                                                    <Link href="/ata">
                                                    <Button className="text-black hover:bg-gray-100 active:bg-zinc-300 w-full" onClick={()=>{
                                                        alert("Gerar relatório PDF!")
                                                        return (
                                                            <PDFGenerator />
                                                        )
                                                    }}><IconPdf className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Gerar Relatório (PDF)</Button>
                                                    </Link>
                                                    <Button className="text-black hover:bg-gray-100 active:bg-zinc-300 w-full" ><IconCursorText className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Editar</Button>
                                                    <Button className="text-red-700 hover:bg-gray-100 active:bg-zinc-300 w-full" ><IconX className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Deletar</Button>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>))}
                            </TableBody>
                        </Table>
                    </ScrollArea>)}
                </section>
            </div>
        </div>
    )
}