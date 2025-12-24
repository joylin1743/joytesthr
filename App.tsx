
import React, { useState, useCallback } from 'react';
import { CommContext, Tone, TransformationResult, BrandConfig } from './types';
import { CONTEXT_LABELS, TONE_LABELS } from './constants';
import { transformCommunication } from './geminiService';
import { ToneChart } from './components/ToneChart';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [context, setContext] = useState<CommContext>(CommContext.CUSTOMER_REPLY);
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [brand, setBrand] = useState<BrandConfig>({ name: '東南旅遊', coreValues: '用心服務、誠信經營、創新卓越' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TransformationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTransform = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await transformCommunication(inputText, context, tone, brand);
      setResult(data);
    } catch (err: any) {
      setError('優化過程中發生錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('內容已複製到剪貼簿！');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              HR ProVoice
            </h1>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            企業品牌形象溝通助理
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Settings & Input Column */}
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">參數設定</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">公司品牌名稱</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="請輸入公司名稱"
                    value={brand.name}
                    onChange={(e) => setBrand({...brand, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">溝通情境</label>
                  <select 
                    value={context}
                    onChange={(e) => setContext(e.target.value as CommContext)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    {Object.entries(CONTEXT_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">期望語調</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(TONE_LABELS).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => setTone(val as Tone)}
                        className={`text-xs p-2.5 rounded-lg border transition-all ${
                          tone === val 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold ring-1 ring-indigo-200' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">原始內容草稿</h2>
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-indigo-600 font-medium flex items-center transition-colors"
                >
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  重置內容
                </button>
              </div>
              <textarea
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:italic"
                placeholder="在此輸入您的原始想法... 例如：「跟客戶說我們出貨延遲了，但我們很在意他們的感受。」"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleTransform}
                  disabled={loading || !inputText.trim()}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
                    loading || !inputText.trim()
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 hover:scale-[1.01]'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>正在優化訊息中...</span>
                    </>
                  ) : (
                    <span>優化訊息內容</span>
                  )}
                </button>
              </div>
              {error && <p className="mt-2 text-xs text-red-500 text-center">{error}</p>}
            </section>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-7 space-y-6">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
                <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <p className="text-center font-medium">請在左側輸入草稿，系統將為您生成專業且符合品牌語氣的回覆內容。</p>
              </div>
            )}

            {loading && (
              <div className="animate-pulse space-y-6">
                <div className="h-64 bg-white rounded-3xl border border-slate-200 shadow-sm"></div>
                <div className="h-32 bg-white rounded-3xl border border-slate-200 shadow-sm"></div>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">優化結果</span>
                    <button 
                      onClick={() => copyToClipboard(result.revisedText)}
                      className="text-xs font-medium text-slate-600 hover:text-indigo-600 flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                      <span>複製內容</span>
                    </button>
                  </div>
                  <div className="p-8 text-slate-800 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                    {result.revisedText}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ToneChart 
                    professionalism={result.toneAnalysis.professionalism}
                    clarity={result.toneAnalysis.clarity}
                    warmth={result.toneAnalysis.warmth}
                  />

                  <div className="p-6 bg-indigo-600 rounded-3xl shadow-lg shadow-indigo-100 text-white">
                    <h4 className="text-sm font-bold mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      溝通技巧建議
                    </h4>
                    <ul className="space-y-3">
                      {result.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start text-xs leading-snug">
                          <span className="mr-2 opacity-50">•</span>
                          <span className="opacity-90">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 bg-slate-100 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">© 2025 HR ProVoice Assistant. 為東南旅遊打造專業溝通標準。</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
