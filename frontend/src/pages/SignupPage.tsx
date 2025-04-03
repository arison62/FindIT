import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {z} from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { post } from "@/api/client";

const formSchema = z.object({
    name: z.string().min(3, "Nom trop court"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Mot de passe trop court"),
})

const SignupPage = () => {
  const navigate = useNavigate();
      const [error, setError] = useState<string | null>(null);
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
                console.log(data);
            }
        }
        sendData();
    }, [loading]);

const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
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
                        </FormItem>
                    )}
                >

                </FormField>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-900">Creer un compte</Button>
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