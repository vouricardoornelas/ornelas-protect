// OrnelasProtectApp.jsx - Aplicação completa pronta para deploy

// IMPORTS
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// IMAGENS DE FUNDO POR SERVIÇO
const bgImages = {
  default: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80",
  "Seguros": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80",
  "Mediação Imobiliária": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
  "Mediação Automóvel": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80",
  "Eventos": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
};

const serviceInfo = {
  default: { title: "Bem-vindo à Ornelas Protect", subtitle: "As suas decisões protegidas pela experiência", tags: ["Seguros", "Imobiliária", "Automóvel", "Eventos"] },
  "Seguros": { title: "Seguros para a sua tranquilidade", subtitle: "Protegemos o que mais importa para si e para a sua família", tags: ["Vida", "Auto", "Saúde", "Habitação", "PETS", "Multicare", "Condomínios", "Acidentes Pessoais", "ENI"] },
  "Mediação Imobiliária": { title: "O imóvel dos seus sonhos", subtitle: "Encontramos a melhor oportunidade no mercado para si", tags: ["Compra", "Venda", "Apartamentos", "Casas", "Terrenos"] },
  "Mediação Automóvel": { title: "O carro certo para si", subtitle: "As melhores marcas com as melhores condições de financiamento", tags: ["Novos", "Usados", "Financiamento", "Todas as marcas"] },
  "Eventos": { title: "Momentos inesquecíveis", subtitle: "Organizamos o seu evento com todo o detalhe e dedicação", tags: ["Casamentos", "Batizados", "Eventos Empresariais"] },
};

const concelhosPorZona = {
  "Continente": [
    "Abrantes","Águeda","Aguiar da Beira","Alandroal","Albergaria-a-Velha","Albufeira","Alcácer do Sal","Alcanena","Alcobaça","Alcochete","Alcoutim","Alenquer","Alfândega da Fé","Alijó","Aljezur","Aljustrel","Almada","Almeida","Almeirim","Almodôvar","Alpiarça","Alter do Chão","Alvaiázere","Alvito","Amadora","Amarante","Amares","Anadia","Ansião","Arcos de Valdevez","Arganil","Armamar","Arouca","Arraiolos","Arronches","Arruda dos Vinhos","Aveiro","Avis","Azambuja",
    "Baião","Barcelos","Barrancos","Barreiro","Beja","Belmonte","Benavente","Bombarral","Borba","Braga","Bragança","Cabeceiras de Basto","Cadaval","Caldas da Rainha","Caminha","Cantanhede","Carrazeda de Ansiães","Carregal do Sal","Cartaxo","Cascais","Castelo Branco","Castelo de Paiva","Castelo de Vide","Castro Daire","Castro Marim","Castro Verde","Celorico da Beira","Celorico de Basto","Chaves","Cinfães","Coimbra","Condeixa-a-Nova","Constância","Coruche","Covilhã","Crato","Cuba",
    "Elvas","Entroncamento","Espinho","Esposende","Estarreja","Estremoz","Évora","Fafe","Faro","Felgueiras","Ferreira do Alentejo","Ferreira do Zêzere","Figueira da Foz","Figueira de Castelo Rodrigo","Figueiró dos Vinhos","Fornos de Algodres","Freixo de Espada à Cinta","Fronteira","Fundão",
    "Gavião","Góis","Gondomar","Gouveia","Grândola","Guarda","Guimarães","Idanha-a-Nova","Ílhavo","Lagos","Lamego","Leiria","Lisboa","Loulé","Loures","Lousã","Lousada","Mação","Macedo de Cavaleiros","Mafra","Maia","Mangualde","Manteigas","Marco de Canaveses","Marinha Grande","Marvão","Matosinhos","Mealhada","Meda","Melgaço","Mesão Frio","Miranda do Corvo","Miranda do Douro","Mirandela","Mogadouro","Moimenta da Beira","Moita","Monção","Monchique","Mondim de Basto","Monforte","Montalegre","Montemor-o-Novo","Montemor-o-Velho","Montijo","Mora","Mortágua","Moura","Mourão","Murça","Murtosa",
    "Nazaré","Nelas","Nisa","Óbidos","Odemira","Odivelas","Oeiras","Oleiros","Olhão","Oliveira de Azeméis","Oliveira de Frades","Oliveira do Bairro","Oliveira do Hospital","Ourém","Ourique","Ovar",
    "Paços de Ferreira","Palmela","Pampilhosa da Serra","Paredes","Paredes de Coura","Pedrógão Grande","Penacova","Penafiel","Penalva do Castelo","Penamacor","Penedono","Penela","Peniche","Peso da Régua","Pinhel","Pombal","Ponte da Barca","Ponte de Lima","Ponte de Sor","Portalegre","Portel","Portimão","Porto","Porto de Mós","Póvoa de Lanhoso","Póvoa de Varzim","Proença-a-Nova",
    "Redondo","Reguengos de Monsaraz","Resende","Ribeira de Pena","Rio Maior","Sabrosa","Sabugal","Salvaterra de Magos","Santa Comba Dão","Santa Maria da Feira","Santa Marta de Penaguião","Santarém","Santiago do Cacém","Santo Tirso","São Brás de Alportel","São João da Madeira","São João da Pesqueira","São Pedro do Sul","Sardoal","Sátão","Seia","Seixal","Serpa","Sernancelhe","Sesimbra","Setúbal","Sever do Vouga","Silves","Sines","Sintra","Sobral de Monte Agraço","Soure","Sousel",
    "Tábua","Tabuaço","Tarouca","Tavira","Terras de Bouro","Tomar","Tondela","Torre de Moncorvo","Torres Novas","Torres Vedras","Trancoso","Trofa","Vagos","Vale de Cambra","Valença","Valongo","Valpaços","Vendas Novas","Viana do Alentejo","Viana do Castelo","Vidigueira","Vieira do Minho","Vila de Rei","Vila do Bispo","Vila do Conde","Vila Flor","Vila Franca de Xira","Vila Nova da Barquinha","Vila Nova de Cerveira","Vila Nova de Famalicão","Vila Nova de Foz Côa","Vila Nova de Gaia","Vila Nova de Paiva","Vila Nova de Poiares","Vila Pouca de Aguiar","Vila Real","Vila Real de Santo António","Vila Velha de Ródão","Vila Verde","Vila Viçosa","Vimioso","Vinhais","Viseu","Vizela"
  ],
  "Madeira": ["Calheta","Câmara de Lobos","Funchal","Machico","Ponta do Sol","Porto Moniz","Porto Santo","Ribeira Brava","Santa Cruz","Santana","São Vicente"],
  "Açores": ["Angra do Heroísmo","Calheta (São Jorge)","Corvo","Horta","Lagoa (São Miguel)","Lajes das Flores","Lajes do Pico","Madalena","Nordeste","Ponta Delgada","Povoação","Praia da Vitória","Ribeira Grande","Santa Cruz da Graciosa","Santa Cruz das Flores","São Roque do Pico","Velas","Vila do Porto","Vila Franca do Campo"]
};

// APP PRINCIPAL
export default function OrnelasProtectApp() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("form");
  const [currentService, setCurrentService] = useState("default");
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => { onAuthStateChanged(auth, setUser); }, []);

  // Se clicar em Leads ou Privacidade sem estar logado, mostra login
  if (showLogin && !user) {
    return <Login onBack={() => setShowLogin(false)} />;
  }

  return (
    <MainApp
      user={user}
      view={view}
      setView={(v) => {
        if ((v === "dashboard" || v === "privacy") && !user) {
          setShowLogin(true);
        } else {
          setView(v);
          setShowLogin(false);
        }
      }}
      currentService={currentService}
      setCurrentService={setCurrentService}
    />
  );
}

// LOGIN COMPONENT
function Login({ onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      alert("Email ou password incorretos.");
    }
  };
  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 relative items-center justify-center" style={{backgroundImage: `url(${bgImages.default})`, backgroundSize: "cover", backgroundPosition: "center"}}>
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="relative text-white text-center p-8">
          <img src="/Logo_Ornelas_Protect_final3.png" className="w-64 mx-auto mb-6 rounded-xl shadow-lg" />
          <h1 className="text-3xl font-bold mb-2">Ornelas Protect</h1>
          <p className="text-blue-200 text-lg">As suas decisões protegidas pela experiência</p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Área Reservada</h2>
          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="block w-full mb-3 border border-gray-300 p-3 rounded-lg" />
          <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} className="block w-full mb-4 border border-gray-300 p-3 rounded-lg" />
          <button onClick={login} className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition mb-3">Entrar</button>
          {onBack && <button onClick={onBack} className="w-full text-gray-500 text-sm hover:text-gray-700 transition">← Voltar ao formulário</button>}
        </div>
      </div>
    </div>
  );
}

// NAVBAR COMPONENT
function NavBar({ view, setView, user }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-blue-900 text-white px-4 py-2 flex items-center shadow relative">
      {/* Logo clicável */}
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 focus:outline-none">
        <img src="/Logo_Ornelas_Protect_final3.png" className="w-10 h-10 rounded-lg shadow" />
      </button>

      {/* Menu dropdown */}
      {open && (
        <div className="absolute top-14 left-2 bg-white text-gray-800 rounded-xl shadow-2xl z-50 min-w-48 overflow-hidden">
          <button onClick={() => { setView("form"); setOpen(false); }} className={`w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition border-b border-gray-100 ${view==="form" ? "font-semibold text-blue-700" : ""}`}>
            📋 Formulário
          </button>
          <button onClick={() => { setView("dashboard"); setOpen(false); }} className={`w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition border-b border-gray-100 ${view==="dashboard" ? "font-semibold text-blue-700" : ""}`}>
            📊 Leads {!user && "🔒"}
          </button>
          <button onClick={() => { setView("privacy"); setOpen(false); }} className={`w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition border-b border-gray-100 ${view==="privacy" ? "font-semibold text-blue-700" : ""}`}>
            🔏 Política de Privacidade
          </button>
          {user
            ? <button onClick={() => { signOut(auth); setOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition">🚪 Logout</button>
            : <button onClick={() => { setView("dashboard"); setOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-blue-700 font-semibold hover:bg-blue-50 transition">🔑 Login</button>
          }
        </div>
      )}

      {/* Fechar menu ao clicar fora */}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
}

// Mapeamento completo de tags → campos do formulário
const tagToFields = {
  // Categorias principais
  "Seguros":              { service: "Seguros" },
  "Imobiliária":          { service: "Mediação Imobiliária" },
  "Automóvel":            { service: "Mediação Automóvel" },
  "Eventos":              { service: "Eventos" },
  // Seguros — sub-categorias
  "Vida":                 { service: "Seguros", subcategory: "Vida" },
  "Auto":                 { service: "Seguros", subcategory: "Auto" },
  "Saúde":                { service: "Seguros", subcategory: "Saúde" },
  "Habitação":            { service: "Seguros", subcategory: "Habitação" },
  "PETS":                 { service: "Seguros", subcategory: "PETS" },
  "Multicare":            { service: "Seguros", subcategory: "Multicare" },
  "Condomínios":          { service: "Seguros", subcategory: "Condomínios" },
  "Acidentes Pessoais":   { service: "Seguros", subcategory: "Acidentes Pessoais" },
  "ENI":                  { service: "Seguros", subcategory: "ENI" },
  // Imobiliária — sub-categorias
  "Compra":               { service: "Mediação Imobiliária", operacao: "Compra" },
  "Venda":                { service: "Mediação Imobiliária", operacao: "Venda" },
  "Apartamentos":         { service: "Mediação Imobiliária", subcategory: "Apartamento" },
  "Casas":                { service: "Mediação Imobiliária", subcategory: "Casa" },
  "Terrenos":             { service: "Mediação Imobiliária", subcategory: "Terreno" },
  // Automóvel — sub-categorias
  "Novos":                { service: "Mediação Automóvel", subcategory: "Novo" },
  "Usados":               { service: "Mediação Automóvel", subcategory: "Usado" },
  "Financiamento":        { service: "Mediação Automóvel", financiamento: "Sim" },
  "Todas as marcas":      { service: "Mediação Automóvel" },
  // Eventos — sub-categorias
  "Casamentos":           { service: "Eventos", subcategory: "Casamento" },
  "Batizados":            { service: "Eventos", subcategory: "Batizado" },
  "Eventos Empresariais": { service: "Eventos", subcategory: "Evento de Empresa" },
};

// MAIN APP COMPONENT
function MainApp({ user, view, setView, currentService, setCurrentService }) {
  const bg = bgImages[currentService] || bgImages.default;
  const info = serviceInfo[currentService] || serviceInfo.default;

  const handleTagClick = (tag) => {
    const fields = tagToFields[tag];
    if (fields) {
      const serviceValue = fields.service;
      setCurrentService(serviceValue);
      setView("form");
      // Passa os campos para o formulário via evento customizado
      window.__ornelasTagFields = fields;
      window.dispatchEvent(new Event("ornelas-tag-click"));
      setTimeout(() => {
        const el = document.getElementById("formulario");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  // Não passa o serviço ao formulário via tag — só muda o painel esquerdo

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <NavBar view={view} setView={setView} user={user} />

      {/* Conteúdo */}
      {view === "form" ? (
        <div className="flex flex-1">
          <div className="hidden md:flex w-1/2 relative flex-col items-center justify-center" style={{backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center"}}>
            <div className="absolute inset-0 bg-blue-900/65" />
            <div className="relative text-white text-center p-10">
              <img src="/Logo_Ornelas_Protect_final3.png" className="w-72 mx-auto mb-6 rounded-xl shadow-lg" />
              <h2 className="text-3xl font-bold mb-3">{info.title}</h2>
              <p className="text-blue-100 text-lg mb-6">{info.subtitle}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {info.tags.map(tag => {
                  const isClickable = !!tagToFields[tag];
                  return isClickable ? (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="bg-white/20 hover:bg-white/40 text-white text-sm px-3 py-1 rounded-full border border-white/30 transition cursor-pointer"
                    >
                      {tag}
                    </button>
                  ) : (
                    <span key={tag} className="bg-white/20 text-white text-sm px-3 py-1 rounded-full border border-white/30">{tag}</span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 bg-gray-50 flex items-start justify-center p-6 overflow-y-auto">
            <ContactForm onServiceChange={setCurrentService} selectedService={currentService} />
          </div>
        </div>
      ) : view === "dashboard" ? (
        <div className="flex-1 bg-gray-100 p-4 overflow-y-auto"><Dashboard /></div>
      ) : (
        <div className="flex-1 bg-gray-100 p-4 overflow-y-auto"><PrivacyPolicy /></div>
      )}
    </div>
  );
}

// CONTACT FORM COMPONENT
function ContactForm({ onServiceChange, selectedService }) {
  const emptyForm = {
    name: "", email: "", phone: "", service: "",
    subcategory: "", operacao: "", fracao: "",
    zonaRegiao: "", concelho: "",
    areaTerreno: "", efeitoTerreno: "",
    marca: "", combustivel: "", ivaDedutivel: "", preco: "", financiamento: "", prestacao: "", kms: "",
    eventoPessoas: "", eventoZona: "", eventoValorPessoa: "",
    message: "", consent: false
  };
  const [form, setForm] = useState(emptyForm);
  const f = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  // Preenche o formulário quando o utilizador clica numa tag
  useEffect(() => {
    const handler = () => {
      const fields = window.__ornelasTagFields;
      if (!fields) return;
      setForm(prev => ({
        ...emptyForm,
        name: prev.name,
        email: prev.email,
        phone: prev.phone,
        message: prev.message,
        consent: prev.consent,
        ...fields,
      }));
      if (fields.service) onServiceChange(fields.service);
      window.__ornelasTagFields = null;
    };
    window.addEventListener("ornelas-tag-click", handler);
    return () => window.removeEventListener("ornelas-tag-click", handler);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.consent) return alert("Consentimento obrigatório (RGPD)");
    await addDoc(collection(db, "leads"), { ...form, status: "novo", notes: "", date: new Date().toISOString() });
    alert("Pedido recebido. Vamos entrar em contacto brevemente.");
    setForm(emptyForm);
    onServiceChange("default");
  };

  const sel = "w-full mb-2 p-2 border border-gray-300 rounded-lg bg-white text-sm";
  const inp = "w-full mb-2 p-2 border border-gray-300 rounded-lg bg-white text-sm";

  return (
    <form id="formulario" onSubmit={submit} className="w-full max-w-md py-4">
      <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-gray-800">Pedido de Contacto</h2>{form.service && (<button type="button" onClick={() => { setForm(emptyForm); onServiceChange("default"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1 rounded-full transition">← Início</button>)}</div>
      <input placeholder="Nome" value={form.name} onChange={e => f("name", e.target.value)} className={inp} />
      <input placeholder="Email" value={form.email} onChange={e => f("email", e.target.value)} className={inp} />
      <input placeholder="Telefone" value={form.phone} onChange={e => f("phone", e.target.value)} className={inp} />
      <select value={form.service} onChange={e => { const s = e.target.value; setForm({...emptyForm, name: form.name, email: form.email, phone: form.phone, message: form.message, consent: form.consent, service: s}); onServiceChange(s || "default"); }} className={sel}>
        <option value="">Tipo de serviço</option>
        <option value="Seguros">Seguros</option>
        <option value="Mediação Imobiliária">Mediação Imobiliária</option>
        <option value="Mediação Automóvel">Mediação Automóvel</option>
        <option value="Eventos">Eventos</option>
      </select>

      {/* SEGUROS */}
      {form.service === "Seguros" && (
        <select value={form.subcategory} onChange={e => f("subcategory", e.target.value)} className={sel}>
          <option value="">Tipo de seguro</option>
          <option value="Vida">Vida</option>
          <option value="Auto">Auto</option>
          <option value="Moto">Moto</option>
          <option value="Saúde">Saúde</option>
          <option value="Multicare">Multicare</option>
          <option value="Habitação">Habitação</option>
          <option value="Condomínios">Condomínios</option>
          <option value="Acidentes Pessoais">Acidentes Pessoais</option>
          <option value="PETS">PETS (Animais de Estimação)</option>
          <option value="ENI">ENI (Trabalhador Independente)</option>
          <option value="Poupança">Poupança</option>
          <option value="Empresas - Acidentes de Trabalho">Empresas - Acidentes de Trabalho</option>
          <option value="Empresas - Responsabilidade Civil">Empresas - Responsabilidade Civil</option>
          <option value="Outro">Outro</option>
        </select>
      )}

      {/* IMOBILIÁRIA */}
      {form.service === "Mediação Imobiliária" && (
        <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-2">Brevemente Disponível</p>
      )}

      {/* AUTOMÓVEL */}
      {form.service === "Mediação Automóvel" && (
        <>
          <select value={form.subcategory} onChange={e => f("subcategory", e.target.value)} className={sel}>
            <option value="">Novo ou Usado?</option>
            <option value="Novo">Novo</option><option value="Usado">Usado</option>
          </select>
          <select value={form.marca} onChange={e => f("marca", e.target.value)} className={sel}>
            <option value="">Marca</option>
            <option value="Alfa Romeo">Alfa Romeo</option><option value="Audi">Audi</option><option value="BMW">BMW</option>
            <option value="Chevrolet">Chevrolet</option><option value="Chrysler">Chrysler</option><option value="Citroën">Citroën</option>
            <option value="Cupra">Cupra</option><option value="Dacia">Dacia</option><option value="DS">DS</option>
            <option value="Ferrari">Ferrari</option><option value="Fiat">Fiat</option><option value="Ford">Ford</option>
            <option value="Honda">Honda</option><option value="Hyundai">Hyundai</option><option value="Jaguar">Jaguar</option>
            <option value="Jeep">Jeep</option><option value="Kia">Kia</option><option value="Lamborghini">Lamborghini</option>
            <option value="Land Rover">Land Rover</option><option value="Lexus">Lexus</option><option value="Maserati">Maserati</option>
            <option value="Mazda">Mazda</option><option value="Mercedes-Benz">Mercedes-Benz</option><option value="Mini">Mini</option>
            <option value="Mitsubishi">Mitsubishi</option><option value="Nissan">Nissan</option><option value="Opel">Opel</option>
            <option value="Peugeot">Peugeot</option><option value="Porsche">Porsche</option><option value="Renault">Renault</option>
            <option value="Seat">Seat</option><option value="Skoda">Skoda</option><option value="Smart">Smart</option>
            <option value="Subaru">Subaru</option><option value="Suzuki">Suzuki</option><option value="Tesla">Tesla</option>
            <option value="Toyota">Toyota</option><option value="Volkswagen">Volkswagen</option><option value="Volvo">Volvo</option>
            <option value="Outra">Outra</option>
          </select>
          <select value={form.combustivel} onChange={e => f("combustivel", e.target.value)} className={sel}>
            <option value="">Combustível</option>
            <option value="Gasolina">Gasolina</option><option value="Diesel">Diesel</option>
            <option value="Híbrido">Híbrido</option><option value="Híbrido Plug-in">Híbrido Plug-in</option>
            <option value="Elétrico">Elétrico</option><option value="Outro">Outro</option>
          </select>
          <select value={form.ivaDedutivel} onChange={e => f("ivaDedutivel", e.target.value)} className={sel}>
            <option value="">IVA Dedutível?</option>
            <option value="Sim">Sim</option><option value="Não">Não</option>
          </select>
          <select value={form.preco} onChange={e => f("preco", e.target.value)} className={sel}>
            <option value="">Intervalo de preço</option>
            <option value="Até 10.000€">Até 10.000€</option>
            <option value="10.000€ - 20.000€">10.000€ - 20.000€</option>
            <option value="20.000€ - 35.000€">20.000€ - 35.000€</option>
            <option value="35.000€ - 50.000€">35.000€ - 50.000€</option>
            <option value="Mais de 50.000€">Mais de 50.000€</option>
          </select>
          <select value={form.financiamento} onChange={e => f("financiamento", e.target.value)} className={sel}>
            <option value="">Precisa de financiamento?</option>
            <option value="Sim">Sim</option><option value="Não">Não</option>
          </select>
          {form.financiamento === "Sim" && (
            <input placeholder="Valor de prestação desejado (€/mês)" value={form.prestacao} onChange={e => f("prestacao", e.target.value)} className={inp} />
          )}
          {form.subcategory === "Usado" && (
            <select value={form.kms} onChange={e => f("kms", e.target.value)} className={sel}>
              <option value="">Máximo de quilómetros</option>
              <option value="Até 50.000 km">Até 50.000 km</option>
              <option value="Até 100.000 km">Até 100.000 km</option>
              <option value="Até 150.000 km">Até 150.000 km</option>
              <option value="Mais de 150.000 km">Mais de 150.000 km</option>
            </select>
          )}
        </>
      )}

      {/* EVENTOS */}
      {form.service === "Eventos" && (
        <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-2">Brevemente Disponível</p>
      )}

      <textarea placeholder="Mensagem" value={form.message} onChange={e => f("message", e.target.value)} className={inp} rows={3} />
      <label className="text-sm flex items-start gap-2 mb-4 text-gray-600">
        <input type="checkbox" checked={form.consent} onChange={e => f("consent", e.target.checked)} className="mt-1" />
        <span>Autorizo o tratamento dos meus dados para contacto comercial</span>
      </label>
      <button className="w-full bg-blue-700 text-white p-3 rounded-lg font-semibold hover:bg-blue-800 transition">Enviar Pedido</button>

      <div className="mt-6 text-center text-sm text-gray-500 border-t pt-4">
        <p className="mb-2">Caso prefira, pode entrar em contacto diretamente:</p>
        <a href="tel:+351913106033" className="block text-blue-700 font-semibold hover:underline">📞 91 310 60 33</a>
        <a href="https://wa.me/351913106033" target="_blank" rel="noreferrer" className="block text-green-600 font-semibold hover:underline mt-1">💬 WhatsApp 91 310 60 33</a>
      </div>
    </form>
  );
}

// DASHBOARD COMPONENT
function Dashboard() {
  const [leads, setLeads] = useState([]);
  const load = async () => {
    const data = await getDocs(collection(db, "leads"));
    setLeads(data.docs.map(d => ({ id: d.id, ...d.data() })));
  };
  useEffect(() => { load(); }, []);
  const remove = async (id) => { await deleteDoc(doc(db, "leads", id)); load(); };
  const updateStatus = async (id, status) => { await updateDoc(doc(db, "leads", id), { status }); load(); };
  const updateNotes = async (id, notes) => { await updateDoc(doc(db, "leads", id), { notes }); };
  const whatsapp = (lead) => {
    const { phone, name, service, subcategory, operacao, marca, combustivel, eventoPessoas } = lead;
    let contexto = "";
    if (service === "Seguros" && subcategory)
      contexto = `para um seguro de *${subcategory}*`;
    else if (service === "Seguros")
      contexto = `na área de *Seguros*`;
    else if (service === "Mediação Imobiliária" && subcategory && operacao)
      contexto = `para *${operacao}* de *${subcategory}*`;
    else if (service === "Mediação Imobiliária")
      contexto = `na área de *Mediação Imobiliária*`;
    else if (service === "Mediação Automóvel" && marca)
      contexto = `para um veículo *${subcategory || ""}* da marca *${marca}*${combustivel ? ` (${combustivel})` : ""}`;
    else if (service === "Mediação Automóvel")
      contexto = `na área de *Mediação Automóvel*`;
    else if (service === "Eventos" && subcategory)
      contexto = `para organização de *${subcategory}*${eventoPessoas ? ` com ${eventoPessoas}` : ""}`;
    else if (service === "Eventos")
      contexto = `na área de *Eventos*`;
    else
      contexto = `no seu pedido de contacto`;

    const msg = encodeURIComponent(`Olá ${name}! 👋\n\nRecebi o seu pedido de informação ${contexto}.\n\nEstamos disponíveis para ajudar!\n\nPodemos continuar por aqui no WhatsApp ou prefere que lhe liguemos?\n\n💬 Continuar no WhatsApp\n📞 Prefiro que me liguem`);
    window.open(`https://wa.me/351${phone}?text=${msg}`);
  };
  const stats = { total: leads.length, novo: leads.filter(l=>l.status==='novo').length, contactado: leads.filter(l=>l.status==='contactado').length, fechado: leads.filter(l=>l.status==='fechado').length };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-white p-3 rounded-xl shadow text-center"><p className="text-xs text-gray-500">Total</p><p className="text-2xl font-bold text-gray-800">{stats.total}</p></div>
        <div className="bg-yellow-50 p-3 rounded-xl shadow text-center"><p className="text-xs text-gray-500">Novos</p><p className="text-2xl font-bold text-yellow-600">{stats.novo}</p></div>
        <div className="bg-blue-50 p-3 rounded-xl shadow text-center"><p className="text-xs text-gray-500">Contactados</p><p className="text-2xl font-bold text-blue-600">{stats.contactado}</p></div>
        <div className="bg-green-50 p-3 rounded-xl shadow text-center"><p className="text-xs text-gray-500">Fechados</p><p className="text-2xl font-bold text-green-600">{stats.fechado}</p></div>
      </div>
      {leads.map(l => (
        <div key={l.id} className="bg-white border p-4 mb-3 rounded-xl shadow">
          <p className="text-lg font-bold text-gray-800">{l.name}</p>
          <p className="text-gray-500 text-sm">{l.email} · {l.phone}</p>
          <div className="mt-2 text-sm text-gray-700 grid grid-cols-2 gap-1">
            {l.service && <p>Serviço: <strong>{l.service}</strong></p>}
            {l.subcategory && <p>Subcategoria: <strong>{l.subcategory}</strong></p>}
            {l.operacao && <p>Operação: <strong>{l.operacao}</strong></p>}
            {l.fracao && <p>Tipologia: <strong>{l.fracao}</strong></p>}
            {l.zonaRegiao && <p>Zona: <strong>{l.zonaRegiao}</strong></p>}
            {l.concelho && <p>Concelho: <strong>{l.concelho}</strong></p>}
            {l.areaTerreno && <p>Área: <strong>{l.areaTerreno}</strong></p>}
            {l.efeitoTerreno && <p>Efeito: <strong>{l.efeitoTerreno}</strong></p>}
            {l.marca && <p>Marca: <strong>{l.marca}</strong></p>}
            {l.combustivel && <p>Combustível: <strong>{l.combustivel}</strong></p>}
            {l.ivaDedutivel && <p>IVA Dedutível: <strong>{l.ivaDedutivel}</strong></p>}
            {l.preco && <p>Preço: <strong>{l.preco}</strong></p>}
            {l.financiamento && <p>Financiamento: <strong>{l.financiamento}</strong></p>}
            {l.prestacao && <p>Prestação: <strong>{l.prestacao}</strong></p>}
            {l.kms && <p>Kms: <strong>{l.kms}</strong></p>}
            {l.eventoPessoas && <p>Pessoas: <strong>{l.eventoPessoas}</strong></p>}
            {l.eventoZona && <p>Zona evento: <strong>{l.eventoZona}</strong></p>}
            {l.eventoValorPessoa && <p>Valor/pessoa: <strong>{l.eventoValorPessoa}</strong></p>}
          </div>
          {l.message && <p className="text-sm text-gray-600 mt-1 italic">"{l.message}"</p>}
          <p className="text-sm mt-2">Status: <strong className={l.status==='novo'?'text-yellow-600':l.status==='contactado'?'text-blue-600':'text-green-600'}>{l.status}</strong></p>
          <textarea placeholder="Notas" defaultValue={l.notes} onBlur={e=>updateNotes(l.id,e.target.value)} className="w-full border border-gray-200 mt-2 p-2 rounded-lg text-sm bg-gray-50" />
          <div className="flex gap-2 mt-2 flex-wrap">
            <button onClick={()=>whatsapp(l)} className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition" title="Enviar mensagem WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.554 4.1 1.523 5.824L0 24l6.341-1.501A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.368l-.36-.214-3.726.882.916-3.618-.235-.372A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
              WhatsApp
            </button>
            <a href={`tel:+351${l.phone}`} className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition" title="Ligar">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.21 2.2z"/></svg>
              Ligar
            </a>
            <button onClick={()=>updateStatus(l.id,'contactado')} className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition">Contactado</button>
            <button onClick={()=>updateStatus(l.id,'fechado')} className="bg-green-700 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-800 transition">Fechado</button>
            <button onClick={()=>remove(l.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition">Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// PRIVACY POLICY COMPONENT
function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow mt-6 mb-10">
      <h2 className="font-bold text-2xl mb-1 text-blue-900">Política de Privacidade</h2>
      <p className="text-sm text-gray-400 mb-6">Ornelas Protect — em conformidade com o RGPD (Regulamento UE 2016/679)</p>

      <section className="mb-6">
        <h3 className="font-semibold text-lg text-blue-800 mb-2">1. Responsável pelo Tratamento</h3>
        <p className="text-gray-700">A <strong>Ornelas Protect</strong> é a entidade responsável pelo tratamento dos dados pessoais recolhidos através deste formulário, nos termos do Regulamento Geral sobre a Proteção de Dados (RGPD) — Regulamento (UE) 2016/679 do Parlamento Europeu e do Conselho, de 27 de abril de 2016.</p>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold text-lg text-blue-800 mb-2">2. Dados Recolhidos</h3>
        <p className="text-gray-700 mb-2">Recolhemos os seguintes dados pessoais:</p>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Nome completo</li>
          <li>Endereço de email</li>
          <li>Número de telefone</li>
          <li>Informações sobre o serviço pretendido</li>
          <li>Mensagem livre (opcional)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold text-lg text-blue-800 mb-2">3. Finalidade e Base Legal do Tratamento</h3>
        <p className="text-gray-700 mb-3">Os dados são tratados com as seguintes finalidades e bases legais:</p>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="text-left p-3 font-semibold text-blue-900">Finalidade</th>
                <th className="text-left p-3 font-semibold text-blue-900">Base Legal (RGPD)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100">
                <td className="p-3 text-gray-700">Responder ao pedido de contacto</td>
                <td className="p-3 text-gray-700">Art. 6.º, n.º 1, al. b) — Execução de pré-contrato</td>
              </tr>
              <tr className="border-t border-gray-100 bg-gray-50">
                <td className="p-3 text-gray-700">Contacto comercial e envio de propostas</td>
                <td className="p-3 text-gray-700">Art. 6.º, n.º 1, al. a) — Consentimento do titular</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="p-3 text-gray-700">Cumprimento de obrigações legais</td>
                <td className="p-3 text-gray-700">Art. 6.º, n.º 1, al. c) — Obrigação legal</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold text-lg text-blue-800 mb-2">4. Conservação dos Dados</h3>
        <p className="text-gray-700">Os dados pessoais são conservados pelo período estritamente necessário à prossecução das finalidades para que foram recolhidos, ou enquanto existir relação comercial ativa. Findo esse período, os dados serão eliminados ou anonimizados, salvo obrigação legal de conservação por período superior.</p>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold text-lg text-blue-800 mb-2">5. Partilha de Dados com Terceiros</h3>
        <p className="text-gray-700">Os dados pessoais não são vendidos, cedidos ou partilhados com terceiros para fins comerciais. Podem ser partilhados com prestadores de serviços tecnológicos (como a Google Firebase, utilizada para armazenamento seguro), que atuam como subcontratantes e estão sujeitos a acordos de proteção de dados adequados.</p>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold text-lg text-blue-800 mb-2">6. Direitos do Titular dos Dados</h3>
        <p className="text-gray-700 mb-2">Nos termos do RGPD, o titular dos dados tem os seguintes direitos:</p>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li><strong>Direito de acesso</strong> — saber quais os dados que temos sobre si</li>
          <li><strong>Direito de retificação</strong> — corrigir dados inexatos ou incompletos</li>
          <li><strong>Direito ao apagamento</strong> — solicitar a eliminação dos seus dados</li>
          <li><strong>Direito à limitação</strong> — restringir o tratamento em determinadas circunstâncias</li>
          <li><strong>Direito à portabilidade</strong> — receber os seus dados em formato estruturado</li>
          <li><strong>Direito de oposição</strong> — opor-se ao tratamento para fins de marketing direto</li>
          <li><strong>Direito de retirar o consentimento</strong> — em qualquer momento, sem prejuízo da licitude do tratamento anterior</li>
        </ul>
        <p className="text-gray-700 mt-2">Para exercer qualquer um destes direitos, contacte-nos através dos canais disponíveis. Responderemos no prazo máximo de 30 dias.</p>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold text-lg text-blue-800 mb-2">7. Segurança dos Dados</h3>
        <p className="text-gray-700">Implementamos medidas técnicas e organizativas adequadas para proteger os seus dados pessoais contra acesso não autorizado, perda, destruição ou divulgação. O armazenamento é realizado em servidores seguros com controlo de acesso restrito.</p>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold text-lg text-blue-800 mb-2">8. Reclamações</h3>
        <p className="text-gray-700">Se considerar que o tratamento dos seus dados pessoais viola o RGPD, tem o direito de apresentar reclamação à autoridade de controlo competente em Portugal: <strong>Comissão Nacional de Proteção de Dados (CNPD)</strong> — <a href="https://www.cnpd.pt" target="_blank" rel="noreferrer" className="text-blue-600 underline">www.cnpd.pt</a>.</p>
      </section>

      <section>
        <h3 className="font-semibold text-lg text-blue-800 mb-2">9. Alterações a esta Política</h3>
        <p className="text-gray-700">A presente Política de Privacidade pode ser atualizada periodicamente. Recomendamos a consulta regular deste documento.</p>
      </section>
    </div>
  );
}
