# 🎓 English Flash Cards

Aplicação web para estudo de inglês com flash cards e o modo **Bricks Challenge** para praticar estruturas gramaticais.

## ✨ Funcionalidades

### 📚 Flash Cards
- Criar, editar e excluir flash cards
- Organizar cards em grupos personalizados
- Campo para digitar resposta em inglês
- Comparação visual entre sua resposta e a correta
- Áudio com pronúncia em inglês (Web Speech API)

### 🧱 Bricks Challenge
Pratique 10 estruturas gramaticais com qualquer verbo:
1. **Infinitive** - I need to [verb]
2. **Imperative** - [Verb] now!
3. **Do/Does** - Do you [verb]?
4. **Are you** - Are you [verbing]?
5. **Have been** - I have been [verbing]
6. **Can** - Can you [verb]?
7. **Must/Should** - You should [verb]
8. **Is there any** - Is there anybody who can [verb]?
9. **Did you** - Did you [verb]?
10. **Have you** - Have you ever [verb]ed?

### 💾 Persistência
- Todos os dados salvos automaticamente no LocalStorage
- Progresso restaurado ao recarregar a página

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:5173`

### Build para Produção

```bash
# Gerar build otimizado
npm run build

# Preview do build
npm run preview
```

## 🛠️ Tecnologias

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **TailwindCSS** - Estilização
- **Zustand** - Gerenciamento de estado
- **Lucide React** - Ícones
- **Web Speech API** - Síntese de voz

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Sidebar.tsx        # Barra lateral com grupos
│   ├── CardList.tsx       # Lista de flash cards
│   ├── FlashCard.tsx      # Componente de card individual
│   └── BricksChallenge.tsx # Modo Bricks Challenge
├── hooks/
│   └── useSpeech.ts       # Hook para Text-to-Speech
├── store/
│   └── useStore.ts        # Store Zustand com persistência
├── types/
│   └── index.ts           # Tipos TypeScript
├── utils/
│   └── bricksGenerator.ts # Gerador de frases do Bricks
├── App.tsx                # Componente principal
├── main.tsx               # Entry point
└── index.css              # Estilos globais
```

## 📖 Como Usar

### Criando Grupos
1. Clique no botão **+** na seção "Meus Grupos"
2. Digite o nome do grupo (ex: "Verbos", "Substantivos")
3. Pressione Enter ou clique no botão de confirmar

### Adicionando Flash Cards
1. Selecione um grupo na barra lateral
2. Clique em **Novo Card**
3. Digite a frase em português e a tradução em inglês
4. Clique em **Criar Card**

### Estudando com Flash Cards
1. Leia a frase em português
2. Digite sua resposta em inglês
3. Pressione Enter ou clique em enviar
4. Veja o feedback visual com a comparação
5. Clique no ícone de som 🔊 para ouvir a pronúncia

### Bricks Challenge
1. Clique em **Bricks Challenge** na barra lateral
2. Escolha um verbo da lista ou digite um personalizado
3. Clique em **Iniciar Desafio**
4. Traduza cada frase para o inglês
5. Ao final, veja seu aproveitamento e revise os erros

## 🎨 Design

- Interface minimalista e moderna
- Cores suaves com destaque em cyan/blue
- Cards com sombras suaves e bordas arredondadas
- Feedback visual para acertos (verde) e erros (vermelho)
- Totalmente responsivo (mobile-first)

## 📝 Licença

MIT License - Sinta-se livre para usar e modificar!
