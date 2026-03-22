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
  default: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80",
  "Seguros": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80",
  "Mediação Imobiliária": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80",
  "Mediação Automóvel": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80",
  "Eventos": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80",
};

// CONCELHOS POR ZONA
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
  useEffect(() => { onAuthStateChanged(auth, setUser); }, []);
  if (!user) return <Login />;
  return <MainApp />;
}

// LOGIN COMPONENT
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = async () => { await signInWithEmailAndPassword(auth, email, password); };
  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundImage: `url(${bgImages.default})`, backgroundSize: "cover", backgroundPosition: "center"}}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <img src="/Logo_Ornelas_Protect_final3.png" className="w-24 mx-auto mb-6" />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="block w-full mb-3 border border-gray-300 p-3 rounded-lg" />
        <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} className="block w-full mb-4 border border-gray-300 p-3 rounded-lg" />
        <button onClick={login} className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition">Entrar</button>
      </div>
    </div>
  );
}

// MAIN APP COMPONENT
function MainApp() {
  const [view, setView] = useState("form");
  const [currentService, setCurrentService] = useState("");
  const bg = bgImages[currentService] || bgImages.default;

  return (
    <div className="min-h-screen relative" style={{backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center", transition: "background-image 0.5s ease"}}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 p-4">
        <div className="flex gap-2 mb-4 items-center">
          <button onClick={() => signOut(auth)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Logout</button>
          <button onClick={() => setView("form")} className={`px-3 py-1 rounded transition ${view==="form" ? "bg-blue-700 text-white" : "bg-white/80 text-gray-800 hover:bg-white"}`}>Formulário</button>
          <button onClick={() => setView("dashboard")} className={`px-3 py-1 rounded transition ${view==="dashboard" ? "bg-blue-700 text-white" : "bg-white/80 text-gray-800 hover:bg-white"}`}>Leads</button>
          <button onClick={() => setView("privacy")} className={`px-3 py-1 rounded transition ${view==="privacy" ? "bg-blue-700 text-white" : "bg-white/80 text-gray-800 hover:bg-white"}`}>Política de Privacidade</button>
        </div>
        {view === "form" ? <ContactForm onServiceChange={setCurrentService} /> : view === "dashboard" ? <Dashboard /> : <PrivacyPolicy />}
      </div>
    </div>
  );
}

// CONTACT FORM COMPONENT
function ContactForm({ onServiceChange }) {
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

  const submit = async (e) => {
    e.preventDefault();
    if (!form.consent) return alert("Consentimento obrigatório (RGPD)");
    await addDoc(collection(db, "leads"), { ...form, status: "novo", notes: "", date: new Date().toISOString() });
    alert("Pedido recebido. Vamos entrar em contacto brevemente.");
    setForm(emptyForm);
    onServiceChange("");
  };

  const sel = "w-full mb-2 p-2 border border-gray-300 rounded-lg bg-white";
  const inp = "w-full mb-2 p-2 border border-gray-300 rounded-lg bg-white";

  return (
    <form onSubmit={submit} className="max-w-md mx-auto bg-white/95 backdrop-blur p-6 rounded-2xl shadow-2xl">
      <img src="/Logo_Ornelas_Protect_final3.png" className="w-28 mx-auto mb-4" />

      <input placeholder="Nome" value={form.name} onChange={e => f("name", e.target.value)} className={inp} />
      <input placeholder="Email" value={form.email} onChange={e => f("email", e.target.value)} className={inp} />
      <input placeholder="Telefone" value={form.phone} onChange={e => f("phone", e.target.value)} className={inp} />

      {/* SERVIÇO PRINCIPAL */}
      <select value={form.service} onChange={e => { const s = e.target.value; setForm({...emptyForm, name: form.name, email: form.email, phone: form.phone, message: form.message, consent: form.consent, service: s}); onServiceChange(s); }} className={sel}>
        <option value="">Tipo de serviço</option>
        <option value="Seguros">Seguros</option>
        <option value="Mediação Imobiliária">Mediação Imobiliária</option>
        <option value="Mediação Automóvel">Mediação Automóvel</option>
        <option value="Eventos">Eventos</option>
      </select>

      {/* ── SEGUROS ── */}
      {form.service === "Seguros" && (
        <select value={form.subcategory} onChange={e => f("subcategory", e.target.value)} className={sel}>
          <option value="">Tipo de seguro</option>
          <option value="Vida">Vida</option>
          <option value="Auto">Auto</option>
          <option value="Moto">Moto</option>
          <option value="Saúde">Saúde</option>
          <option value="Habitação">Habitação</option>
          <option value="Poupança">Poupança</option>
          <option value="Empresas - Acidentes de Trabalho">Empresas - Acidentes de Trabalho</option>
          <option value="Empresas - Responsabilidade Civil">Empresas - Responsabilidade Civil</option>
          <option value="Outro">Outro</option>
        </select>
      )}

      {/* ── MEDIAÇÃO IMOBILIÁRIA ── */}
      {form.service === "Mediação Imobiliária" && (
        <>
          <select value={form.operacao} onChange={e => f("operacao", e.target.value)} className={sel}>
            <option value="">Compra ou Venda?</option>
            <option value="Compra">Compra</option>
            <option value="Venda">Venda</option>
          </select>
          <select value={form.subcategory} onChange={e => f("subcategory", e.target.value)} className={sel}>
            <option value="">Tipo de imóvel</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Casa">Casa</option>
            <option value="Loja">Loja</option>
            <option value="Terreno">Terreno</option>
            <option value="Outro">Outro</option>
          </select>
          {(form.subcategory === "Apartamento" || form.subcategory === "Casa") && (
            <select value={form.fracao} onChange={e => f("fracao", e.target.value)} className={sel}>
              <option value="">Tipologia</option>
              <option value="T0">T0</option>
              <option value="T1">T1</option>
              <option value="T2">T2</option>
              <option value="T3">T3</option>
              <option value="T4">T4</option>
              <option value="T4+">T4+</option>
            </select>
          )}
          {form.subcategory === "Terreno" && (
            <>
              <input placeholder="Área pretendida (m²)" value={form.areaTerreno} onChange={e => f("areaTerreno", e.target.value)} className={inp} />
              <select value={form.efeitoTerreno} onChange={e => f("efeitoTerreno", e.target.value)} className={sel}>
                <option value="">Efeito do terreno</option>
                <option value="Construção Habitacional">Construção Habitacional</option>
                <option value="Armazéns">Armazéns</option>
                <option value="Empresarial">Empresarial</option>
                <option value="Outro">Outro</option>
              </select>
            </>
          )}
          {form.subcategory && (
            <>
              <select value={form.zonaRegiao} onChange={e => { f("zonaRegiao", e.target.value); f("concelho", ""); }} className={sel}>
                <option value="">Zona de interesse</option>
                <option value="Continente">Continente</option>
                <option value="Madeira">Madeira</option>
                <option value="Açores">Açores</option>
              </select>
              {form.zonaRegiao && (
                <select value={form.concelho} onChange={e => f("concelho", e.target.value)} className={sel}>
                  <option value="">Concelho</option>
                  {concelhosPorZona[form.zonaRegiao].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
            </>
          )}
        </>
      )}

      {/* ── MEDIAÇÃO AUTOMÓVEL ── */}
      {form.service === "Mediação Automóvel" && (
        <>
          <select value={form.subcategory} onChange={e => f("subcategory", e.target.value)} className={sel}>
            <option value="">Novo ou Usado?</option>
            <option value="Novo">Novo</option>
            <option value="Usado">Usado</option>
          </select>
          <select value={form.marca} onChange={e => f("marca", e.target.value)} className={sel}>
            <option value="">Marca</option>
            <option value="Alfa Romeo">Alfa Romeo</option>
            <option value="Audi">Audi</option>
            <option value="BMW">BMW</option>
            <option value="Chevrolet">Chevrolet</option>
            <option value="Chrysler">Chrysler</option>
            <option value="Citroën">Citroën</option>
            <option value="Cupra">Cupra</option>
            <option value="Dacia">Dacia</option>
            <option value="DS">DS</option>
            <option value="Ferrari">Ferrari</option>
            <option value="Fiat">Fiat</option>
            <option value="Ford">Ford</option>
            <option value="Honda">Honda</option>
            <option value="Hyundai">Hyundai</option>
            <option value="Jaguar">Jaguar</option>
            <option value="Jeep">Jeep</option>
            <option value="Kia">Kia</option>
            <option value="Lamborghini">Lamborghini</option>
            <option value="Land Rover">Land Rover</option>
            <option value="Lexus">Lexus</option>
            <option value="Maserati">Maserati</option>
            <option value="Mazda">Mazda</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Mini">Mini</option>
            <option value="Mitsubishi">Mitsubishi</option>
            <option value="Nissan">Nissan</option>
            <option value="Opel">Opel</option>
            <option value="Peugeot">Peugeot</option>
            <option value="Porsche">Porsche</option>
            <option value="Renault">Renault</option>
            <option value="Seat">Seat</option>
            <option value="Skoda">Skoda</option>
            <option value="Smart">Smart</option>
            <option value="Subaru">Subaru</option>
            <option value="Suzuki">Suzuki</option>
            <option value="Tesla">Tesla</option>
            <option value="Toyota">Toyota</option>
            <option value="Volkswagen">Volkswagen</option>
            <option value="Volvo">Volvo</option>
            <option value="Outra">Outra</option>
          </select>
          <select value={form.combustivel} onChange={e => f("combustivel", e.target.value)} className={sel}>
            <option value="">Combustível</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Diesel">Diesel</option>
            <option value="Híbrido">Híbrido</option>
            <option value="Híbrido Plug-in">Híbrido Plug-in</option>
            <option value="Elétrico">Elétrico</option>
            <option value="Outro">Outro</option>
          </select>
          <select value={form.ivaDedutivel} onChange={e => f("ivaDedutivel", e.target.value)} className={sel}>
            <option value="">IVA Dedutível?</option>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
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
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
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

      {/* ── EVENTOS ── */}
      {form.service === "Eventos" && (
        <>
          <select value={form.subcategory} onChange={e => f("subcategory", e.target.value)} className={sel}>
            <option value="">Tipo de evento</option>
            <option value="Casamento">Casamento</option>
            <option value="Batizado">Batizado</option>
            <option value="Evento de Empresa">Evento de Empresa</option>
            <option value="Outro">Outro</option>
          </select>
          {(form.subcategory === "Casamento" || form.subcategory === "Batizado" || form.subcategory === "Evento de Empresa") && (
            <>
              <select value={form.eventoPessoas} onChange={e => f("eventoPessoas", e.target.value)} className={sel}>
                <option value="">Número de pessoas</option>
                <option value="Até 50 pessoas">Até 50 pessoas</option>
                <option value="50 - 100 pessoas">50 - 100 pessoas</option>
                <option value="100 - 200 pessoas">100 - 200 pessoas</option>
                <option value="200 - 500 pessoas">200 - 500 pessoas</option>
                <option value="Mais de 500 pessoas">Mais de 500 pessoas</option>
              </select>
              <input placeholder="Zona de interesse" value={form.eventoZona} onChange={e => f("eventoZona", e.target.value)} className={inp} />
              <select value={form.eventoValorPessoa} onChange={e => f("eventoValorPessoa", e.target.value)} className={sel}>
                <option value="">Valor por pessoa disponível</option>
                <option value="Até 25€/pessoa">Até 25€/pessoa</option>
                <option value="25€ - 50€/pessoa">25€ - 50€/pessoa</option>
                <option value="50€ - 100€/pessoa">50€ - 100€/pessoa</option>
                <option value="100€ - 200€/pessoa">100€ - 200€/pessoa</option>
                <option value="Mais de 200€/pessoa">Mais de 200€/pessoa</option>
              </select>
            </>
          )}
        </>
      )}

      <textarea placeholder="Mensagem" value={form.message} onChange={e => f("message", e.target.value)} className={inp} />
      <label className="text-sm flex items-start gap-2 mb-3">
        <input type="checkbox" checked={form.consent} onChange={e => f("consent", e.target.checked)} className="mt-1" />
        <span>Autorizo o tratamento dos meus dados para contacto comercial</span>
      </label>
      <button className="w-full bg-blue-700 text-white p-3 rounded-lg font-semibold hover:bg-blue-800 transition">Enviar</button>
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
  const whatsapp = (phone, name) => { const msg = encodeURIComponent(`Olá ${name}, recebi o seu pedido de contacto. Em que posso ajudar?`); window.open(`https://wa.me/351${phone}?text=${msg}`); };
  const stats = { total: leads.length, novo: leads.filter(l=>l.status==='novo').length, contactado: leads.filter(l=>l.status==='contactado').length, fechado: leads.filter(l=>l.status==='fechado').length };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-white/90 p-3 rounded-lg shadow text-center"><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold">{stats.total}</p></div>
        <div className="bg-yellow-100/90 p-3 rounded-lg shadow text-center"><p className="text-sm text-gray-500">Novos</p><p className="text-2xl font-bold text-yellow-700">{stats.novo}</p></div>
        <div className="bg-blue-100/90 p-3 rounded-lg shadow text-center"><p className="text-sm text-gray-500">Contactados</p><p className="text-2xl font-bold text-blue-700">{stats.contactado}</p></div>
        <div className="bg-green-100/90 p-3 rounded-lg shadow text-center"><p className="text-sm text-gray-500">Fechados</p><p className="text-2xl font-bold text-green-700">{stats.fechado}</p></div>
      </div>
      {leads.map(l => (
        <div key={l.id} className="bg-white/95 border p-4 mb-3 rounded-xl shadow">
          <p className="text-lg font-bold text-gray-800">{l.name}</p>
          <p className="text-gray-600">{l.email}</p>
          <p className="text-gray-600">{l.phone}</p>
          {l.service && <p className="text-sm mt-1">Serviço: <strong>{l.service}</strong></p>}
          {l.subcategory && <p className="text-sm">Subcategoria: <strong>{l.subcategory}</strong></p>}
          {l.operacao && <p className="text-sm">Operação: <strong>{l.operacao}</strong></p>}
          {l.fracao && <p className="text-sm">Tipologia: <strong>{l.fracao}</strong></p>}
          {l.zonaRegiao && <p className="text-sm">Zona: <strong>{l.zonaRegiao}</strong></p>}
          {l.concelho && <p className="text-sm">Concelho: <strong>{l.concelho}</strong></p>}
          {l.areaTerreno && <p className="text-sm">Área do terreno: <strong>{l.areaTerreno}</strong></p>}
          {l.efeitoTerreno && <p className="text-sm">Efeito: <strong>{l.efeitoTerreno}</strong></p>}
          {l.marca && <p className="text-sm">Marca: <strong>{l.marca}</strong></p>}
          {l.combustivel && <p className="text-sm">Combustível: <strong>{l.combustivel}</strong></p>}
          {l.ivaDedutivel && <p className="text-sm">IVA Dedutível: <strong>{l.ivaDedutivel}</strong></p>}
          {l.preco && <p className="text-sm">Preço: <strong>{l.preco}</strong></p>}
          {l.financiamento && <p className="text-sm">Financiamento: <strong>{l.financiamento}</strong></p>}
          {l.prestacao && <p className="text-sm">Prestação: <strong>{l.prestacao}</strong></p>}
          {l.kms && <p className="text-sm">Quilómetros: <strong>{l.kms}</strong></p>}
          {l.eventoPessoas && <p className="text-sm">Nº Pessoas: <strong>{l.eventoPessoas}</strong></p>}
          {l.eventoZona && <p className="text-sm">Zona evento: <strong>{l.eventoZona}</strong></p>}
          {l.eventoValorPessoa && <p className="text-sm">Valor/pessoa: <strong>{l.eventoValorPessoa}</strong></p>}
          {l.message && <p className="text-sm">Mensagem: {l.message}</p>}
          <p className="text-sm mt-1">Status: <strong>{l.status}</strong></p>
          <textarea placeholder="Notas" defaultValue={l.notes} onBlur={e=>updateNotes(l.id,e.target.value)} className="w-full border border-gray-300 mt-2 p-2 rounded-lg text-sm" />
          <div className="flex gap-2 mt-2 flex-wrap">
            <button onClick={()=>whatsapp(l.phone,l.name)} className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition">WhatsApp</button>
            <button onClick={()=>updateStatus(l.id,'contactado')} className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600 transition">Contactado</button>
            <button onClick={()=>updateStatus(l.id,'fechado')} className="bg-green-700 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-800 transition">Fechado</button>
            <button onClick={()=>remove(l.id)} className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition">Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// PRIVACY POLICY COMPONENT
function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto bg-white/95 p-6 rounded-2xl shadow-2xl mt-6">
      <h2 className="font-bold text-xl mb-4 text-blue-800">Política de Privacidade</h2>
      <p className="mb-3 text-gray-700">Somos a Ornelas Protect e respeitamos a sua privacidade. Os dados recolhidos (nome, email, telefone, mensagem) são utilizados exclusivamente para contacto comercial.</p>
      <p className="mb-3 text-gray-700">Tem o direito de aceder, corrigir e eliminar os seus dados em qualquer momento. Para isso, contacte-nos através dos canais disponíveis.</p>
      <p className="mb-3 text-gray-700">Consentimento explícito é necessário antes de submeter qualquer formulário.</p>
      <p className="text-gray-700">Os dados são armazenados de forma segura na nossa cloud (Firebase) e apenas utilizadores autorizados têm acesso.</p>
    </div>
  );
}
