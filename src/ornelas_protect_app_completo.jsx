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
  const emptyForm = { name: "", email: "", phone: "", service: "", subcategory: "", tipologia: "", operacao: "", preco: "", financiamento: "", prestacao: "", kms: "", message: "", consent: false };
  const [form, setForm] = useState(emptyForm);

  const f = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.consent) return alert("Consentimento obrigatório (RGPD)");
    await addDoc(collection(db, "leads"), { ...form, status: "novo", notes: "", date: new Date().toISOString() });
    alert("Pedido recebido. Vamos entrar em contacto brevemente.");
    setForm(emptyForm);
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <img src="/Logo_Ornelas_Protect_final3.png" className="w-28 mx-auto mb-4" />

      <input placeholder="Nome" value={form.name} onChange={e => f("name", e.target.value)} className="w-full mb-2 p-2 border rounded" />
      <input placeholder="Email" value={form.email} onChange={e => f("email", e.target.value)} className="w-full mb-2 p-2 border rounded" />
      <input placeholder="Telefone" value={form.phone} onChange={e => f("phone", e.target.value)} className="w-full mb-2 p-2 border rounded" />

      {/* SERVIÇO PRINCIPAL */}
      <select value={form.service} onChange={e => setForm({...emptyForm, name: form.name, email: form.email, phone: form.phone, message: form.message, consent: form.consent, service: e.target.value})} className="w-full mb-2 p-2 border rounded">
        <option value="">Tipo de serviço</option>
        <option value="Seguros">Seguros</option>
        <option value="Mediação Imobiliária">Mediação Imobiliária</option>
        <option value="Mediação Automóvel">Mediação Automóvel</option>
        <option value="Eventos">Eventos</option>
      </select>

      {/* SEGUROS */}
      {form.service === "Seguros" && (
        <select value={form.subcategory} onChange={e => f("subcategory", e.target.value)} className="w-full mb-2 p-2 border rounded">
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

      {/* MEDIAÇÃO IMOBILIÁRIA */}
      {form.service === "Mediação Imobiliária" && (
        <>
          <select value={form.operacao} onChange={e => f("operacao", e.target.value)} className="w-full mb-2 p-2 border rounded">
            <option value="">Compra ou Venda?</option>
            <option value="Compra">Compra</option>
            <option value="Venda">Venda</option>
          </select>
          <select value={form.subcategory} onChange={e => f("subcategory", e.target.value)} className="w-full mb-2 p-2 border rounded">
            <option value="">Tipo de imóvel</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Casa">Casa</option>
            <option value="Loja">Loja</option>
            <option value="Terreno">Terreno</option>
            <option value="Outro">Outro</option>
          </select>
        </>
      )}

      {/* MEDIAÇÃO AUTOMÓVEL */}
      {form.service === "Mediação Automóvel" && (
        <>
          <select value={form.subcategory} onChange={e => f("subcategory", e.target.value)} className="w-full mb-2 p-2 border rounded">
            <option value="">Novo ou Usado?</option>
            <option value="Novo">Novo</option>
            <option value="Usado">Usado</option>
          </select>
          <select value={form.preco} onChange={e => f("preco", e.target.value)} className="w-full mb-2 p-2 border rounded">
            <option value="">Intervalo de preço</option>
            <option value="Até 10.000€">Até 10.000€</option>
            <option value="10.000€ - 20.000€">10.000€ - 20.000€</option>
            <option value="20.000€ - 35.000€">20.000€ - 35.000€</option>
            <option value="35.000€ - 50.000€">35.000€ - 50.000€</option>
            <option value="Mais de 50.000€">Mais de 50.000€</option>
          </select>
          <select value={form.financiamento} onChange={e => f("financiamento", e.target.value)} className="w-full mb-2 p-2 border rounded">
            <option value="">Precisa de financiamento?</option>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </select>
          {form.financiamento === "Sim" && (
            <input placeholder="Valor de prestação desejado (€/mês)" value={form.prestacao} onChange={e => f("prestacao", e.target.value)} className="w-full mb-2 p-2 border rounded" />
          )}
          {form.subcategory === "Usado" && (
            <select value={form.kms} onChange={e => f("kms", e.target.value)} className="w-full mb-2 p-2 border rounded">
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
        <select value={form.subcategory} onChange={e => f("subcategory", e.target.value)} className="w-full mb-2 p-2 border rounded">
          <option value="">Tipo de evento</option>
          <option value="Casamento">Casamento</option>
          <option value="Batizado">Batizado</option>
          <option value="Evento de Empresa">Evento de Empresa</option>
          <option value="Outro">Outro</option>
        </select>
      )}

      <textarea placeholder="Mensagem" value={form.message} onChange={e => f("message", e.target.value)} className="w-full mb-2 p-2 border rounded" />
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
          {l.preco && <p>Preço: <strong>{l.preco}</strong></p>}
          {l.financiamento && <p>Financiamento: <strong>{l.financiamento}</strong></p>}
          {l.prestacao && <p>Prestação: <strong>{l.prestacao}</strong></p>}
          {l.kms && <p>Quilómetros: <strong>{l.kms}</strong></p>}
          {l.message && <p>Mensagem: {l.message}</p>}
          <p>Status: {l.status}</p>
          <textarea placeholder="Notas" defaultValue={l.notes} onBlur={e=>updateNotes(l.id,e.target.value)} className="w-full border mt-2 p-1" />
          <div className="flex gap-2 mt-2">
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
