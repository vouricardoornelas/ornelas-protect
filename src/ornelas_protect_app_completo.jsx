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

// CONCELHOS POR ZONA
const concelhosPorZona = {
  "Continente": [
    "Abrantes","Águeda","Aguiar da Beira","Alandroal","Albergaria-a-Velha","Albufeira","Alcácer do Sal","Alcanena","Alcobaça","Alcochete","Alcoutim","Alenquer","Alfândega da Fé","Algarve","Alijó","Aljezur","Aljustrel","Almada","Almeida","Almeirim","Almodôvar","Alpiarça","Alter do Chão","Alvaiázere","Alvito","Amadora","Amarante","Amares","Anadia","Ansião","Arcos de Valdevez","Arganil","Armamar","Arouca","Arraiolos","Arronches","Arruda dos Vinhos","Aveiro","Avis","Azambuja",
    "Baião","Barcelos","Barrancos","Barreiro","Beja","Belmonte","Benavente","Bombarral","Borba","Braga","Bragança","Cabeceiras de Basto","Cadaval","Caldas da Rainha","Caminha","Cantanhede","Carrazeda de Ansiães","Carregal do Sal","Cartaxo","Cascais","Castelo Branco","Castelo de Paiva","Castelo de Vide","Castro Daire","Castro Marim","Castro Verde","Celorico da Beira","Celorico de Basto","Chaves","Cinfães","Coimbra","Condeixa-a-Nova","Constância","Coruche","Covilhã","Crato","Cuba",
    "Elvas","Entroncamento","Espinho","Esposende","Estarreja","Estremoz","Évora","Fafe","Faro","Felgueiras","Ferreira do Alentejo","Ferreira do Zêzere","Figueira da Foz","Figueira de Castelo Rodrigo","Figueiró dos Vinhos","Fornos de Algodres","Freixo de Espada à Cinta","Fronteira","Fundão",
    "Gavião","Góis","Gondomar","Gouveia","Grândola","Guarda","Guimarães","Idanha-a-Nova","Ílhavo","Lagos","Lamego","Leiria","Lisboa","Loulé","Loures","Lousã","Lousada","Mação","Macedo de Cavaleiros","Mafra","Maia","Mangualde","Manteigas","Marco de Canaveses","Marinha Grande","Marvão","Matosinhos","Mealhada","Meda","Melgaço","Mesão Frio","Miranda do Corvo","Miranda do Douro","Mirandela","Mogadouro","Moimenta da Beira","Moita","Monção","Monchique","Mondim de Basto","Monforte","Montalegre","Montemor-o-Novo","Montemor-o-Velho","Montijo","Mora","Mortágua","Moura","Mourão","Murça","Murtosa",
    "Nazaré","Nelas","Nisa","Óbidos","Odemira","Odivelas","Oeiras","Oleiros","Olhão","Oliveira de Azeméis","Oliveira de Frades","Oliveira do Bairro","Oliveira do Hospital","Ourém","Ourique","Ovar",
    "Paços de Ferreira","Palmela","Pampilhosa da Serra","Paredes","Paredes de Coura","Pedrógão Grande","Penacova","Penafiel","Penalva do Castelo","Penamacor","Penedono","Penela","Peniche","Peso da Régua","Pinhel","Pombal","Ponte da Barca","Ponte de Lima","Ponte de Sor","Portalegre","Portel","Portimão","Porto","Porto de Mós","Póvoa de Lanhoso","Póvoa de Varzim","Proença-a-Nova",
    "Redondo","Reguengos de Monsaraz","Resende","Ribeira de Pena","Rio Maior","Sabrosa","Sabugal","Salvaterra de Magos","Santa Comba Dão","Santa Maria da Feira","Santa Marta de Penaguião","Santarém","Santiago do Cacém","Santo Tirso","São Brás de Alportel","São João da Madeira","São João da Pesqueira","São Pedro do Sul","São Roque do Pico","São Vicente da Beira","Sardoal","Sátão","Seia","Seixal","Serpa","Sernancelhe","Sesimbra","Setúbal","Sever do Vouga","Silves","Sines","Sintra","Sobral de Monte Agraço","Soure","Sousel",
    "Tábua","Tabuaço","Tarouca","Tavira","Terras de Bouro","Tomar","Tondela","Torre de Moncorvo","Torres Novas","Torres Vedras","Trancoso","Trofa","Vagos","Vale de Cambra","Valença","Valongo","Valpaços","Vendas Novas","Viana do Alentejo","Viana do Castelo","Vidigueira","Vieira do Minho","Vila de Rei","Vila do Bispo","Vila do Conde","Vila Flor","Vila Franca de Xira","Vila Nova da Barquinha","Vila Nova de Cerveira","Vila Nova de Famalicão","Vila Nova de Foz Côa","Vila Nova de Gaia","Vila Nova de Paiva","Vila Nova de Poiares","Vila Pouca de Aguiar","Vila Real","Vila Real de Santo António","Vila Velha de Ródão","Vila Verde","Vila Viçosa","Vimioso","Vinhais","Viseu","Vizela"
  ],
  "Madeira": [
    "Calheta","Câmara de Lobos","Funchal","Machico","Ponta do Sol","Porto Moniz","Porto Santo","Ribeira Brava","Santa Cruz","Santana","São Vicente"
  ],
  "Açores": [
    "Angra do Heroísmo","Calheta (São Jorge)","Corvo","Horta","Lagoa (São Miguel)","Lajes das Flores","Lajes do Pico","Madalena","Nordeste","Ponta Delgada","Povoação","Praia da Vitória","Ribeira Grande","Santa Cruz da Graciosa","Santa Cruz das Flores","São Roque do Pico","Velas","Vila do Porto","Vila Franca do Campo"
  ]
};

// APP PRINCIPAL
export default function OrnelasProtectApp() {
  const [user, setUser] = useState(null);
  useEffect(() => { onAuthStateChanged(auth, setUser); }, []);
  if (!user) return <Login />;
  return (
    <div className="p-4">
      <button onClick={() => signOut(auth)} className="mb-4 bg-red-500 text-white px-3 py-1 rounded">Logout</button>
      <MainApp />
    </div>
  );
}

// LOGIN COMPONENT
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = async () => { await signInWithEmailAndPassword(auth, email, password); };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow">
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="block mb-2 border p-2" />
        <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} className="block mb-2 border p-2" />
        <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">Entrar</button>
      </div>
    </div>
  );
}

// MAIN APP COMPONENT
function MainApp() {
  const [view, setView] = useState("form");
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setView("form")} className="bg-gray-200 px-3 py-1 rounded">Formulário</button>
        <button onClick={() => setView("dashboard")} className="bg-gray-200 px-3 py-1 rounded">Leads</button>
        <button onClick={() => setView("privacy")} className="bg-gray-200 px-3 py-1 rounded">Política de Privacidade</button>
      </div>
      {view === "form" ? <ContactForm /> : view === "dashboard" ? <Dashboard /> : <PrivacyPolicy />}
    </div>
  );
}

// CONTACT FORM COMPONENT
function ContactForm() {
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
  };

  const sel = "w-full mb-2 p-2 border rounded";
  const inp = "w-full mb-2 p-2 border rounded";

  return (
    <form onSubmit={submit} className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <img src="/Logo_Ornelas_Protect_final3.png" className="w-28 mx-auto mb-4" />

      <input placeholder="Nome" value={form.name} onChange={e => f("name", e.target.value)} className={inp} />
      <input placeholder="Email" value={form.email} onChange={e => f("email", e.target.value)} className={inp} />
      <input placeholder="Telefone" value={form.phone} onChange={e => f("phone", e.target.value)} className={inp} />

      {/* SERVIÇO PRINCIPAL */}
      <select value={form.service} onChange={e => setForm({...emptyForm, name: form.name, email: form.email, phone: form.phone, message: form.message, consent: form.consent, service: e.target.value})} className={sel}>
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

          {/* ZONA DE INTERESSE */}
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
      <label className="text-sm">
        <input type="checkbox" checked={form.consent} onChange={e => f("consent", e.target.checked)} /> Autorizo o tratamento dos meus dados para contacto comercial
      </label>
      <button className="w-full bg-blue-700 text-white p-2 mt-3 rounded">Enviar</button>
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
        <div className="bg-white p-3 rounded shadow">Total: {stats.total}</div>
        <div className="bg-yellow-200 p-3 rounded">Novos: {stats.novo}</div>
        <div className="bg-blue-200 p-3 rounded">Contactados: {stats.contactado}</div>
        <div className="bg-green-200 p-3 rounded">Fechados: {stats.fechado}</div>
      </div>
      {leads.map(l => (
        <div key={l.id} className="border p-3 mb-2 rounded bg-white">
          <p><strong>{l.name}</strong></p>
          <p>{l.email}</p>
          <p>{l.phone}</p>
          {l.service && <p>Serviço: <strong>{l.service}</strong></p>}
          {l.subcategory && <p>Subcategoria: <strong>{l.subcategory}</strong></p>}
          {l.operacao && <p>Operação: <strong>{l.operacao}</strong></p>}
          {l.fracao && <p>Tipologia: <strong>{l.fracao}</strong></p>}
          {l.zonaRegiao && <p>Zona: <strong>{l.zonaRegiao}</strong></p>}
          {l.concelho && <p>Concelho: <strong>{l.concelho}</strong></p>}
          {l.areaTerreno && <p>Área do terreno: <strong>{l.areaTerreno}</strong></p>}
          {l.efeitoTerreno && <p>Efeito: <strong>{l.efeitoTerreno}</strong></p>}
          {l.marca && <p>Marca: <strong>{l.marca}</strong></p>}
          {l.combustivel && <p>Combustível: <strong>{l.combustivel}</strong></p>}
          {l.ivaDedutivel && <p>IVA Dedutível: <strong>{l.ivaDedutivel}</strong></p>}
          {l.preco && <p>Preço: <strong>{l.preco}</strong></p>}
          {l.financiamento && <p>Financiamento: <strong>{l.financiamento}</strong></p>}
          {l.prestacao && <p>Prestação: <strong>{l.prestacao}</strong></p>}
          {l.kms && <p>Quilómetros: <strong>{l.kms}</strong></p>}
          {l.eventoPessoas && <p>Nº Pessoas: <strong>{l.eventoPessoas}</strong></p>}
          {l.eventoZona && <p>Zona evento: <strong>{l.eventoZona}</strong></p>}
          {l.eventoValorPessoa && <p>Valor/pessoa: <strong>{l.eventoValorPessoa}</strong></p>}
          {l.message && <p>Mensagem: {l.message}</p>}
          <p>Status: {l.status}</p>
          <textarea placeholder="Notas" defaultValue={l.notes} onBlur={e=>updateNotes(l.id,e.target.value)} className="w-full border mt-2 p-1" />
          <div className="flex gap-2 mt-2 flex-wrap">
            <button onClick={()=>whatsapp(l.phone,l.name)} className="bg-green-500 text-white px-2 py-1 rounded">WhatsApp</button>
            <button onClick={()=>updateStatus(l.id,'contactado')} className="bg-yellow-500 px-2 py-1 rounded">Contactado</button>
            <button onClick={()=>updateStatus(l.id,'fechado')} className="bg-green-700 text-white px-2 py-1 rounded">Fechado</button>
            <button onClick={()=>remove(l.id)} className="bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// PRIVACY POLICY COMPONENT
function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow mt-6">
      <h2 className="font-bold text-xl mb-2">Política de Privacidade</h2>
      <p>Somos a Ornelas Protect e respeitamos a sua privacidade. Os dados recolhidos (nome, email, telefone, mensagem) são utilizados exclusivamente para contacto comercial.</p>
      <p>Tem o direito de aceder, corrigir e eliminar os seus dados em qualquer momento. Para isso, contacte-nos através dos canais disponíveis.</p>
      <p>Consentimento explícito é necessário antes de submeter qualquer formulário.</p>
      <p>Os dados são armazenados de forma segura na nossa cloud (Firebase) e apenas utilizadores autorizados têm acesso.</p>
    </div>
  );
}
