"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Filter,
  Eye,
  Loader2,
  Briefcase,
  Users,
  Clock,
  Scale,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddCaseModal } from "@/components/AddCaseModal"

// Interface para los casos de la API
interface CaseFromAPI {
  id: number;
  title: string;
  description: string | null;
  client_name: string;
  contact_person: string | null;
  client_email: string | null;
  client_phone: string | null;
  practice_area: string | null;
  case_type: string | null;
  opponent: string | null;
  opponent_lawyer: string | null;
  file_number: string | null;
  court: string | null;
  jurisdiction: string | null;
  judge: string | null;
  status: string | null;
  next_hearing: string | null;
  amount: number | null;
  fees: string | null;
  responsible_lawyer: string | null;
  assistants: string | null;
  strategy: string | null;
  risks: string | null;
  created_at: string | null;
  updated_at: string | null;
  start_date: string | null;
  end_date: string | null;
  observaciones: string | null;
}

interface Stats {
  totalCasos: number;
  casosIniciados: number;
  casosEnPruebas: number;
  casosFinalizados: number;
  totalClientes: number;
}

export default function Dashboard() {
  const router = useRouter()
  const [casos, setCasos] = useState<CaseFromAPI[]>([])
  const [loadingCases, setLoadingCases] = useState(true)
  const [loadingStats, setLoadingStats] = useState(true)
  const [errorCases, setErrorCases] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats>({
    totalCasos: 0,
    casosIniciados: 0,
    casosEnPruebas: 0,
    casosFinalizados: 0,
    totalClientes: 0,
  })

  // Función para cargar casos desde la API
  const fetchCasos = async () => {
    setLoadingCases(true)
    setErrorCases(null)
    try {
      const response = await fetch("/api/casos")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al cargar los casos")
      }

      const casosData = result.data || []
      setCasos(casosData)

      // Calcular estadísticas
      const iniciados = casosData.filter((c: CaseFromAPI) => c.status === "inicio").length
      const enPruebas = casosData.filter((c: CaseFromAPI) => c.status === "pruebas").length
      const finalizados = casosData.filter((c: CaseFromAPI) =>
        c.status === "sentencia" || c.status === "ejecucion"
      ).length

      setStats(prev => ({
        ...prev,
        totalCasos: casosData.length,
        casosIniciados: iniciados,
        casosEnPruebas: enPruebas,
        casosFinalizados: finalizados,
      }))
    } catch (error) {
      console.error("Error fetching cases:", error)
      setErrorCases(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setLoadingCases(false)
    }
  }

  // Cargar clientes
  const fetchClientes = async () => {
    try {
      const response = await fetch("/api/clientes")
      const result = await response.json()
      if (response.ok) {
        setStats(prev => ({
          ...prev,
          totalClientes: (result.data || []).length,
        }))
      }
    } catch (error) {
      console.error("Error fetching clientes:", error)
    }
  }

  // Cargar todos los datos
  const loadAllData = async () => {
    setLoadingStats(true)
    await Promise.all([fetchCasos(), fetchClientes()])
    setLoadingStats(false)
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    loadAllData()
  }, [])

  // Función para formatear la fecha
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sin fecha"
    const date = dateString.includes("T")
      ? new Date(dateString)
      : new Date(dateString + "T12:00:00")
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  // Función para mapear estados
  const getStatusDisplay = (status: string | null) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      "inicio": { label: "Inicio", color: "bg-blue-100 text-blue-700" },
      "pruebas": { label: "Etapa Probatoria", color: "bg-yellow-100 text-yellow-700" },
      "alegatos": { label: "Alegatos", color: "bg-orange-100 text-orange-700" },
      "sentencia": { label: "Sentencia", color: "bg-green-100 text-green-700" },
      "ejecucion": { label: "Ejecución", color: "bg-purple-100 text-purple-700" },
      "suspendido": { label: "Suspendido", color: "bg-red-100 text-red-700" },
      "En Proceso": { label: "En Proceso", color: "bg-blue-100 text-blue-700" },
      "Completado": { label: "Completado", color: "bg-green-100 text-green-700" },
    }
    return statusMap[status || ""] || { label: status || "Sin estado", color: "bg-gray-100 text-gray-700" }
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Resumen general del sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <AddCaseModal onCaseCreated={fetchCasos} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        {/* Total Casos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-gray-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  {loadingStats ? (
                    <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-purple-400 animate-spin" />
                  ) : (
                    <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-500 truncate">Total Casos</p>
                  {loadingStats ? (
                    <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mt-1"></div>
                  ) : (
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.totalCasos}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Casos Iniciados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-gray-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  {loadingStats ? (
                    <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-blue-400 animate-spin" />
                  ) : (
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-500 truncate">Iniciados</p>
                  {loadingStats ? (
                    <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mt-1"></div>
                  ) : (
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.casosIniciados}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* En Pruebas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-gray-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  {loadingStats ? (
                    <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 animate-spin" />
                  ) : (
                    <Scale className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-500 truncate">En Pruebas</p>
                  {loadingStats ? (
                    <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mt-1"></div>
                  ) : (
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.casosEnPruebas}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Clientes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-gray-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  {loadingStats ? (
                    <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-green-400 animate-spin" />
                  ) : (
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-500 truncate">Clientes</p>
                  {loadingStats ? (
                    <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mt-1"></div>
                  ) : (
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.totalClientes}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cases List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="border-gray-200">
          <CardHeader className="pb-4 px-4 md:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base md:text-lg font-semibold">Lista de Casos</CardTitle>
                <CardDescription className="text-sm">Todos los casos registrados</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/casos")}>
                <Eye className="w-4 h-4 mr-2" />
                Ver Todos
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile View - Card List */}
            <div className="md:hidden">
              {loadingCases ? (
                <div className="flex items-center justify-center gap-2 text-gray-500 py-8">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Cargando casos...
                </div>
              ) : errorCases ? (
                <div className="text-center py-8 text-red-500 px-4">{errorCases}</div>
              ) : casos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No hay casos registrados</div>
              ) : (
                <div className="divide-y">
                  {casos.map((caso) => {
                    const statusInfo = getStatusDisplay(caso.status)
                    return (
                      <div
                        key={caso.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer active:bg-gray-100"
                        onClick={() => router.push(`/casos/${caso.id}`)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{caso.title}</p>
                            <p className="text-sm text-gray-500 mt-1">{caso.client_name}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={statusInfo.color + " text-xs"}>
                                {statusInfo.label}
                              </Badge>
                              <span className="text-xs text-gray-400">{formatDate(caso.created_at)}</span>
                            </div>
                          </div>
                          <Eye className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Desktop/Tablet View - Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-medium text-gray-700">ID</TableHead>
                    <TableHead className="font-medium text-gray-700">Caso</TableHead>
                    <TableHead className="font-medium text-gray-700">Cliente</TableHead>
                    <TableHead className="font-medium text-gray-700">Área</TableHead>
                    <TableHead className="font-medium text-gray-700">Fecha Inicio</TableHead>
                    <TableHead className="font-medium text-gray-700">Estado</TableHead>
                    <TableHead className="font-medium text-gray-700 w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingCases ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Cargando casos...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : errorCases ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {errorCases}
                      </TableCell>
                    </TableRow>
                  ) : casos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No hay casos registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    casos.map((caso) => {
                      const statusInfo = getStatusDisplay(caso.status)
                      return (
                        <TableRow
                          key={caso.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => router.push(`/casos/${caso.id}`)}
                        >
                          <TableCell className="font-mono text-sm text-gray-600">#{caso.id}</TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-900">{caso.title}</div>
                            {caso.file_number && (
                              <div className="text-sm text-gray-500">Exp: {caso.file_number}</div>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-700">{caso.client_name}</TableCell>
                          <TableCell>
                            <span className="capitalize text-gray-600">{caso.practice_area || "-"}</span>
                          </TableCell>
                          <TableCell className="text-gray-600">{formatDate(caso.created_at)}</TableCell>
                          <TableCell>
                            <Badge className={statusInfo.color}>
                              {statusInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/casos/${caso.id}`)}>
                                  Ver detalles
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}