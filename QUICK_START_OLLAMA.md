# 🚀 Quick Start with Ollama (FREE AI)

Generate newsletters with **$0 cost** using local AI!

## 5-Minute Setup

### 1. Install Ollama (2 min)

**Mac:**
```bash
brew install ollama
```

**Linux:**
```bash
curl https://ollama.ai/install.sh | sh
```

**Windows:**
Download from: https://ollama.ai/download

### 2. Download AI Model (3 min)

```bash
ollama pull llama3.1:8b
```

*First download takes ~5 minutes (4 GB file)*

### 3. Configure (30 sec)

Edit `.env`:
```env
AI_PROVIDER=ollama
```

Edit `config.json`:
```json
{
  "ai": {
    "provider": "ollama",
    "model": "llama3.1:8b"
  }
}
```

### 4. Test (30 sec)

```bash
npm run test-ollama
```

### 5. Generate! (2 min)

```bash
npm run generate
```

---

## That's It!

You're now generating newsletters **completely free** with local AI.

**For detailed setup:** See [OLLAMA_SETUP.md](OLLAMA_SETUP.md)

**For full docs:** See [README.md](README.md)

---

## Quick Tips

### Speed Up Generation
```bash
# Keep Ollama running in background
ollama serve &
```

### Better Quality
```bash
# Use larger model (needs powerful hardware)
ollama pull llama3.1:70b
```

### List Available Models
```bash
ollama list
```

### Switch Back to Claude
Edit `.env`:
```env
AI_PROVIDER=anthropic
```

---

**Enjoy free newsletter generation! 🎉**
