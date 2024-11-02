'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiOutlineMinusCircle } from 'react-icons/ai'; // Ícone de menos
import { bancosFamosos } from '@/mock/setting';

// Definição dos tipos para as categorias, contas e cartões
interface Category {
  nome: string;
}

interface Account {
  nome: string;
  banco: string;
  limite: string;
}

interface CardDetails {
  nome: string;
  banco: string;
  tipo: string;
  limite: string;
  conta: string;
  bandeira: string;
  ultimos4: string;
}

// Definição do tipo de usuário
interface User {
  categories: string[];
  accounts: Account[];
  cards: CardDetails[];
}

// Definição das props do componente
interface SettingsSectionProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export function SettingsSection({ user, setUser }: SettingsSectionProps) {
  const [novaCategoria, setNovaCategoria] = useState<string>('');
  const [novaConta, setNovaConta] = useState<Account>({ nome: '', banco: '', limite: '' });
  const [novoCartao, setNovoCartao] = useState<CardDetails>({
    nome: '',
    banco: '',
    tipo: '',
    limite: '',
    conta: '',
    bandeira: '',
    ultimos4: '',
  });
  const [itemParaRemover, setItemParaRemover] = useState<{ tipo: string; item: string | Account | CardDetails } | null>(null);
  const [modalAberto, setModalAberto] = useState<boolean>(false);

  const adicionarCategoria = () => {
    if (novaCategoria && !user.categories.includes(novaCategoria)) {
      setUser({ ...user, categories: [...user.categories, novaCategoria] });
      setNovaCategoria('');
    }
  };

  const adicionarConta = () => {
    if (novaConta.nome && !user.accounts.find(acc => acc.nome === novaConta.nome)) {
      setUser({ ...user, accounts: [...user.accounts, novaConta] });
      setNovaConta({ nome: '', banco: '', limite: '' }); // Resetando os campos
    }
  };

  const adicionarCartao = () => {
    if (novoCartao.nome && novoCartao.conta && !user.cards.find(card => card.nome === novoCartao.nome)) {
      const contaSelecionada = user.accounts.find(acc => acc.nome === novoCartao.conta);
      setUser({
        ...user,
        cards: [
          ...user.cards,
          {
            ...novoCartao,
            banco: contaSelecionada ? contaSelecionada.banco : '',
          }
        ]
      });
      setNovoCartao({ nome: '', banco: '', tipo: '', limite: '', conta: '', bandeira: '', ultimos4: '' }); // Resetando os campos
    }
  };

  const removerItem = (tipo: string, item: string | Account | CardDetails) => {
    if (tipo === 'categoria') {
      setUser({ ...user, categories: user.categories.filter(cat => cat !== item) });
    } else if (tipo === 'conta') {
      setUser({ ...user, accounts: user.accounts.filter(acc => acc.nome !== (item as Account).nome) });
    } else if (tipo === 'cartao') {
      setUser({ ...user, cards: user.cards.filter(card => card.nome !== (item as CardDetails).nome) });
    }
    setModalAberto(false);
  };

  const confirmarRemocao = () => {
    if (itemParaRemover) {
      const { tipo, item } = itemParaRemover;
      removerItem(tipo, item);
      setItemParaRemover(null);
    }
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="grid w-full grid-cols-3 gap-2">
              <TabsTrigger value="categories">Categorias</TabsTrigger>
              <TabsTrigger value="accounts">Contas</TabsTrigger>
              <TabsTrigger value="cards">Cartões</TabsTrigger>
            </TabsList>
            <TabsContent value="categories">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value)}
                    placeholder="Nova categoria"
                  />
                  <Button onClick={adicionarCategoria}>Adicionar</Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {user.categories.map((categoria, index) => (
                    <div
                      key={index}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md relative group flex justify-between items-center shadow-md"
                    >
                      {categoria}
                      <div className="hidden group-hover:block absolute right-0">
                        <button
                          className="bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                          onClick={() => {
                            setItemParaRemover({ tipo: 'categoria', item: categoria });
                            setModalAberto(true);
                          }}
                        >
                          <AiOutlineMinusCircle />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="accounts">
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Input
                    value={novaConta.nome}
                    onChange={(e) => setNovaConta({ ...novaConta, nome: e.target.value })}
                    placeholder="Nome da Conta"
                  />
                  <select
                    value={novaConta.banco}
                    onChange={(e) => setNovaConta({ ...novaConta, banco: e.target.value })}
                    className="border rounded-md px-2 py-1"
                  >
                    <option value="">Selecione um Banco</option>
                    {bancosFamosos.map((banco, index) => (
                      <option key={index} value={banco.nome}>
                        {banco.nome}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    value={novaConta.limite}
                    onChange={(e) => setNovaConta({ ...novaConta, limite: e.target.value })}
                    placeholder="Limite"
                  />
                  <Button onClick={adicionarConta}>Adicionar Conta</Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {user.accounts.map((conta, index) => (
                    <div
                      key={index}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md relative group flex justify-between items-center shadow-md"
                    >
                      {`${conta.nome} - ${conta.banco} (Limite: ${conta.limite})`}
                      <div className="hidden group-hover:block absolute right-0">
                        <button
                          className="bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                          onClick={() => {
                            setItemParaRemover({ tipo: 'conta', item: conta });
                            setModalAberto(true);
                          }}
                        >
                          <AiOutlineMinusCircle />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="cards">
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Input
                    value={novoCartao.nome}
                    onChange={(e) => setNovoCartao({ ...novoCartao, nome: e.target.value })}
                    placeholder="Nome do Cartão"
                  />
                  <select
                    value={novoCartao.conta}
                    onChange={(e) => setNovoCartao({ ...novoCartao, conta: e.target.value })}
                    className="border rounded-md px-2 py-1"
                  >
                    <option value="">Selecione uma Conta</option>
                    {user.accounts.map((conta, index) => (
                      <option key={index} value={conta.nome}>
                        {conta.nome} - {conta.banco}
                      </option>
                    ))}
                  </select>
                  <select
                    value={novoCartao.bandeira}
                    onChange={(e) => setNovoCartao({ ...novoCartao, bandeira: e.target.value })}
                    className="border rounded-md px-2 py-1"
                  >
                    <option value="">Selecione a Bandeira</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">MasterCard</option>
                    <option value="amex">American Express</option>
                    <option value="elo">Elo</option>
                  </select>
                  <Input
                    type="number"
                    value={novoCartao.limite}
                    onChange={(e) => setNovoCartao({ ...novoCartao, limite: e.target.value })}
                    placeholder="Limite"
                  />
                  <Button onClick={adicionarCartao}>Adicionar Cartão</Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {user.cards.map((cartao, index) => (
                    <div
                      key={index}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md relative group flex justify-between items-center shadow-md"
                    >
                      {`${cartao.nome} - ${cartao.banco} (${cartao.tipo})`}
                      <div className="hidden group-hover:block absolute right-0">
                        <button
                          className="bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                          onClick={() => {
                            setItemParaRemover({ tipo: 'cartao', item: cartao });
                            setModalAberto(true);
                          }}
                        >
                          <AiOutlineMinusCircle />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {modalAberto && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-md">
            <h3>Você tem certeza que deseja remover?</h3>
            <div className="flex space-x-2 mt-4">
              <Button onClick={confirmarRemocao}>Sim</Button>
              <Button onClick={() => setModalAberto(false)}>Não</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
