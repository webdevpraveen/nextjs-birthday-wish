import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import styles from "../styles/Name.module.css";
import { useRouter } from "next/router";
import ConfettiGenerator from "confetti-js";
import messages from "../utils/birthdayWishes.js";
import useTheme from "../hooks/useTheme";
import * as htmlToImage from "html-to-image";
import FileSaver from "file-saver";
import { Button, CopyLinkButton } from "../components";

const Wish = ({ history }) => {
  const router = useRouter();
  const { name } = router.query;
  const color = name ? name[1] : 0;
  const imageUrl = router.query.img; //new

  const [downloading, setDownloading] = useState(false);
  const [downloadedOnce, setDownloadedOnce] = useState(false);
  const audioRef = useRef();

  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(color);

    if (!downloading) {
      const confetti = new ConfettiGenerator({
        target: "canvas",
        start_from_edge: true,
      });
      confetti.render();
      audioRef.current.play();
    }
  }, [color, downloading]);

  useEffect(() => {
    if (downloading && !downloadedOnce) downloadImage();
  }, [downloading, downloadedOnce]);

  const randomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min)) + min;

  const downloadImage = () => {
    if (downloadedOnce) return;

    const node = document.getElementById("image");
    if (!node) return;

    setDownloadedOnce(true);
    htmlToImage.toPng(node).then((blob) => {
      FileSaver.saveAs(blob, "birthday-wish.png");
      setDownloading(false);
    });
  };

  const title = (name) => {
    const wish = "Happy Birthday " + name + "!";
    const base_letters = [];
    const name_letters = [];

    for (let i = 0; i < wish.length; i++) {
      const letter = wish.charAt(i);
      const span = (
        <span key={i} style={{ "--i": i + 1 }}>
          {letter}
        </span>
      );
      i < 15 ? base_letters.push(span) : name_letters.push(span);
    }

    return (
      <h1
        className={downloading ? styles.titleImg : styles.title}
        style={{ "--wish-length": wish.length }}
      >
        <div>{base_letters}</div>
        <div className={styles.span}>{name_letters}</div>
      </h1>
    );
  };

  if (downloading) {
    return (
      <div className={styles.containerImg} id="image">
        <main className={styles.image}>
          <div>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Birthday"
                className={styles.birthdayImage}
              />
            )}

            <div className={styles.main}>{title(name && name[0])}</div>
            <div style={{ height: 40 }} />
            <p className={styles.descImg}>
              {messages[randomNumber(0, messages.length)].value}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Happy Birthday {name && name[0]}</title>
        <meta name="description" content="A surprise birthday wish!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <canvas className={styles.canvas} id="canvas"></canvas>

      <main className={styles.animate}>
        <div>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Birthday"
              className={styles.birthdayImage}
            />
          )}

          <div className={styles.main}>{title(name && name[0])}</div>
          <p className={styles.desc}>
            {messages[randomNumber(0, messages.length)].value}
          </p>
        </div>

        <div className={styles.buttonContainer}>
          {history[0] === "/" && <CopyLinkButton />}
          {history[0] === "/" && (
            <Button
              onClick={() => {
                setDownloadedOnce(false);
                setDownloading(true);
              }}
              text="Download as Image"
            />
          )}
          <Button onClick={() => router.push("/")} text="← Create a wish" />
        </div>
      </main>

      <audio ref={audioRef} autoPlay>
        <source src="media/hbd.mp3" />
      </audio>
    </div>
  );
};

export default Wish;
