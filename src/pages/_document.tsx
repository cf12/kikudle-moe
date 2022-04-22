import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html>
      <Head>
        <meta property="og:title" content="Kikudle - Wordle For Weebs!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kikudle.moe" />
        <meta
          property="og:image"
          content="https://kikudle.moe/images/thumbnail.png"
        />
        <meta
          property="og:description"
          content='Kikudle is the wordle game for weebs! Guess the daily anime based on bits and pieces of the opening theme. After each attempt, you&apos;ll receive even more hints...
          '
        />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="twitter:card" content="summary_large_image" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
