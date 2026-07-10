"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema } from "@/schema/user-schema";
import {  useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginData } from "@/types/auth";
import { IconLogout } from "@tabler/icons-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function AdminLoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isExecuting, setIsExecuting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@gmail.com",
      password: "12345678",
    },
  });

  const onSubmit = async (data: LoginData) => {
    setIsExecuting(true);
    setErrorMessage(null);

    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setErrorMessage(error.message || "Login failed");
        toast.error(error.message || "Login failed");
      } else {
        const sessionResult = await authClient.getSession();
const loggedInUser = sessionResult.data?.user as any;

if (loggedInUser?.role !== "admin") {
  await authClient.signOut();

  setErrorMessage("Only admin users can access the admin panel");
  toast.error("Only admin users can access the admin panel");
  return;
}

toast.success("Login successful");

router.replace("/dashboard"); // change to your admin dashboard route
router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <IconLogout  />
          </div>
          <CardTitle>Login to your admin Dashboard</CardTitle>
          <CardDescription>
            Enter your email and password to login
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input 
                          className="bg-white"
                          placeholder="admin@gmail.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-white">Password</FormLabel>
                      </div>
                      <FormControl>
                        <Input className="bg-white" type="password" {...field} placeholder="password"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {errorMessage && (
                  <div className="text-sm font-medium text-red-500">
                    {errorMessage}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isExecuting}>
                  {isExecuting ? <Loader2 className="animate-spin size-4" /> : "Login"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
