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

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

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

  const login = async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };

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
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", consent: false });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.consent) return alert("Consentimento obrigatório (RGPD)");

    await addDoc(collection(db, "leads"), { ...form, status: "novo", notes: "", date: new Date().toISOString() });
    alert("Pedido recebido. Vamos entrar em contacto brevemente.");
    setForm({ name: "", email: "", phone: "", message: "", consent: false });
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <img src="/Logo_Ornelas_Protect_final3.png" className="w-28 mx-auto mb-4" />
      <input placeholder="Nome" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="w-full mb-2 p-2 border" />
      <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} className="w-full mb-2 p-2 border" />
      <input placeholder="Telefone" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} className="w-full mb-2 p-2 border" />
      <textarea placeholder="Mensagem" value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} className="w-full mb-2 p-2 border" />
      <label className="text-sm">
        <input type="checkbox" checked={form.consent} onChange={(e)=>setForm({...form,consent:e.target.checked})} /> Autorizo o tratamento dos meus dados para contacto comercial
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
          <p>Status: {l.status}</p>
          <textarea placeholder="Notas" defaultValue={l.notes} onBlur={e=>updateNotes(l.id,e.target.value)} className="w-full border mt-2 p-1" />
          <div className="flex gap-2 mt-2">
            <button onClick={()=>whatsapp(l.phone,l.name)} className="bg-green-500 text-white px-2">WhatsApp</button>
            <button onClick={()=>updateStatus(l.id,'contactado')} className="bg-yellow-500 px-2">Contactado</button>
            <button onClick={()=>updateStatus(l.id,'fechado')} className="bg-green-700 text-white px-2">Fechado</button>
            <button onClick={()=>remove(l.id)} className="bg-red-600 text-white px-2">Eliminar</button>
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