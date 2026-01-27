pnpm add -D typescript

pnpm tsc --init

{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}

pnpm add bcryptjs cloudinary cookie-parser dotenv express ioredis jsonwebtoken mongoose stripe

pnpm add -D nodemon \
  @types/express \
  @types/cookie-parser \
  @types/jsonwebtoken \
  @types/bcryptjs \
  @types/node

pnpm add -D tsx
