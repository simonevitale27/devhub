# DevHub - Serverless SQL Training Platform

![DevHub Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## 🎯 Elevator Pitch

*A professional-grade, client-side SQL simulation environment built to practice Data Analysis workflows (ETL, Querying, Reporting) without backend latency. Powered by AlaSQL (in-memory DB) and React, featuring a custom-built SQL editor with real-time syntax highlighting.*

---

## ✨ Key Features

- **Infinite SQL Gym**: 100+ exercises covering SELECT, JOINs, Aggregations, Subqueries, and advanced SQL patterns
- **Advanced SQL Editor**: Real-time syntax highlighting, auto-formatting, and smart column insertion for a professional coding experience
- **Debug Mode**: Simulation of troubleshooting scenarios with intentionally broken queries to practice error resolution
- **Data Sandbox**: Import your CSV files (Drag & Drop) and query them locally with SQL - no server required
- **Professional Reporting**: Export query results as **PDF Reports** (with stats & charts) or **CSV** files
- **Insight Tools**: Automatic analysis of query results with statistics (Avg, Min, Max) and interactive Table Inspector
- **Zero Latency**: All queries execute instantly in-browser - perfect for rapid iteration and learning

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript 5.8
- **Database**: AlaSQL (in-memory SQL engine)
- **Styling**: Tailwind CSS with custom design system
- **Data Processing**: PapaParse for CSV parsing
- **Build Tool**: Vite 6.2
- **Icons**: Lucide React

---

## 📁 Project Structure

### Architecture & Design

- [**ARCHITECTURE.md**](ARCHITECTURE.md) - Complete project architecture, serverless philosophy, data flow patterns
- [**DB_SCHEMA.md**](DB_SCHEMA.md) - Database schema with ER diagrams and table relationships
- [**DESIGN_SYSTEM.md**](DESIGN_SYSTEM.md) - UI/UX design system, components, and style guidelines

### Key Directories

```text
devhub/
├── components/      # React UI components
├── services/        # Business logic (SQL, exercises, AI coach)
├── utils/           # Helper functions (CSV parser, SQL validators)
└── types.ts         # TypeScript definitions
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher)

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd devhub
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**

   Navigate to `http://localhost:3000`

> **Note**: This project uses a mock AI service for zero-config setup. No API keys or external services required.

---

## 📊 Use Cases

### For Data Analysts

- Practice SQL queries on realistic e-commerce datasets
- Test complex JOIN scenarios without database setup
- Validate query results with instant feedback
- Import CSV exports and analyze them locally

### For Learning

- Progressive difficulty levels (Easy → Medium → Hard)
- Instant validation with detailed error messages
- Interactive schema viewer with ER diagrams
- Built-in hints and solutions for each exercise

---

## 🎓 Portfolio Highlights

### Built to demonstrate

- **Data Engineering Skills**: ETL workflows, schema design, query optimization
- **Frontend Development**: React state management, TypeScript type safety, responsive UI
- **Architecture Design**: Serverless approach, in-browser SQL execution, zero-backend philosophy
- **UX Focus**: Instant feedback, progressive disclosure, error handling

---

## 📄 License

MIT

---

**Built with ❤️ by a Data Analyst who loves clean code and efficient workflows.**
