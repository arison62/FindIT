import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {z} from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { post } from "@/api/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(3, "Nom trop court"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Mot de passe doit avoir minimum 8 caractères"),
})

const SignupPage = () => {
  const navigate = useNavigate();
      const [send, setSend] = useState(false);
      const [loading, setLoading] = useState(false);
      const isFirstRender = useRef(true);
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email: "",
        password: "",
        name: "",
    },
});

 useEffect(()=>{
        
        if(isFirstRender.current){
            
            isFirstRender.current = false;
            return;
        }
        const sendData = async () => {
            setLoading(true);
            const data =  await post<{token: string}>("/api/auth/signup", {
                email: form.getValues("email"),
                password: form.getValues("password"),
                name: form.getValues("name"),
            });

            if(data.status === 200){
                localStorage.setItem("token", data.data.token);
                console.log("Token: ", data);
                navigate("/");
            }else{
                toast( data.message || "Une erreur reseau est survenu", {
                    description: "Veuillez verifier vos identifiants",
                    duration: 5000,
                    icon: "⚠️",
          
                    action: {
                      label: "Fermer",
          
                      onClick: () => {
                        console.log("Toast closed");
                      },
                    },
                  });
            }
            setLoading(false);
        }
        sendData();
    }, [form, navigate, send]);

const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSend(!send);
    console.log(data);
};
return (
    <div className="max-w-screen w-full flex flex-col items-center justify-center">
        <div className="max-w-md w-full mt-8">
        <Form {...form}>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">S'inscrire</h1>
                <p className="text-gray-500">Creer un compte</p>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" {...field} />    
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                >

                </FormField>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom complet</FormLabel>
                            <FormControl>
                                <Input placeholder="Nom" {...field} />    
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                >

                </FormField>
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                                <Input placeholder="Mot de passe" {...field} />    
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                >

                </FormField>
                <Button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-900">Creer un compte</Button>
            </form>
            <div className="flex flex-col justify-between mt-4 items-center">
                
                <p className="text-gray-500">Vous avez deja un compte ? 
                    <Link to="/signin" className="text-blue-500 hover:text-blue-700"> Se connecter</Link>
                </p>
            </div>
            
        </Form>
        </div>
        
    </div>
);
}
export default SignupPage;