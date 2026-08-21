# Project Requirements & Setup

## Requirements

* **.NET 10 SDK**
* **Node.js** and **npm**

## Client Setup

Navigate to the client project:

```bash
cd Client
```

Install the required npm packages:

```bash
npm install
```

## Server Setup

Navigate to the server project:

```bash
cd Server
```

Build the project:

```bash
dotnet build
```

Apply the Entity Framework Core migrations and update the database:

```bash
dotnet ef database update
```
