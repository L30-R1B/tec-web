// Em: src/app/page.tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redireciona o usuário da página inicial ("/") para a página de login
  redirect('/login');
}