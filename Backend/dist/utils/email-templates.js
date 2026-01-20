"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emailTemplates = {
    registerEmailData: (fullname, email) => {
        const firstName = fullname.split(' ')[0];
        return {
            to: email,
            subject: `Ready for takeoff, ${firstName}? 🚀`,
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
                    body { font-family: 'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif; background-color: #f0fdf4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); overflow: hidden; }
                    .header-img { width: 100%; height: 220px; object-fit: cover; display: block; }
                    .content { padding: 40px; }
                    .tag { background-color: #dbeafe; color: #2563eb; padding: 6px 12px; border-radius: 100px; font-weight: 700; font-size: 12px; display: inline-block; margin-bottom: 16px; letter-spacing: 0.5px; }
                    h1 { color: #0f172a; font-size: 32px; font-weight: 800; letter-spacing: -1px; margin: 0 0 16px 0; line-height: 1.1; }
                    p { color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
                    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 32px 0; background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0; }
                    .stat-item { text-align: center; }
                    .stat-val { display: block; font-size: 24px; font-weight: 700; color: #0f172a; }
                    .stat-label { font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
                    .btn { display: block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-align: center; padding: 18px; border-radius: 14px; font-weight: 700; text-decoration: none; font-size: 16px; transition: transform 0.2s; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2); }
                    .btn:hover { transform: translateY(-2px); }
                    .footer { text-align: center; padding: 24px; background: #f8fafc; color: #94a3b8; font-size: 13px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80" alt="Adventure Travel" class="header-img"/>
                    <div class="content">
                        <span class="tag">WELCOME ABOARD</span>
                        <h1>Your Adventure Starts Now.</h1>
                        <p>Hi ${firstName}, welcome to <strong>AdventureNexus</strong>. You've just unlocked the smartest way to see the world. Our AI is ready to craft your perfect itinerary, whether you crave mountain peaks or city streets.</p>
                        
                        <div class="stats-grid">
                            <div class="stat-item"><span class="stat-val">∞</span><span class="stat-label">Trips</span></div>
                            <div class="stat-item"><span class="stat-val">AI</span><span class="stat-label">Powered</span></div>
                            <div class="stat-item"><span class="stat-val">24/7</span><span class="stat-label">Ideas</span></div>
                        </div>

                        <a href="https://yourtravelplanner.com/dashboard" class="btn">Create Your First Plan →</a>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} AdventureNexus · Explore Everywhere</p>
                    </div>
                </div>
            </body>
            </html>`
        };
    },
    deleteUserEmailData: (fullname, email) => {
        return {
            to: email,
            subject: 'We only say "See you later" 👋',
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <style>
                    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
                    .container { max-width: 500px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
                    .img-wrapper { width: 80px; height: 80px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
                    .icon { font-size: 32px; }
                    h2 { color: #1e293b; font-size: 24px; margin: 0 0 16px 0; }
                    p { color: #64748b; margin-bottom: 24px; line-height: 1.5; }
                    .btn-outline { display: inline-block; border: 2px solid #e2e8f0; color: #475569; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 14px; transition: all 0.2s; }
                    .btn-outline:hover { border-color: #cbd5e1; background: #f8fafc; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="img-wrapper"><span class="icon">�</span></div>
                    <h2>It's not goodbye.</h2>
                    <p>Hi ${fullname}, we've deleted your account as requested. The world is a big place, and if our paths cross again, we'll be here ready to plan your next journey.</p>
                    <a href="https://yourtravelplanner.com" class="btn-outline">Visit AdventureNexus</a>
                </div>
            </body>
            </html>`
        };
    },
    subscribeDailyMailEmailData: (email) => {
        return {
            to: email,
            subject: 'You\'re on the VIP List! 🌟',
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
                    body { font-family: 'Outfit', sans-serif; background-color: #fff7ed; margin: 0; }
                    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 24px; border: 2px solid #ffedd5; overflow: hidden; }
                    .hero { height: 180px; background: url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80') center/cover; position: relative; }
                    .overlay { background: linear-gradient(0deg, #ffffff 0%, transparent 100%); position: absolute; bottom: 0; left: 0; right: 0; height: 60px; }
                    .content { padding: 40px; position: relative; }
                    .badge { background: #f97316; color: white; padding: 8px 16px; border-radius: 100px; font-weight: 700; position: absolute; top: -20px; left: 40px; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.3); }
                    h1 { color: #2a1b06; font-size: 28px; margin: 16px 0; line-height: 1.2; }
                    p { color: #7c2d12; line-height: 1.6; font-size: 16px; }
                    .benefits { background: #fff7ed; border-radius: 16px; padding: 24px; margin: 24px 0; }
                    .benefit { display: flex; align-items: start; gap: 12px; margin-bottom: 16px; font-weight: 600; color: #431407; }
                    .benefit:last-child { margin-bottom: 0; }
                    .check { background: #fdba74; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="hero"><div class="overlay"></div></div>
                    <div class="content">
                        <span class="badge">VIP STATUS: ACTIVE</span>
                        <h1>Get ready for daily inspiration.</h1>
                        <p>You've just joined the AdventureNexus Daily Club. We'll send you one bite-sized travel secret every morning to fuel your wanderlust.</p>
                        
                        <div class="benefits">
                            <div class="benefit"><span class="check">✓</span> Discover "Hidden Gem" spots</div>
                            <div class="benefit"><span class="check">✓</span> Exclusive local food guides</div>
                            <div class="benefit"><span class="check">✓</span> Smart budget hacks</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>`
        };
    },
    sendDailyTipEmailData: (email, tipData) => {
        const date = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const categoryImages = {
            "Hidden Gem": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
            "Culture": "https://images.unsplash.com/photo-1533669919207-04b7453Ac78d?auto=format&fit=crop&w=800&q=80",
            "Savings": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
            "Safety": "https://images.unsplash.com/photo-1470290449668-02dd93d9420a?auto=format&fit=crop&w=800&q=80"
        };
        const heroImage = categoryImages[tipData.category] || "https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?auto=format&fit=crop&w=800&q=80";
        return {
            to: email,
            subject: `💡 Tip of the Day: ${tipData.headline}`,
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; margin: 0; }
                    .card { max-width: 500px; margin: 20px auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                    .img-container { height: 250px; background-image: url('${heroImage}'); background-size: cover; background-position: center; position: relative; }
                    .date-pill { position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); color: white; padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
                    .content { padding: 32px; }
                    .cat { color: #8b5cf6; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; display: block; }
                    h1 { font-size: 24px; margin: 0 0 16px; color: #111; line-height: 1.3; font-weight: 800; }
                    p { color: #555; line-height: 1.6; font-size: 16px; margin-bottom: 24px; }
                    .insight { background: #f5f3ff; border-radius: 12px; padding: 16px; border: 1px solid #ddd6fe; color: #5b21b6; font-size: 14px; display: flex; gap: 12px; }
                    .emoji { font-size: 20px; }
                    .btn { display: block; background: #111; color: #fff; text-align: center; padding: 16px; border-radius: 12px; text-decoration: none; font-weight: 700; margin-top: 32px; transition: opacity 0.2s; }
                    .btn:hover { opacity: 0.9; }
                    .footer { text-align: center; padding: 20px; color: #aaa; font-size: 11px; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="img-container">
                        <span class="date-pill">${date}</span>
                    </div>
                    <div class="content">
                        <span class="cat">${tipData.category || 'PRO TIP'}</span>
                        <h1>${tipData.headline}</h1>
                        <p>${tipData.advice || tipData.actionable_update}</p>
                        
                        ${tipData.local_insight ? `
                        <div class="insight">
                            <span class="emoji">🤫</span>
                            <div><strong>Local Secret:</strong><br/>${tipData.local_insight}</div>
                        </div>` : ''}

                        <a href="https://yourtravelplanner.com/explore" class="btn">Plan a Trip to ${tipData.location}</a>
                    </div>
                </div>
                <div class="footer">AdventureNexus Daily Brief · <a href="#" style="color:#aaa">Unsubscribe</a></div>
            </body>
            </html>`
        };
    }
};
exports.default = emailTemplates;
