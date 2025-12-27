
import React, { useState } from 'react';
import { generateInterviewGuide } from '../services/geminiService';
import { InterviewGuide } from '../types';

export const InterviewScript: React.FC = () => {
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<InterviewGuide | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jd) return;
    setLoading(true);
    try {
      const data = await generateInterviewGuide(jd);
      setGuide(data);
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar roteiro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Roteiro de Entrevista</h2>
        <p className="text-slate-600 mb-6">Insira a descrição da vaga para gerar perguntas estratégicas e o que esperar de cada resposta.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none min-h-[150px]"
            placeholder="Cole aqui a descrição da vaga..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md disabled:opacity-50"
          >
            {loading ? 'Preparando Perguntas...' : 'Gerar Roteiro Inteligente'}
          </button>
        </form>
      </div>

      {guide && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 space-y-8 animate-fade-in">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Guia de Entrevista</h1>
              <p className="text-green-700 font-medium">{guide.jobTitle}</p>
            </div>
            <button 
              onClick={() => window.print()}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              PDF / Imprimir
            </button>
          </div>

          <div className="space-y-8">
            {['Técnica', 'Comportamental', 'Cultura'].map(category => {
              const questions = guide.questions.filter(q => q.category.toLowerCase().includes(category.toLowerCase()));
              if (questions.length === 0) return null;
              
              return (
                <section key={category}>
                  <h3 className="text-lg font-bold text-green-800 uppercase tracking-wider mb-4 border-l-4 border-yellow-400 pl-3">{category}</h3>
                  <div className="space-y-6">
                    {questions.map((q, i) => (
                      <div key={i} className="bg-slate-50 rounded-lg p-5 border border-slate-100">
                        <p className="text-slate-900 font-semibold text-lg mb-3">"{q.question}"</p>
                        <div className="bg-white rounded p-3 border border-slate-200">
                          <span className="text-xs font-bold text-green-700 uppercase block mb-1">O que avaliar na resposta:</span>
                          <p className="text-slate-600 text-sm leading-relaxed">{q.expectedAnswer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
