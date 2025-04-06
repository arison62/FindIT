import { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { get, post } from "@/api/client";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useUser } from "@/hooks/use-user";

// Validation schema basé sur le modèle mongoose
const formSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit comporter au moins 3 caractères")
    .max(100),
  description: z
    .string()
    .min(10, "La description doit comporter au moins 10 caractères"),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  address: z.string().min(5, "Veuillez indiquer une adresse valide"),
  date_found: z.string().optional(),
  is_anonymous: z.boolean(),
  status: z.enum(["found", "lost"]),
  images: z.array(z.any()).min(1, "Veuillez ajouter au moins une image"),
});

const AddPost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);
  const {is_logged_in} = useUser()

  // Initialiser le formulaire
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      address: "",
      date_found: format(new Date(), "yyyy-MM-dd"),
      is_anonymous: false,
      status: "found",
      images: [],
    },
  });
 useEffect(()=>{
  // redirect if not login
  if(!is_logged_in){
    toast("Vous devez etre connecte", {
      description: "Veuillez vous connecter"
    });
    navigate("/login")
  }
 }, [])
  // Charger les catégories depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await get("/api/posts/categories");
        if (typeof response.error == "boolean" && response.error) {
          toast(response.message || "Une erreur reseau est survenu", {
            description: "Veuillez rafraîchir la page.",
            duration: 5000,
            icon: "⚠️",
          });
          return;
        }
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        toast("Erreur lors du chargement des catégories", {
          description: "Veuillez rafraîchir la page.",
          duration: 5000,
          icon: "⚠️",
        });
      }
    };

    fetchCategories();
  }, []);

  // Gérer le téléchargement des images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast("Trop d'images", {
        description: "Vous ne pouvez télécharger que 5 images maximum.",
        duration: 5000,
        icon: "⚠️",
      });
      return;
    }

    // Créer des aperçus d'images
    const newPreviews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        if (newPreviews.length === files.length) {
          setPreviewImages(newPreviews);
          form.setValue("images", files);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Supprimer une image de la liste
  const removeImage = (index) => {
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);

    const currentImages = form.getValues("images");
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    form.setValue("images", newImages);
  };

  // Gérer la soumission du formulaire
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Créer un FormData pour envoyer les fichiers
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("address", data.address);
      formData.append("date_found", data.date_found);
      formData.append("is_anonymous", data.is_anonymous.toString());
      formData.append("status", data.status);

      // Ajouter les images au formData
      data.images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      // Envoyer à l'API
      const response = await post("/api/posts/create", formData);

      if (response.status === 201) {
        toast("Publication réussie", {
          description: "Votre objet a été publié avec succès.",
          duration: 5000,
          icon: "✅",
        });
        navigate("/");
      } else {
        throw new Error(response.message || "Une erreur est survenue");
      }
    } catch (error) {
      toast("Échec de la publication", {
        description: error.message || "Veuillez réessayer plus tard.",
        duration: 5000,
        icon: "⚠️",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Publier un objet</h1>
        <p className="text-gray-500">
          Partagez les détails de l'objet que vous avez trouvé ou perdu
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Type d'annonce (Trouvé/Perdu) */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Type d'annonce</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="found" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        J'ai trouvé un objet
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="lost" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        J'ai perdu un objet
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Titre */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre de l'annonce</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Clés trouvées près de la gare"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Décrivez l'objet en détail (couleur, marque, état, etc.)"
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Catégorie */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Adresse */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Où l'objet a été trouvé/perdu"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date de découverte */}
          <FormField
            control={form.control}
            name="date_found"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Date de{" "}
                  {form.watch("status") === "found" ? "découverte" : "perte"}
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Publication anonyme */}
          <FormField
            control={form.control}
            name="is_anonymous"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Publication anonyme</FormLabel>
                  <FormDescription>
                    Votre nom n'apparaîtra pas dans l'annonce.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Upload d'images */}
          <FormField
            control={form.control}
            name="images"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Images de l'objet (maximum 5)</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-20 border-dashed"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        multiple
                      />
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-6 h-6 text-gray-500 mb-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span>Ajouter des photos</span>
                      </div>
                    </Button>

                    {/* Aperçu des images */}
                    {previewImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {previewImages.map((src, index) => (
                          <Card
                            key={index}
                            className="relative overflow-hidden"
                          >
                            <CardContent className="p-0">
                              <img
                                src={src}
                                alt={`Aperçu ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                                onClick={() => removeImage(index)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M18 6 6 18" />
                                  <path d="m6 6 12 12" />
                                </svg>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bouton de soumission */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-700"
          >
            {loading ? "Publication en cours..." : "Publier l'annonce"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddPost;
