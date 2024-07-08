import React, { useEffect, useRef } from 'react';

const GoogleFormEmbed = () => {
  const iframeRef = useRef(null);

  const changeTextColor = () => {
    if (iframeRef.current) {
      try {
        const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;

        // Vérifier si l'accès au contenu de l'iframe est autorisé
        if (iframeDocument) {
          // Ajoutez une feuille de style personnalisée à l'iframe
          const style = document.createElement('style');
          style.innerHTML = `
            body, body * {
              color: red !important; /* Change la couleur du texte à rouge */
            }
          `;
          iframeDocument.head.appendChild(style);
        }
      } catch (error) {
        console.error("Cannot access iframe content:", error);
      }
    }
  };

  useEffect(() => {
    // Utiliser setTimeout pour attendre 2 secondes après le rendu de l'iframe
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        try {
          const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
          
          // Vérifier si l'accès au contenu de l'iframe est autorisé
          if (iframeDocument) {
            // Ajoutez une feuille de style personnalisée à l'iframe
            const style = document.createElement('style');
            style.innerHTML = `
              body {
                font-weight: 800; /* Extrabold */
              }
            `;
            iframeDocument.head.appendChild(style);
          }
        } catch (error) {
          console.error("Cannot access iframe content:", error);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <iframe
        ref={iframeRef}
        src="https://docs.google.com/forms/d/e/1FAIpQLSdtndpTXuX-Uyn1CHAKnEJmW2ANShk2O45cXT7uqyJee7uYzA/viewform?embedded=true"
        width="640"
        height="480"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        title="Google Form"
        className="border-2 border-gray-300 mb-4"
      >
        Loading…
      </iframe>
      <button
        onClick={changeTextColor}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Change Color
      </button>
    </div>
  );
};

export default GoogleFormEmbed;
