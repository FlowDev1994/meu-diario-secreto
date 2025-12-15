import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Calendar from 'react-calendar' // Importa o Calendário Visual
import { Trash2, CheckCircle, Circle, LogOut, Calendar as CalIcon } from 'lucide-react' // Ícones
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  
  // O calendário usa objeto Date, mas o banco usa string YYYY-MM-DD
  const [date, setDate] = useState(new Date()) 
  
  // Estados de Dados
  const [content, setContent] = useState('')
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  
  // Estados de Interface
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ message: '', type: '' })
  const [authMode, setAuthMode] = useState('login') // 'login' ou 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  // Formata a data para YYYY-MM-DD (para o banco)
  const formattedDate = date.toISOString().split('T')[0]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    supabase.auth.onAuthStateChange((_event, session) => setSession(session))
  }, [])

  // Carrega tudo quando a data ou usuário muda
  useEffect(() => {
    if (session) {
      fetchEntry()
      fetchTasks()
    }
  }, [date, session])

  // --- BUSCAR DADOS ---
  async function fetchEntry() {
    setLoading(true)
    const { data } = await supabase
      .from('journal_entries')
      .select('content')
      .eq('user_id', session.user.id)
      .eq('entry_date', formattedDate)
      .single()
    setContent(data ? data.content : '')
    setLoading(false)
  }

  async function fetchTasks() {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('task_date', formattedDate)
      .order('created_at', { ascending: true })
    setTasks(data || [])
  }

  // --- SALVAR DIÁRIO ---
  async function saveEntry() {
    setStatus({ message: 'Salvando...', type: 'normal' })
    const { error } = await supabase
      .from('journal_entries')
      .upsert({ 
        user_id: session.user.id, 
        entry_date: formattedDate, 
        content: content 
      }, { onConflict: 'user_id, entry_date' })

    if (error) setStatus({ message: 'Erro!', type: 'error' })
    else {
      setStatus({ message: 'Salvo!', type: 'success' })
      setTimeout(() => setStatus({ message: '', type: '' }), 2000)
    }
  }

  // --- GERENCIAR TAREFAS ---
  async function addTask(e) {
    e.preventDefault()
    if (!newTask.trim()) return

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ 
        user_id: session.user.id, 
        task_date: formattedDate, 
        title: newTask,
        is_completed: false
      }])
      .select()

    if (!error && data) {
      setTasks([...tasks, ...data])
      setNewTask('')
    }
  }

  async function toggleTask(task) {
    // Atualiza visualmente na hora (otimista)
    const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, is_completed: !t.is_completed } : t)
    setTasks(updatedTasks)

    await supabase.from('tasks').update({ is_completed: !task.is_completed }).eq('id', task.id)
  }

  async function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id))
    await supabase.from('tasks').delete().eq('id', id)
  }

  // --- AUTH ---
  async function handleAuth(e) {
    e.preventDefault()
    setLoading(true)
    if (authMode === 'register') {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
      if (!error) alert('Verifique seu e-mail!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
    }
    setLoading(false)
  }

  // --- TELA LOGIN ---
  if (!session) return (
    <div className="login-container">
      <div className="login-card">
        <h1>Diário Seguro 🔒</h1>
        <form onSubmit={handleAuth}>
          {authMode === 'register' && (
            <input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required />
          )}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading} className="btn-primary">
            {authMode === 'register' ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>
        <button className="btn-link" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
          {authMode === 'login' ? 'Criar conta nova' : 'Já tenho conta'}
        </button>
      </div>
    </div>
  )

  const userName = session.user.user_metadata.full_name || 'Visitante'

  // --- TELA PRINCIPAL (DASHBOARD) ---
  return (
    <div className="app-container">
      <nav className="navbar">
        <h2>Olá, {userName}</h2>
        <button onClick={() => supabase.auth.signOut()} className="btn-icon"><LogOut size={20}/> Sair</button>
      </nav>

      <main className="dashboard">
        {/* COLUNA ESQUERDA: CALENDÁRIO + TAREFAS */}
        <aside className="sidebar">
          <div className="calendar-card">
            <Calendar 
              onChange={setDate} 
              value={date} 
              locale="pt-BR"
              className="react-calendar-custom"
            />
          </div>

          <div className="tasks-card">
            <div className="card-header">
              <h3>Tarefas do Dia</h3>
              <span className="date-badge">{date.toLocaleDateString('pt-BR')}</span>
            </div>
            
            <form onSubmit={addTask} className="task-input-wrapper">
              <input 
                type="text" 
                placeholder="Nova tarefa..." 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <button type="submit" className="btn-small">+</button>
            </form>

            <ul className="task-list">
              {tasks.length === 0 && <li className="empty-msg">Nenhuma tarefa hoje.</li>}
              {tasks.map(task => (
                <li key={task.id} className={task.is_completed ? 'completed' : ''}>
                  <div onClick={() => toggleTask(task)} className="task-content">
                    {task.is_completed ? <CheckCircle size={18} color="#03dac6"/> : <Circle size={18} />}
                    <span>{task.title}</span>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="btn-delete"><Trash2 size={16}/></button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* COLUNA DIREITA: DIÁRIO */}
        <section className="journal-area">
          <div className="journal-header">
            <div className="date-display">
              <CalIcon size={24} color="#bb86fc" />
              <h1>{date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</h1>
            </div>
            {status.message && <span className={`status ${status.type}`}>{status.message}</span>}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Querido diário...`}
            className="journal-editor"
          />
          
          <button onClick={saveEntry} className="btn-primary btn-save">
            Salvar Memória
          </button>
        </section>
      </main>
    </div>
  )
}

export default App