# Zadanie 2 PAwChO

Robert Horbaczewski

Opracowano pipeline w usłudze GitHub Actions, który zbuduje obraz kontenera na podstawie Dockerfile-a oraz kodów źródłowych aplikacji z zadania 1, przesyła go na repozytorium GitHUub oraz spełnia następujące warunki:

a. Obraz wspiera dwie architektury: linux/arm64 oraz linux amd/64.
```yaml
      - name: Build and push Docker image
        uses: docker/build-push-action@v6
        with:
          context: .
          file: ./Dockerfile
          platforms: linux/amd64,linux/arm64
          push: true
```

b. Wykorzystywane (pobierane i wysyłane) są dane cache (eksporter: registry oraz backend-u registry w trubie max). Dane cache przechowywane w dedykowanym, publicznym repozytorium na DockerHub:

```yaml
          cache-from: |
            type=registry,ref=${{ vars.DOCKERHUB_USERNAME }}/zadanie2:buildcache

          cache-to: |
            type=registry,ref=${{ vars.DOCKERHUB_USERNAME }}/zadanie2:buildcache,mode=max

          tags: ${{ steps.meta.outputs.tags }}
```

Dane cache przechowywane są pod pojedynczym tagiem buildcache. Nie są wykorzystywane bezpośrednio przez użytkownika, pełnią jedynie funkcję pomocniczą i są nadpisywane przy kolejnych procesach budowania. https://hub.docker.com/repository/docker/roberthorbaczewski/zadanie2/general

Wykorzystano do tego przykład z dokumentacji Dockera: https://docs.docker.com/build/ci/github-actions/cache/#registry-cache


Wykorzystano automatyczne tagowanie obrazu oparte o identyfikator commit git. Dodatkowo podczas publikacji tagów Git zgodnych z wzorcem v* generowany jest tag zgodny z semver:

```yaml
push:
  tags:
    - 'v*'
```

```yaml
      - name: Docker metadata definitions
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          flavor: latest=true
          tags: |
            type=sha,priority=100,prefix=sha-,format=short
            type=semver,priority=200,pattern={{version}}
```
Tag latest wskazuje najnowszą poprawnie zudowaną wersję obrazu, tagi sha-xxxxxxxx pozwalają określić, z którego commita Git został zbudowany dany obraz. Schemat semver wykorzystywany jest podczas publikacji oznaczonych tagów Git, zgodnie z Semantic Versioning.

Inteligentnym jest zostawić na repo stare wersje obrazu, umożliwia to odtworzenie wcześniejszych wersji aplikacji i powrót do stabilnej wersji w przypadku błędów w nowszym wydaniu (lub też do ulubionej wersji aplikacji ze względów sentymentalnych).
