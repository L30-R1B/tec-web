import Button from "@/app/components/button";
import RoomsCarousel from "@/app/components/RoomsCarousel";

export default function ChooseRoom() {
    return (
        <div className="page-container">
            <header>
                <nav className="navbar">
                    <div className="navbar-content" style={{ width: "100%" }}>
                        <img
                            src="/bingo-logo.png"
                            alt="logo"
                            className="navbar-logo"
                        />

                        <div className="navbar-links">
                            <a className="nav-links">Como jogar</a>
                            <a className="nav-links">Salas</a>
                            <a className="nav-links">Minha conta</a>
                        </div>

                        <div style={{ marginLeft: "auto", paddingRight: "40px" }}>
                            <Button variant="primary">Sair</Button>
                        </div>
                    </div>
                </nav>
            </header>

            <main>
                <div className="choose-room-container">
                    <h1 className="title">Escolha sua sala e parta para a diversão!</h1>
                    <RoomsCarousel />
                </div>
            </main>
        </div>
    );
}