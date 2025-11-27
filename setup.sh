#!/bin/bash

# Script di setup per SQL Gym
# Verifica Node.js e installa le dipendenze

echo "🔍 Verifico Node.js..."

# Cerca Node.js in vari percorsi
NODE_PATH=""
if command -v node &> /dev/null; then
    NODE_PATH=$(command -v node)
elif [ -f "/Applications/Cursor.app/Contents/Resources/app/resources/helpers/node" ]; then
    NODE_PATH="/Applications/Cursor.app/Contents/Resources/app/resources/helpers/node"
elif [ -f "/usr/local/bin/node" ]; then
    NODE_PATH="/usr/local/bin/node"
elif [ -f "/opt/homebrew/bin/node" ]; then
    NODE_PATH="/opt/homebrew/bin/node"
fi

if [ -z "$NODE_PATH" ]; then
    echo "❌ Node.js non trovato!"
    echo ""
    echo "Per installare Node.js:"
    echo "1. Scarica da https://nodejs.org/ (versione LTS consigliata)"
    echo "2. Oppure installa con Homebrew: brew install node"
    echo "3. Oppure usa nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi

echo "✅ Node.js trovato: $NODE_PATH"
$NODE_PATH --version

echo ""
echo "🔍 Verifico npm..."

# Cerca npm
NPM_CMD=""
if command -v npm &> /dev/null; then
    NPM_CMD="npm"
elif [ -f "/usr/local/bin/npm" ]; then
    NPM_CMD="/usr/local/bin/npm"
elif [ -f "/opt/homebrew/bin/npm" ]; then
    NPM_CMD="/opt/homebrew/bin/npm"
else
    echo "⚠️  npm non trovato nel PATH"
    echo "Provo a installare npm usando Node.js..."
    
    # Prova a installare npm usando node
    if $NODE_PATH -e "console.log('Node.js funziona')" &> /dev/null; then
        echo "Scarico npm..."
        curl -L https://www.npmjs.com/install.sh | NODE_PATH="$NODE_PATH" sh
        if command -v npm &> /dev/null; then
            NPM_CMD="npm"
        fi
    fi
fi

if [ -z "$NPM_CMD" ]; then
    echo "❌ npm non disponibile"
    echo "Installa Node.js completo da https://nodejs.org/"
    exit 1
fi

echo "✅ npm trovato: $NPM_CMD"
$NPM_CMD --version

echo ""
echo "📦 Installo le dipendenze..."
$NPM_CMD install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup completato con successo!"
    echo "Ora puoi eseguire: npm run dev"
else
    echo ""
    echo "❌ Errore durante l'installazione delle dipendenze"
    exit 1
fi

