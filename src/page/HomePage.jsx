import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const HomePage = () => {
  const [JT, setJT] = useState(218);
  const [S, setS] = useState(10000);
  const [P_alea_vie, setP_alea_vie] = useState(0.9);
  const [P_arret, setP_arret] = useState(0.8);
  const [P_produit, setP_produit] = useState(0.5);
  const [DIRECT_COST, setDIRECT_COST] = useState(150);
  const [MSP1, setMSP1] = useState(70000);
  const [MSP2, setMSP2] = useState(70000);
  const [P, setP] = useState(0.5);
  const [NSP1, setNSP1] = useState(1);
  const [NJ, setNJ] = useState(2);

  // Déclarer les états pour les outputs
  const [prix_par_concept, setPrixParConcept] = useState(null);
  const [c1, setC1] = useState(null);
  const [token, setToken] = useState(null);

  const calculatePrice = () => {
    // Calculer les valeurs intermédiaires
    const MS = MSP1 + MSP2 + S * 12;
    const nbr_jour_salarie = NSP1 * JT * P_alea_vie * P_arret;
    const nbr_jour_total = JT * P * P_alea_vie + nbr_jour_salarie;
    const nbr_jour_total_1 = nbr_jour_total * P_produit;
    const n1 = nbr_jour_total_1 / NJ;
    const direct_cost_year = DIRECT_COST * 12;
    const CC = MS * 0.4;
    const CF = CC + MS;
    const total_cost = CF * P_produit + direct_cost_year;

    // Calculer le prix par concept
    const prix_par_concept_calculated = total_cost / n1;
    setPrixParConcept(prix_par_concept_calculated);

    // Calculer le nombre de produits réalisables par mois
    const c1_calculated = n1 / 12; // Remplacer 12 par N_MOIS si N_MOIS est une variable
    setC1(c1_calculated);

    // Envoyer les données à Google Sheets
    sendDataToSheet();
  };

  const sendDataToSheet = async () => {

    if (!token) {
      console.error('No OAuth token available');
      return;
    }

    try {
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_API_SPREADSHEET_ID}/values/naruto!A1:Z1:append?valueInputOption=RAW`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          "range": "naruto!A1:Z1",
          "majorDimension": "ROWS",
          "values": [
            [      JT,
                S,
                P_alea_vie,
                P_arret,
                P_produit,
                DIRECT_COST,
                MSP1,
                MSP2,
                P,
                NSP1,
                NJ],

          ]
        })
      });

      const result = await response.json();
      console.log('Success:', result);
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Login Success:', tokenResponse);
      setToken(tokenResponse.access_token);
    },
    onError: (error) => {
      console.error('Login Failed:', error);
    },
    scope: 'https://www.googleapis.com/auth/spreadsheets',
  });

  return (
    <div className="bg-gray-100 text-gray-800 font-sans">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-2xl font-bold text-primary">ReliableProject</div>
          <ul className="flex space-x-6">
            <li><a href="#reliability-score" className=" text-xs text-gray-800 hover:text-primary">Score de Fiabilité</a></li>
          </ul>
        </nav>
      </header>

      <div className="container mx-auto p-6">
        <section className="hero flex flex-col lg:flex-row items-center py-12">
          <div className="hero-text flex-1">
            <h1 className="text-5xl font-bold mb-4">Estimez la Fiabilité de Votre Projet</h1>
            <p className="text-xl mb-6">Obtenez des informations précieuses sur le potentiel de succès de votre projet avec notre outil avancé d'estimation de fiabilité.</p>
            {!token&&<button onClick={() => login()} className="btn btn-primary">Commencez l'Estimation en se connectant</button>}
          </div>
          <div className="hero-image flex-1 text-right">
            <img src="https://websim.ai/reliability-estimation.svg" alt="Estimation de Fiabilité de Projet" className="max-w-full h-auto" />
          </div>
        </section>

        <section id="features" className="features grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="feature-card bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold mb-4 text-center">Détails du Projet</h3>
            <div>
              <label className="block mb-2 ">Nombre de jours travaillé dans la boîte dans un an (JT)</label>
              <input type="number" value={JT} onChange={(e) => setJT(Number(e.target.value))} className="input input-bordered w-full mb-4" />
            </div>
            <div>
              <label className="block mb-2 ">Salaire mensuel d’un dirigeant (S)</label>
              <input type="number" value={S} onChange={(e) => setS(Number(e.target.value))} className="input input-bordered w-full mb-4" />
            </div>
            <div>
              <label className="block mb-2 ">Pourcentage représentant le nombre de jours travaillés en tenant en compte les aléas de la vie (P_alea_vie)</label>
              <input type="number" value={P_alea_vie} onChange={(e) => setP_alea_vie(Number(e.target.value))} className="input input-bordered w-full mb-4" />
            </div>
            <div>
              <label className="block mb-2 ">Pourcentage représentant les arrêts maladies liés aux salariés (P_arret)</label>
              <input type="number" value={P_arret} onChange={(e) => setP_arret(Number(e.target.value))} className="input input-bordered w-full mb-4" />
            </div>
            <div>
              <label className="block mb-2 ">Pourcentage passé sur un produit 1 développé par la boîte (P_produit)</label>
              <input type="number" value={P_produit} onChange={(e) => setP_produit(Number(e.target.value))} className="input input-bordered w-full mb-4" />
            </div>
          </div>

          <div className="feature-card bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold mb-4 text-center">Évaluation des Risques</h3>
            <div>
              <label className="block mb-2 ">Coût direct par mois (DIRECT_COST)</label>
              <input type="number" value={DIRECT_COST} onChange={(e) => setDIRECT_COST(Number(e.target.value))} className="input input-bordered w-full mb-4" />
            </div>
            <div>
              <label className="block mb-2 ">Somme des salaires brut annuels des salariés à l’exception du dirigeant ayant travaillé sur le produit 1 (MSP1)</label>
              <input type="number" value={MSP1} onChange={(e) => setMSP1(Number(e.target.value))} className="input input-bordered w-full mb-4" />
            </div>
            <div>
              <label className="block mb-2 ">Somme des salaires brut annuels des salariés à l’exception du dirigeant ne travaillant pas sur le produit 1 (MSP2)</label>
              <input type="number" value={MSP2} onChange={(e) => setMSP2(Number(e.target.value))} className="input input-bordered w-full mb-4" />
            </div>
          </div>

          <div className="feature-card bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold mb-4 text-center">Score de Fiabilité</h3>
            <div>
              <label className="block mb-2 ">Pourcentage passé sur le produit 1 (P)</label>
              <input type="number" value={P} onChange={(e) => setP(Number(e.target.value))} className="input input-bordered w-full mb-4" />
            </div>
            <div>
              <label className="block mb-2 ">Nombre de salariés ayant travaillé sur le produit 1 (NSP1)</label>
              <input type="number" value={NSP1} onChange={(e) => setNSP1(Number(e.target.value))} className="input input-bordered w-full mb-4" />
            </div>
            <div>
              <label className="block mb-2 ">Nombre de jours travaillé par le dirigeant (NJ)</label>
              <input type="number" value={NJ} onChange={(e) => setNJ(Number(e.target.value))} className="input input-bordered w-full mb-4" />
            </div>
          </div>

          <div className="feature-card bg-white rounded-lg p-6 h-fit shadow-md">
            {token?<button onClick={()=>{calculatePrice()}} className="btn btn-accent w-full">Soumettre</button>:<button onClick={() => login()} className="btn btn-primary">Se connecter</button>}
          </div>
        </section>

        <section id="reliability-score" className="reliability-score bg-neutral text-neutral-content text-center py-12 mt-12 rounded-lg">
          <h2 className="text-4xl font-bold mb-4">Score de Fiabilité de Votre Projet</h2>
          <div className="score text-6xl font-extrabold"><p>{Math.round(prix_par_concept) + " € "}</p>
          <p>{Math.round(c1)+" clients/an"}</p>
          </div>

        </section>

      </div>
    </div>
  );
};

export default HomePage;
