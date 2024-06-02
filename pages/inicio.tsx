import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import Nav from '@/components/myui/Nav';
import Header from "@/components/myui/Header"
import "@/app/globals.css"

import RelatorioGrafico from "@/components/myui/RelatorioGrafico"
import RadarGrafico from "@/components/myui/RadarGrafico"

export default function Inicio() {
    const data = [12, 19, 3, 5, 2, 3];
    return (
        <div className="flex flex-row w-full h-screen">
            <Nav></Nav>
            <div className="flex-1 flex flex-col h-screen bg-gray-100">
                <Header content="Painel De Controle" />
                <section className="w-full max-w-[1200px]  bg-zinc-50 border  mt-1 border-l-0 border-indigo-600 h-screen  text-gray-950">
                    <div className="w-full flex p-4 gap-4 justify-center">
                        <Card className="bg-white rounded-md min-w-[280px]">
                            <CardHeader className="flex">
                                <CardTitle className="text-base font-semibold">Total de Trabalhos de Fim de Curso</CardTitle>
                                <CardDescription className="opacity-90">Contagem dos TFCs</CardDescription>
                            </CardHeader>
                            <CardFooter >
                                <p className="text-3xl flex items-center text-violet-700"> 40 <small className="text-[17px] ml-2 font-semibold"> Trabalhos</small></p>
                            </CardFooter>
                        </Card>
                        <Card className="bg-white rounded-md min-w-[280px]">
                            <CardHeader className="flex">
                                <CardTitle className="text-base font-semibold">Trabalhos Avaliados</CardTitle>
                                <CardDescription className="opacity-90">Total de TFCs Avaliados</CardDescription>
                            </CardHeader>
                            <CardFooter >
                                <p className="text-3xl flex items-center text-violet-700"> 05 <small className="text-[17px] ml-2 font-semibold"> Avaliados</small></p>
                            </CardFooter>
                        </Card>
                        <Card className="bg-white rounded-md min-w-[280px]">
                            <CardHeader className="flex">
                                <CardTitle className="text-base font-semibold">Cursos</CardTitle>
                                <CardDescription className="opacity-90">Total de cursos</CardDescription>
                            </CardHeader>
                            <CardFooter >
                                <p className="text-3xl flex items-center text-violet-700"> 10 <small className="text-[17px] ml-2 font-semibold"> Curso</small></p>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="w-full flex">
                        <Card className="bg-white rounded-md w-full  h-[330px]">
                            <CardHeader className="flex">
                                <CardTitle className="text-base font-semibold">Resumos</CardTitle>
                                {/* <CardDescription className="opacity-90">Apresentação dos resumos estatísticos dos trabalhos</CardDescription> */}
                            </CardHeader>
                            <CardContent className="flex relative">
                                <div className="border border-gray-100 flex-1">
                                    <RelatorioGrafico data={data} width={400} height={100} />
                                </div>
                                <div className="border border-gray-100">
                                    <RadarGrafico
                                        data={[50, 60, 70, 85, 75]}
                                        labels={['INFORMÁTICA', 'ELECTRÓNICA', 'GSI', 'DP', 'CONT']}
                                        width={300}
                                        height={100}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    )
}
