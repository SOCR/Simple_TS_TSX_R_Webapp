
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Link } from "react-router";
// import { useAuth } from "@/contexts/AuthContext";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const { resetPassword } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     try {
//       await resetPassword(email);
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error("Password reset error:", error);
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
//             <CardTitle className="text-2xl">Reset Password</CardTitle>
//             <CardDescription>
//               {isSubmitted
//                 ? "Check your email for a reset link"
//                 : "Enter your email to receive a password reset link"}
//             </CardDescription>
//           </CardHeader>
//           {!isSubmitted ? (
//             <form onSubmit={handleSubmit}>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="your.email@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>
//               </CardContent>
//               <CardFooter className="flex flex-col space-y-4">
//                 <Button type="submit" className="w-full" disabled={isSubmitting}>
//                   {isSubmitting ? "Sending..." : "Send reset link"}
//                 </Button>
//                 <p className="text-sm text-center text-muted-foreground">
//                   Remember your password?{" "}
//                   <Link to="/login" className="text-primary hover:underline">
//                     Back to login
//                   </Link>
//                 </p>
//               </CardFooter>
//             </form>
//           ) : (
//             <CardContent className="space-y-4">
//               <p className="text-center text-muted-foreground py-4">
//                 We've sent a password reset link to <strong>{email}</strong>.
//                 Check your email and follow the instructions to reset your password.
//               </p>
//               <Button
//                 variant="outline"
//                 className="w-full mt-4"
//                 onClick={() => setIsSubmitted(false)}
//               >
//                 Try a different email
//               </Button>
//               <p className="text-sm text-center text-muted-foreground mt-4">
//                 <Link to="/login" className="text-primary hover:underline">
//                   Back to login
//                 </Link>
//               </p>
//             </CardContent>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;
