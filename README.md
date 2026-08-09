[README.md](https://github.com/user-attachments/files/30866419/README.md)
# 🧠 Splortch Clicker

Un clicker 100% brainrot, en HTML/CSS/JS pur (aucune dépendance, aucun build).
Clique sur Splortch, achète des upgrades absurdes, débloque des succès et fais des rebirths pour un multiplicateur permanent.

## ✨ Fonctionnalités

- Clic avec coups critiques (×10, 2% de chance)
- 12 upgrades (clic et production passive) avec coûts qui montent
- 14 succès à débloquer
- Système de **rebirth** (prestige) avec multiplicateur permanent
- Sauvegarde automatique dans le navigateur (`localStorage`)
- Export / import de sauvegarde (code à copier-coller)
- Design 100% responsive (mobile + desktop)
- Zéro dépendance externe à part les polices Google Fonts

## 🚀 Lancer le jeu en local

Aucune installation nécessaire, c'est du HTML/CSS/JS statique.

```bash
git clone https://github.com/TON-USER/splortch-clicker.git
cd splortch-clicker
```

Puis ouvre simplement `index.html` dans ton navigateur.

Ou, pour un vrai serveur local (recommandé) :

```bash
python3 -m http.server 8000
# puis ouvre http://localhost:8000
```

## 🌐 Héberger sur GitHub Pages (gratuit)

1. Crée un repo GitHub et pousse ces fichiers dedans :
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Splortch Clicker"
   git branch -M main
   git remote add origin https://github.com/TON-USER/splortch-clicker.git
   git push -u origin main
   ```
2. Sur GitHub, va dans **Settings → Pages**.
3. Dans **Source**, choisis la branche `main` et le dossier `/ (root)`.
4. Enregistre. Ton jeu sera en ligne à l'adresse :
   `https://TON-USER.github.io/splortch-clicker/`

## 📁 Structure du projet

```
splortch-clicker/
├── index.html    # structure de la page
├── style.css     # tout le design (thème brainrot néon)
├── script.js     # logique du jeu (state, économie, save)
└── README.md
```

## 🛠️ Personnaliser

- **Upgrades** : modifie le tableau `UPGRADES` dans `script.js` (nom, emoji, coût de base, gain).
- **Succès** : modifie le tableau `ACHIEVEMENTS` dans `script.js`.
- **Phrases brainrot** : modifie `TICKER_PHRASES` dans `script.js`.
- **Couleurs** : modifie les variables CSS dans `:root` en haut de `style.css`.

## 📄 Licence

Libre d'utilisation, modification et republication.
