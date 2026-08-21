# رفع WarHex إلى GitHub من Termux

بعد فك الضغط ادخل مجلد المشروع ثم نفّذ:

```bash
cd ~/storage/downloads/WarHex-Ready/Project-111111111-main
git init
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/walid4mp/Project-111111111.git
git add .
git commit -m "WarHex auth payments and mobile fixes"
git push -u origin main --force
```

**مهم:** لا ترفع `.env.local`. الأسرار توضع في Render/GitHub Secrets فقط.

بعد الرفع شغّل GitHub Actions. Workflow Android يبني APK وDebug AAB كـ artifacts.
