'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [showModal, setShowModal] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null); // ✅ Typed properly

  const handleStart = () => {
    setShowModal(false);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Some browsers block autoplay
        console.warn('Autoplay failed');
      });
    }
  };

  // Prevent autoplay issues when modal disappears
  useEffect(() => {
    if (!showModal && audioRef.current) {
      audioRef.current.play().catch(() => {
        console.warn('Autoplay failed');
      });
    }
  }, [showModal]);

  return (
    <>
      <Head>
        <title>Car Game UI</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* ✅ Audio Ref */}
      <audio ref={audioRef} src="/audio/Styles of Beyond.mp3" loop preload="auto" />

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h1>Ready to Race?</h1>
            <button style={{borderRadius:'30px'}} onClick={handleStart} className="start-button">
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Main UI */}
      {!showModal && (
        <div className="main">
  <div className="card">
    <h1 className="title">🏁 Black Street X</h1>
    <div className="menu">
      <Link href="/gameplay">
        <button className="btn">Career Mode</button>
      </Link>
      <Link href="/">
        <button className="btn">Multiplayer</button>
      </Link>
      <Link href="/">
        <button className="btn">Settings</button>
      </Link>
    </div>
  </div>
</div>
      )}

      {/* Global Styles */}
      <style jsx global>{`
        body,
        html {
          margin: 0;
          padding: 0;
          font-family: 'Orbitron', sans-serif;
          background: url('/images/front page car.jpg');
          background-size: cover;
          overflow: hidden;
        }
      `}</style>

      {/* Component Styles */}
      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.9);
          z-index: 1000;
          animation: fadeIn 1s ease-in-out;
        }

        .modal-content {
          background: rgba(255, 255, 255, 0.1);
          padding: 60px;
          border-radius: 16px;
          text-align: center;
          color: white;
          backdrop-filter: blur(12px);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        }

        .start-button {
          margin-top: 20px;
          padding: 12px 32px;
          font-size: 1.2rem;
          color: #fff;
          background: #00cc88;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .start-button:hover {
          background: #00b377;
        }

        .main {
          height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .card {
          background: rgba(0, 0, 0, 0.6);
          padding: 50px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          text-align: center;
          color: white;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .title {
          font-size: 3rem;
          margin-bottom: 40px;
          color: #ffffff;
        }

        .menu {
          display: flex;
          flex-direction: column;
          gap: 20px;
          border-radius: 30px;

        }

        .btn {
          background: linear-gradient(145deg, #00ccff, #0066ff);
          border: none;
          padding: 15px 30px;
          color: white;
          font-size: 1.1rem;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          width: 400px;
        }

        .btn:hover {
          background: linear-gradient(145deg, #00bbee, #0055dd);
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
