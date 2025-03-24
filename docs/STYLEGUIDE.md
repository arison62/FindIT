# Guide de style FindIT

## Frontend (React/TypeScript +  Tailwindcss/shadcn-ui)  

### 1. Composants React
```tsx
// Nommage PascalCase avec suffixe .tsx
export default function UserProfileCard({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handler avec type explicite
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ...
  };

  return (
    <Card className="w-[350px]"> {/* Classes Tailwind regroupées */}
      <CardHeader>
        <CardTitle className="text-primary">{user.name}</CardTitle> {/* shadcn-ui */}
      </CardHeader>
      {isLoading ? (
        <Skeleton className="h-[20px] w-[100px]" /> {/* Composants shadcn */}
      ) : (
        <CardContent>...</CardContent>
      )}
    </Card>
  );
}

## 2. Typage TypeScript

// Interfaces dans types/
interface ApiResponse<T> {
  error: boolean;
  message?: string;
  data?: T;
}

// Props avec interface dédiée
interface UserCardProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  onSelect: (id: string) => void;
}

3. Style tailwindcss  
- Utiliser les classes utilitaire directement
- Creer des variants dans index.css

---

## ⚙️ Backend (Node.js/Express)

### 1. Structure des Réponses API
typescript
{
    "error" : boolean | undefined
    "data": object | undefined,
    "message" : string | undefined
}
// Success (200 OK)
{
  "error": false,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "total": 15
    }
  }
}

// Error (400 Bad Request)
{
  "error": true,
  "message": "Coordonnées GPS invalides"
}
```
## 🔗 Ressources & Documentation

### Frontend Essentials
- **[React Official Docs](https://react.dev/learn)**: Bases de React avec TypeScript
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**: Guide complet du typage
- **[Tailwind CSS Docs](https://tailwindcss.com/docs/installation)**: Utilisation des classes utilitaires
- **[shadcn-ui Documentation](https://ui.shadcn.com/docs)**: Guide des composants modifiables


### Backend & API
- **[Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)**: Guide de performance
- **[REST API Standards](https://restfulapi.net/)**: Bonnes pratiques REST
- **[JWT Authentication Guide](https://jwt.io/introduction)**: Sécurisation des APIs

### Outils
- **[MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/)**: Base de données cloud




