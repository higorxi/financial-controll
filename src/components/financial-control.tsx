"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LineChart as LineChartIcon,
  Plus,
  Settings,
  User,
  Menu,
  X,
} from "lucide-react";

const initialUser = {
  name: "Example User",
  email: "user@example.com",
  balance: 10000,
  emergencyFund: 5000,
  emergencyFundGoal: 15000,
  cryptoInvestments: 2000,
  categories: [
    "Food",
    "Transport",
    "Housing",
    "Health",
    "Leisure",
    "Education",
    "Others",
  ],
  accounts: ["Bank A", "Bank B"],
  cards: ["Card X", "Card Y"],
  friends: ["friend1@email.com", "friend2@email.com"],
  wishlist: [
    { item: "New Laptop", value: 5000 },
    { item: "Beach Trip", value: 3000 },
  ],
};

export default function FinancialControl() {
  const [user, setUser] = useState(initialUser);
  const [transactions, setTransactions] = useState([]);
  const [activeSection, setActiveSection] = useState("launch");
  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    amount: "",
    description: "",
    category: "",
    account: "",
    installments: 1,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addTransaction = (e) => {
    e.preventDefault();
    const transaction = {
      ...newTransaction,
      date: new Date(),
      amount: parseFloat(newTransaction.amount),
      installments: parseInt(newTransaction.installments),
    };
    setTransactions([...transactions, transaction]);
    updateBalance(transaction.type, transaction.amount);
    setNewTransaction({
      type: "expense",
      amount: "",
      description: "",
      category: "",
      account: "",
      installments: 1,
    });
  };

  const updateBalance = (type, amount) => {
    setUser((prev) => ({
      ...prev,
      balance:
        type === "income" ? prev.balance + amount : prev.balance - amount,
    }));
  };

  const calculateTotalByCategory = () => {
    const totals = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
      }
    });
    return Object.entries(totals).map(([category, total]) => ({
      category,
      total,
    }));
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC0CB",
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "launch":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addTransaction} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newTransaction.type}
                      onValueChange={(value) =>
                        setNewTransaction({ ...newTransaction, type: value })
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          amount: e.target.value,
                        })
                      }
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newTransaction.description}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newTransaction.category}
                      onValueChange={(value) =>
                        setNewTransaction({
                          ...newTransaction,
                          category: value,
                        })
                      }
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {user.categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="account">Account/Card</Label>
                    <Select
                      value={newTransaction.account}
                      onValueChange={(value) =>
                        setNewTransaction({ ...newTransaction, account: value })
                      }
                    >
                      <SelectTrigger id="account">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {[...user.accounts, ...user.cards].map((acc) => (
                          <SelectItem key={acc} value={acc}>
                            {acc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="installments">Installments</Label>
                  <Input
                    id="installments"
                    type="number"
                    min="1"
                    value={newTransaction.installments}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        installments: e.target.value,
                      })
                    }
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Transaction
                </Button>
              </form>
            </CardContent>
          </Card>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  width={600}
                  height={300}
                  data={calculateTotalByCategory()}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart width={400} height={400}>
                  <Pie
                    data={calculateTotalByCategory()}
                    cx={200}
                    cy={200}
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                  >
                    {calculateTotalByCategory().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Categories</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.categories.map((category, index) => (
                      <div
                        key={index}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Accounts</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.accounts.map((account, index) => (
                      <div
                        key={index}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                      >
                        {account}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Cards</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.cards.map((card, index) => (
                      <div
                        key={index}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                      >
                        {card}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case "profile":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={user.name} readOnly />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user.email} readOnly />
                </div>
                <div>
                  <Label>Current Balance</Label>
                  <Input
                    value={user.balance.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Emergency Fund</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={user.emergencyFund.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                      readOnly
                    />
                    <span>of</span>
                    <Input
                      value={user.emergencyFundGoal.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                      readOnly
                    />
                  </div>
                  <progress
                    className="w-full mt-2"
                    value={user.emergencyFund}
                    max={user.emergencyFundGoal}
                  />
                </div>
                <div>
                  <Label>Crypto Investments</Label>
                  <Input
                    value={user.cryptoInvestments.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-card text-card-foreground p-4 flex flex-col transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between mb-6">
          <div
            className={`flex items-center ${
              isSidebarOpen ? "" : "justify-center w-full"
            }`}
          >
            <img src="/placeholder.svg" alt="Logo" className="h-8 w-8 mr-2" />
            {isSidebarOpen && (
              <span className="text-2xl font-bold">FinControl</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
        <nav className="flex-grow">
          <Button
            variant={activeSection === "launch" ? "secondary" : "ghost"}
            className={`w-full justify-start mb-4 ${
              isSidebarOpen ? "" : "justify-center"
            } py-2`}
            onClick={() => setActiveSection("launch")}
          >
            <Plus className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Lançamentos</span>}
          </Button>
          <Button
            variant={activeSection === "reports" ? "secondary" : "ghost"}
            className={`w-full justify-start mb-4 ${
              isSidebarOpen ? "" : "justify-center"
            } py-2`}
            onClick={() => setActiveSection("reports")}
          >
            <LineChartIcon className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Relatórios</span>}
          </Button>
          <Button
            variant={activeSection === "settings" ? "secondary" : "ghost"}
            className={`w-full justify-start mb-4 ${
              isSidebarOpen ? "" : "justify-center"
            } py-2`}
            onClick={() => setActiveSection("settings")}
          >
            <Settings className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Ajustes</span>}
          </Button>
          <Button
            variant={activeSection === "profile" ? "secondary" : "ghost"}
            className={`w-full justify-start mb-4 ${
              isSidebarOpen ? "" : "justify-center"
            } py-2`}
            onClick={() => setActiveSection("profile")}
          >
            <User className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Perfil</span>}
          </Button>
        </nav>
        <div
          className={`text-sm text-muted-foreground ${
            isSidebarOpen ? "" : "text-center"
          }`}
        >
          {isSidebarOpen ? (
            <>
              <p>{currentDateTime.toLocaleDateString()}</p>
              <p>{currentDateTime.toLocaleTimeString()}</p>
            </>
          ) : (
            <p>
              {currentDateTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">
          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        </h1>
        {renderSection()}
      </main>
    </div>
  );
}
