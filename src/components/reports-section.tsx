'use client'

import React, { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { mockPaymentMethodData, mockMonthlyData, mockYearlyData, mockCategoryData } from '@/mock/reports'



const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC0CB']

export function ReportsSection() {
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar')
  const [selectedMethod, setSelectedMethod] = useState<string>('Conta 1')

  // Função para exportar como PNG ou PDF
  const exportChart = (format: 'png' | 'pdf') => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        if (format === 'png') {
          const imgData = canvas.toDataURL('image/png')
          const link = document.createElement('a')
          link.href = imgData
          link.download = 'chart.png'
          link.click()
        } else if (format === 'pdf') {
          const imgData = canvas.toDataURL('image/png')
          const pdf = new jsPDF()
          pdf.addImage(imgData, 'PNG', 10, 10, 180, 160)
          pdf.save('chart.pdf')
        }
      })
    }
  }

  // Filtrar dados para o método de pagamento selecionado
  const filteredPaymentData = mockPaymentMethodData.filter(item => item.method === selectedMethod)

  // Renderizar o gráfico com base no tipo selecionado
  const renderChart = (data: any, dataKey: string, labelKey: string) => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={labelKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={labelKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        )
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                dataKey={dataKey}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Relatórios Financeiros</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="monthly">Despesas do Mês</TabsTrigger>
            <TabsTrigger value="yearly">Despesas do Ano</TabsTrigger>
            <TabsTrigger value="category">Por Categoria</TabsTrigger>
            <TabsTrigger value="payment-method">Por Conta ou Cartão</TabsTrigger>
          </TabsList>

          <div className="flex justify-end mt-4">
            <select onChange={(e) => setChartType(e.target.value as 'bar' | 'pie' | 'line')} className="p-2 border rounded">
              <option value="bar">Gráfico de Barras</option>
              <option value="line">Gráfico de Linha</option>
              <option value="pie">Gráfico de Pizza</option>
            </select>
          </div>

          {/* Gráfico de Despesas do Mês */}
          <TabsContent value="monthly">
            <div ref={chartRef} className="text-center">
              <h2 className="text-2xl font-bold text-red-500">Despesas do Mês</h2>
              <p className="text-sm text-gray-500">Representação das despesas por semana no mês atual.</p>
              {renderChart(mockMonthlyData, 'total', 'name')}
            </div>
          </TabsContent>

          {/* Gráfico de Despesas do Ano */}
          <TabsContent value="yearly">
            <div ref={chartRef} className="text-center">
              <h2 className="text-2xl font-bold text-red-500">Despesas do Ano</h2>
              <p className="text-sm text-gray-500">Representação das despesas por mês no ano atual.</p>
              {renderChart(mockYearlyData, 'total', 'name')}
            </div>
          </TabsContent>

          {/* Gráfico por Categoria */}
          <TabsContent value="category">
            <div ref={chartRef} className="text-center">
              <h2 className="text-2xl font-bold text-red-500">Despesas por Categoria</h2>
              <p className="text-sm text-gray-500">Distribuição das despesas por categoria.</p>
              {renderChart(mockCategoryData, 'total', 'category')}
            </div>
          </TabsContent>

          {/* Gráfico por Conta ou Cartão */}
          <TabsContent value="payment-method">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-500">Despesas por Conta ou Cartão</h2>
              <p className="text-sm text-gray-500">Distribuição das despesas entre Conta e Cartão.</p>
              <select onChange={(e) => setSelectedMethod(e.target.value)} className="mb-4 p-2 border rounded">
                {mockPaymentMethodData.map((item) => (
                  <option key={item.method} value={item.method}>{item.method}</option>
                ))}
              </select>
              {renderChart(filteredPaymentData, 'total', 'method')}
            </div>
          </TabsContent>

          {/* Botões para Exportar */}
          <div className="flex justify-end mt-4 space-x-2">
            <button onClick={() => exportChart('png')} className="px-4 py-2 bg-blue-500 text-white rounded">Exportar PNG</button>
            <button onClick={() => exportChart('pdf')} className="px-4 py-2 bg-green-500 text-white rounded">Exportar PDF</button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
