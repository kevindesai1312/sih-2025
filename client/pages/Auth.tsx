import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { login, signup } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    try {
      await login(String(fd.get("email")), String(fd.get("password")));
      nav("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    try {
      await signup(
        String(fd.get("name")),
        String(fd.get("email")),
        String(fd.get("password")),
      );
      nav("/");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
  }

  return (
    <div className="container py-12">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Login / Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <form className="space-y-3" onSubmit={handleLogin}>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <Input name="email" type="email" required />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Password
                  </label>
                  <Input
                    name="password"
                    type="password"
                    minLength={6}
                    required
                  />
                </div>
                {error && (
                  <div className="text-sm text-destructive">{error}</div>
                )}
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="mt-4">
              <form className="space-y-3" onSubmit={handleSignup}>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Full name
                  </label>
                  <Input name="name" required minLength={2} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <Input name="email" type="email" required />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Password
                  </label>
                  <Input
                    name="password"
                    type="password"
                    minLength={6}
                    required
                  />
                </div>
                {error && (
                  <div className="text-sm text-destructive">{error}</div>
                )}
                <Button type="submit" className="w-full">
                  Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
