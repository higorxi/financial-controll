'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown } from 'lucide-react' // Ícones do Lucide

interface User {
  categories: string[]
  accounts: string[]
  cards: string[]
}

interface NewTransaction {
  type: 'despesa' | 'receita'
  amount: string
  description: string
  category: string
  account: string
  installments: number
}

interface LaunchesSectionProps {
  addTransaction: (transaction: NewTransaction & { date: Date }) => void
  user: User
}

export function LaunchesSection({ addTransaction, user }: LaunchesSectionProps) {
  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    type: 'despesa',
    amount: '',
    description: '',
    category: '',
    account: '',
    installments: 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTransaction({
      ...newTransaction,
      date: new Date(),
      amount: newTransaction.amount,
      installments: parseInt(newTransaction.installments.toString()),
    })
    setNewTransaction({
      type: 'despesa',
      amount: '',
      description: '',
      category: '',
      account: '',
      installments: 1,
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto text-center">
      <CardHeader>
        <CardTitle>Adicionar Transação</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="despesa" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="despesa"
              className="flex items-center justify-center gap-2 text-red-500"
            >
              <TrendingDown className="w-5 h-5" /> Despesa
            </TabsTrigger>
            <TabsTrigger
              value="receita"
              className="flex items-center justify-center gap-2 text-green-500"
            >
              <TrendingUp className="w-5 h-5" /> Receita
            </TabsTrigger>
          </TabsList>
          <TabsContent value="despesa">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) =>
                      setNewTransaction({ ...newTransaction, amount: e.target.value, type: 'despesa' })
                    }
                    placeholder="Digite o valor"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={newTransaction.category}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {user.categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  placeholder="Digite a descrição"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="account">Conta/Cartão</Label>
                  <Select
                    value={newTransaction.account}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, account: value })}
                  >
                    <SelectTrigger id="account">
                      <SelectValue placeholder="Selecione a conta" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...user.accounts, ...user.cards].map((acc) => (
                        <SelectItem key={acc} value={acc}>
                          {acc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="installments">Parcelas</Label>
                  <Input
                    id="installments"
                    type="number"
                    min="1"
                    value={newTransaction.installments}
                    onChange={(e) =>
                      setNewTransaction({ ...newTransaction, installments: parseInt(e.target.value) || 1 })
                    }
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-red-500 text-white hover:bg-red-600">
                Adicionar Despesa
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="receita">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) =>
                      setNewTransaction({ ...newTransaction, amount: e.target.value, type: 'receita' })
                    }
                    placeholder="Digite o valor"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={newTransaction.category}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {user.categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  placeholder="Digite a descrição"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account">Conta</Label>
                <Select
                  value={newTransaction.account}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, account: value })}
                >
                  <SelectTrigger id="account">
                    <SelectValue placeholder="Selecione a conta" />
                  </SelectTrigger>
                  <SelectContent>
                    {user.accounts.map((acc) => (
                      <SelectItem key={acc} value={acc}>
                        {acc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-600">
                Adicionar Receita
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
