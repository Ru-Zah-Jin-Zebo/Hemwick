# Project Structure

```
resume-chatbot/
├── README.md                  # Root README with setup instructions
├── docker-compose.yml         # Docker Compose configuration
├── backend/
│   ├── Dockerfile             # Backend Docker configuration
│   ├── README.md              # Backend documentation
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI main application
│   │   ├── models/            # Data models
│   │   ├── routers/           # API route definitions
│   │   ├── services/          # Business logic
│   │   │   └── llm_service.py # LangChain integration
│   │   └── utils/             # Utility functions
│   ├── data/                  # RAG documents storage
│   ├── requirements.txt       # Python dependencies
│   └── tests/                 # Backend tests
└── frontend/
    ├── Dockerfile             # Frontend Docker configuration
    ├── README.md              # Frontend documentation
    ├── components/            # React components
    │   ├── chat/              # Chat-related components
    │   ├── layout/            # Layout components
    │   ├── resume/            # Resume components
    │   └── ui/                # UI components (shadcn/ui)
    ├── lib/                   # Utility functions
    ├── app/                   # Next.js app router
    │   ├── page.tsx           # Main resume page
    │   ├── layout.tsx         # Root layout
    │   └── api/               # API routes for client-side calls
    ├── public/                # Static assets
    ├── next.config.js         # Next.js configuration
    ├── package.json           # NPM dependencies
    ├── postcss.config.js      # PostCSS configuration
    ├── tailwind.config.js     # Tailwind CSS configuration
    └── tsconfig.json          # TypeScript configuration
```