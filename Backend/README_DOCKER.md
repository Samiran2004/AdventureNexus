# AdventureNexus Backend Docker Deployment Guide

Ei backend service ta Docker use kore deploy korar jonno niche deya step gulo follow koro.

## 1. Build the Docker Image
Tomar terminal e backend directory te thaka obosthay ei command ta chalao:
```bash
docker build -t samiransamanta/adventure-nexus-backend .
```

## 2. Push to Docker Hub
Prothome login koro (jodi age na kora thake):
```bash
docker login
```
Tarpor image ta push koro:
```bash
docker push samiransamanta/adventure-nexus-backend
```

## 3. Deploy to Render
1. Render dashboard e jao.
2. **New +** button e click kore **Web Service** select koro.
3. **Existing Image** option ta choose koro.
4. Image URL e likho: `docker.io/samiransamanta/adventure-nexus-backend:latest`.
5. **Environment Variables** section e tomar `.env` file er shob key-value gulo add kore dao. (Render automatically `PORT` provide korbe, tai manually deyar dorkar nai jodi na chaw).
6. Deploy button e click koro!

---

### Dockerfile Summary:
- **Base Image**: `node:20-alpine` (Lightweight and secure).
- **Multi-stage Build**: Prothome TypeScript build hoye `dist` folder create korbe, tarpor sudhu proyojoniyo files gulo production image e copy hobe. Er fole image size khub e choto hobe.
- **Port**: 5000 expose kora hoyeche, kintu Render `PORT` env variable use kore dynamic vabe handle korbe.
