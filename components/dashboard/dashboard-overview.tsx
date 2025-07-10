"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Clock, Plus, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface DashboardOverviewProps {
  member: any
  subscription: any
  recentShifts: any[]
  teamCount: number
}

export function DashboardOverview({ member, subscription, recentShifts, teamCount }: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {member.user_profile?.full_name?.split(" ")[0] || "there"}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Here's what's happening at {member.business?.name}</p>
      </div>

      {/* Trial Warning */}
      {subscription?.status === "trialing" && subscription?.daysLeft <= 3 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">Your free trial expires in {subscription.daysLeft} days</p>
                <p className="text-sm text-orange-700">
                  Upgrade now to continue managing your shifts without interruption
                </p>
              </div>
            </div>
            <Button className="bg-orange-600 hover:bg-orange-700">Upgrade Now</Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamCount}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Shifts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentShifts.length}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trial Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscription?.status === "trialing" ? subscription.daysLeft : "∞"}
            </div>
            <p className="text-xs text-muted-foreground">
              {subscription?.status === "trialing" ? "Days remaining" : "Active subscription"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Shifts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Shifts</CardTitle>
            <CardDescription>Your next scheduled shifts</CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/schedule">
              <Plus className="w-4 h-4 mr-2" />
              Create Shift
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentShifts.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts scheduled</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first shift</p>
              <Button asChild>
                <Link href="/dashboard/schedule">Create Your First Shift</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentShifts.map((shift) => (
                <div key={shift.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{shift.title}</h4>
                    <p className="text-sm text-gray-600">
                      {format(new Date(shift.start_time), "MMM d, yyyy 'at' h:mm a")} -{" "}
                      {format(new Date(shift.end_time), "h:mm a")}
                    </p>
                    {shift.assigned_to?.user_profile?.full_name && (
                      <p className="text-sm text-gray-500">Assigned to: {shift.assigned_to.user_profile.full_name}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{shift.position}</Badge>
                    <Badge
                      variant={shift.status === "scheduled" ? "default" : "secondary"}
                      className={shift.status === "scheduled" ? "bg-blue-100 text-blue-800" : ""}
                    >
                      {shift.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" asChild className="h-auto p-4 justify-start bg-transparent">
              <Link href="/dashboard/schedule">
                <Calendar className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Create Schedule</div>
                  <div className="text-sm text-gray-500">Add shifts for your team</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto p-4 justify-start bg-transparent">
              <Link href="/dashboard/team">
                <Users className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Invite Team</div>
                  <div className="text-sm text-gray-500">Add team members</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
