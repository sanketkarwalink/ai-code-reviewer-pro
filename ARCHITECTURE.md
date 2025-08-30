# 📁 Project Architecture

## 🏗️ Directory Structure

```
ai-code-reviewer-pro/
├── 📁 app/                     # Next.js App Router
│   ├── 📁 api/                # API endpoints
│   │   ├── 📁 analyze/        # Code analysis endpoint
│   │   │   └── route.ts       # POST /api/analyze
│   │   ├── 📁 fix/           # Auto-fix endpoint  
│   │   │   └── route.ts       # POST /api/fix
│   │   ├── 📁 analytics/     # Analytics endpoint
│   │   │   └── route.ts       # GET /api/analytics
│   │   └── 📁 providers/     # Provider management
│   │       └── route.ts       # GET/POST /api/providers
│   ├── favicon.ico           # App favicon
│   ├── globals.css          # Global styles
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Main application page
├── 📁 components/             # Reusable React components
│   ├── AnalyticsDashboard.tsx # Analytics visualization
│   ├── CodeTemplates.tsx     # Code template examples
│   └── ProvidersStatus.tsx   # AI provider status
├── 📁 lib/                   # Utility libraries
│   ├── codeTemplates.ts     # Template code data
│   └── multiAI.ts          # Multi-provider AI service
├── 📁 public/               # Static assets
│   ├── file.svg            # File icon
│   ├── globe.svg           # Globe icon
│   ├── next.svg            # Next.js logo
│   ├── vercel.svg          # Vercel logo
│   └── window.svg          # Window icon
├── 📄 .env.example          # Environment variables template
├── 📄 .env.local           # Local environment (gitignored)
├── 📄 .gitignore           # Git ignore rules
├── 📄 CONTRIBUTING.md      # Contribution guidelines
├── 📄 DEPLOYMENT.md        # Deployment instructions
├── 📄 LICENSE              # MIT license
├── 📄 README.md            # Project documentation
├── 📄 SETUP_FREE_AI.md     # Free AI providers setup
├── 📄 eslint.config.mjs    # ESLint configuration
├── 📄 next-env.d.ts        # Next.js TypeScript declarations
├── 📄 next.config.ts       # Next.js configuration
├── 📄 package.json         # Node.js dependencies
├── 📄 postcss.config.mjs   # PostCSS configuration
├── 📄 tsconfig.json        # TypeScript configuration
└── 📄 vercel.json          # Vercel deployment config
```

## 🔧 Core Components

### Frontend Architecture

#### Main Application (`app/page.tsx`)
- **Purpose**: Primary user interface
- **Features**: 
  - Multi-tab navigation (Code Review, Analytics, Templates)
  - Language selection and detection
  - Code input and analysis
  - Auto-fix functionality
  - Copy-to-clipboard with animation
- **State Management**: React hooks for local state
- **Styling**: Tailwind CSS with responsive design

#### Analytics Dashboard (`components/AnalyticsDashboard.tsx`)
- **Purpose**: Visualize user coding metrics
- **Features**:
  - Session-based tracking
  - Language usage breakdown
  - Score improvement trends
  - Review history
- **Data Source**: `/api/analytics` endpoint

#### Code Templates (`components/CodeTemplates.tsx`)
- **Purpose**: Interactive learning examples
- **Features**:
  - Multi-language code samples
  - One-click analysis
  - Educational descriptions
- **Data Source**: `lib/codeTemplates.ts`

### Backend Architecture

#### API Layer (`app/api/`)
All endpoints follow RESTful design principles:

##### Code Analysis (`api/analyze/route.ts`)
- **Method**: POST
- **Purpose**: Analyze code quality and issues
- **Input**: Code string, language, session ID
- **Output**: Detailed analysis with scores and suggestions
- **AI Integration**: Uses multi-provider service

##### Auto-Fix (`api/fix/route.ts`)
- **Method**: POST  
- **Purpose**: Generate improved code versions
- **Input**: Original code, analysis results, language
- **Output**: Fixed code with explanations
- **Strategy**: Minimal, targeted improvements

##### Analytics (`api/analytics/route.ts`)
- **Method**: GET
- **Purpose**: Retrieve user coding statistics
- **Input**: Session ID (header)
- **Output**: Aggregated metrics and trends
- **Storage**: In-memory with session persistence

##### Provider Management (`api/providers/route.ts`)
- **Methods**: GET, POST
- **Purpose**: Monitor and manage AI providers
- **Features**: Status checking, error handling, reset functionality

### Service Layer

#### Multi-AI Service (`lib/multiAI.ts`)
- **Purpose**: Abstract AI provider interactions
- **Features**:
  - Provider selection and failover
  - Error categorization and handling
  - Rate limiting and timeout management
- **Providers**: OpenAI, Groq, Hugging Face, Cohere
- **Strategy**: Intelligent routing based on availability

## 🔄 Data Flow

### Code Analysis Flow
```
1. User Input → Frontend Validation
2. Language Detection → Auto-correction Warning
3. API Request → /api/analyze
4. AI Processing → Multi-provider Service
5. Response Processing → Structured Results
6. UI Update → Score Display + Issue List
```

### Auto-Fix Flow
```
1. Analysis Results → Fix Request
2. API Call → /api/fix
3. Context Building → Enhanced Prompts
4. AI Generation → Improved Code
5. Response Validation → Quality Checks
6. UI Update → Side-by-side Comparison
```

### Analytics Flow
```
1. User Actions → Session Tracking
2. Data Aggregation → In-memory Storage
3. API Request → /api/analytics
4. Data Processing → Trend Calculation
5. Visualization → Chart Rendering
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue shades for actions and links
- **Success**: Green for positive feedback
- **Warning**: Yellow/orange for alerts
- **Error**: Red for problems
- **Neutral**: Gray scale for UI elements

### Typography
- **Headings**: Font weight hierarchy (600-700)
- **Body**: Regular weight (400) for readability
- **Code**: Monospace font family
- **Labels**: Medium weight (500) for emphasis

### Spacing
- **Component Padding**: 4-6 units (1rem-1.5rem)
- **Section Margins**: 6-8 units (1.5rem-2rem)
- **Element Gaps**: 2-4 units (0.5rem-1rem)

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔒 Security Considerations

### API Security
- **Environment Variables**: Secure key storage
- **Input Validation**: Sanitization and type checking
- **Error Handling**: No sensitive data in error messages
- **Rate Limiting**: API usage controls

### Frontend Security
- **XSS Prevention**: Proper input sanitization
- **Content Security**: Trusted content sources
- **State Management**: Secure session handling

## 📈 Performance Optimizations

### Build Optimizations
- **Turbopack**: Fast development builds
- **Code Splitting**: Automatic bundle optimization
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: Next.js built-in optimization

### Runtime Optimizations
- **Component Memoization**: React.memo for heavy components
- **State Optimization**: Minimal re-renders
- **API Caching**: Response caching strategies
- **Lazy Loading**: On-demand resource loading

## 🧪 Testing Strategy

### Unit Testing
- **Utils**: Pure function testing
- **Components**: React Testing Library
- **API Routes**: Endpoint testing
- **Services**: Business logic validation

### Integration Testing
- **User Flows**: End-to-end scenarios
- **API Integration**: Provider interactions
- **Error Handling**: Failure scenarios

### Performance Testing
- **Load Testing**: API endpoint stress testing
- **Bundle Analysis**: Build size monitoring
- **Runtime Performance**: Component render timing

## 🚀 Deployment Architecture

### Vercel Deployment
- **Build Process**: Automatic on git push
- **Environment Variables**: Secure secret management
- **Edge Functions**: Global API distribution
- **Analytics**: Built-in performance monitoring

### Alternative Platforms
- **Netlify**: Static site hosting with functions
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment option

---

This architecture provides a solid foundation for scalability, maintainability, and professional development practices.
