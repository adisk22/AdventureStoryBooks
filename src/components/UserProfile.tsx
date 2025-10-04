import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, LogOut, Trophy, Star } from 'lucide-react';
import { useAuth, type DemoUser } from '@/contexts/DemoAuthContext';

interface UserProfileProps {
  user: DemoUser;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    display_name: user.display_name,
    email: user.email,
  });

  const handleSaveProfile = () => {
    // Demo mode - just close the dialog
    setIsEditing(false);
    setIsProfileOpen(false);
  };

  const handleSignOut = () => {
    // Demo mode - just show a message
    console.log('Demo mode: Sign out clicked');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <>
      {/* User Avatar Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsProfileOpen(true)}
        className="flex items-center gap-2"
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
            {getInitials(user.display_name)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden sm:inline">{user.display_name}</span>
      </Button>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              User Profile
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                  {getInitials(user.display_name)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">{user.display_name}</h3>
              <Badge className={getRoleColor(user.role)}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold">{user.total_points}</div>
                  <div className="text-sm text-muted-foreground">Points</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">Level {user.level}</div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={editData.display_name}
                    onChange={(e) => setEditData({ ...editData, display_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile} className="flex-1">
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Display Name</Label>
                  <p className="text-sm text-muted-foreground">{user.display_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Member Since</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {!isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex-1"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex-1"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};