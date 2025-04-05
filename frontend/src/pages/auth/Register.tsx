
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Link, useNavigate } from "react-router";
// import { useAuth } from "@/contexts/AuthContext";

// const Register = () => {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { signUp } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     try {
//       await signUp(email, password, fullName);
//       navigate("/login", { 
//         state: { message: "Please check your email to confirm your account before logging in." }
//       });
//     } catch (error) {
//       console.error("Registration error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold gradient-heading mb-2">ProjectVault</h1>
//           <p className="text-muted-foreground">Manage your projects with ease</p>
//         </div>

//         <Card className="w-full shadow-lg animate-fadeIn">
//           <CardHeader>
//             <CardTitle className="text-2xl">Create an account</CardTitle>
//             <CardDescription>Enter your details to get started</CardDescription>
//           </CardHeader>
//           <form onSubmit={handleSubmit}>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="fullName">Full Name</Label>
//                 <Input
//                   id="fullName"
//                   type="text"
//                   placeholder="John Doe"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="your.email@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="Create a secure password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   minLength={8}
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   Password must be at least 8 characters long
//                 </p>
//               </div>
//             </CardContent>
//             <CardFooter className="flex flex-col space-y-4">
//               <Button type="submit" className="w-full" disabled={isSubmitting}>
//                 {isSubmitting ? "Creating account..." : "Create account"}
//               </Button>
//               <p className="text-sm text-center text-muted-foreground">
//                 Already have an account?{" "}
//                 <Link to="/login" className="text-primary hover:underline">
//                   Sign in
//                 </Link>
//               </p>
//             </CardFooter>
//           </form>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Register;
