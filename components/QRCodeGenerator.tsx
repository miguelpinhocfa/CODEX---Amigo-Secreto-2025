import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer } from 'lucide-react';

interface QRCodeGeneratorProps {
  onClose: () => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onClose }) => {
  const currentUrl = window.location.href;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-zinc-900 border-2 border-green-500/50 p-8 rounded-lg max-w-md w-full relative shadow-[0_0_50px_rgba(0,255,0,0.1)]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-green-500 hover:text-green-400 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center space-y-6">
          <h2 className="text-2xl font-cinzel text-green-500 font-bold border-b border-green-500/30 pb-4">
            Cartão de Acesso
          </h2>
          
          <p className="text-green-300/80 text-sm">
            Imprima ou mostre este código para que o destinatário possa aceder ao Codex no jantar.
          </p>

          <div className="bg-white p-4 rounded-lg inline-block mx-auto">
            <QRCodeSVG 
              value={currentUrl} 
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="text-xs text-green-500/50 break-all font-mono">
            {currentUrl}
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-900/30 hover:bg-green-900/50 text-green-400 border border-green-500/30 rounded transition-all uppercase tracking-widest text-sm font-bold"
          >
            <Printer size={16} /> Imprimir Página
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
