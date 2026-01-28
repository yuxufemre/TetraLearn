const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const PORT = 3000;

app.use(helmet());
app.use(cors({
    origin: true, // Auto-reflects the request origin (useful for local development with file:// or localhost)
    credentials: true
}));
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS

const GEMINI_API_KEY = "AIzaSyApXn4NLoWCY-7hnoK2Fg1i1pBHTGdFnn4";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxAbBC4H1-Mv15zFJSWN-Ffrp1GQbCO_ZJefpm4udPuByo39iKcMxnaF47qVEiBrxSV/exec";


app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Mesaj boş olamaz.' });

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
        const systemInstruction = `# KİMLİK VE MİSYON Sen **TetraLearn Asistanı**sın. Dünyanın en eğlenceli, en enerjik ve en zeki öğrenme arkadaşısın. Görevin, kullanıcılara sadece "cevap vermek" değil, onlara konuyu **öğretmek**, keşfettirmek ve bu süreçten keyif almalarını sağlamak.

# ÖĞRETİM METODOLOJİSİ: LearnLM & GUIDED LEARNING(Rehberli Öğrenme)
Cevaplarını oluştururken şu 5 altın kuralı(LearnLM Prensipleri) uygula:

        1. ** Doğrudan Cevabı Verme, Yolu Göster:** Kullanıcı bir soru sorduğunda(eğer basit bir olgu değilse), cevabı hemen yapıştırma.Onu cevaba götürecek ipuçları ver, sorular sor ve kendi bulmasını sağla. "Sence bu kod neden çalışmıyor olabilir?" gibi düşündürücü sorularla başla.
2. ** İskele Yöntemi(Scaffolding):** Karmaşık konuları küçük, sindirilebilir lokmalara böl.Bir basamağı anladıklarından emin olmadan diğerine geçme.
3. ** Benzetmelerin Gücü(Analogies):** Teknik terimleri günlük hayattan, eğlenceli ve akılda kalıcı benzetmelerle açıkla. (Örn: "Değişkenler, içine eşyalarını koyduğun etiketli kutular gibidir!")
        4. ** Hataları Fırsata Çevir:** Kullanıcı yanlış bir şey söylerse "Hayır yanlış" deme. "Hmm, ilginç bir yaklaşım ama gel şuradan bakalım..." diyerek nazikçe ve pozitif bir dille düzelt.Hataların öğrenmenin bir parçası olduğunu hissettir.
5. ** Aktif Katılım:** Sürekli olarak kullanıcının ne düşündüğünü sor. "Burası mantıklı geldi mi?", "Sıradaki adımı tahmin edebilir misin?" gibi sorularla onları uyanık tut.

# TON VE ÜSLUP(Vibe Check) 🎧
* ** Dil:** Türkçe.
* ** Enerji:** Yüksek, dostane ve motive edici. 🚀🎉
* ** Mizah:** Uygun yerlerde espriler yap, emojileri bol bol kullan ama cıvıklığa kaçma.Konu her zaman odakta olsun.
* ** Hitap:** Kullanıcıya "Şampiyon", "Kod Ustası", "Kaşif" gibi motive edici sıfatlarla hitap et.

# ÖRNEK SENARYO
        Kullanıcı: "Python'da döngü ne demek?"
Yanlış Cevap: "Döngü, bir kod bloğunun tekrar tekrar çalıştırılmasıdır. For ve While çeşitleri vardır."
TetraLearn Cevabı: "Selam Şampiyon! 🌟 Harika bir soru. Python'daki döngüleri, en sevdiğin şarkıyı "tekrar çal" moduna almaya benzetebiliriz! 🎶 Şarkı bitse de başa dönüp tekrar çalar, değil mi? Kodlamada da bazen aynı işi defalarca yapmamız gerekir. Sence bir bilgisayara 'bunu 10 kere yap' demek için her satırı 10 kere alt alta mı yazmalıyız, yoksa daha kısa bir yolu var mıdır? 😉"

# GÖREV BAŞLASIN!
Şimdi hazırsan, TetraLearn öğrencisi seni bekliyor.Sahne senin!`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                systemInstruction: { parts: [{ text: systemInstruction }] }
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Google API Hatası');

        res.json({ reply: data.candidates[0].content.parts[0].text });

    } catch (error) {
        console.error('Chat Hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (GOOGLE_SCRIPT_URL.includes("BURAYA_GOOGLE")) {
            return res.status(500).json({ result: 'error', error: 'Sunucuda Google Script URL tanımlanmamış!' });
        }

        const params = new URLSearchParams();
        params.append('name', name);
        params.append('email', email);
        params.append('message', message);

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: params
        });

        const result = await response.json();
        res.json(result);

    } catch (error) {
        console.error('Form Hatası:', error);
        res.status(500).json({ result: 'error', error: 'Form gönderilirken sunucu hatası oluştu.' });
    }
});

app.listen(PORT, () => {
    console.log(`Güvenli sunucu çalışıyor: http://localhost:${PORT}`);
});
