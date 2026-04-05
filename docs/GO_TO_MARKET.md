# TocToc — Piano Go-to-Market: Da 1 Palazzo a 100 Palazzi senza Budget Pubblicitario

> Strategia di lancio per Torino (replicabile in qualsiasi città italiana)

---

## 📍 La Premessa: Il Problema del Cold-Start

Ogni app di comunità locale soffre del paradosso dell'uovo e della gallina:
- **Nessuno installa l'app** se i vicini non la usano
- **I vicini non la usano** se nessuno l'ha installata

TocToc risolve questo problema con un meccanismo virale **offline → online**: il **Volantino Condominio**.

---

## 🗺️ Fase 1 — Il Nucleo Iniziale (settimane 1–4)

### Obiettivo: 5 palazzi attivi a Torino

**Tattica: L'Elevator Pitch Letterale**

1. Il fondatore (o un community manager) identifica **5 palazzi** nei quartieri
   Crocetta, San Salvario, Vanchiglia — aree con alta densità abitativa e
   affittuari giovani (>18–35 anni, digitalmente attivi).

2. Si entra nel palazzo durante le ore diurne e si attacca **un solo foglio A4**
   all'interno dell'ascensore o vicino alle cassette della posta:

   ```
   Ciao Vicino! 👋
   Ho creato la bacheca digitale del nostro palazzo su TocToc.
   Scansiona qui per pacchi, prestiti e ordini di gruppo.
   [QR CODE]
   🔔 toctoc.app/join?building=XXXX
   ```

3. Il QR rimanda direttamente alla schermata del palazzo su TocToc.
   L'onboarding è **anonimo e in meno di 20 secondi** (nessun form, nessuna email).

**KPI Fase 1:**
- ≥ 3 utenti attivi per palazzo
- ≥ 1 post creato entro 48h dall'installazione del volantino

---

## 📈 Fase 2 — Il Flywheel (mesi 2–3)

### Obiettivo: 30 palazzi attivi

**Il meccanismo di crescita organica:**

```
Utente installa TocToc
        ↓
Risolve un problema reale (pacco, trapano, pizza in gruppo)
        ↓
Ha un'esperienza positiva con un vicino
        ↓
Apre "Profilo" → tappa "Invita il tuo condominio"
        ↓
Genera il volantino personalizzato dall'app
        ↓
Stampa e attacca nel proprio palazzo
        ↓
Nuovi vicini installano TocToc
        ↓
[loop]
```

**Azioni di supporto:**
- Post organici su **Nextdoor Italia** e gruppi Facebook di quartiere
  ("Ho creato una cosa per il nostro quartiere, è gratis e anonima")
- Contatto diretto con **amministratori di condominio** (offerta: dashboard
  gratuita per comunicare agli inquilini via TocToc)
- Presenza su **Reddit r/italy** e **r/torino** con un approccio genuino,
  non promozionale

---

## 💰 Fase 3 — Monetizzazione Locale (mese 4+)

### Il modello "Vicino Sponsor"

I **Sponsored Post** sono il cuore del modello di revenue: appaiono come post
normali nella bacheca, ma con un badge dorato "⭐ Sponsorizzato".

**Chi paga:**
- Panetterie e bar di quartiere (offerta mensile a €29/mese)
- Lavanderie, idraulici, elettricisti di zona
- Supermercati locali per promozioni flash ("Fragole fresche: ultimi 2 kg!")

**Perché funziona:**
- Il commerciante raggiunge **solo i residenti del palazzo/quartiere** —
  zero dispersione geografica
- Il messaggio è **contestuale** (appare tra post di vicini reali) →
  alta rilevanza percepita
- CPM effettivo stimato: **€8–12** vs €25–40 per Meta Ads localizzate

**Dashboard Sponsor (roadmap):**
- Inserimento autonomo del post sponsorizzato
- Selezione del raggio geografico (100m / 500m / 1km)
- Report: impression, tap, conversioni

---

## 🔢 Proiezioni

| Mese | Palazzi attivi | Utenti DAU | Revenue mensile |
|------|---------------|------------|-----------------|
| 1    | 5             | ~40        | €0              |
| 3    | 30            | ~240       | €0              |
| 6    | 100           | ~800       | ~€290 (10 sponsor) |
| 12   | 400           | ~3.200     | ~€1.450 (50 sponsor) |

---

## 🏆 Il Vantaggio Competitivo

| Dimensione       | TocToc                        | WhatsApp gruppi              |
|------------------|-------------------------------|------------------------------|
| Privacy          | Anonimo al 100%               | Numero di telefono visibile  |
| Onboarding       | < 20 secondi, QR code         | Admin deve aggiungere        |
| Scadenza post    | 24h (feed pulito)             | Storia infinita e caotica    |
| Raggio           | 100m (solo il tuo palazzo)    | Chiunque venga aggiunto      |
| Monetizzazione   | Sponsor nativi iperlocali     | Nessuna                      |

---

## 📋 Checklist Lancio Torino

- [ ] Preparare 50 volantini A4 con QR personalizzati per 50 palazzi target
- [ ] Identificare 3 community manager volontari (studenti fuorisede, pensionati attivi)
- [ ] Creare profilo Instagram `@toctoc.torino` con contenuti "vicini reali, storie reali"
- [ ] Contattare 5 panetterie / bar di quartiere per il primo slot sponsor gratuito (30gg)
- [ ] Impostare Firestore security rules per `sponsored_posts` (solo admin può approvare)
- [ ] Configurare Firebase Analytics per tracciare `invite_sent`, `post_created`, `chat_opened`
- [ ] A/B test: volantino con emoji vs. volantino minimal — misurare conversion rate QR

---

## 💡 Il Principio Guida

> **"Non fare marketing. Fai sentire le persone meno sole."**

TocToc non è un'app di social media.
È uno strumento che risolve micro-problemi quotidiani (il pacco, il trapano,
la pizza) e in farlo, costruisce la fiducia tra sconosciuti che condividono
le stesse scale.

Il volantino nell'ascensore non è pubblicità — è un **atto di cura** da parte
di un vicino che vuole rendere il palazzo un posto migliore.
*Questo* è il motivo per cui funziona.

---

*Documento redatto per il lancio di TocToc — versione 1.0*
