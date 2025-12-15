# 🔒 Meu Diário Secreto & Task Manager

Um aplicativo web moderno e seguro para gerenciamento pessoal. O projeto combina um **Diário Pessoal** com um **Gerenciador de Tarefas**, protegidos por autenticação e segurança a nível de banco de dados (RLS).

![Preview do Projeto][(https://via.placeholder.com/800x400?text=Adicione+um+Print+do+Seu+Projeto+Aqui)](https://meu-diario-secreto.vercel.app/)


## 🚀 Funcionalidades

- **Autenticação Segura:** Login e Cadastro com E-mail e Senha via Supabase Auth.
- **Diário Pessoal:** Editor de texto amplo para registrar pensamentos diários, salvo automaticamente por data.
- **Calendário Interativo:** Navegação visual entre os dias.
- **Lista de Tarefas (To-Do):** Adicionar, concluir e excluir tarefas vinculadas ao dia selecionado.
- **Segurança de Dados:** Implementação de **RLS (Row Level Security)**. Cada usuário vê apenas seus próprios dados.
- **Design Moderno:** Interface "Dark Mode" com elementos translúcidos (Glassmorphism) e responsividade.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Linguagem:** JavaScript (ES6+)
- **Estilização:** CSS3 (Variáveis CSS, Flexbox, Grid Layout)
- **Backend as a Service:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Bibliotecas:** - `react-calendar` (Calendário)
  - `lucide-react` (Ícones)
- **Deploy:** Vercel

## ⚙️ Como rodar o projeto localmente

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SEU-USUARIO/meu-diario-secreto.git](https://github.com/SEU-USUARIO/meu-diario-secreto.git)
   cd meu-diario-secreto
