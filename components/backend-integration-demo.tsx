/**
 * Full-stack integration example component
 * Shows how to use backend authentication and deadlines together
 */

'use client';

import { useBackendAuth } from '@/hooks/useBackendAuth';
import { useBackendDeadlines } from '@/hooks/useBackendDeadlines';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Calendar, Mail } from 'lucide-react';
import { format } from 'date-fns';

export function BackendIntegrationDemo() {
  const { user, token, isLoading: authLoading, login, register, logout, isAuthenticated } = useBackendAuth();
  const { 
    deadlines, 
    upcomingDeadlines, 
    pastDeadlines,
    isLoading: deadlinesLoading, 
    error,
    createDeadline,
    updateDeadline,
    deleteDeadline,
    syncToCalendar,
    sendEmailNotification 
  } = useBackendDeadlines(token);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleCreateDeadline = async () => {
    try {
      await createDeadline({
        title: 'New Deadline',
        description: 'Created from full-stack integration',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
      });
    } catch (err) {
      console.error('Failed to create deadline:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>{showRegister ? 'Register' : 'Login'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={showRegister ? handleRegister : handleLogin} className="space-y-4">
            {showRegister && (
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {showRegister ? 'Register' : 'Login'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setShowRegister(!showRegister)}
            >
              {showRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Welcome, {user?.name}!</CardTitle>
          <Button onClick={logout} variant="outline">Logout</Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Email: {user?.email}
          </p>
          <p className="text-sm text-muted-foreground">
            User ID: {user?.id}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Deadlines</CardTitle>
          <Button onClick={handleCreateDeadline}>
            Create Test Deadline
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {deadlinesLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div>
                <h3 className="font-semibold mb-2">Upcoming Deadlines ({upcomingDeadlines.length})</h3>
                <div className="space-y-2">
                  {upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{deadline.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(deadline.deadline), 'PPp')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Priority: {deadline.priority} | Status: {deadline.status}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => syncToCalendar(deadline.id)}
                        >
                          <Calendar className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendEmailNotification(deadline.id)}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteDeadline(deadline.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Past Deadlines ({pastDeadlines.length})</h3>
                <div className="space-y-2">
                  {pastDeadlines.slice(0, 5).map((deadline) => (
                    <div key={deadline.id} className="flex items-center justify-between p-3 border rounded opacity-60">
                      <div>
                        <p className="font-medium">{deadline.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(deadline.deadline), 'PPp')}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">{deadline.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">All Deadlines ({deadlines.length})</h3>
                <p className="text-sm text-muted-foreground">
                  Total: {deadlines.length} | 
                  Upcoming: {upcomingDeadlines.length} | 
                  Past: {pastDeadlines.length}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
