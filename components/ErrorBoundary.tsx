import React, { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public readonly props: Readonly<ErrorBoundaryProps>;
  
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    const { children } = this.props;
    
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-red-950/10 border border-red-900/30 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-600/20 rounded-lg border border-red-500/30">
              <AlertTriangle size={32} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-red-300 font-bold text-lg">Impossibile visualizzare i dati</h3>
              <p className="text-red-400/70 text-sm mt-1">Si è verificato un errore durante il rendering</p>
            </div>
          </div>
          {this.state.error && (
            <details className="mt-4 text-xs text-red-300/50 font-mono max-w-2xl">
              <summary className="cursor-pointer hover:text-red-300 transition-colors">Dettagli tecnici</summary>
              <pre className="mt-2 p-3 bg-black/30 rounded border border-red-900/20 overflow-auto max-h-40">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
