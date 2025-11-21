"use client"

import { useState } from "react"
import {
  Workflow,
  Filter,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  Plus,
  Eye,
  Users,
  MoreHorizontal,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Sample data
const metricsData = [
  { label: "Casos Activos", value: "237", change: "+12%", trend: "up", icon: Workflow },
  { label: "Tasa de Éxito", value: "98.7%", change: "+0.3%", trend: "up", icon: CheckCircle },
  { label: "Tiempo Promedio", value: "38s", change: "-2.1s", trend: "up", icon: Clock },
  { label: "Clientes Activos", value: "1,423", change: "+8.2%", trend: "up", icon: Users },
]

const workflowData = [
  {
    id: 6734,
    name: "Revisión de Contratos Comerciales",
    client: "Grupo Financiero XYZ",
    started: "22 Jun 2025, 10:48",
    duration: "45.2s",
    status: "running",
    error: null,
  },
  {
    id: 6733,
    name: "Análisis de Due Diligence",
    client: "TechCorp S.A.",
    started: "22 Jun 2025, 10:12",
    duration: "30s",
    status: "success",
    error: null,
  },
  {
    id: 6732,
    name: "Actualización de Documentos Corporativos",
    client: "Inmobiliaria del Centro",
    started: "22 Jun 2025, 09:45",
    duration: "2m 15s",
    status: "success",
    error: null,
  },
  {
    id: 6731,
    name: "Revisión de Compliance Regulatorio",
    client: "Banco Nacional",
    started: "22 Jun 2025, 09:30",
    duration: "1m 8s",
    status: "success",
    error: null,
  },
  {
    id: 6730,
    name: "Auditoría de Contratos Laborales",
    client: "Corporación Industrial",
    started: "22 Jun 2025, 09:15",
    duration: "3m 22s",
    status: "success",
    error: null,
  },
  {
    id: 6729,
    name: "Registro de Propiedad Intelectual",
    client: "StartUp Innovación",
    started: "22 Jun 2025, 08:58",
    duration: "45s",
    status: "failed",
    error: "Documento faltante: Poder notarial",
  },
  {
    id: 6728,
    name: "Verificación de Cumplimiento Fiscal",
    client: "Distribuidora Global",
    started: "22 Jun 2025, 08:45",
    duration: "1m 12s",
    status: "success",
    error: null,
  },
  {
    id: 6727,
    name: "Archivo de Expedientes Judiciales",
    client: "Bufete Asociados",
    started: "22 Jun 2025, 08:30",
    duration: "4m 33s",
    status: "success",
    error: null,
  },

]

const chartData = [
  { name: "Ene", sales: 4000, views: 2400, workflows: 240 },
  { name: "Feb", sales: 3000, views: 1398, workflows: 221 },
  { name: "Mar", sales: 2000, views: 9800, workflows: 229 },
  { name: "Abr", sales: 2780, views: 3908, workflows: 200 },
  { name: "May", sales: 1890, views: 4800, workflows: 218 },
  { name: "Jun", sales: 2390, views: 3800, workflows: 250 },
  { name: "Jul", sales: 3490, views: 4300, workflows: 210 },
]

const teamMembers = [
  {
    name: "Clara Blackwood",
    role: "Abogado",
    status: "online",
    avatar: "/placeholder.svg?height=32&width=32",
    availability: "Disponible",
  },
  {
    name: "Michael Whitmore",
    role: "Socio",
    status: "online",
    avatar: "/placeholder.svg?height=32&width=32",
    availability: "Disponible",
  },
  {
    name: "Dennis Brightwood",
    role: "Abogado",
    status: "away",
    avatar: "/placeholder.svg?height=32&width=32",
    availability: "Disponible en 2hrs",
  },
  {
    name: "Sarah Chen",
    role: "Asistente Legal",
    status: "online",
    avatar: "/placeholder.svg?height=32&width=32",
    availability: "En reunión",
  },
]

const recentActivity = [
  { workflow: "Revisión de Contratos Comerciales", time: "hace 2 minutos", status: "success", duration: "45s" },
  { workflow: "Análisis de Due Diligence", time: "hace 5 minutos", status: "success", duration: "30s" },
  { workflow: "Actualización de Documentos", time: "hace 12 minutos", status: "success", duration: "2m 15s" },
  { workflow: "Revisión de Compliance", time: "hace 18 minutos", status: "success", duration: "1m 8s" },
  { workflow: "Registro de Propiedad Intelectual", time: "hace 32 minutos", status: "failed", duration: "45s" },
]

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("Últimos 30 días")

  return (
    <div className="p-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard Legal</h1>
          <p className="text-gray-600 mt-1">Monitorea tus casos y rendimiento del sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                {selectedPeriod} <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedPeriod("Últimos 7 días")}>Últimos 7 días</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("Últimos 30 días")}>Últimos 30 días</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("Últimos 90 días")}>Últimos 90 días</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Caso
          </Button>
        </div>
      </div>

      {/* Main Top Section: Recent Workflow Runs + Recent Activity */}
      {/* Quick Action Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8 mt-8">
        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Nuevo caso</h3>
              <p className="text-sm text-gray-600">Crear nueva gestión legal</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Ver pendientes</h3>
              <p className="text-sm text-gray-600">Revisar casos pendientes</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Reabrir último caso</h3>
              <p className="text-sm text-gray-600">Reintentar gestión fallida</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {metricsData.map((metric, index) => (
          <Card key={index} className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <metric.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {metric.change}
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Recent Workflow Runs (Left - 2/3 width) */}
      <div className="col-span-2">
        <Card className="border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Casos Recientes</CardTitle>
                <CardDescription>Monitorea la ejecución de tus casos y su rendimiento</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Todos
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium text-gray-700">ID Caso</TableHead>
                  <TableHead className="font-medium text-gray-700">Proceso Legal</TableHead>
                  <TableHead className="font-medium text-gray-700">Cliente</TableHead>
                  <TableHead className="font-medium text-gray-700">Iniciado</TableHead>
                  <TableHead className="font-medium text-gray-700">Estado</TableHead>
                  <TableHead className="font-medium text-gray-700">Observaciones</TableHead>
                  <TableHead className="font-medium text-gray-700 w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflowData.map((workflow) => (
                  <TableRow key={workflow.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">{workflow.id}</TableCell>
                    <TableCell className="font-medium">{workflow.name}</TableCell>
                    <TableCell className="text-gray-600">{workflow.client}</TableCell>
                    <TableCell className="text-gray-600">{workflow.started}</TableCell>
                    <TableCell>
                      {workflow.status === "running" && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                          En Proceso
                        </Badge>
                      )}
                      {workflow.status === "success" && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completado
                        </Badge>
                      )}
                      {workflow.status === "failed" && (
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                          <XCircle className="w-3 h-3 mr-1" />
                          Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-48 truncate">{workflow.error || "Ninguna"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                          <DropdownMenuItem>Reabrir Caso</DropdownMenuItem>
                          <DropdownMenuItem>Ver Documentos</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Archivar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>

      {/* Bottom Section: Performance Analytics + Sidebar */}
      <div className="grid grid-cols-3 gap-8 mt-8">
        <div className="col-span-2">
          <Card className="border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Análisis de Rendimiento</CardTitle>
                  <CardDescription>Tendencias de ejecución de casos y métricas del sistema</CardDescription>
                </div>
                <Tabs defaultValue="workflows" className="w-auto">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="workflows">Casos</TabsTrigger>
                    <TabsTrigger value="sales">Ventas</TabsTrigger>
                    <TabsTrigger value="views">Vistas</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="workflows"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Account Balance */}
          <Card className="border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Balance de Cuenta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-gray-900 mb-4">$1,423.25</div>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Créditos Mensuales</span>
                  <span className="text-sm font-medium">$500.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Uso Este Mes</span>
                  <span className="text-sm font-medium">$76.75</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  Agregar Crédito
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  Transferir
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team Status */}
          <Card className="border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Estado del Equipo</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${member.status === "online" ? "bg-green-500" : "bg-gray-400"
                          }`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-600">
                        {member.role} • {member.availability}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>


          {/* Recent Activity (Right - 1/3 width) */}
          <div>
            <Card className="border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${activity.status === "success" ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 truncate">{activity.workflow}</div>
                        <div className="text-xs text-gray-600">
                          {activity.time} • {activity.duration}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}