import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function TodosPage() {
    const supabase = createClient(cookies())

    const { data: todos, error } = await supabase.from('todos').select()

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Todos</h1>
                <p className="text-gray-600 mt-1">Lista de tareas desde Supabase</p>
            </div>

            <Card className="border-gray-200">
                <CardHeader>
                    <CardTitle>Mis Tareas</CardTitle>
                    <CardDescription>Conectado a Supabase</CardDescription>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <div className="text-red-600 p-4 bg-red-50 rounded-lg">
                            <p className="font-medium">Error al cargar los datos:</p>
                            <p className="text-sm mt-1">{error.message}</p>
                        </div>
                    ) : !todos || todos.length === 0 ? (
                        <div className="text-gray-500 p-4 bg-gray-50 rounded-lg text-center">
                            No hay tareas disponibles
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {todos.map((todo: any, index: number) => (
                                <li
                                    key={todo.id || index}
                                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <pre className="text-sm overflow-auto">
                                        {JSON.stringify(todo, null, 2)}
                                    </pre>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
