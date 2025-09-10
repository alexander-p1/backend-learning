# Swing Notes API

Ett serverless API för att hantera anteckningar med autentisering via API-nyckel.

## Funktioner

- **GET** `/api/notes/{username}` - Hämta alla anteckningar för en användare
- **POST** `/api/notes/{username}` - Skapa en ny anteckning
- **PUT** `/api/notes/{id}` - Uppdatera en befintlig anteckning
- **DELETE** `/api/notes/{id}` - Ta bort en anteckning

## Autentisering

Alla endpoints kräver en API-nyckel som skickas i Authorization header:
```
Authorization: Bearer your-api-key
```

## Note-objekt

```json
{
  "id": "uuid-string",
  "username": "användarnamn",
  "title": "Titel (max 50 tecken)",
  "text": "Anteckningstext (max 300 tecken)",
  "createdAt": "2025-09-10T10:00:00.000Z",
  "modifiedAt": "2025-09-10T10:00:00.000Z"
}
```

## Installation och Deploy

1. Installera dependencies:
```bash
npm install
```

2. Sätt upp din API-nyckel som miljövariabel:
```bash
export API_KEY="your-secret-api-key"
```

3. Deploya till AWS:
```bash
npm run deploy
```

## API Exempel

### Hämta anteckningar
```bash
curl -X GET "https://your-api-gateway-url/api/notes/username" \
  -H "Authorization: Bearer your-api-key"
```

### Skapa anteckning
```bash
curl -X POST "https://your-api-gateway-url/api/notes/username" \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Min anteckning",
    "text": "Detta är texten i min anteckning"
  }'
```

### Uppdatera anteckning
```bash
curl -X PUT "https://your-api-gateway-url/api/notes/note-id" \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Uppdaterad titel",
    "text": "Uppdaterad text"
  }'
```

### Ta bort anteckning
```bash
curl -X DELETE "https://your-api-gateway-url/api/notes/note-id" \
  -H "Authorization: Bearer your-api-key"
```

## HTTP Status Codes

- **200 OK** - Begäran lyckades
- **400 Bad Request** - Felaktig data eller format
- **404 Not Found** - Resursen finns inte
- **500 Internal Server Error** - Serverfel

## Lokala test

För att testa lokalt, installera serverless-offline:
```bash
npm install -g serverless-offline
serverless offline
```

## Projektstruktur

```
swing-notes-api/
├── src/
│   ├── handlers/
│   │   ├── getNotes.js
│   │   ├── createNote.js
│   │   ├── updateNote.js
│   │   └── deleteNote.js
│   ├── utils/
│   │   └── dynamodb.js
│   └── authorizer.js
├── serverless.yml
├── package.json
└── README.md
```
