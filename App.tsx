
import React, { useState } from 'react';
import { AppView } from './types';
import { JobGenerator } from './components/JobGenerator';
import { CVAnalyzer } from './components/CVAnalyzer';
import { InterviewScript } from './components/InterviewScript';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case AppView.JOB_GENERATOR:
        return <JobGenerator />;
      case AppView.CV_ANALYZER:
        return <CVAnalyzer />;
      case AppView.INTERVIEW_SCRIPT:
        return <InterviewScript />;
      default:
        return (
          <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto px-4">
            <div 
              onClick={() => setCurrentView(AppView.JOB_GENERATOR)}
              className="bg-white p-8 rounded-2xl shadow-md border-b-4 border-green-700 hover:-translate-y-2 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-700 group-hover:text-white transition-colors text-green-700">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Gerador de Vagas</h3>
              <p className="text-slate-600">Crie descrições atraentes e estruturadas em segundos usando nossa IA treinada para RH.</p>
            </div>

            <div 
              onClick={() => setCurrentView(AppView.CV_ANALYZER)}
              className="bg-white p-8 rounded-2xl shadow-md border-b-4 border-yellow-400 hover:-translate-y-2 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 bg-yellow-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-400 group-hover:text-slate-900 transition-colors text-yellow-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Analista de CVs</h3>
              <p className="text-slate-600">Triagem automática de até 50 currículos. Identifique os melhores talentos instantaneamente.</p>
            </div>

            <div 
              onClick={() => setCurrentView(AppView.INTERVIEW_SCRIPT)}
              className="bg-white p-8 rounded-2xl shadow-md border-b-4 border-slate-800 hover:-translate-y-2 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-800 group-hover:text-white transition-colors text-slate-700">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Roteiro Inteligente</h3>
              <p className="text-slate-600">Perguntas personalizadas para cada vaga, focando em competências reais e fit cultural.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentView(AppView.DASHBOARD)}
          >
            <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl">H</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">HR <span className="text-green-700">INTELLECT</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setCurrentView(AppView.JOB_GENERATOR)}
              className={`font-medium transition-colors ${currentView === AppView.JOB_GENERATOR ? 'text-green-700' : 'text-slate-500 hover:text-green-700'}`}
            >
              Vagas
            </button>
            <button 
              onClick={() => setCurrentView(AppView.CV_ANALYZER)}
              className={`font-medium transition-colors ${currentView === AppView.CV_ANALYZER ? 'text-green-700' : 'text-slate-500 hover:text-green-700'}`}
            >
              Analista
            </button>
            <button 
              onClick={() => setCurrentView(AppView.INTERVIEW_SCRIPT)}
              className={`font-medium transition-colors ${currentView === AppView.INTERVIEW_SCRIPT ? 'text-green-700' : 'text-slate-500 hover:text-green-700'}`}
            >
              Entrevistas
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-xs">AI</div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-400 uppercase tracking-widest">Premium Suite</span>
          </div>
        </div>
      </nav>

      {/* Hero Section if in Dashboard */}
      {currentView === AppView.DASHBOARD && (
        <div className="bg-green-700 text-white py-20 px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Contratações <span className="text-yellow-400">Inteligentes.</span></h1>
          <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto opacity-90">
            Acelere seu processo seletivo em até 10x com ferramentas alimentadas por inteligência artificial generativa.
          </p>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <p>&copy; 2024 HR Intellect - Recrutamento de Alta Performance. Desenvolvido com Gemini AI.</p>
      </footer>
    </div>
  );
};

export default App;
