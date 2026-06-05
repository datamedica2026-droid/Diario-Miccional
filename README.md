# Diario Miccional
### Desarrollado por InnoIA · Verificado por CURG

> Herramienta clínica digital para el seguimiento urológico del tracto urinario inferior. Registra, analiza y comparte diarios miccionales en tiempo real entre paciente y médico.

---

## ¿Qué es?

**Diario Miccional** es una Progressive Web App (PWA) de dos interfaces diseñada para urología clínica:

- **App del paciente** — registra micciones, bebidas y fugas con cronómetro, análisis acústico del flujo, bienestar diario y horario de sueño.
- **Panel del médico** — visualiza registros en tiempo real, gráficas clínicas, análisis acústico, alertas automáticas, interconsultas entre colegas y análisis comparativo por clínica.

---

## Tecnología

| Capa | Tecnología |
|---|---|
| Frontend | HTML5 + CSS3 + JavaScript (ES Modules) |
| Backend | Google Firebase (Firestore + Authentication) |
| Hosting | Vercel (CD automático desde GitHub) |
| Análisis acústico | Web Audio API |
| Gráficas | Chart.js 4.4 |
| Iconos | Tabler Icons |
| Excel export | SheetJS (xlsx) |
| QR | QRCode.js |
| PWA | Service Worker + Web App Manifest |

---

## Archivos

```
├── paciente.html       # App del paciente (PWA instalable)
├── medico.html         # Panel médico (dashboard)
├── privacidad.html     # Política de privacidad pública
├── index.html          # Redirección a paciente.html
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker (caché offline)
├── icon-192.svg        # Icono app 192px
├── icon-512.svg        # Icono app 512px
├── icon-192.png        # Icono app 192px (PNG)
└── icon-512.png        # Icono app 512px (PNG)
```

---

## Funcionalidades principales

### App del paciente
- Conexión por código médico (`XXXX-XXXX`) o registro QR automático
- Cronómetro de micción con análisis acústico en tiempo real (Web Audio API)
  - Calibración de ruido ambiente (2s) → clasificación: débil / bajo / normal / fuerte
- Registro de bebidas, fugas, bienestar y horario de sueño
- Análisis con semáforos clínicos, gráficas de frecuencia y volumen
- Tendencia semanal comparativa
- Historial completo filtrable por fecha
- Mensajes del médico con notificación visual
- Recordatorios personalizables (hora de levantada, agua, micción, dormir)
- Descarga de informe clínico en HTML
- Modo oscuro / claro · Bilingüe ES/EN
- Instalable como app (PWA) · Banner offline automático

### Panel del médico
- Autenticación Firebase (registro, login, recuperación de contraseña)
- Gestión de pacientes por clínica y año de seguimiento
- Vista en tiempo real: diario filtrable por fecha, gráficas, análisis acústico
- Alertas automáticas: polaquiuria, poliuria, fugas, inactividad >3 días
- Análisis comparativo entre pacientes de una clínica
- Sistema de interconsultas con código temporal de 48h
- Tarjetas de colegas estilo LinkedIn con interconsulta directa
- Ficha imprimible con QR de conexión automática
- Exportar datos en CSV y Excel (.xlsx)
- Informe técnico completo descargable
- Foto de perfil del médico
- Modo oscuro / claro · Bilingüe ES/EN

---

## Base científica

| Referencia | Aplicación |
|---|---|
| ICS Standardisation 2019 | Parámetros normales del tracto urinario inferior |
| EAU Guidelines 2023 | Rangos de flujo, nicturia, frecuencia |
| Tsui et al., J Urology 2006 | Metodología del análisis acústico del flujo |
| Ley 1581/2012 Colombia | Base legal de tratamiento de datos |

---

## Estructura de datos (Firestore)

```
doctors/{uid}
  ├── nombre, especialidad, clinicas[], email, photoURL

patients/{id}
  ├── nombre, fechaNac, genero, telefono, email
  ├── diagnostico, medicoTratante, clinica, yearInicio
  ├── doctorId, accessCode, status, notes[], lastRecord
  ├── records/{id}    → type, date, hora, vol, dur, flow,
  │                     urgency, pos, genero, notas, acoustics{}
  ├── sleep/{date}    → wake, sleep, date
  └── wellbeing/{date}→ wellbeing, pain, date

consultations/{id}
  ├── patientId, patientName
  ├── fromDoctorId, fromDoctorName
  ├── code, status, expiresAt, notes[]
```

---

## Reglas de Firestore recomendadas

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /doctors/{doctorId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == doctorId;
    }
    match /patients/{patientId} {
      allow read, write: if true;
      match /records/{r} { allow read, write: if true; }
      match /sleep/{s} { allow read, write: if true; }
      match /wellbeing/{w} { allow read, write: if true; }
    }
    match /consultations/{consultId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Despliegue

1. Fork o clona este repositorio
2. Conecta el repo a [Vercel](https://vercel.com) — despliegue automático en cada push
3. Configura Firebase:
   - Habilita **Firestore** y **Authentication (Email/Password)**
   - Publica las reglas de Firestore (ver arriba)
   - Agrega el dominio de Vercel a **Authentication → Dominios autorizados**
4. Accede al panel médico: `tudominio.vercel.app/medico.html`
5. Accede a la app del paciente: `tudominio.vercel.app/paciente.html`

---

## Demo en producción

🔗 [diario-miccional-inky.vercel.app](https://diario-miccional-inky.vercel.app)

---

## Contacto y soporte

**CURG — Colombian Urology Research Group**
📧 [diariomiccional.info@researchcurg.com](mailto:diariomiccional.info@researchcurg.com)

**Privacidad de datos**
📧 [diariomiccional.info@researchcurg.com](mailto:diariomiccional.info@researchcurg.com)
🔗 [Política de privacidad completa](https://diario-miccional-inky.vercel.app/privacidad.html)

---

## Licencia

© 2026 InnoIA · Verificado por CURG (Colombian Urology Research Group).
Todos los derechos reservados. Uso clínico exclusivo bajo supervisión médica.

---

<div align="center">
  <sub>Desarrollado por <strong>InnoIA</strong> · Verificado por <strong>CURG</strong> · v2.0 · 2026</sub>
</div>
