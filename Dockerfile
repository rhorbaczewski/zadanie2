# STAGE 1

# Obraz bazowy zawierający system Alpine i srodowisko Node.js
# AS build - nazwa nadana etapowi, zgodnie z dobrymi praktykami dla budowania wieloetapowego
FROM node:alpine AS build

# Deklaracja katalogu roboczego
WORKDIR /app

# Kopiowanie plików package.json i package-lock.json do obrazu Dockera
# Dzieki temu npm install wykona sie ponownie w przypadku zmiany zaleznosci w tych plikach - przy zmianie innych plikow wykorzystany zostanie cache
COPY package*.json ./

# Instalacja bibliotek wymaganych przez aplikacje Node.js
RUN npm install

# Kopiowanie do obrazu pozostalych plikow aplikacji
COPY . .

# STAGE 2

# Obraz bazowy zawierający system Alpine i srodowisko Node.js
FROM node:alpine

# Informacja na temat autora zgodna ze standardem OCI
LABEL org.opencontainers.image.authors="s101574@pollub.edu.pl"

# Deklaracja katalogu roboczego
WORKDIR /app

# Kopiowanie aplikacji z etapu 1.
COPY --from=build /app .

# Informacja o porcie wewnetrznym kontenera, na ktorym nasluchuje aplikacja
EXPOSE 8080

# Procedura Healthcheck - zautomatyzowana weryfikacja dzialania uruchomionej aplikacji
# Co 10 sekund wykonuje zapytanie HTTP do aplikacji
HEALTHCHECK --interval=10s --timeout=3s \
  CMD wget -q -O - http://localhost:8080 || exit 1

# Domyslne polecenie przy starcie kontenera
CMD ["npm", "start"]