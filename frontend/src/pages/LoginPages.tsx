import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { post } from "@/api/client";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(7, "Mot de passe doit avoir au moins 8 caractères"),
});
const LoginPages = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [send, setSend] = useState(false);
  const isFirstRender = useRef(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const sendData = async () => {
      setLoading(true);
      const data = await post<{ token: string }>("/api/auth/signin", {
        email: form.getValues("email"),
        password: form.getValues("password"),
      });

      if (data.status === 200) {
        localStorage.setItem("token", data.data.token);

        navigate("/");
      } else {
        toast(data.message || "Une erreur reseau est survenu", {
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
    };
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <h1 className="text-2xl font-bold">Se connecter</h1>
            <p className="text-gray-500">Connectez-vous à votre compte</p>
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
            ></FormField>
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
            ></FormField>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-900"
            >
              Se connecter
            </Button>
          </form>
          <div className="flex flex-col justify-between mt-4 items-center">
            <p className="text-gray-500">
              Pas encore de compte ?
              <Link to="/signup" className="text-blue-500 hover:text-blue-700">
                {" "}
                S'inscrire
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPages;
