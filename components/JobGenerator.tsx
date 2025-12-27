
import React, { useState } from 'react';
import { generateJobDescription } from '../services/geminiService';
import { JobDescription } from '../types';

export const JobGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobDescription | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    setLoading(true);
    try {
      const data = await generateJobDescription(prompt);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar descrição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Gerador de Vagas</h2>
        <p className="text-slate-600 mb-6">Descreva os pontos principais da vaga e nossa IA gerará uma descrição completa e profissional.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none min-h-[120px]"
            placeholder="Ex: Preciso de um Desenvolvedor Senior React com 5 anos de experiência, inglês fluente para trabalhar remoto em uma Fintech..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Gerando...
              </>
            ) : 'Gerar Descrição Detalhada'}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-lg border-l-4 border-yellow-400 p-8 space-y-6 animate-fade-in">
          <header className="border-b pb-4">
            <h1 className="text-3xl font-bold text-slate-800">{result.title}</h1>
            <div className="flex gap-4 mt-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">{result.department}</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">{result.seniority}</span>
            </div>
          </header>

          <section>
            <h3 className="text-lg font-bold text-green-700 mb-2">Sobre a Vaga</h3>
            <p className="text-slate-700 leading-relaxed">{result.description}</p>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <section>
              <h3 className="text-lg font-bold text-green-700 mb-2">Requisitos</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {result.requirements.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </section>
            <section>
              <h3 className="text-lg font-bold text-green-700 mb-2">Responsabilidades</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {result.responsibilities.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </section>
          </div>

          <section>
            <h3 className="text-lg font-bold text-green-700 mb-2">Benefícios</h3>
            <div className="flex flex-wrap gap-2">
              {result.benefits.map((item, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                  {item}
                </span>
              ))}
            </div>
          </section>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              onClick={() => {
                const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `vaga-${result.title.toLowerCase().replace(/\s/g, '-')}.json`;
                a.click();
              }}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
            >
              Exportar JSON
            </button>
            <button 
              onClick={() => window.print()}
              className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Imprimir Vaga
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
