# AdventureNexus Backend Docker Deployment Guide

Ei backend service ta Docker use kore deploy korar jonno niche deya step gulo follow koro.

## 1. Automatic Deployment (GitHub Actions) - RECOMMENDED
Ami ekta GitHub Actions workflow তৈরি করে দিয়েছি (`.github/workflows/docker-build.yml`) যা প্রতিবার `main` ব্রাঞ্চে `Backend` ফোল্ডারের কোড পুশ করলে অটোমেটিক `--no-cache` মোডে বিল্ড এবং ডকার হাবে পুশ করে দেবে।

**এটি সেটআপ করার জন্য:**
1. GitHub এ আপনার রিপোজিটরিতে যান।
2. **Settings** > **Secrets and variables** > **Actions** এ যান।
3. নিচের দুটি **Repository secrets** অ্যাড করুন:
   - `DOCKERHUB_USERNAME`: `samiransamanta`
   - `DOCKERHUB_TOKEN`: (আপনার Docker Hub Access Token টি এখানে দিন)

এখন থেকে আপনি যখনই কোড পুশ করবেন, GitHub অটোমেটিক আপনার ইমেজটি আপডেট করে দেবে।

---

## 2. Manual Build & Push (Alternative)
যদি ম্যানুয়ালি নিজের পিসি থেকে করতে চান:

### Build Image
```bash
docker build --no-cache -t samiransamanta/adventure-nexus-backend .
```

### Push Image
```bash
docker login
docker push samiransamanta/adventure-nexus-backend
```

---

## 3. Deploy to Render
1. Render dashboard e jao.
2. **New +** button e click kore **Web Service** select koro.
3. **Existing Image** option ta choose koro.
4. Image URL e likho: `docker.io/samiransamanta/adventure-nexus-backend:latest`.
5. **Environment Variables** section e tomar `.env` file er shob key-value gulo add kore dao.
6. Deploy button e click koro!

---

### Dockerfile Summary:
- **Base Image**: `node:20-alpine` (Lightweight and secure).
- **Multi-stage Build**: TypeScript বিল্ড এবং প্রোডাকশন অপ্টিমাইজেশন করা হয়েছে।
- **Port**: 5000 (Render dynamic PORT হ্যান্ডেল করবে)।
