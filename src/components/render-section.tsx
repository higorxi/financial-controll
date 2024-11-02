import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export const renderSection = (activeSection: unknown) => {
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