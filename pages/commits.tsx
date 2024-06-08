import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Nav from '@/components/myui/Nav';
import Header from "@/components/myui/Header"
import "@/app/globals.css"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IconArrowRight } from "@tabler/icons-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSession } from "../utils/loginAuth"
// import { CommitsFunc } from "../utils/commits.tsx"
export default function Commits() {
    const { data: sessionData } = useSession();
    const uid = sessionData ? sessionData.uid : 0;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
   
    const submitCommit = () =>{
        
    }
    return (
        <div className="flex flex-row w-full h-screen">
            <Nav />
            <div className="flex-1 relative flex flex-col h-screen bg-gray-100">
                <Header content="Submissões e Estados do TFC" />

                <section className="w-full  max-w-[1200px] bg-gray-50  mt-1 h-screen text-gray-950  headerBorder">
                    <div className="flex justify-between absolute bottom-0">
                        <div className="flex mt-4 ml-6 gap-2">
                            <form onSubmit={submitCommit}>
                            <Input type="text" placeholder="Escreva uma mensagem do estado atual do TFC" className="w-[400px] border-slate-400 focus:outline-violet-400 border placeholder:text-slate-500 bg-slate-200" />
                            <select className='text-center text-sm font-semibold px-2 py-0 outline-none focus:outline-none hover:outline-none'>
                                <option>Modificando</option>
                                <option>Retificando</option>
                                <option>Investigando</option>
                                <option>Desenvolvendo</option>
                            </select>
                            <Button className="mb-2 text-green-50 hover:bg-green-500 active:bg-green-400 bg-green-600"  >
                                <IconArrowRight stroke={"white"} className="w-4 mr-2 h-4 rounded-none" strokeWidth={3} /> Publicar Submissão
                            </Button>
                            </form>
                        </div>
                    </div>
                    <ScrollArea className="h-[80vh] w-full">
                        <br/><br/>
                        {loading ? (
                            <div className="w-full text-gray-700 text-center">Carregando...</div>
                        ) : error.trim() === " " ? (
                            <div className="w-full text-red-700 font-semibold text-center">{error}, Porfavor entre em contacto com o suporte do site</div>
                        ) : (
                            <Table>
                                <TableCaption>Listagem das submissões do TFC feitas</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Submisões</TableHead>
                                        <TableHead>Submetido em</TableHead>
                                        <TableHead className="text-right">Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="w-full">
                                        <TableRow>
                                            <TableCell className="font-bold">1</TableCell>
                                            <TableCell>Estou trabalhando na sessão de metodologia</TableCell>
                                            <TableCell>10:20 2024</TableCell>
                                            <TableCell className="text-right">Modificando</TableCell>
                                        </TableRow>
                                </TableBody>
                            </Table>
                        )}
                    </ScrollArea>
                </section>
            </div>
        </div>
    );
}