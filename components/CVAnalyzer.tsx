
import React, { useState } from 'react';
import { extractTextFromPdf } from '../utils/pdfProcessor';
import { analyzeCV } from '../services/geminiService';
import { CVAnalysis } from '../types';

export const CVAnalyzer: React.FC = () => {
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [cvFiles, setCvFiles] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<CVAnalysis[]>([]);
  const [progress, setProgress] = useState(0);

  const handleCVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 50);
      setCvFiles(files);
    }
  };

  const handleStartAnalysis = async () => {
    if (!jdFile || cvFiles.length === 0) {
      alert('Selecione a descrição da vaga e pelo menos um currículo.');
      return;
    }

    setAnalyzing(true);
    setResults([]);
    setProgress(0);

    try {
      const jdText = await extractTextFromPdf(jdFile);
      const allResults: CVAnalysis[] = [];

      for (let i = 0; i < cvFiles.length; i++) {
        const cvFile = cvFiles[i];
        const cvText = await extractTextFromPdf(cvFile);
        const analysis = await analyzeCV(jdText, cvText);
        
        // Only keep results with >= 50% score
        if (analysis.score >= 50) {
          allResults.push(analysis);
        }
        
        setProgress(Math.round(((i + 1) / cvFiles.length) * 100));
        // Sort results by score
        setResults([...allResults].sort((a, b) => b.score - a.score));
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao processar documentos. Verifique se os PDFs estão legíveis.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Analista de Currículos</h2>
        <p className="text-slate-600 mb-6">Compare candidatos com as exigências da vaga. Candidatos com menos de 50% de compatibilidade serão filtrados automaticamente.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Descrição da Vaga (PDF)</label>
            <div className="relative group border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-green-500 transition-colors">
              <input 
                type="file" 
                accept="application/pdf"
                onChange={(e) => setJdFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center text-slate-500">
                {jdFile ? (
                  <span className="text-green-700 font-medium">✓ {jdFile.name}</span>
                ) : (
                  <span>Clique ou arraste a Vaga</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Currículos (Máximo 50 PDFs)</label>
            <div className="relative group border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-green-500 transition-colors">
              <input 
                type="file" 
                multiple
                accept="application/pdf"
                onChange={handleCVChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center text-slate-500">
                {cvFiles.length > 0 ? (
                  <span className="text-green-700 font-medium">✓ {cvFiles.length} arquivos selecionados</span>
                ) : (
                  <span>Clique ou arraste os Currículos</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            onClick={handleStartAnalysis}
            disabled={analyzing || !jdFile || cvFiles.length === 0}
            className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-10 rounded-lg transition-all shadow-md disabled:opacity-50"
          >
            {analyzing ? `Analisando (${progress}%)` : 'Iniciar Triagem Inteligente'}
          </button>
          
          {analyzing && (
            <div className="flex-1 max-w-xs bg-slate-100 rounded-full h-2.5">
              <div className="bg-yellow-400 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Candidatos Qualificados ({results.length})</h3>
            <span className="text-sm text-slate-500 italic">*Exibindo apenas candidatos com compatibilidade superior a 50%</span>
          </div>
          
          <div className="grid gap-4">
            {results.map((res, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className={`w-24 h-24 flex items-center justify-center font-bold text-2xl ${res.score >= 80 ? 'bg-green-700 text-white' : 'bg-yellow-400 text-slate-900'}`}>
                    {res.score}%
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xl font-bold text-slate-800">{res.candidateName || 'Candidato ' + (idx + 1)}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${res.score >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {res.score >= 80 ? 'Altamente Recomendado' : 'Revisar'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mt-1">{res.reasoning}</p>
                    
                    <div className="mt-3 flex gap-4 text-xs">
                      <div className="flex-1">
                        <span className="font-bold text-green-700 block mb-1">Pontos Fortes:</span>
                        <div className="flex flex-wrap gap-1">
                          {res.pros.slice(0, 3).map((p, i) => (
                            <span key={i} className="bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">{p}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 border-l pl-4">
                        <span className="font-bold text-red-600 block mb-1">Gaps Identificados:</span>
                        <div className="flex flex-wrap gap-1">
                          {res.cons.slice(0, 3).map((c, i) => (
                            <span key={i} className="bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
