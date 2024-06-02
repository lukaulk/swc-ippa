import Nav from '@/components/myui/Nav'
import "@/app/globals.css"
import Header from "@/components/myui/Header"
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

import { IconCursorText, IconDots, IconPlus, IconSearch, IconX } from "@tabler/icons-react"
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label }  from "@/components/ui/label"

export default function Estagio() {
    var estagio = [
        { id: 1, nome: 'Bernadinho Lukau Makuti', info: 'Lorem Ipsum dolor sit' },
        { id: 2, nome: 'Paulo Aberto Maria', info: 'Lorem Ipsum dolor sit' },
        { id: 3, nome: 'Miguel Fransisco Polo', info: 'Lorem Ipsum dolor sit' },
        { id: 4, nome: 'Mavinga Antonio Pedro', info: 'Lorem Ipsum dolor sit' },
        { id: 5, nome: 'Pedro Cazanda Jsa', info: 'Lorem Ipsum dolor sit' },
        { id: 6, nome: 'Pinalaks akskn', info: 'Lorem Ipsum dolor sit' },
        { id: 7, nome: 'Frwadamdoa Mluakas', info: 'Lorem Ipsum dolor sit' },
        { id: 8, nome: 'Lukau Nakaisa lakas asa', info: 'Lorem Ipsum dolor sit' },
    ]
    return (
        <div className="flex flex-row w-full h-screen">
            <Nav />
            <div className="flex-1 flex flex-col h-screen bg-gray-100">
                <Header content="Estágio" />
                <section className="w-full max-w-[1200px]  bg-gray-50 border  mt-1 border-l-0 border-violet-500 h-screen  text-gray-950">

                    <div className="flex justify-between">
                        <div className="flex mt-2 mr-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                <Button className="ml-4 bg-violet-500 mb-2 text-white hover:bg-violet-800" ><IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Adicionar</Button>
                                </DialogTrigger>
                                <DialogContent className='bg-white sm:min-w-[900px]'>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Cadastrar Estágio 
                                        </DialogTitle>
                                        <DialogDescription>
                                         Registrar estágio
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className='flex flex-col gap-5 mt-4'>
                                                <div className='mb-2 grid grid-cols-4 gap-4'>
                                                    <Label> Data Início<br/><br/>
                                                    <Input type='date' className='w-full border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2' />
                                                    </Label>
                                                    <Label> Data Fim<br/><br/>
                                                    <Input type='date' className='w-full border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2' />
                                                    </Label>
                                                </div>
                                                <div className='mb-2 grid grid-cols-4 gap-4'>
                                                    <Label>Tipo de Estágio<br/><br/>
                                                    <select className="px-4 w-full  py-2 text-slate-800 hover:bg-slate-300 active:bg-slate-400 bg-slate-200  border-slate-400 border rounded-md" ><option>Obrigratório</option> <option>Não Obrigatório</option><option> Validação</option></select>
                                                     </Label>
                                                    <Label> Local do Estágio<br/><br/>
                                                    <Input type='text' className='w-full border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2' />
                                                    </Label>
                                                    <Label> Nome da Empresa<br/><br/>
                                                    <Input type='text' className='w-full border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2' />
                                                    </Label>
                                                </div>
                                                <div className='mb-2 grid grid-cols-4 gap-4'>
                                                    <Label> Atividade Estagiário<br/><br/>
                                                    <Input type='text' className='w-full border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2' />
                                                    </Label>
                                                    <Label> Supervisor do Estágio <br/><br/>
                                                    <Input type='text' className='w-full border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2' />
                                                    </Label>
                                                    <Label> Alunos (ou Estagiários)<br/><br/>
                                                    <Input type='text' className='w-full border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2' />
                                                    </Label>
                                                </div>
                                                {/* <div className='flex gap-4 mt-4'>
                                                <Label> Duração <br/><br/>
                                                <Input type='number'  className='w-[180px] uppercase border border-zinc-300 bg-zinc-100 hover:ring-violet-500 hover:ring-2' />
                                                </Label>
                                                </div> */}
                                                
                                           </div>
                                    <DialogFooter>
                                    <Button className="bg-violet-500 mt-4 text-white hover:bg-violet-800 text-center w-full" ><IconPlus stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Cadastar Estágio</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <ScrollArea className="h-[80vh] w-full">
                        <Table>
                            <TableCaption>Listagem dos Estágios</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Data Início</TableHead>
                                    <TableHead>Data Fim</TableHead>
                                    <TableHead>Duração</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="w-full">
                                {estagio.map((d) => (
                                    <TableRow key={d.id}>
                                        <TableCell className="font-bold">{d.id}</TableCell>
                                        <TableCell>02/04/2024 13:47</TableCell>
                                        <TableCell>02/04/2024 13:47</TableCell>
                                        <TableCell>12</TableCell>
                                        <TableCell>
                                            <Switch id="estado" className='bg-slate-500 border border-slate-300' />
                                            <Label htmlFor="estado">Aberto</Label>
                                        </TableCell>
                                        <TableCell className="text-right">
                                        <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button className="text-black hover:bg-gray-100" ><IconDots className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Opções</Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="mr-4 flex p-0 flex-col bg-white w-fit items-start">
                                                    <Button className="text-black hover:bg-gray-100 active:bg-zinc-300 w-full" ><IconCursorText className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Renomear</Button>
                                                    <Button className="text-red-700 hover:bg-gray-100 active:bg-zinc-300 w-full" ><IconX className="w-5 mr-2 h-5 rounded-none" strokeWidth={2} /> Deletar</Button>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell className="text-zinc-600" colSpan={3}>Existem <b>{estagio.length}</b> Estágios no Total</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </ScrollArea>

                </section>
            </div>
        </div>
    )
} 