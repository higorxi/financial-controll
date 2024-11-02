'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { ArrowDownIcon, ArrowUpIcon, DollarSign, LineChart as LineChartIcon, PiggyBank, Target, Download, CreditCard, Building, Plus, Share2, Gift } from 'lucide-react'

// Simulação de dados do usuário
const usuarioInicial = {
  nome: 'Usuário Exemplo',
  email: 'usuario@exemplo.com',
  saldo: 10000,
  fundoEmergencia: 5000,
  metaFundoEmergencia: 15000,
  investimentosCripto: 2000,
  categorias: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Educação', 'Outros'],
  contas: ['Banco A', 'Banco B'],
  cartoes: ['Cartão X', 'Cartão Y'],
  amigos: ['amigo1@email.com', 'amigo2@email.com'],
  listaDesejos: [
    { item: 'Notebook novo', valor: 5000 },
    { item: 'Viagem para a praia', valor: 3000 },
  ],
}

export function ControleFinanceiroCompletoComponent() {
  const [usuario, setUsuario] = useState(usuarioInicial)
  const [transacoes, setTransacoes] = useState([])
  const [novaCategoria, setNovaCategoria] = useState('')
  const [novaConta, setNovaConta] = useState('')
  const [novoCartao, setNovoCartao] = useState('')
  const [novoAmigo, setNovoAmigo] = useState('')
  const [novoItemDesejo, setNovoItemDesejo] = useState({ item: '', valor: 0 })
  const [filtroMes, setFiltroMes] = useState(new Date().getMonth())
  const [filtroAno, setFiltroAno] = useState(new Date().getFullYear())

  const adicionarTransacao = (tipo, valor, descricao, categoria, conta, parcelas = 1) => {
    const novaTransacao = {
      tipo,
      valor: parseFloat(valor),
      descricao,
      categoria,
      conta,
      data: new Date(),
      parcelas,
      valorParcela: parseFloat(valor) / parcelas
    }
    setTransacoes([...transacoes, novaTransacao])
    atualizarSaldo(tipo, parseFloat(valor))
  }

  const atualizarSaldo = (tipo, valor) => {
    setUsuario(prev => ({
      ...prev,
      saldo: tipo === 'receita' ? prev.saldo + valor : prev.saldo - valor
    }))
  }

  const adicionarCategoria = () => {
    if (novaCategoria && !usuario.categorias.includes(novaCategoria)) {
      setUsuario(prev => ({
        ...prev,
        categorias: [...prev.categorias, novaCategoria]
      }))
      setNovaCategoria('')
    }
  }

  const adicionarConta = () => {
    if (novaConta && !usuario.contas.includes(novaConta)) {
      setUsuario(prev => ({
        ...prev,
        contas: [...prev.contas, novaConta]
      }))
      setNovaConta('')
    }
  }

  const adicionarCartao = () => {
    if (novoCartao && !usuario.cartoes.includes(novoCartao)) {
      setUsuario(prev => ({
        ...prev,
        cartoes: [...prev.cartoes, novoCartao]
      }))
      setNovoCartao('')
    }
  }

  const adicionarAmigo = () => {
    if (novoAmigo && !usuario.amigos.includes(novoAmigo)) {
      setUsuario(prev => ({
        ...prev,
        amigos: [...prev.amigos, novoAmigo]
      }))
      setNovoAmigo('')
    }
  }

  const adicionarItemDesejo = () => {
    if (novoItemDesejo.item && novoItemDesejo.valor > 0) {
      setUsuario(prev => ({
        ...prev,
        listaDesejos: [...prev.listaDesejos, novoItemDesejo]
      }))
      setNovoItemDesejo({ item: '', valor: 0 })
    }
  }

  const atualizarFundoEmergencia = (valor) => {
    setUsuario(prev => ({
      ...prev,
      fundoEmergencia: prev.fundoEmergencia + parseFloat(valor)
    }))
  }

  const atualizarInvestimentosCripto = (valor) => {
    setUsuario(prev => ({
      ...prev,
      investimentosCripto: prev.investimentosCripto + parseFloat(valor)
    }))
  }

  const filtrarTransacoes = () => {
    return transacoes.filter(t => {
      const data = new Date(t.data)
      return data.getMonth() === filtroMes && data.getFullYear() === filtroAno
    })
  }

  const calcularTotalPorCategoria = () => {
    const totais = {}
    filtrarTransacoes().forEach(t => {
      if (t.tipo === 'despesa') {
        totais[t.categoria] = (totais[t.categoria] || 0) + t.valor
      }
    })
    return Object.entries(totais).map(([categoria, total]) => ({ categoria, total }))
  }

  const calcularTotalPorConta = () => {
    const totais = {}
    filtrarTransacoes().forEach(t => {
      totais[t.conta] = (totais[t.conta] || 0) + (t.tipo === 'receita' ? t.valor : -t.valor)
    })
    return Object.entries(totais).map(([conta, total]) => ({ conta, total }))
  }

  const exportarParaExcel = () => {
    // Simulação de exportação para Excel
    const dadosExportacao = transacoes.map(t => ({
      ...t,
      data: t.data.toLocaleDateString()
    }))
    console.log('Exportando para Excel:', dadosExportacao)
    alert('Dados exportados para Excel (simulação)')
  }

  const calcularRiscoEndividamento = () => {
    const totalDespesas = transacoes.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0)
    const totalReceitas = transacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0)
    const taxaEndividamento = totalDespesas / totalReceitas
    if (taxaEndividamento > 0.7) return 'alto'
    if (taxaEndividamento > 0.5) return 'medio'
    return 'baixo'
  }

  const corRiscoEndividamento = {
    alto: 'text-red-500',
    medio: 'text-yellow-500',
    baixo: 'text-green-500'
  }

  const CORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC0CB']

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Controle Financeiro Completo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Saldo Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{usuario.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fundo de Emergência</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{usuario.fundoEmergencia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <progress className="w-full" value={usuario.fundoEmergencia} max={usuario.metaFundoEmergencia} />
            <p>Meta: {usuario.metaFundoEmergencia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <div className="mt-2">
              <Input
                type="number"
                placeholder="Valor"
                className="w-full mb-2"
                onChange={(e) => setNovoValorFundoEmergencia(e.target.value)}
              />
              <Button onClick={() => atualizarFundoEmergencia(novoValorFundoEmergencia)} className="w-full">
                Adicionar ao Fundo
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investimentos em Criptomoedas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{usuario.investimentosCripto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <div className="mt-2">
              <Input
                type="number"
                placeholder="Valor"
                className="w-full mb-2"
                onChange={(e) => setNovoValorCripto(e.target.value)}
              />
              <Button onClick={() => atualizarInvestimentosCripto(novoValorCripto)} className="w-full">
                Atualizar Investimento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Adicionar Transação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault()
            adicionarTransacao(
              e.target.tipo.value,
              e.target.valor.value,
              e.target.descricao.value,
              e.target.categoria.value,
              e.target.conta.value,
              parseInt(e.target.parcelas.value)
            )
            e.target.reset()
          }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="tipo">Tipo</Label>
                <Select name="tipo">
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="valor">Valor</Label>
                <Input id="valor" name="valor" type="number" step="0.01" placeholder="Digite o valor" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" name="descricao" placeholder="Digite a descrição" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="categoria">Categoria</Label>
                <Select name="categoria">
                  <SelectTrigger id="categoria">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {usuario.categorias.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="conta">Conta/Cartão</Label>
                <Select name="conta">
                  <SelectTrigger id="conta">
                    <SelectValue placeholder="Selecione a conta" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {[...usuario.contas, ...usuario.cartoes].map(conta => (
                      <SelectItem key={conta} value={conta}>{conta}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="parcelas">Parcelas</Label>
                <Input id="parcelas" name="parcelas" type="number" min="1" defaultValue="1" />
              </div>
            </div>
            <Button className="mt-4 w-full" type="submit">Adicionar Transação</Button>
          </form>
        </CardContent>
      </Card>

      <Tabs defaultValue="transacoes" className="mb-6">
        <TabsList>
          <TabsTrigger value="transacoes">Transações</TabsTrigger>
          <TabsTrigger  value="analise">Análise</TabsTrigger>
          <TabsTrigger value="contas">Contas e Cartões</TabsTrigger>
          <TabsTrigger value="metas">Metas e Planos</TabsTrigger>
          <TabsTrigger value="desejos">Lista de Desejos</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>
        <TabsContent value="transacoes">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Transações</span>
                <Button onClick={exportarParaExcel} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar para Excel
                </Button>
              </CardTitle>
              <div className="flex space-x-2">
                <Select value={filtroMes.toString()} onValueChange={(value) => setFiltroMes(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filtroAno.toString()} onValueChange={(value) => setFiltroAno(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - 2 + i
                      return <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    })}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Conta</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtrarTransacoes().map((t, index) => (
                    <TableRow key={index}>
                      <TableCell>{t.data.toLocaleDateString()}</TableCell>
                      <TableCell>{t.tipo === 'receita' ? 'Receita' : 'Despesa'}</TableCell>
                      <TableCell>{t.descricao}</TableCell>
                      <TableCell>{t.categoria}</TableCell>
                      <TableCell>{t.conta}</TableCell>
                      <TableCell className={t.tipo === 'receita' ? 'text-green-500' : 'text-red-500'}>
                        {t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analise">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gastos por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={calcularTotalPorCategoria()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Gastos</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart width={500} height={300}>
                  <Pie
                    data={calcularTotalPorCategoria()}
                    dataKey="total"
                    nameKey="categoria"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {calcularTotalPorCategoria().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="contas">
          <Card>
            <CardHeader>
              <CardTitle>Saldo por Conta/Cartão</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conta/Cartão</TableHead>
                    <TableHead>Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calcularTotalPorConta().map((conta, index) => (
                    <TableRow key={index}>
                      <TableCell>{conta.conta}</TableCell>
                      <TableCell className={conta.total >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {conta.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="metas">
          <Card>
            <CardHeader>
              <CardTitle>Metas e Planos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Fundo de Emergência</h3>
                  <progress className="w-full" value={usuario.fundoEmergencia} max={usuario.metaFundoEmergencia} />
                  <p>
                    {usuario.fundoEmergencia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} de{' '}
                    {usuario.metaFundoEmergencia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Investimentos em Criptomoedas</h3>
                  <p>
                    Total investido: {usuario.investimentosCripto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                {/* Adicione mais metas e planos aqui */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="desejos">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Desejos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Valor Estimado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuario.listaDesejos.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.item}</TableCell>
                      <TableCell>{item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Adicionar Novo Item</h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Nome do item"
                    value={novoItemDesejo.item}
                    onChange={(e) => setNovoItemDesejo({ ...novoItemDesejo, item: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Valor estimado"
                    value={novoItemDesejo.valor}
                    onChange={(e) => setNovoItemDesejo({ ...novoItemDesejo, valor: parseFloat(e.target.value) })}
                  />
                  <Button onClick={adicionarItemDesejo}>Adicionar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="configuracoes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Categorias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {usuario.categorias.map((categoria, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{categoria}</span>
                      <Button variant="destructive" size="sm" onClick={() => removerCategoria(categoria)}>
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex space-x-2">
                  <Input
                    placeholder="Nova categoria"
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value)}
                  />
                  <Button onClick={adicionarCategoria}>Adicionar</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Contas e Cartões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="font-semibold">Contas</h3>
                  {usuario.contas.map((conta, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{conta}</span>
                      <Button variant="destructive" size="sm" onClick={() => removerConta(conta)}>
                        Remover
                      </Button>
                    </div>
                  ))}
                  <div className="mt-2 flex space-x-2">
                    <Input
                      placeholder="Nova conta"
                      value={novaConta}
                      onChange={(e) => setNovaConta(e.target.value)}
                    />
                    <Button onClick={adicionarConta}>Adicionar</Button>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold">Cartões</h3>
                  {usuario.cartoes.map((cartao, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{cartao}</span>
                      <Button variant="destructive" size="sm" onClick={() => removerCartao(cartao)}>
                        Remover
                      </Button>
                    </div>
                  ))}
                  <div className="mt-2 flex space-x-2">
                    <Input
                      placeholder="Novo cartão"
                      value={novoCartao}
                      onChange={(e) => setNovoCartao(e.target.value)}
                    />
                    <Button onClick={adicionarCartao}>Adicionar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Compartilhar com Amigos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {usuario.amigos.map((amigo, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span>{amigo}</span>
                    <Button variant="outline" size="sm" onClick={() => compartilharComAmigo(amigo)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Compartilhar Resumo
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex space-x-2">
                <Input
                  placeholder="Email do amigo"
                  value={novoAmigo}
                  onChange={(e) => setNovoAmigo(e.target.value)}
                />
                <Button onClick={adicionarAmigo}>Adicionar Amigo</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}