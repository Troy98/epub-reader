# Installatie Handleiding

In dit hoofdstuk wordt beschreven hoe de applicatie gestart kan worden wordt.

### clone van de repository

Om de applicatie te kunnen draaien is het nodig om de repository te clonen. Dit kan gedaan worden door de volgende commando's uit te voeren:

```console
git clone https://github.com/HANICA-DWA/sep2022-project-Andorra.git
```

### Accounts
Accounts die standaard gebruikt worden in de applicatie

#### Gmail
Voor deze applicatie zijn 2 gmail accounts aangemaakt, 1 voor algemeen gebruik en 1 voor de E2E tests

| Account                         | Invoeren bij                                                             |
|---------------------------------|--------------------------------------------------------------------------|
| thereadablereader@gmail.com     | -                                                                        |
| readablereadertesting@gmail.com | ```readable_reader/src/__tests__/helperFunctions.e2e.js``` regel 14 & 15 |

> :warning: Bij regel 14 en 15 hoor je het wachtwoord in te voeren.

> :warning: De wachtwoorden zijn niet in deze repo te vinden, die zijn op andere wijzen aangeboden.

Het wachtwoord in de helperFunctions is leeg gelaten, deze zal handmatig ingevuld moeten worden.

#### Dropbox

> :warning: Dit stukje is niet verplicht om de applicatie te kunnen draaien, maar is wel nodig om de applicatie te kunnen testen.

Voor dropbox zijn ook een aantal keys en secrets aangemaakt die later met een ander account kunnen worden aangepast.
Het standaard account dat hiervoor gebruikt is, is ```thereadablereader@gmail.com``` Bij de volgende link kan je de keys en secrets vinden: https://www.dropbox.com/developers/apps
> :warning: De wachtwoorden zijn niet in deze repo te vinden, die zijn op andere wijzen aangeboden.

Wanneer de applicatie op een server gehost zal gaan worden zal het domein van dropbox ook bijgewerkt moeten worden, dit kan [hier](https://www.dropbox.com/developers/apps/info/96d8yoynjw5yarm) aangepast worden.
Op deze link zijn ook de app key en app secret te vinden, de app key moet in beide de readable_reader client en server ingesteld worden in het .env bestand, de secret is alleen in de server nodig.

Op het account ```thereadablereader@gmail.com``` staan ook al een aantal bestanden in de dropbox map, deze kunnen gebruikt worden om de applicatie te testen.

---

### MongoDB

Voor het gebruik van Mongoose is MongoDB nodig, deze kan gedownload worden op de [MongoDB website](https://www.mongodb.com/try/download/community).
De gebruikte versie voor dit project is **6.0.2**.

Om dat te controleren kan het volgende commando gebruikt worden:
```console
mongosh
```
Verwachte resultaat:
![Image](https://user-images.githubusercontent.com/42937680/211809855-7a62dcd1-4349-437a-bfc8-7b847dccea6c.png)

---

### Installatie

Wanneer de applicatie op een lokale machine gedraaid moet worden is het nodig om de volgende stappen te volgen.

**In beide de front- en back-end:**
In de folders readable-reader(front-end) en server(back-end) is er een .env.example aanwezig. Dit bestand is nodig om de applicatie te laten draaien.
Kopieer de .env.example in de server folder en readable_reader folder, pas hierna de naam aan naar .env en vul de juiste waardes in.

> De correcte waardes zijn al ingevuld bij de .env variabels voor het account thereadablereader@gmail.com. Wanneer 
> je de dropbox account wilt veranderen, vul dan de juiste waardes in.

Als laatste moeten we de packages installeren voor de server en client. Voer de volgende stappen na het kopiëren van
het .env bestand uit:

1. vanuit de **root** folder van het project voer je de volgende commando's uit:
> Waarom we npm install --force gebruiken kan je [hier](Software%20Guidebook.md#128-npm-install---force-in-readable-reader) vinden.

```console
cd readable-reader
npm install --force
```

2. vanuit de **root** folder van het project voer je de volgende commando's uit:

```console
cd server
npm install
```
![Image](https://user-images.githubusercontent.com/42937680/211815092-536fd0dc-72dc-495d-b3ab-278f2d796ef9.png)

---

### Starten van de applicatie

#### 12.4 Starten van de client
Om de client te starten moeten de volgende commando's uitgevoerd worden vanuit de **root** folder van het project.

```console
cd readable-reader
npm start
```

![Image](https://user-images.githubusercontent.com/42937680/211816408-a1fa7b6b-4bbf-4c8d-a915-e83d6af86792.png)
> :warning: Wanneer er een ESlint error verschijnt, start dan de client opnieuw op. 9 van de 10 keer lost dit 
> het probleem op.

> Wanneer je de eslint CRLF LF-error krijgt, pas dan de [.eslintrc.js](readable-reader/.eslintrc.js) bestand bij en 
> vernader de ignorePatterns naar `ignorePatterns: ['*']`.
> 

#### Starten van de server

Om de server te starten moeten de volgende commando's uitgevoerd worden vanuit de **root** folder van het project.

```console
cd server/src
node index.js
```

Of

```console
cd server
npm start
```
![Image](https://user-images.githubusercontent.com/42937680/211815891-911fb13c-f1ca-40d3-a660-fb8794256bc5.png)
> :warning: Zorg dat **_'DB connected!'_** in de console staat
> <br /> **_LET OP:_** Als er **_'Running in Test mode'_** staat klopt er iets niet met het .env bestand en wordt de configuratie niet goed ingeladen, controleer in dit geval of het .env bestand in de root van de server folder staat.

De installatie is nu klaar en de applicatie kan gebruikt worden. Er wordt standaard al een gebruiker aangemaakt, deze kan gebruikt worden om jezelf bekend te maken met de applicatie.
De gebruikersnaam van dit account is **_testuser_**, deze bevat ook al een aantal boeken.

> :heavy_check_mark: Goed bezig! de installatie is nu klaar en de applicatie kan gebruikt worden.

---

### Testen

#### Unit & Endpoint tests

> Voor je de tests kan uitvoeren moet je een zip bestand hebben die 100mb of meer is.
> Die kan je [hier](https://drive.google.com/uc?export=download&id=1unKTBxixdjS7mNvXVmTnOJ4ouqjrZoOK) vinden.
> Dit bestand moet je in `server/src/__tests__/testFile` plaatsen. <br />
>
> **Zorg ervoor dat het bestand 100mb.zip heet!**

Om de unit tests en endpoint tests uit voeren moeten de volgende commando's uitgevoerd worden vanuit de **root**
folder van het project:

```console
cd server
npm test
```
![Image](https://user-images.githubusercontent.com/42937680/212075637-9c4a5037-7aa3-4253-99c2-ddc9a3198c53.png)
#### E2E tests

> :warning: Wanneer je tijdens het testen van dropbox een 6-digit code moet invullen,
> upload eerst handmatig via dropbox.
> Dan kan je op je gemak de 6-digit code invullen. <br />
>
> Wanneer je dit gedaan heb kan je de test opnieuw uitvoeren en
> zie je dat de 6-digit code niet weer opnieuw hoef in te vullen.

Om de E2E tests te draaien moeten het volgende gebeuren.

1.  Open de server/src folder en pas in de .env de PRODUCTION variable aan naar false.
2.  Start of herstart de server met de volgende commando's vanuit de **root** folder van het project.

```console
cd server/src
node index.js
```

of 

```console
cd server/src
npm start
```

![Image](https://user-images.githubusercontent.com/42937680/211818980-ad8bd31c-b386-4da3-9070-4bf407476e01.png)
> :warning: Zorg dat **_'Running is test mode'_** in de console staat

3.  Start de client met de volgende commando's vanuit de **root** folder van het project.

```console
cd readable-reader
npm start
```

4.  Voer de End-To-End tests uit door in de **root** folder van het project de volgende commando's uit te voeren.

```console
cd readable-reader
npm run e2e
```
![Image](https://user-images.githubusercontent.com/42937680/212075433-a6558baa-3b85-4939-916d-82771d075161.png)
> :warning: Vergeet na het testen niet de env variable terug te zetten naar true

> :warning: E2E tests zijn inconsistent over verschillende computers en systemen. Het kan zijn dat ze falen!
