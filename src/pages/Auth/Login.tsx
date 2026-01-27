import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/redux/slices/authSlice";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;


export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });
  const user = [
    {
      id: "1",
      email: "superadmin@example.com",
      password: "password",
      role: "Super Admin",
    },
    {
      id: "2",
      email: "employee1@example.com",
      password: "password",
      role: "Employee",
    },
    {
      id: "3",
      email: "employee2@example.com",
      password: "password",
      role: "Employee",
    },
    {
      id: "4",
      email: "admin@example.com",
      password: "password",
      role: "Admin",
    }
  ]

  const onSubmit = async (data: LoginFormData) => {
    dispatch(loginStart());

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const foundUser = user.find(
        (u) => u.email === data.email && u.password === data.password
      );

      if (!foundUser) {
        dispatch(loginFailure("Invalid email or password"));
        return;
      }

      // Role mapping to match UserRole enum:
      // "Super Admin" -> 'super-admin' (can access /dashboard)
      // "Admin" -> 'admin' (goes to /cars)
      // "Employee" -> 'employee' (goes to /cars)
      let role: 'super-admin' | 'admin' | 'employee' = 'employee';
      let firstName = "User";
      
      if (foundUser.role === "Super Admin") {
        role = 'super-admin';
        firstName = "Super Admin";
      } else if (foundUser.role === "Admin") {
        role = 'admin';
        firstName = "Admin";
      } else {
        role = 'employee';
        firstName = "Employee";
      }

      // 🔍 Console log for debugging
      console.log('🔐 Login Debug Info:');
      console.log('Found User Role:', foundUser.role);
      console.log('Mapped Role:', role);
      console.log('User Email:', foundUser.email);

      dispatch(
        loginSuccess({
          user: {
            id: foundUser.id,
            email: foundUser.email,
            firstName: firstName,
            lastName: "User",
            role: role,
          },
          token: "mock-jwt-token-" + Date.now(),
        })
      );

      // 🔍 Console log after dispatch
      console.log('✅ User dispatched with role:', role);
      console.log('📍 Redirecting to:', role === 'super-admin' ? '/dashboard' : '/cars');

      // Redirect logic:
      // Super Admin -> /dashboard
      // Admin and Employee -> /cars
      console.log('🚀 About to navigate, role:', role)
      
      if (role === 'super-admin') {
        console.log('📍 Navigating to /dashboard')
        navigate("/dashboard", { replace: true });
      } else if (role === 'admin') {
        console.log('📍 Navigating to /cars')
        navigate("/cars", { replace: true });
      } else if (role === 'employee') {
        console.log('📍 Navigating to /cars')
        navigate("/cars", { replace: true });
      }
      
      console.log('✅ Navigate called')
    } catch {
      dispatch(loginFailure("An error occurred. Please try again."));
    }
  };


  return (
    <div className="space-y-6">
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xl">D</span>
        </div>
        <span className="font-display font-bold text-2xl">Dashboard</span>
      </div>

      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className={cn("pl-10", errors.email && "border-destructive")}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={cn(
                "pl-10 pr-10",
                errors.password && "border-destructive"
              )}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-input"
              {...register("remember")}
            />
            <Label
              htmlFor="remember"
              className="text-sm font-normal cursor-pointer"
            >
              Remember me for 30 days
            </Label>
          </div>
          <Link
            to="/auth/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading}
        >
          {!isLoading && (
            <>
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
          Demo Credentials
        </span>
      </div>

      <div className="p-4 rounded-lg bg-muted/50 border text-sm space-y-3">
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Super Admin Account:</p>
          <p><strong>Email:</strong> superadmin@example.com</p>
          <p><strong>Password:</strong> password</p>
          <p className="text-xs text-muted-foreground">→ Redirects to /dashboard</p>
        </div>
        <Separator />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Admin Account:</p>
          <p><strong>Email:</strong> admin@example.com</p>
          <p><strong>Password:</strong> password</p>
          <p className="text-xs text-muted-foreground">→ Redirects to /cars</p>
        </div>
        <Separator />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Employee Account 1:</p>
          <p><strong>Email:</strong> employee1@example.com</p>
          <p><strong>Password:</strong> password</p>
          <p className="text-xs text-muted-foreground">→ Redirects to /cars</p>
        </div>
        <Separator />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Employee Account 2:</p>
          <p><strong>Email:</strong> employee2@example.com</p>
          <p><strong>Password:</strong> password</p>
          <p className="text-xs text-muted-foreground">→ Redirects to /cars</p>
        </div>
      </div>
    </div>
  );
}
