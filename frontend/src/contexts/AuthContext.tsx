
// import { createContext, useContext, useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabase';
// import type { User } from '@/types/index';
// import { toast } from "sonner"

// import { Navigate, useLocation } from 'react-router';

// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   signIn: (email: string, password: string) => Promise<void>;
//   signUp: (email: string, password: string, fullName: string) => Promise<void>;
//   signOut: () => Promise<void>;
//   resetPassword: (email: string) => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {
//     // Check active session
//     const checkSession = async () => {
//       const { data, error } = await supabase.auth.getSession();
      
//       if (error) {
//         console.error('Error checking session:', error);
//         setLoading(false);
//         return;
//       }

//       if (data.session) {
//         const { data: userData, error: userError } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('id', data.session.user.id)
//           .single();

//         if (userError) {
//           console.error('Error fetching user profile:', userError);
//         } else if (userData) {
//           setUser(userData as User);
//         }
//       }
      
//       setLoading(false);
//     };

//     checkSession();

//     // Listen for auth changes
//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (event === 'SIGNED_IN' && session) {
//           const { data: userData, error: userError } = await supabase
//             .from('profiles')
//             .select('*')
//             .eq('id', session.user.id)
//             .single();

//           if (userError) {
//             console.error('Error fetching user profile:', userError);
//           } else if (userData) {
//             setUser(userData as User);
//           }
//         } else if (event === 'SIGNED_OUT') {
//           setUser(null);
//         }
//       }
//     );

//     return () => {
//       authListener.subscription.unsubscribe();
//     };
//   }, []);

//   const signIn = async (email: string, password: string) => {
//     // console.log("signIn", email, password);
//     setLoading(true);
//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       console.log("signIn", error);

//       if (error) throw error;
//       toast.success("Welcome back!", {
//         description: "You have successfully signed in.",
//       });
//     } catch (error: any) {
//       toast.error("Error signing in", {
//         description: error.message,
//       });
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signUp = async (email: string, password: string, fullName: string) => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: {
//             full_name: fullName,
//           },
//         },
//       });

//       if (error) throw error;

//       if (data.user) {
//         // Create a profile for the new user
//         await supabase.from('profiles').insert({
//           id: data.user.id,
//           email: email,
//           full_name: fullName,
//           created_at: new Date().toISOString(),
//         });
//       }

//       toast.success("Account created", {
//         description: "Check your email to confirm your account.",
//       });
//     } catch (error: any) {
//       toast.error("Error signing up", {
//         description: error.message,
//       });
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signOut = async () => {
//     setLoading(true);
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//       setUser(null);
//       toast.success("Signed out", {
//         description: "You have been signed out successfully.",
//       });
//     } catch (error: any) {
//       toast.error("Error signing out", {
//         description: error.message,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetPassword = async (email: string) => {
//     setLoading(true);
//     try {
//       const { error } = await supabase.auth.resetPasswordForEmail(email, {
//         redirectTo: `${window.location.origin}/reset-password`,
//       });
      
//       if (error) throw error;
      
//       toast.success("Password reset email sent", {
//         description: "Check your email for the reset link.",
//       });
//     } catch (error: any) {
//       toast.error("Error resetting password", {
//         description: error.message,
//       });
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
//   const { user, loading } = useAuth();
//   const location = useLocation();
  
//   if (loading) {
//     return <div className="flex h-screen items-center justify-center">Loading...</div>;
//   }
  
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }
  
//   return <>{children}</>;
// };
