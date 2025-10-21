import LoginForm from "@/app/components/LoginForm";
import SocialButton from "@/app/components/SocialButton";

export default function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-sidebar">
        <img src="/bingo.jpg" alt="Bingo" className="login-image" />
      </div>

      <div className="login-form-container">
        <h1 className="login-title">Bem-vindo de volta!</h1>

        <LoginForm />

        <div className="login-divider">
          <div className="login-divider-line" />
          <span className="login-divider-text">OU</span>
          <div className="login-divider-line" />
        </div>

        <div className="social-buttons">
          <SocialButton src="/google.png" alt="Entrar com Google" />
          <SocialButton src="/facebook.png" alt="Entrar com Facebook" />
          <SocialButton src="/twitter.png" alt="Entrar com Twitter" />
        </div>

        <p className="login-signup-text">
          Ainda não faz parte?{" "}
          <a href="#" className="login-signup-link">
            Cadastre-se agora!
          </a>
        </p>
      </div>
    </div>
  );
}