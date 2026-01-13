
import React, { useState, useEffect } from 'react';

// --- Configuration ---
const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbypc9qzjJYQlCgdCG5M8qus0S-TB6ivD10fsJG8q47XlVzF9Jmz46CfilEaCrgwcz7j/exec";
const WHATSAPP_NUMBER = "923703730897"; 

// --- Types ---
type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

type LeadData = {
  name: string;
  phone: string;
  area: string;
  source: string;
};

// --- Utils ---
const logLeadToSheet = async (lead: LeadData) => {
  try {
    const data = new URLSearchParams();
    data.append('Date', new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }));
    data.append('Name', lead.name);
    data.append('Phone', lead.phone);
    data.append('Area', lead.area);
    data.append('Source', lead.source);
    data.append('Business_Type', 'Karachi Car Rental');
    data.append('Status', 'Form Submitted');

    await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data.toString(),
    });
  } catch (error) {
    console.error("Sheet logging failed", error);
  }
};

// --- Components ---
const Section: React.FC<SectionProps> = ({ children, className = "", id }) => (
  <section id={id} className={`py-20 px-6 md:px-12 max-w-7xl mx-auto ${className}`}>
    {children}
  </section>
);

const FeatureCard: React.FC<{ title: string; desc: string; icon: string }> = ({ title, desc, icon }) => (
  <div className="group bg-slate-800/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 shadow-xl text-right">
    <div className="text-3xl mb-4 bg-slate-700/50 w-12 h-12 flex items-center justify-center rounded-lg group-hover:bg-emerald-600/30 group-hover:text-emerald-400 transition-colors ml-auto mr-0">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{title}</h3>
    <p className="text-slate-300 leading-relaxed text-sm md:text-base">{desc}</p>
  </div>
);

const SEOTerm: React.FC<{ text: string }> = ({ text }) => (
  <span className="inline-block bg-slate-200 text-slate-900 px-4 py-1 rounded-lg font-bold border-b-2 border-emerald-600 shadow-sm mx-1 my-1 text-sm">
    "{text}"
  </span>
);

export default function App() {
  const [isConfirmingWA, setIsConfirmingWA] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentSource, setCurrentSource] = useState("");
  
  const [formData, setFormData] = useState({ name: '', phone: '', area: '' });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenForm = (source: string) => {
    setCurrentSource(source);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lead: LeadData = { ...formData, source: currentSource };
    await logLeadToSheet(lead);
    setShowForm(false);
    setIsConfirmingWA(true);
  };

  const handleFinalRedirect = () => {
    const message = encodeURIComponent(`اسلام علیکم لوکل باس مارکیٹنگ، میرا نام ${formData.name} ہے اور میرا کار رینٹل بزنس ${formData.area} میں ہے۔ میں اپنے بزنس کا فری آڈٹ کروانا چاہتا ہوں۔`);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(waUrl, '_blank');
    setIsConfirmingWA(false);
    setFormData({ name: '', phone: '', area: '' });
  };

  return (
    <div className="min-h-screen text-right urdu-text bg-slate-50 overflow-x-hidden">
      {/* Confirmation Screen */}
      {isConfirmingWA && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl text-center border-t-8 border-emerald-500">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg className="w-10 h-10 text-emerald-600 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.394 0 12.03a11.85 11.85 0 001.54 5.851L0 24l6.337-1.663a11.79 11.79 0 005.704 1.46h.005c6.637 0 12.032-5.395 12.036-12.031a11.83 11.83 0 00-3.669-8.508z"/>
               </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">آخری قدم باقی ہے!</h3>
            <p className="text-slate-600 font-medium leading-relaxed mb-8">
              آپ کی معلومات محفوظ کر لی گئی ہیں۔ اپنا فری آڈٹ شروع کروانے کے لیے نیچے بٹن دبا کر واٹس ایپ پر میسج بھیجیں۔
            </p>
            <button 
              onClick={handleFinalRedirect}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-5 rounded-2xl text-xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all hover:scale-105"
            >
              <span>واٹس ایپ پر تصدیق کریں</span>
            </button>
            <button 
              onClick={() => setIsConfirmingWA(false)}
              className="mt-6 text-slate-400 font-bold hover:text-slate-600 transition-colors"
            >
              کینسل کریں
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
            <div className="bg-emerald-700 p-8 text-white text-center">
               <h3 className="text-3xl font-black mb-1">Free Business Audit</h3>
               <p className="opacity-90 font-medium">نیچے دی گئی معلومات فراہم کریں</p>
            </div>
            <div className="p-8 bg-slate-50">
              <form onSubmit={handleSubmit} className="space-y-4 text-left" dir="ltr">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name (پورا نام)</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Muhammad Ahmed" 
                    className="w-full border-2 border-slate-200 bg-white p-4 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">WhatsApp Number (موبائل نمبر)</label>
                  <input 
                    required 
                    type="tel"
                    pattern="[0-9]{11}"
                    title="Please enter your 11-digit mobile number (e.g., 03001234567)"
                    placeholder="e.g. 03001234567" 
                    className="w-full border-2 border-slate-200 bg-white p-4 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  />
                  <p className="text-[10px] text-slate-400 mt-1 ml-1 text-right urdu-text">اسی نمبر پر آپ کو آڈٹ رپورٹ بھیجی جائے گی۔</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Area in Karachi (علاقہ)</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. DHA Phase 6 / Gulshan" 
                    className="w-full border-2 border-slate-200 bg-white p-4 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium" 
                    value={formData.area} 
                    onChange={(e) => setFormData({...formData, area: e.target.value})} 
                  />
                </div>
                
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-xl text-xl uppercase shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95 mt-4">
                  Get Free Audit Now
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="w-full text-slate-400 font-bold py-2 hover:text-slate-600 transition-colors">
                  Close
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center flex-row-reverse">
          <div className={`text-2xl font-black ${scrolled ? 'text-slate-900' : 'text-white'}`}>LOCAL<span className="text-emerald-500">BOSS</span></div>
          <button onClick={() => handleOpenForm('Navbar')} className={`px-6 py-2 rounded-full font-bold transition-all ${scrolled ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-white text-slate-900 hover:bg-slate-100'}`}>فری مشورہ</button>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative bg-slate-950 text-white pt-40 pb-56 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
           <img src="https://images.localbossmarketing.com/wp-content/uploads/2026/01/Whisk_a57820134e10548ba4640828d58628b5dr.jpeg" className="w-full h-full object-cover" alt="Hero" />
           <div className="absolute inset-0 bg-slate-950/80"></div>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block bg-emerald-500/20 border border-emerald-500/30 text-white px-5 py-2 rounded-full text-sm font-bold mb-8 backdrop-blur-sm">کراچی کے نمبر 1 کار رینٹل مارکیٹنگ ایکسپرٹ</div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.15] mb-8 drop-shadow-lg">ویب سائٹ تو ہے مگر <span className="text-emerald-500">بکنگ</span> نہیں آ رہی؟</h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow">مہنگی مارکیٹنگ پر پیسے ضائع کرنا بند کریں۔ ہم آپ کے بزنس کو گوگل پر "رینک" کرواتے ہیں تاکہ کسٹمرز خود آپ کو ڈھونڈیں اور براہِ راست واٹس ایپ پر رابطہ کریں۔</p>
          <button onClick={() => handleOpenForm('Hero')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-6 px-14 rounded-2xl text-2xl shadow-2xl transition-all hover:scale-105 active:scale-95">فری مشورہ حاصل کریں</button>
        </div>
      </header>

      {/* Problem Section */}
      <Section className="-mt-32 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-10 md:p-16 border border-slate-100">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-tight">آپ کا بزنس گوگل پر <span className="text-red-600 underline decoration-4 underline-offset-8">غائب</span> کیوں ہے؟</h2>
              <div className="space-y-6">
                <p className="text-lg text-slate-700 font-medium leading-relaxed">کراچی میں روزانہ ہزاروں لوگ گوگل پر گاڑیاں ڈھونڈتے ہیں۔ اگر آپ ان کی سرچ کا حصہ نہیں ہیں، تو آپ ہر روز کسٹمر کھو رہے ہیں۔</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border-r-8 border-red-500 shadow-sm">
                    <span className="text-2xl">❌</span><span className="font-bold">کیا آپ کا نام <SEOTerm text="Car Rental Near Me" /> سرچ پر آتا ہے؟</span>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border-r-8 border-red-500 shadow-sm">
                    <span className="text-2xl">❌</span><span className="font-bold">کیا آپ <SEOTerm text="Wedding Car Rental" /> کے کسٹمرز تک پہنچ پا رہے ہیں؟</span>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border-r-8 border-red-500 shadow-sm">
                    <span className="text-2xl">❌</span><span className="font-bold">کیا <SEOTerm text="Airport Pickup" /> کے آرڈرز دوسروں کے پاس جا رہے ہیں؟</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-inner border border-slate-200">
                <img src="https://images.localbossmarketing.com/wp-content/uploads/2026/01/Whisk_7daf6c8721a7fe28ee5474967c39cfc3dr.png" alt="SEO problem" className="w-full hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </Section>

      {/* Solution / Deliverables */}
      <Section>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">ایڈز پر پیسہ ضائع کرنا چھوڑیں، <span className="text-emerald-600 underline underline-offset-8 decoration-emerald-200">اثاثہ</span> بنائیں</h2>
          <p className="text-xl text-slate-700 font-medium leading-relaxed">ہم آپ کی ویب سائٹ کو ایک ایسا خودکار بکنگ سسٹم بنا دیتے ہیں جو بغیر پیسے خرچ کیے آپ کے لیے گاہک لاتا ہے۔</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard icon="🎯" title="ٹارگٹڈ لوکل SEO" desc="ہم آپ کے بزنس کو ان الفاظ پر رینک کرتے ہیں جو لوگ حقیقت میں سرچ کرتے ہیں۔" />
          <FeatureCard icon="📱" title="واٹس ایپ فرسٹ ڈیزائن" desc="کسٹمر کو ویب سائٹ پر لائیں اور بغیر کسی رکاوٹ کے واٹس ایپ چیٹ پر لیں۔" />
          <FeatureCard icon="🗺️" title="گوگل میپس ڈومینیشن" desc="کراچی کے مخصوص علاقوں جیسے ڈی ایچ اے یا گلشن میں آپ کی پہچان بنائیں۔" />
          <FeatureCard icon="⚡" title="تیز رفتار ویب سائٹ" desc="تیز رفتار ویب سائٹ کا مطلب ہے کسٹمر کا بھروسہ اور بہتر گوگل رینکنگ۔" />
          <FeatureCard icon="🚗" title="سروس پیجز" desc="ایئرپورٹ پک اپ اور شادی کی بکنگ کے لیے خصوصی پیجز جو بکنگ لاتے ہیں۔" />
          <FeatureCard icon="💡" title="فری کنسلٹیشن" desc="ہم آپ کو بتاتے ہیں کہ آپ کے بزنس کے لیے کیا صحیح ہے اور کیا غلط۔" />
        </div>
      </Section>

      {/* Why WhatsApp Visual Section */}
      <div className="bg-slate-950 py-32 relative overflow-hidden my-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row-reverse items-center gap-20 relative z-10">
          <div className="flex-1 text-white text-right">
            <h2 className="text-4xl md:text-5xl font-black mb-10 leading-tight">کراچی کا کسٹمر کیا چاہتا ہے؟</h2>
            <div className="space-y-6">
              {[
                {q: "فوری جواب", a: "کسٹمر کال سے ڈرتا ہے، وہ واٹس ایپ پر ریٹس پوچھنا چاہتا ہے۔"},
                {q: "تصویروں کا ثبوت", a: "بکنگ سے پہلے کسٹمر واٹس ایپ پر گاڑی کی اصل تصویر دیکھنا چاہتا ہے۔"},
                {q: "آسان رابطہ", a: "بغیر کسی فارم کے، براہِ راست مالک سے بات کرنا اعتماد بڑھاتا ہے۔"}
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                  <h4 className="text-xl font-bold text-emerald-400 mb-2">{item.q}</h4>
                  <p className="text-slate-300 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <img src="https://images.localbossmarketing.com/wp-content/uploads/2026/01/Whisk_2b27b6d317ff863b1e5491044f663b54dr.jpeg" alt="Customer" className="rounded-[3rem] shadow-2xl border-4 border-emerald-600/20" />
          </div>
        </div>
      </div>

      {/* Trust Metrics */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100"><div className="text-5xl font-black text-slate-900 mb-2">100%</div><div className="text-slate-500 font-bold uppercase tracking-wider text-xs">لوکل فوکس</div></div>
          <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100"><div className="text-5xl font-black text-slate-900 mb-2">24/7</div><div className="text-slate-500 font-bold uppercase tracking-wider text-xs">سپورٹ</div></div>
          <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100"><div className="text-5xl font-black text-slate-900 mb-2">0/-</div><div className="text-slate-500 font-bold uppercase tracking-wider text-xs">فری آڈٹ</div></div>
          <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100"><div className="text-5xl font-black text-slate-900 mb-2">Real</div><div className="text-slate-500 font-bold uppercase tracking-wider text-xs">نتائج</div></div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-white pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-16 leading-tight">کیا آپ کا بزنس <span className="text-emerald-500 underline underline-offset-[16px] decoration-8 decoration-emerald-500/30">نمبر 1</span> بننے کے لیے تیار ہے؟</h2>
          <button onClick={() => handleOpenForm('Footer')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-8 px-16 rounded-[2rem] text-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 mb-24">فری آڈٹ کے لیے رابطہ کریں</button>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-16 text-slate-500 font-bold">
            <div className="text-2xl text-white font-black">LOCAL<span className="text-emerald-600">BOSS</span></div>
            <p className="text-sm">© 2024 لوکل باس مارکیٹنگ - کراچی کار رینٹل گرو</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
