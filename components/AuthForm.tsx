"use client";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { signIn, signUp, syncUser } from "@/lib/actions/auth.action";
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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
        toast.success("Protocol Registered. Please identify.");
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
          toast.error("Handshake Failed. Retry Protocol.");
          return;
        }
        await signIn({
          email,
          idToken,
        });
        toast.success("Handshake Successful. Access Granted.");
        router.push("/");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(`Protocol Error: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const syncResult = await syncUser({
        uid: user.uid,
        name: user.displayName || "Google User",
        email: user.email!,
        idToken,
      });

      if (syncResult.success) {
        toast.success("Google Handshake Successful.");
        router.push("/");
      } else {
        toast.error("Handshake Failed during sync.");
      }
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      toast.error(`Google Protocol Error: ${error.message}`);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
      {/* Left Side - Intelligence Branding */}
      <div className="hidden lg:flex flex-col space-y-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent rounded-[1.2rem] shadow-lg shadow-accent/20">
              <Image src="/logo.svg" alt="logo" height={32} width={32} className="invert brightness-0" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-black text-text-primary tracking-tighter">
                ScreenElite
              </h1>
              <p className="text-[10px] font-bold text-accent uppercase tracking-[0.4em] -mt-1">
                Elite Protocol
              </p>
            </div>
          </div>
          
          <h2 className="text-6xl font-black text-text-primary leading-[0.95] tracking-tighter">
            Evaluating <br />
            <span className="text-accent italic">Excellence.</span>
          </h2>
          
          <p className="text-xl text-text-secondary font-medium max-w-md leading-relaxed">
            The next generation of pedagogical assessment and interview training for elite educators.
          </p>
        </div>

        <div className="space-y-4">
           <FeatureItem icon={<Zap size={18} />} title="AI Logic Engines" description="Hyper-realistic pedagogical simulations." />
           <FeatureItem icon={<Shield size={18} />} title="Evidence Based" description="Direct transcript analysis and metrics." />
           <FeatureItem icon={<Users size={18} />} title="Cross Industry" description="Specialized tracks for every professional." />
        </div>
      </div>

      {/* Right Side - Auth Card */}
      <div className="glass-card p-12 md:p-16 border border-border-color bg-card-bg shadow-xl rounded-[3rem] transition-all duration-500 relative overflow-hidden">
        {/* Subtle decorative glow in dark mode only */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[80px] -mr-16 -mt-16 opacity-0 dark:opacity-100" />

        <div className="lg:hidden flex flex-col items-center mb-12">
           <div className="p-3 bg-accent rounded-2xl mb-4 shadow-lg shadow-accent/20">
              <Image src="/logo.svg" alt="logo" height={24} width={24} className="invert brightness-0" />
           </div>
           <h2 className="text-2xl font-black text-text-primary tracking-tighter uppercase">ScreenElite</h2>
        </div>

        <div className="space-y-2 mb-10">
          <h3 className="text-3xl font-bold text-text-primary tracking-tight">
            {isSignIn ? "Access Hub" : "Initialize Account"}
          </h3>
          <p className="text-text-secondary text-sm font-semibold">
            {isSignIn 
              ? "Identify yourself to enter the protocol dashboard." 
              : "Register your identity to start your pedagogical journey."}
          </p>
        </div>

        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  label="Full Name"
                  placeholder="Enter legal name"
                  type="text"
                />
              )}
              <FormField
                control={form.control}
                name="email"
                label="Email Identity"
                placeholder="operator@tutorscreen.pro"
                type="email"
              />
              <div className="relative">
                <FormField
                  control={form.control}
                  name="password"
                  label="Security Key"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  className="absolute right-4 top-10 text-text-secondary hover:text-accent transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <Button
                className="w-full h-16 rounded-[1.5rem] bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-accent/20 transition-all duration-500 hover:scale-[1.02] disabled:opacity-50"
                type="submit"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                    {isSignIn ? "Authorizing..." : "Registering..."}
                  </>
                ) : (
                  <>{isSignIn ? "Start Protocol" : "Register Identity"}</>
                )}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border-color" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black">
              <span className="bg-card-bg px-4 text-text-secondary">Or Identification Via</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={isLoading || isGoogleLoading}
            onClick={handleGoogleSignIn}
            className="w-full h-16 rounded-[1.5rem] bg-bg-secondary border border-border-color text-text-primary font-bold hover:bg-bg-primary transition-all duration-500 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.67-.35-1.39-.35-2.1s.13-1.43.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            {isGoogleLoading ? "Syncing..." : "Continue with Google"}
          </Button>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          <p className="text-sm text-text-secondary font-bold">
            {isSignIn ? "New Operator?" : "Existing Identity?"}
            <Link
              href={!isSignIn ? "/sign-in" : "/sign-up"}
              className="text-accent font-black ml-2 hover:underline tracking-tight"
            >
              {!isSignIn ? "Sign In" : "Sign Up"}
            </Link>
          </p>
          
          <div className="flex items-center gap-4 text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">
             <span className="hover:text-accent cursor-pointer transition-colors">Terms of Protocol</span>
             <div className="size-1 rounded-full bg-border-color" />
             <span className="hover:text-accent cursor-pointer transition-colors">Privacy Shield</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="flex items-center gap-4 group">
    <div className="size-10 rounded-xl bg-bg-secondary flex items-center justify-center text-accent border border-border-color group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm">
      {icon}
    </div>
    <div className="flex flex-col">
       <span className="text-sm font-bold text-text-primary tracking-tight">{title}</span>
       <span className="text-[10px] text-text-secondary font-bold">{description}</span>
    </div>
  </div>
);

export default AuthForm;