"use client";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";
import { Eye, EyeOff, Loader2, Shield, Zap, Users } from "lucide-react";
import { useState } from "react";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });
        if (!result.success) {
          toast.error(result.message);
          return;
        }
        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }
        await signIn({
          email,
          idToken,
        });
        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <>
    {/* <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden"> */}
      {/* Background decoration - Full screen coverage */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 h-screen w-screen rounded-full bg-indigo-500 opacity-10 blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 h-screen w-screen rounded-full bg-purple-500 opacity-10 blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 h-screen w-screen rounded-full bg-blue-500 opacity-5 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-1/3 h-screen w-screen rounded-full bg-pink-500 opacity-5 blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      </div>

      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[calc(100vh-2rem)]">
            {/* Left Side - Branding and Features */}
            <div className="hidden lg:flex flex-col justify-center h-full pr-8">
              <div className="text-left">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
                    <Image src="/logo.svg" alt="logo" height={48} width={56} />
                  </div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    DevPrep
                  </h1>
                </div>
                
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Master Your Interview Skills with AI
                </h2>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-lg">
                  Practice realistic interviews, get instant feedback, and land your dream job with confidence.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                      <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">AI-Powered Practice</h3>
                      <p className="text-gray-600 dark:text-gray-400">Realistic interview simulations with advanced AI technology</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                      <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Industry Expertise</h3>
                      <p className="text-gray-600 dark:text-gray-400">Questions tailored to your specific industry and role</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                      <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Detailed Feedback</h3>
                      <p className="text-gray-600 dark:text-gray-400">Comprehensive analysis to improve your performance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form - Full width without card */}
            <div className="flex flex-col justify-center h-full pl-8 w-full">
              {/* Logo and Brand for mobile */}
              <div className="lg:hidden text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg mb-4">
                  <Image src="/logo.svg" alt="logo" height={40} width={48} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">DevPrep</h1>
                <p className="text-gray-600 dark:text-gray-300">Practice job interviews with AI</p>
              </div>

              {/* Form content without card container */}
              <div className="w-full">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    {isSignIn ? "Welcome Back" : "Create Account"}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {isSignIn 
                      ? "Sign in to continue to your account" 
                      : "Join thousands of professionals improving their interview skills"}
                  </p>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-7"
                  >
                    {!isSignIn && (
                      <FormField
                        control={form.control}
                        name="name"
                        label="Full Name"
                        placeholder="Enter your full name"
                        type="text"
                      />
                    )}
                    <FormField
                      control={form.control}
                      name="email"
                      label="Email Address"
                      placeholder="Enter your email"
                      type="email"
                    />
                    <div className="relative">
                      <FormField
                        control={form.control}
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-9 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <Button
                      className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {isSignIn ? "Signing In..." : "Creating Account..."}
                        </>
                      ) : (
                        <>{isSignIn ? "Sign In" : "Create Account"}</>
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="mt-10 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    {isSignIn ? "Don't have an account?" : "Already have an account?"}
                    <Link
                      href={!isSignIn ? "/sign-in" : "/sign-up"}
                      className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-1 transition-colors duration-200"
                    >
                      {!isSignIn ? "Sign In" : "Sign Up"}
                    </Link>
                  </p>
                </div>
              </div>

              {/* Additional Links */}
              <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>
                  By continuing, you agree to DevPrep's{" "}
                  <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/* </div> */}
    {/* </div> */}
    </>
  );
};

export default AuthForm;