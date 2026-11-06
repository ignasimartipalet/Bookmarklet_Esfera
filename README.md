# Assistent Esfer@

Una eina basada en bookmarklets per ajudar a omplir notes i comentaris a Esfer@ de forma ràpida i automàtica.

Aquest projecte consisteix en una pàgina web estàtica (`index.html`) que genera dos marcadors per al navegador:

- Assistent Esfer@
- Assistent Esfer@ optatives

La idea és poder executar la funcionalitat des de qualsevol pàgina, directament des de la barra de marcadors, sense necessitat d’instal·lar cap extensió ni dependències.

## Què fa

L’eina permet:

- introduir llistes d’alumnes amb dades de nota i comentari
- recórrer grups de classe o optatives
- cercar alumnes per nom i cognoms
- assignar notes/comentaris automàticament
- activar un mode de prova per veure què faria abans de modificar res
- mostrar un resum final amb alumnes no trobats, errors i comentaris ja existents

## Funcionalitat principal

### Assistent Esfer@ optatives
És la funcionalitat més completa del projecte. Permet processar una llista d’alumnes en format tabular i aplicar la informació a diversos grups.

### Format d’entrada
Cada línia de la llista ha de contenir, idealment, les dades separades per tabulador:

- Nom
- Nota
- Comentari

Exemple:

```text
García López, Joan    AN    Participa molt
Pérez Martí, Anna     AE    Molt bon treball
