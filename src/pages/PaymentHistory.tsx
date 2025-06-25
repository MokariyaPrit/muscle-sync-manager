"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { db } from "@/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { AlertCircle } from "lucide-react"

interface Membership {
  paymentId: string
  plan: string
  status: string
  upgradedAt: any
  expiry: any
}

const PaymentHistory = () => {
  const { user } = useAuth()
  const [history, setHistory] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) return
      const snapshot = await getDocs(collection(db, "memberships", user.id, "history"))
      const list: Membership[] = []
      snapshot.forEach(doc => {
        const data = doc.data()
        list.push({
          paymentId: data.paymentId,
          plan: data.plan,
          status: data.status,
          upgradedAt: data.upgradedAt?.toDate?.() || null,
          expiry: data.expiry?.toDate?.() || null
        })
      })
      setHistory(list)
      setLoading(false)
    }

    fetchHistory()
  }, [user])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : history.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <AlertCircle className="mx-auto h-8 w-8 mb-2 text-gray-400" />
            <p className="text-base font-medium">No payment history found</p>
            <p className="text-sm">Upgrade your membership to start seeing transactions here.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Upgraded At</TableHead>
                <TableHead>Expiry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.plan}</TableCell>
                  <TableCell>{item.paymentId}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.upgradedAt ? format(item.upgradedAt, "PPPpp") : "N/A"}</TableCell>
                  <TableCell>{item.expiry ? format(item.expiry, "PPP") : "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

export default PaymentHistory
  