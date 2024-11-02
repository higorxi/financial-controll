'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProfileSection({ user }) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <img src={user.profilePicture} alt={`${user.name}'s profile`} className="w-16 h-16 rounded-full" />
          <div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={user.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} readOnly />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Input id="bio" value={user.bio} readOnly />
        </div>
        <div className="space-y-2">
          <Label>Photos</Label>
          <div className="grid grid-cols-2 gap-4">
            {(user.photos ?? []).map((photo, index) => (
              <img key={index} src={photo} alt={`Photo ${index + 1}`} className="w-full h-auto rounded-lg" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
