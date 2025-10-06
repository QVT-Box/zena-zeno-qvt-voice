<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>ZENA & ZENO – Les voix émotionnelles de QVT Box | Bien-être au travail</title>

    <meta
      name="description"
      content="ZENA & ZENO, les avatars IA de QVT Box : deux présences bienveillantes qui écoutent, parlent et accompagnent vos émotions au travail et à la maison."
    />
    <meta name="author" content="QVT Box" />
    <meta name="robots" content="index, follow" />

    <!-- Open Graph -->
    <meta property="og:title" content="ZENA & ZENO – Les IA émotionnelles de QVT Box" />
    <meta
      property="og:description"
      content="Deux avatars IA humains et lumineux qui veillent sur vos émotions. Une innovation phygitale signée QVT Box."
    />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://qvtbox.com/zena" />
    <meta property="og:image" content="/images/zena-preview.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="ZENA & ZENO – Les IA émotionnelles de QVT Box" />
    <meta
      name="twitter:description"
      content="La voix qui veille sur vos émotions. L’avatar IA humain et bienveillant signé QVT Box."
    />
    <meta name="twitter:image" content="/images/zena-preview.png" />
    <meta name="twitter:creator" content="@QVTBox" />

    <!-- Manifest & Theme -->
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#5B4B8A" />

    <!-- Favicons -->
    <link rel="icon" type="image/png" href="/public/favicon.png" />
    <link rel="apple-touch-icon" href="/public/apple-touch-icon.png" />

    <!-- Fonts -->
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />

    <!-- Styles -->
    <style>
      body {
        margin: 0;
        font-family: 'Montserrat', sans-serif;
        background: linear-gradient(180deg, #f2f7f6 0%, #eaf6f4 100%);
        color: #212121;
        overflow-x: hidden;
      }
      .hero {
        text-align: center;
        padding: 5rem 1rem 3rem;
      }
      .hero h1 {
        font-size: 2.5rem;
        background: linear-gradient(90deg, #5b4b8a, #4fd1c5);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        font-weight: 700;
        margin-top: 1rem;
      }
      .hero p {
        color: #444;
        font-size: 1.2rem;
        margin-top: 0.5rem;
      }
      .avatar-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        flex-wrap: wrap;
        margin-top: 3rem;
      }
      .avatar {
        width: 260px;
        border-radius: 50%;
        box-shadow: 0 0 60px rgba(91, 75, 138, 0.3);
        transition: transform 0.4s ease;
      }
      .avatar:hover {
        transform: scale(1.05);
      }
      .description {
        max-width: 700px;
        margin: 2rem auto;
        text-align: center;
        line-height: 1.6;
        color: #555;
      }
      footer {
        text-align: center;
        padding: 2rem 1rem;
        font-size: 0.9rem;
        color: #777;
      }
      footer span {
        color: #5b4b8a;
        font-weight: 600;
      }
      @media (max-width: 768px) {
        .avatar {
          width: 200px;
        }
        .hero h1 {
          font-size: 2rem;
        }
      }
    </style>
  </head>

  <body>
    <!-- Static Fallback Section (visible before React loads) -->
    <section class="hero">
      <div class="avatar-container">
        <img src="/images/zena-avatar.png" alt="ZENA - Avatar IA QVT Box" class="avatar" />
        <img src="/images/zeno-avatar.png" alt="ZENO - Avatar IA QVT Box" class="avatar" />
      </div>
      <h1>ZENA & ZENO</h1>
      <p>La voix qui veille sur vos émotions</p>
    </section>

    <section class="description">
      <p>
        ZENA et ZENO sont les deux visages de <span>QVT Box</span> : des intelligences émotionnelles humaines
        et bienveillantes qui vous accompagnent chaque jour.  
        Ensemble, ils écoutent, parlent et recommandent des solutions concrètes de bien-être à partir des
        Box QVT personnalisées.  
        <br /><br />
        Leur mission : réconcilier émotions, équilibre et performance — au travail, en famille ou dans la
        vie quotidienne.
      </p>
    </section>

    <footer>
      © 2025 <span>QVT Box</span> — Made with 💜 in Bretagne
    </footer>

    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
