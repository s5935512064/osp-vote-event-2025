
				import createSSRHandler from './.netlify/build/entry.mjs';
				export default createSSRHandler({"cacheOnDemandPages":false,"notFoundContent":"<!DOCTYPE html><html lang=\"th\" data-astro-cid-zetdm5md> <head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>กำลังเปลี่ยนหน้า...</title><!-- Meta refresh เป็น fallback หลัก --><meta http-equiv=\"refresh\" content=\"0; url={redirectUrl}\"><!-- Preconnect สำหรับ performance --><link rel=\"preconnect\" href=\"https://theoldsiam.co.th\"><style>body{font-family:Prompt,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff}.container[data-astro-cid-zetdm5md]{text-align:center;padding:2rem}.spinner[data-astro-cid-zetdm5md]{border:4px solid rgba(255,255,255,.3);border-radius:50%;border-top:4px solid white;width:40px;height:40px;animation:spin 1s linear infinite;margin:0 auto 1rem}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n</style></head> <body data-astro-cid-zetdm5md> <div class=\"container\" data-astro-cid-zetdm5md> <div class=\"spinner\" data-astro-cid-zetdm5md></div> <h1 data-astro-cid-zetdm5md>กำลังพาไปยังหน้าใหม่...</h1> <p data-astro-cid-zetdm5md>หากไม่ได้เปลี่ยนหน้าโดยอัตโนมัติ <a href=\"/event/2025/pride-month-vote\" style=\"color: #ffeb3b;\" data-astro-cid-zetdm5md>คลิกที่นี่</a></p> </div> <script type=\"module\">(function(){const a=new URLSearchParams(window.location.search);let r=\"/event/2025/pride-month-vote\";const c=[\"utm_source\",\"utm_medium\",\"utm_campaign\",\"ref\",\"source\",\"lang\"],e=new URLSearchParams;c.forEach(t=>{if(a.has(t)){const o=a.get(t);o!==null&&e.set(t,o)}});const n=r+(e.toString()?\"?\"+e.toString():\"\");window.location.replace(n),setTimeout(()=>{window.location.href=n},100)})();</script> </body> </html>"});
				export const config = {
					includedFiles: ['**/*'],
					name: 'Astro SSR',
					nodeBundler: 'none',
					generator: '@astrojs/netlify@6.5.6',
					path: '/*',
					preferStatic: true,
				};
			