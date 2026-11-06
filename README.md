# Series 7A

Aplicación web completa para gestionar plataformas de streaming, series y valoraciones personales.

## Tecnologías

- Next.js 15 y React 19
- TypeScript
- Tailwind CSS
- Supabase/PostgreSQL
- Despliegue preparado para Vercel

## Ejecutar en Windows

1. Instalar Node.js 20 o superior.
2. Desde PowerShell, instalar dependencias:
   ```powershell
   npm install
   ```
3. Crear `.env.local` a partir de `.env.example` y completar los datos públicos del proyecto Supabase.
4. Ejecutar:
   ```powershell
   npm run dev
   ```
5. Abrir `http://localhost:3000`.

## Configurar Supabase

1. Crear un proyecto en Supabase.
2. En **SQL Editor**, ejecutar el archivo `supabase/migrations/001_initial_schema.sql`.
3. Copiar **Project URL** y **anon public key** desde **Project Settings > API**.
4. Completar esas credenciales en `.env.local`.

Para desplegar sin autenticación, la migración habilita políticas públicas. Para una aplicación con cuentas reales, se recomienda reemplazar estas políticas por reglas basadas en usuarios autenticados.

Las relaciones impiden asociar una serie a una plataforma distinta de la plataforma seleccionada al crearla o valorararla.

## Comprobaciones locales

```powershell
npm run typecheck
npm run build
```

## Publicar en GitHub desde Windows

Desde la carpeta del proyecto:

```powershell
git init
git add .
git commit -m "Aplicación completa de catalogación de series"
git branch -M main
git remote add origin https://github.com/USUARIO/seriesCatalogacion_7A.git
git push -u origin main
```

Si el repositorio ya tiene `origin`, actualizarlo con:

```powershell
git remote set-url origin https://github.com/USUARIO/seriesCatalogacion_7A.git
```

## Desplegar en Vercel

1. Importar el repositorio en Vercel.
2. Seleccionar Next.js como framework.
3. En **Environment Variables**, configurar:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Ejecutar el despliegue.
5. Volver a ejecutar la migración de Supabase si la base de datos aún no fue creada.

Los datos de Supabase persisten independientemente del estado del despliegue de Vercel.
