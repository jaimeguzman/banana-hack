"use client"

import { ArrowDown, ArrowUp, ChevronDown, HelpCircle, LayoutDashboard, Settings } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for the charts
const data = Array.from({ length: 50 }, (_, i) => ({
  value: 30 + Math.random() * 10 + Math.sin(i / 5) * 5
}))

const stockData = Array.from({ length: 50 }, (_, i) => ({
  value: 280 + Math.random() * 40 + Math.sin(i / 5) * 10
}))

export default function Dashboard() {
  return (
    <div className="grid h-screen" style={{ gridTemplateColumns: "250px 1fr 400px" }}>
      {/* Sidebar */}
      <div className="border-r bg-background p-4">
        <div className="space-y-4">
          <Input type="search" placeholder="Search" className="bg-muted" />
          <nav className="space-y-2">
            <Button variant="secondary" className="w-full justify-start">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              Transactions
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              Cash flow
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              Accounts
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              Investments
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              Categories
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              Recurrings
            </Button>
          </nav>
          <Separator />
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">MY ACCOUNTS</h4>
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-muted-foreground flex items-center">
                Credit Cards <ChevronDown className="ml-1 h-4 w-4" />
              </h5>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                        Credit Card
                      </div>
                    </TableCell>
                    <TableCell className="text-right">$2,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                        Credit Card
                      </div>
                    </TableCell>
                    <TableCell className="text-right">$1,300</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="fixed bottom-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <HelpCircle className="mr-2 h-4 w-4" />
              Get help
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 bg-muted/10">
        <h1 className="text-2xl font-semibold mb-6">Investments</h1>
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-green-500 flex items-center mb-1">
                  <ArrowUp className="h-4 w-4 mr-1" /> 2.29%
                </div>
                <div className="text-3xl font-semibold mb-1">$13,253</div>
                <div className="text-sm text-muted-foreground flex items-center">
                  estimated return <HelpCircle className="h-4 w-4 ml-1" />
                </div>
              </div>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <Tabs defaultValue="3M" className="mt-4">
              <TabsList className="grid grid-cols-7 w-full">
                <TabsTrigger value="1D">1D</TabsTrigger>
                <TabsTrigger value="1W">1W</TabsTrigger>
                <TabsTrigger value="1M">1M</TabsTrigger>
                <TabsTrigger value="3M">3M</TabsTrigger>
                <TabsTrigger value="YTD">YTD</TabsTrigger>
                <TabsTrigger value="1Y">1Y</TabsTrigger>
                <TabsTrigger value="ALL">ALL</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Accounts</h2>
            <div className="text-sm text-muted-foreground">3M BALANCE CHANGE</div>
          </div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-500 mr-2" />
                    <div>
                      <div>Robinhood</div>
                      <div className="text-sm text-muted-foreground">2 days ago</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="text-green-500">↑ 1.81%</div>
                </TableCell>
                <TableCell className="text-right">$6,281.54</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-500 mr-2" />
                    <div>
                      <div>Coinbase</div>
                      <div className="text-sm text-muted-foreground">2 days ago</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="text-red-500">↓ 0.22%</div>
                </TableCell>
                <TableCell className="text-right">$3,360.12</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-500 mr-2" />
                    <div>
                      <div>Wealthfront</div>
                      <div className="text-sm text-muted-foreground">2 days ago</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="text-green-500">↑ 1.97%</div>
                </TableCell>
                <TableCell className="text-right">$2,906.82</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Allocation</h2>
              <div className="text-sm text-muted-foreground">BY PERCENTAGE</div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>Equity</div>
                <div>43.61%</div>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full w-[43.61%] bg-primary rounded-full" />
              </div>
              <div className="flex justify-between items-center">
                <div>Crypto</div>
                <div>29.61%</div>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full w-[29.61%] bg-primary rounded-full" />
              </div>
              <div className="flex justify-between items-center">
                <div>ETF</div>
                <div>26.77%</div>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full w-[26.77%] bg-primary rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="border-l bg-background p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="inline-block rounded px-2 py-1 text-xs bg-muted">STOCK</div>
              <div className="mt-2">
                <h2 className="text-2xl font-semibold">NFLX</h2>
                <div className="text-muted-foreground">Netflix Inc</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold">$299.05</div>
              <div className="text-sm text-muted-foreground">Price at 4:00 PM</div>
            </div>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <Tabs defaultValue="3M">
            <TabsList className="grid grid-cols-7 w-full">
              <TabsTrigger value="1D">1D</TabsTrigger>
              <TabsTrigger value="1W">1W</TabsTrigger>
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="3M">3M</TabsTrigger>
              <TabsTrigger value="YTD">YTD</TabsTrigger>
              <TabsTrigger value="1Y">1Y</TabsTrigger>
              <TabsTrigger value="ALL">ALL</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-muted-foreground">Average cost</div>
                  <div>$224.54</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-muted-foreground">Total return</div>
                  <div>$213.84 (33.18%)</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Positions</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-500 mr-2" />
                  <div>
                    <div>Robinhood</div>
                    <div className="text-sm text-muted-foreground">2.87 shares</div>
                  </div>
                </div>
                <div>$858.27</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

